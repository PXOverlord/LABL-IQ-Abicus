'use client';

import { useCallback, useEffect, useState } from 'react';

import { analysisAPI, type AnalysisComparisonResponse, type AnalysisComparisonItem } from '../../lib/api';
import { useAnalysisStore } from '../../hooks/useAnalysisStore';
import AnalyticsWidgets from '../../components/dashboard/AnalyticsWidgets';
import TrendCharts from '../../components/dashboard/TrendCharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Loader2, RefreshCcw } from 'lucide-react';

const DEFAULT_SELECTION_COUNT = 3;
const MAX_SELECTION = 5;

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function ReportsPage() {
  const analyses = useAnalysisStore((state) => state.analyses) || [];
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const loadHistory = useAnalysisStore((state) => state.loadHistory);

  const [selected, setSelected] = useState<string[]>([]);
  const [report, setReport] = useState<AnalysisComparisonResponse | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory({ limit: 50 }).catch((error) => {
      console.error('Failed to load analysis history for reports', error);
      const msg =
        (error as any)?.response?.status === 401
          ? 'Please log in to view your analyses.'
          : 'Unable to load analysis history.';
      setLoadError(msg);
      setErrorMessage(msg);
    });
  }, [loadHistory]);

  useEffect(() => {
    if (!analyses.length || selected.length) return;
    const initial = analyses.slice(0, DEFAULT_SELECTION_COUNT).map((item: any) => item.id);
    setSelected(initial);
  }, [analyses, selected.length]);

  const handleCompare = useCallback(async () => {
    if (!selected.length) {
      setReport(null);
      setErrorMessage('Select at least one analysis to compare.');
      return;
    }

    setIsComparing(true);
    setErrorMessage('');
    try {
      const response = await analysisAPI.compare(selected);
      setReport(response);
    } catch (error) {
      console.error('Failed to compare analyses', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Comparison failed. Please try again.'
      );
    } finally {
      setIsComparing(false);
    }
  }, [selected]);

  useEffect(() => {
    if (!selected.length || report || isComparing || isLoading) return;
    void handleCompare();
  }, [selected, report, isComparing, isLoading, handleCompare]);

  const toggleSelection = (analysisId: string) => {
    setErrorMessage('');
    setSelected((prev) => {
      if (prev.includes(analysisId)) {
        return prev.filter((id) => id !== analysisId);
      }
      if (prev.length >= MAX_SELECTION) {
        setErrorMessage(`You can compare up to ${MAX_SELECTION} analyses at a time.`);
        return prev;
      }
      return [...prev, analysisId];
    });
  };

  const clearSelection = () => {
    setSelected([]);
    setReport(null);
    setErrorMessage('');
  };

  const comparisonItems: AnalysisComparisonItem[] = report?.items ?? [];
  const summary = report?.summary;

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Comparative reporting</h1>
        <p className="text-sm text-muted-foreground">
          Select multiple analyses to compare savings, shipment volume, and performance trends across merchants.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Analyses</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose up to five analyses to include in the comparison report.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleCompare} disabled={isComparing || !selected.length} className="flex items-center gap-2">
              {isComparing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isComparing ? 'Comparing…' : `Compare selected (${selected.length})`}
            </Button>
            <Button variant="ghost" onClick={clearSelection} disabled={!selected.length} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Loading analysis history…
            </div>
          ) : loadError ? (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
              {loadError}
            </div>
          ) : !analyses.length ? (
            <div className="text-center py-10 text-muted-foreground">
              Run an analysis to see it listed here.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {analyses.map((analysis: any) => {
                const isChecked = selected.includes(analysis.id);
                return (
                  <label
                    key={analysis.id}
                    className={`border rounded-md p-4 bg-white flex items-start gap-3 transition shadow-sm ${
                      isChecked ? 'border-primary/70 ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <Checkbox
                      id={`compare-${analysis.id}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleSelection(analysis.id)}
                    />
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">
                        {analysis.filename || analysis.fileName || `Analysis ${analysis.id.slice(0, 8)}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {analysis.timestamp ? new Date(analysis.timestamp).toLocaleString() : 'Pending timestamp'}
                      </div>
                      <div className="text-xs text-muted-foreground space-x-2">
                        {analysis.merchant ? <Badge variant="secondary">{analysis.merchant}</Badge> : null}
                        <span>Shipments: {analysis.totalResults ?? analysis.summary?.total_shipments ?? 0}</span>
                        <span>Savings: {formatCurrency(Number(analysis.summary?.total_savings ?? 0))}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {errorMessage ? (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => void handleCompare()}>
              Retry
            </Button>
          </div>
        </Alert>
      ) : null}

      {summary && selected.length ? (
        <section className="space-y-6">
          <AnalyticsWidgets
            totalSavings={summary.totalSavings}
            totalShipments={summary.totalShipments}
            avgSavingsPerShipment={summary.avgSavingsPerShipment}
          />

          {summary.trend.length || summary.zones.length || summary.weights.length ? (
            <TrendCharts
              trend={summary.trend}
              zones={summary.zones}
              weights={summary.weights}
            />
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-sm text-muted-foreground">
                Additional visualization data is not available for the selected analyses.
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Selected analyses</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="pb-2 pr-4 font-medium">Analysis</th>
                    <th className="pb-2 pr-4 font-medium hidden md:table-cell">Merchant</th>
                    <th className="pb-2 pr-4 font-medium">Shipments</th>
                    <th className="pb-2 pr-4 font-medium">Total savings</th>
                    <th className="pb-2 pr-4 font-medium">Avg / shipment</th>
                    <th className="pb-2 pr-4 font-medium hidden lg:table-cell">% savings</th>
                    <th className="pb-2 font-medium hidden xl:table-cell">Amazon vs. current</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {comparisonItems.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-foreground">
                          {item.filename || `Analysis ${item.id.slice(0, 8)}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Timestamp unavailable'}
                        </div>
                        {item.error ? (
                          <div className="text-xs text-red-600 mt-1">{item.error}</div>
                        ) : null}
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell">
                        {item.merchant || '—'}
                      </td>
                      <td className="py-3 pr-4">{item.totalShipments.toLocaleString()}</td>
                      <td className="py-3 pr-4">{formatCurrency(item.totalSavings)}</td>
                      <td className="py-3 pr-4">{formatCurrency(item.avgSavingsPerShipment)}</td>
                      <td className="py-3 pr-4 hidden lg:table-cell">
                        {item.percentSavings != null ? formatPercent(Number(item.percentSavings)) : '—'}
                      </td>
                      <td className="py-3 hidden xl:table-cell">
                        <div className="text-xs">
                          <div>Amazon: {item.totalAmazonCost != null ? formatCurrency(item.totalAmazonCost) : '—'}</div>
                          <div>Current: {item.totalCurrentCost != null ? formatCurrency(item.totalCurrentCost) : '—'}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {summary.merchants.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Merchant performance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {summary.merchants.map((merchant) => (
                  <div key={merchant.merchant} className="border rounded-md p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-foreground">{merchant.merchant}</div>
                      <Badge variant="outline">{merchant.analyses} analyses</Badge>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div>Total savings: {formatCurrency(merchant.totalSavings)}</div>
                      <div>Shipments: {merchant.totalShipments.toLocaleString()}</div>
                      <div>Avg / shipment: {formatCurrency(merchant.avgSavingsPerShipment)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </section>
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Select at least one analysis and run the comparison to see detailed results.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
