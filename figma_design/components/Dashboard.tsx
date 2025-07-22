import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Truck, 
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Target,
  Users,
  Globe,
  Calendar,
  FileText,
  Download,
  RefreshCw,
  Upload
} from 'lucide-react';
import { useDashboard } from '../hooks/useShipping';
import { useState } from 'react';
import { env } from '../utils/env';

// Mock data for development mode
const mockMetrics = {
  totalShipments: 12540,
  totalSavings: 47250,
  avgSavingsPerShipment: 3.77,
  topCarrier: "UPS",
  recentAnalyses: [
    {
      id: "1",
      uploadId: "upload-1",
      totalShipments: 2450,
      totalCost: 18500,
      potentialSavings: 3200,
      avgSavingsPerShipment: 1.31,
      topSavingsOpportunities: [],
      carrierBreakdown: [],
      zoneAnalysis: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed" as const
    },
    {
      id: "2",
      uploadId: "upload-2",
      totalShipments: 1850,
      totalCost: 14200,
      potentialSavings: 2850,
      avgSavingsPerShipment: 1.54,
      topSavingsOpportunities: [],
      carrierBreakdown: [],
      zoneAnalysis: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed" as const
    },
    {
      id: "3",
      uploadId: "upload-3",
      totalShipments: 3200,
      totalCost: 24800,
      potentialSavings: 4100,
      avgSavingsPerShipment: 1.28,
      topSavingsOpportunities: [],
      carrierBreakdown: [],
      zoneAnalysis: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed" as const
    }
  ],
  monthlyTrends: [
    { month: "Jan 2025", shipments: 4200, cost: 32500, savings: 15750 },
    { month: "Dec 2024", shipments: 3800, cost: 29200, savings: 14200 },
    { month: "Nov 2024", shipments: 4540, cost: 35800, savings: 17300 }
  ]
};

export function Dashboard() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Use safe environment detection
  const shouldUseMockData = env.isDevelopment && !env.useBackend;
  const { metrics, loading, error, refreshMetrics } = useDashboard(timeframe);
  
  // Use mock data or real data based on environment
  const displayMetrics = shouldUseMockData ? mockMetrics : metrics;
  const displayLoading = shouldUseMockData ? false : loading;
  const displayError = shouldUseMockData ? null : error;

  if (displayLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-black">Failed to Load Dashboard</h3>
          <p className="text-gray-600 max-w-md">
            {displayError}
          </p>
          <Button onClick={refreshMetrics} className="bg-black text-white hover:bg-gray-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!displayMetrics) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-black">No Data Available</h3>
          <p className="text-gray-600 max-w-md">
            Upload your first shipment data to see your dashboard analytics.
          </p>
        </div>
      </div>
    );
  }

  const chartColors = ['#0e121b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Development Mode Banner */}
      {shouldUseMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Demo Mode Active</p>
              <p className="text-xs text-blue-600">Showing sample data for demonstration. Upload real data or connect to backend for actual analytics.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-black">Performance Overview</h2>
          <p className="text-gray-600">Track your shipping optimization progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { value: '7d', label: '7D' },
              { value: '30d', label: '30D' },
              { value: '90d', label: '90D' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeframe(value as '7d' | '30d' | '90d')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeframe === value
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={refreshMetrics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">
                  {displayMetrics.totalShipments.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Shipments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">
                  ${displayMetrics.totalSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Savings</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">
                    ${displayMetrics.avgSavingsPerShipment.toFixed(2)} avg per shipment
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">{displayMetrics.topCarrier}</div>
                <div className="text-sm text-gray-600">Top Carrier</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">{displayMetrics.recentAnalyses.length}</div>
                <div className="text-sm text-gray-600">Recent Analyses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="shadow-sm hover-lift bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Monthly Trends</span>
            </CardTitle>
            <CardDescription>Shipment volume and savings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayMetrics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Savings ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Analyses */}
        <Card className="shadow-sm hover-lift bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Recent Analyses</span>
            </CardTitle>
            <CardDescription>Your latest shipping analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayMetrics.recentAnalyses.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      analysis.status === 'completed' ? 'bg-green-100' : 
                      analysis.status === 'processing' ? 'bg-amber-100' : 'bg-red-100'
                    }`}>
                      {analysis.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : analysis.status === 'processing' ? (
                        <Clock className="w-4 h-4 text-amber-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-black">
                        {analysis.totalShipments.toLocaleString()} shipments
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm text-green-600">
                      ${analysis.potentialSavings.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">potential savings</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm hover-lift bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-medium text-black mb-2">Upload New Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Analyze more shipment data to find additional savings opportunities.
            </p>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Upload Files
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-medium text-black mb-2">Generate Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create detailed reports to share insights with your team.
            </p>
            <Button variant="outline" size="sm">
              Create Report
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-medium text-black mb-2">Set Goals</h3>
            <p className="text-sm text-gray-600 mb-4">
              Define savings targets and track your progress toward them.
            </p>
            <Button variant="outline" size="sm">
              Set Goals
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}