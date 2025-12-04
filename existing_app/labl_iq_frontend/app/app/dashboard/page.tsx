'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, TrendingUp, Package, DollarSign, Plus, ArrowRight } from 'lucide-react';

import { useAnalysisStore } from '../../hooks/useAnalysisStore';
import AnalyticsWidgets from '../../components/dashboard/AnalyticsWidgets';
import TrendCharts from '../../components/dashboard/TrendCharts';

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '—';
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const analyses = useAnalysisStore((state) => state.analyses);
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const loadHistory = useAnalysisStore((state) => state.loadHistory);

  useEffect(() => {
    loadHistory({ limit: 25 }).catch((error) => {
      console.error('Failed to load dashboard history', error);
    });
  }, [loadHistory]);

  const metrics = useMemo(() => {
    const totalAnalyses = analyses.length;
    const totalShipments = analyses.reduce((sum, analysis) => {
      const total = analysis.totalResults ?? analysis.summary?.total_shipments ?? analysis.summary?.total_packages ?? 0;
      return sum + Number(total || 0);
    }, 0);
    const totalSavings = analyses.reduce((sum, analysis) => sum + Number(analysis.summary?.total_savings ?? 0), 0);
    const totalCurrent = analyses.reduce((sum, analysis) => sum + Number(analysis.summary?.total_current_cost ?? 0), 0);
    const totalAmazon = analyses.reduce((sum, analysis) => sum + Number(analysis.summary?.total_amazon_cost ?? 0), 0);

    const avgSavingsPerShipment = totalShipments > 0 ? totalSavings / totalShipments : 0;

    return {
      totalAnalyses,
      totalShipments,
      totalSavings,
      totalCurrent,
      totalAmazon,
      avgSavingsPerShipment,
    };
  }, [analyses]);

  const recentAnalyses = useMemo(() => {
    return analyses
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map((analysis) => ({
        id: analysis.id,
        fileName: analysis.filename || analysis.fileName || `Analysis ${analysis.id.slice(0, 8)}`,
        date: analysis.timestamp ? new Date(analysis.timestamp).toLocaleString() : 'Recently',
        shipmentCount: analysis.totalResults ?? analysis.summary?.total_shipments ?? analysis.summary?.total_packages ?? 0,
        totalSavings: Number(analysis.summary?.total_savings ?? 0),
        merchant: analysis.merchant,
      }));
  }, [analyses]);

  const charts = useMemo(() => {
    const trend = analyses
      .slice()
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((analysis) => ({
        date: analysis.timestamp ? new Date(analysis.timestamp).toLocaleDateString() : 'Unknown',
        savings: Number(analysis.summary?.total_savings ?? 0),
        shipments: Number(analysis.totalResults ?? analysis.summary?.total_shipments ?? analysis.summary?.total_packages ?? 0),
      }));

    const zoneMap = new Map<string | number, number>();
    analyses.forEach((analysis) => {
      const rows = (analysis.visualizations?.zone_table as any[]) || [];
      rows.forEach((row) => {
        const key = row.Zone ?? row.zone;
        const shipments = Number(row.Shipments ?? row.shipments ?? 0);
        if (key != null) {
          zoneMap.set(key, (zoneMap.get(key) ?? 0) + shipments);
        }
      });
    });
    const zones = Array.from(zoneMap.entries())
      .map(([zone, count]) => ({ zone: Number(zone), count }))
      .sort((a, b) => a.zone - b.zone);

    const weightMap = new Map<string, number>();
    analyses.forEach((analysis) => {
      const rows = (analysis.visualizations?.weight_table as any[]) || [];
      rows.forEach((row) => {
        const bucket = String(row['Weight Range'] ?? row.weight_bracket ?? row.bucket ?? 'Unknown');
        const shipments = Number(row.Shipments ?? row.shipments ?? 0);
        weightMap.set(bucket, (weightMap.get(bucket) ?? 0) + shipments);
      });
    });
    const weights = Array.from(weightMap.entries()).map(([bucket, count]) => ({ bucket, count }));

    return { trend, zones, weights };
  }, [analyses]);

  const handleNewAnalysis = () => router.push('/upload');
  const handleViewAllAnalyses = () => router.push('/analysis');

  return (
    <div className="p-6 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Labl IQ</h1>
        <p className="text-lg text-gray-600">Shipping intelligence and analysis hub</p>
        <p className="text-sm text-gray-500">Run analyses, review savings, and export detailed reports.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNewAnalysis}>
          <CardContent className="p-6 text-center space-y-4">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">New Analysis</h3>
              <p className="text-sm text-gray-600">Upload new shipping data and run an analysis.</p>
            </div>
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              Start Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewAllAnalyses}>
          <CardContent className="p-6 text-center space-y-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">View Analyses</h3>
              <p className="text-sm text-gray-600">Browse previous analyses and drill into results.</p>
            </div>
            <Button variant="outline" className="w-full">
              Browse Results
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" onClick={() => router.push('/reports')}>
          <CardContent className="p-6 text-center space-y-4">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Reports</h3>
              <p className="text-sm text-gray-600">Generate detailed comparisons across analyses.</p>
            </div>
            <Button variant="outline" className="w-full">
              Open Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Analyses</p>
              <p className="text-2xl font-semibold">{metrics.totalAnalyses}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <Package className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Total Shipments</p>
              <p className="text-2xl font-semibold">{metrics.totalShipments.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-semibold">{formatCurrency(metrics.totalSavings)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Avg Savings / Shipment</p>
              <p className="text-2xl font-semibold">{formatCurrency(metrics.avgSavingsPerShipment)}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <AnalyticsWidgets
        totalSavings={metrics.totalSavings}
        totalShipments={metrics.totalShipments}
        avgSavingsPerShipment={metrics.avgSavingsPerShipment}
      />

      <TrendCharts trend={charts.trend} zones={charts.zones} weights={charts.weights} />

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent analyses</h2>
        {isLoading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : recentAnalyses.length === 0 ? (
          <div className="text-sm text-gray-600">No analyses available yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentAnalyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow transition">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold">
                    {analysis.fileName}
                  </CardTitle>
                  <Badge variant="secondary">{analysis.merchant || 'No merchant'}</Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-900">{analysis.shipmentCount.toLocaleString()}</span> shipments analyzed
                  </div>
                  <div>Total savings: <span className="font-medium text-gray-900">{formatCurrency(analysis.totalSavings)}</span></div>
                  <div className="text-xs text-gray-400">{analysis.date}</div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/analysis/${analysis.id}`)}>
                      View details
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/export?analysis=${analysis.id}`)}>
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
