'use client';

// Force dynamic rendering so search params can be used without static prerender errors
export const dynamic = 'force-dynamic';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveAs } from 'file-saver';

import { useAnalysisStore } from '../../hooks/useAnalysisStore';
import { analysisAPI } from '../../lib/api';

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading export tools…</div>}>
      <ExportContent />
    </Suspense>
  );
}

function ExportContent() {
  const params = useSearchParams();
  const initialId = params.get('analysis') || '';
  const analyses = useAnalysisStore((state) => state.analyses);
  const current = useAnalysisStore((state) => state.current);
  const loadHistory = useAnalysisStore((state) => state.loadHistory);
  const loadAnalysis = useAnalysisStore((state) => state.loadAnalysis);
  const [selected, setSelected] = useState(initialId);
  const [exporting, setExporting] = useState<'excel' | 'csv' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory({ limit: 100 }).catch(() => {});
    if (initialId) loadAnalysis(initialId).catch(() => {});
  }, [initialId, loadHistory, loadAnalysis]);

  const chosen = useMemo(() => {
    if (current && current.id === selected) return current as any;
    return null;
  }, [current, selected]);

  useEffect(() => {
    if (selected) loadAnalysis(selected).catch(() => {});
  }, [selected, loadAnalysis]);

  const onExport = async (format: 'excel' | 'csv' | 'pdf') => {
    if (!chosen) return;
    setExporting(format);
    setError(null);
    try {
      const { blob, filename } = await analysisAPI.exportAnalysis(chosen.id, format);
      saveAs(blob, filename);
    } catch (err) {
      console.error(`Failed to export ${format}`, err);
      setError('Export failed. Please retry once the analysis has finished processing.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="text-xl">Export</div>

      <div className="flex items-center gap-2">
        <select className="border rounded px-2 py-1 min-w-[360px]" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select analysis…</option>
          {analyses.map((a: any) => (
            <option key={a.id} value={a.id}>
              {a.timestamp?.slice(0, 16)} • {a.filename || a.id}{a.merchant ? ` • ${a.merchant}` : ''}
            </option>
          ))}
        </select>
      </div>

      {!chosen ? (
        <div className="text-sm text-gray-600">Choose an analysis to export.</div>
      ) : (
        <div className="space-y-3">
          <div className="border rounded p-3 bg-white flex items-center gap-2 flex-wrap">
            <button
              className="border rounded px-3 py-1"
              onClick={() => onExport('excel')}
              disabled={exporting !== null}
            >
              {exporting === 'excel' ? 'Exporting…' : 'Export Excel'}
            </button>
            <button
              className="border rounded px-3 py-1"
              onClick={() => onExport('csv')}
              disabled={exporting !== null}
            >
              {exporting === 'csv' ? 'Exporting…' : 'Export CSV'}
            </button>
            <button
              className="border rounded px-3 py-1"
              onClick={() => onExport('pdf')}
              disabled={exporting !== null}
            >
              {exporting === 'pdf' ? 'Exporting…' : 'Export PDF'}
            </button>

            {error ? <span className="text-xs text-red-500 ml-2">{error}</span> : null}
          </div>

          <div className="text-xs text-gray-600">
            {chosen.timestamp?.slice(0, 16)} • {chosen.filename || chosen.id}{chosen.merchant ? ` • ${chosen.merchant}` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
