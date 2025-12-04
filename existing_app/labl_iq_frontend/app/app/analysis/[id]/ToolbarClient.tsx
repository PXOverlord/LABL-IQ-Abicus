'use client';

import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';

import { useAnalysisStore } from '../../../hooks/useAnalysisStore';
import { analysisAPI } from '../../../lib/api';

export default function ToolbarClient({ analysis }: { analysis: any }) {
  const { updateAnalysisMeta } = useAnalysisStore();
  const [merchant, setMerchant] = useState<string>(analysis?.merchant || '');
  const [title, setTitle] = useState<string>(analysis?.title || '');
  const [tags, setTags] = useState<string>((analysis?.tags || []).join(', '));
  const [exporting, setExporting] = useState<'excel' | 'csv' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasResults = Array.isArray(analysis?.results) && analysis.results.length > 0;

  useEffect(() => {
    setMerchant(analysis?.merchant || '');
    setTitle(analysis?.title || '');
    setTags((analysis?.tags || []).join(', '));
  }, [analysis]);

  const onSaveMeta = async () => {
    try {
      const cleanTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      await updateAnalysisMeta(analysis.id, { merchant, title, tags: cleanTags });
      setError(null);
    } catch (err) {
      console.error('Failed to update analysis metadata', err);
      setError('Unable to save metadata. Please try again.');
    }
  };

  const onExport = async (format: 'excel' | 'csv' | 'pdf') => {
    if (!analysis?.id || !hasResults) return;
    setExporting(format);
    setError(null);
    try {
      const { blob, filename } = await analysisAPI.exportAnalysis(analysis.id, format);
      saveAs(blob, filename);
    } catch (err) {
      console.error(`Failed to export ${format}`, err);
      setError('Export failed. Please retry once the analysis is ready.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="border rounded p-3 bg-white flex items-center gap-2 flex-wrap">
      <input className="border rounded px-2 py-1" placeholder="Merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
      <input className="border rounded px-2 py-1" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border rounded px-2 py-1 min-w-[280px]" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <button className="border rounded px-3 py-1" onClick={onSaveMeta}>Save</button>

      <button
        className="border rounded px-3 py-1"
        onClick={() => onExport('excel')}
        disabled={!hasResults || exporting !== null}
      >
        {exporting === 'excel' ? 'Exporting…' : 'Export Excel'}
      </button>
      <button
        className="border rounded px-3 py-1"
        onClick={() => onExport('csv')}
        disabled={!hasResults || exporting !== null}
      >
        {exporting === 'csv' ? 'Exporting…' : 'Export CSV'}
      </button>
      <button
        className="border rounded px-3 py-1"
        onClick={() => onExport('pdf')}
        disabled={!hasResults || exporting !== null}
      >
        {exporting === 'pdf' ? 'Exporting…' : 'Export PDF'}
      </button>

      {error ? <span className="text-xs text-red-500 ml-2">{error}</span> : null}
    </div>
  );
}
