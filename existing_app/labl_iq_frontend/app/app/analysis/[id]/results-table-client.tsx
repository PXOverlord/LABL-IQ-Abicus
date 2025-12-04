'use client';

import React, { useMemo, useState } from 'react';

type Props = { rows: any[] };

export default function ResultTableClient({ rows }: Props) {
  const [q, setQ] = useState('');
  const [zone, setZone] = useState<string>('all');
  const [savingsFilter, setSavingsFilter] = useState<string>('all');
  const [errorFilter, setErrorFilter] = useState<string>('all');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const cols = useMemo(() => {
    if (!rows?.length) return [];
    
    // Get all available columns
    const allColumns = Object.keys(rows[0]);
    
    // Prioritize important columns first
    const priorityColumns = [
      'shipment_id', 'rowIndex', 'zone', 'weight', 'carrier_rate',
      'base_rate', 'final_rate', 'savings', 'savings_percent',
      'markup_amount', 'markup_percentage', 'total_surcharges'
    ];
    
    // Start with priority columns (if they exist)
    const orderedColumns: string[] = [];
    priorityColumns.forEach(col => {
      if (allColumns.includes(col)) {
        orderedColumns.push(col);
      }
    });
    
    // Add remaining columns
    allColumns.forEach(col => {
      if (!orderedColumns.includes(col)) {
        orderedColumns.push(col);
      }
    });
    
    // Use selected columns if available, otherwise use ordered columns
    const displayColumns = selectedColumns.length > 0 ? selectedColumns : orderedColumns.slice(0, 25);
    return displayColumns;
  }, [rows, selectedColumns]);

  const filtered = useMemo(() => {
    const z = zone === 'all' ? null : Number(zone);
    return rows.filter(r => {
      // Zone filter
      const zoneOk = z == null ? true : Number(r.zone) === z;
      if (!zoneOk) return false;
      
      // Savings filter
      if (savingsFilter !== 'all') {
        const savings = r.savings || 0;
        if (savingsFilter === 'positive' && savings <= 0) return false;
        if (savingsFilter === 'negative' && savings >= 0) return false;
        if (savingsFilter === 'zero' && savings !== 0) return false;
      }
      
      // Error filter
      if (errorFilter !== 'all') {
        const hasError = r.errors && r.errors !== '';
        if (errorFilter === 'with_errors' && !hasError) return false;
        if (errorFilter === 'no_errors' && hasError) return false;
      }
      
      // Text search
      if (!q) return true;
      const s = JSON.stringify(r).toLowerCase();
      return s.includes(q.toLowerCase());
    });
  }, [rows, q, zone, savingsFilter, errorFilter]);

  const page = 1;
  const pageSize = 500; // don't fry the DOM
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {/* Enhanced Filters Section */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Search All Fields</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Search shipments, zips, errors..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Zone Filter</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            >
              <option value="all">All Zones</option>
              {[1,2,3,4,5,6,7,8].map(z => <option key={z} value={z}>{`Zone ${z}`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Savings Filter</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={savingsFilter}
              onChange={(e) => setSavingsFilter(e.target.value)}
            >
              <option value="all">All Savings</option>
              <option value="positive">Positive Savings</option>
              <option value="negative">Negative Savings</option>
              <option value="zero">Zero Savings</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Error Filter</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={errorFilter}
              onChange={(e) => setErrorFilter(e.target.value)}
            >
              <option value="all">All Shipments</option>
              <option value="with_errors">With Errors</option>
              <option value="no_errors">No Errors</option>
            </select>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="bg-blue-100 border border-blue-200 rounded px-3 py-2">
            <span className="text-sm font-medium text-blue-800">
              {filtered.length} of {rows.length} shipments
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {filtered.length > 0 && (
              <>
                Showing first {Math.min(slice.length, filtered.length)} results
                {filtered.length > slice.length && ` (use search to find more)`}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Column Selector */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Column Display Options</h3>
        
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedColumns([])}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 border rounded"
          >
            Show All Columns
          </button>
          <button
            onClick={() => setSelectedColumns(['shipment_id', 'zone', 'weight', 'carrier_rate', 'base_rate', 'final_rate', 'savings'])}
            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded"
          >
            Key Columns Only
          </button>
          <button
            onClick={() => setSelectedColumns(['shipment_id', 'zone', 'weight', 'carrier_rate', 'base_rate', 'final_rate', 'savings', 'savings_percent', 'markup_amount', 'total_surcharges'])}
            className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 border border-green-300 rounded"
          >
            Business View
          </button>
        </div>
        
        {/* Column Checkboxes */}
        <div className="grid grid-cols-4 gap-3">
          {rows?.[0] ? Object.keys(rows[0]).map(col => (
            <label key={col} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={selectedColumns.length === 0 || selectedColumns.includes(col)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns(prev => 
                      prev.length === 0 ? [] : [...prev, col]
                    );
                  } else {
                    setSelectedColumns(prev => prev.filter(c => c !== col));
                  }
                }}
                className="rounded"
              />
              <span className="truncate font-medium">{col}</span>
            </label>
          )) : null}
        </div>
      </div>

      {slice.length === 0 ? (
        <div className="text-sm text-gray-600">No results.</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c} className="text-left border-b p-2 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((r, i) => (
                <tr key={i} className="border-b">
                  {cols.map(c => (
                    <td key={c} className="p-2 whitespace-nowrap">
                      {typeof r[c] === 'number' ? r[c].toFixed(2) : String(r[c] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
