import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useUserJourney } from '../hooks/useUserJourney';
import { 
  Package, 
  Truck, 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Clock,
  Target,
  FileText,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Globe
} from 'lucide-react';

export function JourneyAwareDashboard() {
  const { currentJourney, getJourneyConfig } = useUserJourney();
  const config = getJourneyConfig();

  // Render different dashboard based on journey and configuration
  if (currentJourney === 'merchant') {
    return <MerchantDashboard config={config} />;
  } else {
    return <AnalystDashboard config={config} />;
  }
}

function MerchantDashboard({ config }: { config: any }) {
  const { theme } = config;
  const layout = theme?.dashboardLayout || 'operational';

  // Mock data - would come from API
  const merchantData = {
    operational: {
      activeShipments: 1247,
      dailyVolume: 89,
      avgDeliveryTime: 2.4,
      onTimeDelivery: 94.2,
      costPerShipment: 8.73,
      todaysCost: 776.97
    },
    analytical: {
      monthlyVolume: 2847,
      costSavings: 23400,
      optimizationRate: 18.7,
      topCarrier: 'UPS',
      avgZoneDistance: 850,
      dimensionalOptimization: 12.3
    }
  };

  if (layout === 'operational') {
    return (
      <div className="space-y-8">
        {/* Operational Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black">Operations Center</h2>
            <p className="text-gray-600">Real-time shipping operations and performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
            <Button className="bg-black text-white hover:bg-gray-800">
              Process Shipments
            </Button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-semibold text-black">
                    {merchantData.operational.activeShipments.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Active Shipments</div>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+{merchantData.operational.dailyVolume} today</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-semibold text-black">
                    {merchantData.operational.avgDeliveryTime} days
                  </div>
                  <div className="text-sm text-gray-600">Avg Delivery Time</div>
                  <div className="flex items-center mt-1">
                    <ArrowDownRight className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">Improved by 0.3 days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-semibold text-black">
                    ${merchantData.operational.costPerShipment}
                  </div>
                  <div className="text-sm text-gray-600">Cost per Shipment</div>
                  <div className="flex items-center mt-1">
                    <ArrowDownRight className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">-$0.47 optimized</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-semibold text-black">
                    {merchantData.operational.onTimeDelivery}%
                  </div>
                  <div className="text-sm text-gray-600">On-Time Delivery</div>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">Excellent performance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operational Dashboard - would include shipment tracking, alerts, etc. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Today's Shipping Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">89 shipments processed</div>
                      <div className="text-xs text-gray-600">Total cost: ${merchantData.operational.todaysCost}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Today</Badge>
                </div>
                {/* Add more operational activities */}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-black text-white hover:bg-gray-800">
                <Package className="w-4 h-4 mr-3" />
                Process New Shipment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-3" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Analytical layout for merchants who prefer data focus
  return (
    <div className="space-y-8">
      {/* Analytical Merchant Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black">Shipping Analytics</h2>
          <p className="text-gray-600">Data-driven insights for your shipping operations</p>
        </div>
      </div>

      {/* Analytics focused metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-black">
                  ${merchantData.analytical.costSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Monthly Savings</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-black">
                  {merchantData.analytical.optimizationRate}%
                </div>
                <div className="text-sm text-gray-600">Optimization Rate</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-black">
                  {merchantData.analytical.monthlyVolume.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Monthly Volume</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalystDashboard({ config }: { config: any }) {
  const { theme } = config;
  const layout = theme?.dashboardLayout || 'analytical';

  // Mock analyst data
  const analystData = {
    totalClients: 23,
    activeProjects: 8,
    totalSavings: 847000,
    avgOptimization: 18.7,
    completedAnalyses: 156,
    monthlyRevenue: 45600
  };

  return (
    <div className="space-y-8">
      {/* Analyst Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black">Analytics Command Center</h2>
          <p className="text-gray-600">Client projects, analysis results, and business insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-purple-50 text-purple-700">
            <BarChart3 className="w-3 h-3 mr-1" />
            {analystData.activeProjects} Active Projects
          </Badge>
          <Button className="bg-black text-white hover:bg-gray-800">
            New Client Analysis
          </Button>
        </div>
      </div>

      {/* Analyst Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold text-black">{analystData.totalClients}</div>
                <div className="text-sm text-gray-600">Total Clients</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+3 this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold text-black">
                  ${(analystData.totalSavings / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Client Savings</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+{analystData.avgOptimization}% avg optimization</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold text-black">{analystData.completedAnalyses}</div>
                <div className="text-sm text-gray-600">Completed Analyses</div>
                <div className="flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-600">12 this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-semibold text-black">
                  ${(analystData.monthlyRevenue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
                <div className="flex items-center mt-1">
                  <Zap className="w-3 h-3 text-amber-600 mr-1" />
                  <span className="text-xs text-amber-600">+23% growth</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyst-specific sections would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Client Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Client project list */}
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-600">Client project management coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-black text-white hover:bg-gray-800">
              <Users className="w-4 h-4 mr-3" />
              New Client Project
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-3" />
              Bulk Analysis
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-3" />
              Generate Presentation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}