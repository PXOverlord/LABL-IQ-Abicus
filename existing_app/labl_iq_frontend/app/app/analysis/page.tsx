'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAnalysisStore } from '../../hooks/useAnalysisStore';

export default function AnalysisIndexPage() {
  const analyses = useAnalysisStore((state) => state.analyses);
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const loadHistory = useAnalysisStore((state) => state.loadHistory);
  const [merchant, setMerchant] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    loadHistory().catch(() => {
      /* ignore initial load errors */
    });
  }, [loadHistory]);

  const merchantOptions = useMemo(() => {
    const counts = new Map<string, number>();
    analyses.forEach((analysis: any) => {
      const name = analysis.merchant?.trim();
      if (!name) return;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, count]) => ({ merchant: label, count }));
  }, [analyses]);

  return (
    <div className="p-6 space-y-4">
      <div className="text-xl">Analyses</div>

      <div className="flex gap-2 items-center">
        <select className="border rounded px-2 py-1" value={merchant} onChange={(e) => setMerchant(e.target.value)}>
          <option value="">All merchants</option>
          {merchantOptions.map((m) => (
            <option key={m.merchant} value={m.merchant}>{m.merchant} ({m.count})</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 w-72"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="border rounded px-3 py-1" onClick={() => loadHistory({ merchant: merchant || undefined, q: q || undefined })}>
          Apply
        </button>
        <button className="text-xs underline ml-2" onClick={() => { setMerchant(''); setQ(''); loadHistory(); }}>
          Clear
        </button>
      </div>

      <div className="grid gap-3">
        {isLoading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : analyses.length === 0 ? (
          <div className="text-sm text-gray-600">No analyses yet.</div>
        ) : (
          analyses.map((a: any) => (
            <div key={a.id} className="border rounded p-4 bg-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm">{a.timestamp?.slice(0, 16)} • {a.filename || a.id}</div>
                <div className="text-xs text-gray-600">
                  {a.merchant ? <span className="mr-2">Merchant: <span className="font-medium">{a.merchant}</span></span> : null}
                  Shipments {a.shipment_count ?? 0}
                  {typeof a?.summary?.total_savings === 'number' ? ` • Savings $${a.summary.total_savings.toFixed(2)}` : ''}
                </div>
              </div>
              <div className="space-x-2">
                <Link className="border rounded px-3 py-1" href={`/analysis/${a.id}`}>Open</Link>
                <Link className="border rounded px-3 py-1" href={`/export?analysis=${a.id}`}>Export</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
