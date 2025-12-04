'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import ToolbarClient from './ToolbarClient';
import ResultTableClient from './results-table-client';
import { useAnalysisStore } from '../../../hooks/useAnalysisStore';
import { Card, CardContent } from '../../../components/ui/card';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type PlotFigure = {
  data: any[];
  layout: Record<string, any>;
  config?: Record<string, any>;
};

export default function AnalysisDetail({ params }: { params: { id: string } }) {
  const loadAnalysis = useAnalysisStore((state) => state.loadAnalysis);
  const current = useAnalysisStore((state) => state.current);
  const isLoading = useAnalysisStore((state) => state.isLoading);

  useEffect(() => {
    loadAnalysis(params.id).catch((error) => {
      console.error('Failed to load analysis', error);
    });
  }, [params.id, loadAnalysis]);

  const summary = current?.summary || {};
  const settings = current?.settings || {};
  const results = current?.results || [];
  const totalResults = current?.totalResults ?? summary.total_packages ?? summary.total_shipments ?? results.length;
  const previewCount = current?.previewCount ?? results.length;
  const moreResultsAvailable = totalResults > previewCount;

  const totalSavings = Number(summary.total_savings ?? 0);
  const percentSavings = Number(summary.percent_savings ?? 0);
  const totalCurrentCost = Number(summary.total_current_cost ?? 0);
  const totalAmazonCost = Number(summary.total_amazon_cost ?? 0);
  const avgSavingsPerShipment = totalResults > 0 ? totalSavings / Math.max(totalResults, 1) : 0;

  const summaryCards = [
    { label: 'Total Shipments', value: totalResults, format: 'number' as const },
    { label: 'Previewed Rows', value: previewCount, format: 'number' as const },
    { label: 'Total Savings', value: totalSavings, format: 'currency' as const },
    { label: 'Avg Savings / Shipment', value: avgSavingsPerShipment, format: 'currency' as const },
    { label: 'Percent Savings', value: percentSavings, format: 'percent' as const },
    { label: 'Current → Amazon', value: `${formatCurrency(totalCurrentCost)} → ${formatCurrency(totalAmazonCost)}` },
  ];

  const settingsEntries = [
    { label: 'Markup percent', value: settings.markup_percent ?? settings.markupPct ?? settings.markupPercentage },
    { label: 'Fuel surcharge %', value: settings.fuel_surcharge_percent ?? settings.fuelSurchargePct, format: 'percent' as const },
    { label: 'Service level', value: settings.serviceLevel || current?.status || 'standard' },
    { label: 'Origin ZIP', value: settings.origin_zip ?? settings.originZip },
    { label: 'DAS surcharge', value: settings.das_surcharge, format: 'currency' as const },
    { label: 'eDAS surcharge', value: settings.edas_surcharge, format: 'currency' as const },
    { label: 'Remote surcharge', value: settings.remote_surcharge, format: 'currency' as const },
    { label: 'Dim divisor', value: settings.dim_divisor ?? settings.dimDivisor },
  ];

  const visualizations = current?.visualizations || {};
  const zoneVisualization = useMemo(() => parsePlotFigure(visualizations.zone_fig), [visualizations.zone_fig]);
  const weightVisualization = useMemo(() => parsePlotFigure(visualizations.weight_fig), [visualizations.weight_fig]);
  const surchargeVisualization = useMemo(() => parsePlotFigure(visualizations.surcharge_fig), [visualizations.surcharge_fig]);

  const zoneTable = (visualizations.zone_table as any[] | undefined) ?? [];
  const weightTable = (visualizations.weight_table as any[] | undefined) ?? [];
  const surchargeTable = (visualizations.surcharge_table as any[] | undefined) ?? [];

  if (isLoading && !current) {
    return <div className="p-6 text-sm text-gray-600">Loading analysis…</div>;
  }

  if (!current) {
    return (
      <div className="p-6">
        <div className="text-lg mb-4">Analysis not found.</div>
        <Link href="/analysis" className="underline text-sm">
          Back to analyses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Analysis</div>
          <div className="text-xl font-semibold">{current.filename || current.id}</div>
          <div className="text-sm text-gray-600">
            {new Date(current.timestamp).toLocaleString()}
            {current.merchant ? (
              <>
                {' '}
                • Merchant <span className="font-medium">{current.merchant}</span>
              </>
            ) : null}
            {current.title ? <>
              {' '}
              • {current.title}
            </> : null}
            {(current.tags || []).length ? <>
              {' '}
              • {(current.tags || []).join(', ')}
            </> : null}
          </div>
        </div>
        <Link href="/analysis" className="underline text-sm">
          Back
        </Link>
      </div>

      <ToolbarClient analysis={current} />

      <section className="grid gap-4 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="text-xs uppercase text-gray-500 tracking-wide">{card.label}</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">
                {'format' in card && card.format === 'currency'
                  ? formatCurrency(Number(card.value))
                  : 'format' in card && card.format === 'percent'
                  ? formatPercent(Number(card.value))
                  : 'format' in card && card.format === 'number'
                  ? formatNumber(Number(card.value))
                  : String(card.value)}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-white shadow-sm border">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Settings Snapshot</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {settingsEntries.map((entry) => (
                <div key={entry.label} className="space-y-1">
                  <dt className="text-xs uppercase text-gray-500 tracking-wide">{entry.label}</dt>
                  <dd className="font-medium text-gray-900">{formatDisplayValue(entry)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <VisualizationCard
          title="Zone Analysis"
          figure={zoneVisualization}
          table={zoneTable}
          emptyMessage="Zone data not available for this analysis."
        />

        <VisualizationCard
          title="Weight Distribution"
          figure={weightVisualization}
          table={weightTable}
          emptyMessage="Weight data not available for this analysis."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <VisualizationCard
          title="Surcharge Impact"
          figure={surchargeVisualization}
          table={surchargeTable}
          emptyMessage="No surcharge data available for this analysis."
        />

        <Card className="lg:col-span-2 bg-white shadow-sm border">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Shipment Results Preview</h3>
              <div className="text-xs text-gray-500">
                Showing {formatNumber(previewCount)} of {formatNumber(totalResults)} shipments
              </div>
            </div>
            {moreResultsAvailable ? (
              <p className="text-xs text-amber-600">
                Only the first {formatNumber(previewCount)} rows are displayed for performance. Use filters or export for the complete dataset.
              </p>
            ) : null}
            {results.length === 0 ? (
              <div className="text-sm text-gray-600">No shipment results available for this analysis.</div>
            ) : (
              <ResultTableClient rows={results} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(2)}%`;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString();
}

function formatDisplayValue(entry: { value: any; format?: 'currency' | 'percent' }) {
  if (entry.value == null) return '—';
  if (entry.format === 'currency') return formatCurrency(Number(entry.value));
  if (entry.format === 'percent') return formatPercent(Number(entry.value));
  return String(entry.value);
}

type VisualizationCardProps = {
  title: string;
  figure: PlotFigure | null;
  table: Record<string, any>[];
  emptyMessage: string;
};

function VisualizationCard({ title, figure, table, emptyMessage }: VisualizationCardProps) {
  const hasFigure = Boolean(figure && figure.data && figure.data.length);
  const hasTable = table && table.length > 0;

  if (!hasFigure && !hasTable) {
    return (
      <Card className="bg-white shadow-sm border">
        <CardContent className="p-4 text-sm text-gray-600">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {hasFigure ? (
          <div className="w-full overflow-hidden rounded-lg border">
            <Plot
              data={figure!.data}
              layout={{ ...figure!.layout, autosize: true, height: 360 }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : null}
        {hasTable ? (
          <div className="border rounded-md overflow-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide">
                <tr>
                  {Object.keys(table[0]).map((key) => (
                    <th key={key} className="px-3 py-2 text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.slice(0, 8).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t">
                    {Object.keys(table[0]).map((key) => (
                      <td key={key} className="px-3 py-2">
                        {typeof row[key] === 'number' ? formatNumberCell(row[key]) : String(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function formatNumberCell(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}

function parsePlotFigure(fig: any): PlotFigure | null {
  if (!fig) return null;
  if (typeof fig === 'string') {
    try {
      return JSON.parse(fig);
    } catch (error) {
      console.error('Failed to parse Plotly figure', error);
      return null;
    }
  }
  return fig;
}
