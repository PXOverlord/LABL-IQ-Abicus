
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '../../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { 
  TrendingUp, 
  Download, 
  DollarSign, 
  Package, 
  Truck,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAnalysisStore } from '../../../lib/stores/analysis-store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const statusIcons = {
  PENDING: Clock,
  PROCESSING: Clock,
  COMPLETED: CheckCircle,
  FAILED: AlertCircle,
};

const statusColors = {
  PENDING: 'text-yellow-600',
  PROCESSING: 'text-blue-600',
  COMPLETED: 'text-green-600',
  FAILED: 'text-red-600',
};

const CHART_COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363'];

export default function AnalysisResultsPage() {
  const router = useRouter();
  const params = useParams();
  const analysisId = params.id as string;
  
  const { currentAnalysis, fetchAnalysis, isLoading, pollStatus, stopPolling } = useAnalysisStore();
  
  useEffect(() => {
    // For testing, load analysis without authentication
    if (analysisId) {
      fetchAnalysis(analysisId);
      
      // Start polling if analysis is not complete
      const checkAndPoll = async () => {
        try {
          await fetchAnalysis(analysisId);
          if (currentAnalysis?.status === 'PROCESSING' || currentAnalysis?.status === 'PENDING') {
            pollStatus(analysisId);
          }
        } catch (error) {
          console.error('Error fetching analysis:', error);
        }
      };
      
      checkAndPoll();
    }

    return () => {
      stopPolling();
    };
  }, [analysisId, fetchAnalysis, pollStatus, stopPolling]);

  const handleExportCsv = () => {
    if (!currentAnalysis?.results?.shipments) {
      toast.error('No data available for export');
      return;
    }

    try {
      const headers = ['Package ID', 'Origin ZIP', 'Destination ZIP', 'Weight', 'Current Carrier', 'Current Cost', 'Recommended Carrier', 'Recommended Cost', 'Potential Savings'];
      const csvData = [
        headers.join(','),
        ...currentAnalysis.results.shipments.map((shipment: any) => [
          shipment.package_id || '',
          shipment.origin_zip || '',
          shipment.destination_zip || '',
          shipment.weight || '',
          shipment.current_carrier || '',
          `$${shipment.current_cost?.toFixed(2) || '0.00'}`,
          shipment.recommended_carrier || '',
          `$${shipment.recommended_cost?.toFixed(2) || '0.00'}`,
          `$${shipment.savings?.toFixed(2) || '0.00'}`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `analysis-results-${analysisId}.csv`);
      toast.success('Results exported successfully');
    } catch (error) {
      toast.error('Failed to export results');
      console.error(error);
    }
  };

  const handleBackToHistory = () => {
    router.push('/history');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
              <p className="text-gray-600 mb-6">
                The analysis you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={handleBackToHistory}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const StatusIcon = statusIcons[currentAnalysis.status as keyof typeof statusIcons];
  const statusColor = statusColors[currentAnalysis.status as keyof typeof statusColors];

  // Mock data for demonstration since we don't have real backend integration
  const mockResults = {
    summary: {
      totalShipments: 150,
      totalSavings: 2750.50,
      averageSavingsPercentage: 18.3,
      currentTotalCost: 15025.75,
      optimizedTotalCost: 12275.25
    },
    carrierComparison: [
      { name: 'UPS', current: 8500, optimized: 6200 },
      { name: 'FedEx', current: 4200, optimized: 3800 },
      { name: 'USPS', current: 2325, optimized: 2275 }
    ],
    serviceDistribution: [
      { name: 'Ground', value: 60, color: CHART_COLORS[0] },
      { name: '2-Day', value: 25, color: CHART_COLORS[1] },
      { name: 'Overnight', value: 15, color: CHART_COLORS[2] }
    ],
    topSavingsOpportunities: [
      { packageId: 'PKG001', origin: '90210', destination: '10001', currentCost: 25.50, recommendedCost: 18.75, savings: 6.75, currentCarrier: 'UPS', recommendedCarrier: 'FedEx' },
      { packageId: 'PKG002', origin: '90210', destination: '60601', currentCost: 32.25, recommendedCost: 24.50, savings: 7.75, currentCarrier: 'FedEx', recommendedCarrier: 'UPS' },
      { packageId: 'PKG003', origin: '90210', destination: '30301', currentCost: 28.00, recommendedCost: 21.25, savings: 6.75, currentCarrier: 'UPS', recommendedCarrier: 'USPS' },
    ]
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleBackToHistory}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                  <span className={`font-medium ${statusColor}`}>
                    {currentAnalysis.status.toLowerCase()}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{currentAnalysis.filename}</span>
                </div>
              </div>
            </div>
            
            {currentAnalysis.status === 'COMPLETED' && (
              <Button onClick={handleExportCsv}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>

          {/* Status-specific content */}
          {currentAnalysis.status === 'PENDING' && (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Analysis Queued</h2>
                <p className="text-gray-600">
                  Your analysis is in the queue and will begin processing shortly.
                </p>
              </CardContent>
            </Card>
          )}

          {currentAnalysis.status === 'PROCESSING' && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">Analysis in Progress</h2>
                <p className="text-gray-600">
                  We're analyzing your shipping data across multiple carriers. This typically takes 2-5 minutes.
                </p>
              </CardContent>
            </Card>
          )}

          {currentAnalysis.status === 'FAILED' && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Analysis Failed</h2>
                <p className="text-gray-600 mb-4">
                  {currentAnalysis.error || 'An error occurred while processing your analysis.'}
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                  Start New Analysis
                </Button>
              </CardContent>
            </Card>
          )}

          {currentAnalysis.status === 'COMPLETED' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Package className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {mockResults.summary.totalShipments}
                        </p>
                        <p className="text-sm text-gray-600">Total Shipments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-600 animate-count-up">
                          ${mockResults.summary.totalSavings.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Potential Savings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900 animate-count-up">
                          {mockResults.summary.averageSavingsPercentage}%
                        </p>
                        <p className="text-sm text-gray-600">Avg Savings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          3
                        </p>
                        <p className="text-sm text-gray-600">Carriers Analyzed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Comparison by Carrier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockResults.carrierComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                          />
                          <Tooltip />
                          <Bar dataKey="current" fill={CHART_COLORS[0]} name="Current" />
                          <Bar dataKey="optimized" fill={CHART_COLORS[1]} name="Optimized" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Level Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockResults.serviceDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {mockResults.serviceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Savings Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Savings Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Package ID</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Current</TableHead>
                          <TableHead>Recommended</TableHead>
                          <TableHead>Savings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockResults.topSavingsOpportunities.map((opportunity) => (
                          <TableRow key={opportunity.packageId}>
                            <TableCell className="font-medium">
                              {opportunity.packageId}
                            </TableCell>
                            <TableCell>
                              {opportunity.origin} → {opportunity.destination}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">${opportunity.currentCost.toFixed(2)}</div>
                                <Badge variant="outline" className="text-xs">
                                  {opportunity.currentCarrier}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">${opportunity.recommendedCost.toFixed(2)}</div>
                                <Badge variant="outline" className="text-xs">
                                  {opportunity.recommendedCarrier}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-green-600">
                                ${opportunity.savings.toFixed(2)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
