import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp, 
  Truck, 
  Target, 
  Clock, 
  DollarSign,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Eye,
  Settings,
  Zap
} from 'lucide-react';

// Enhanced Platform Overview Component for Dual User Types
export function PlatformOverview() {
  const [userRole, setUserRole] = useState<'merchant' | 'analyst'>('merchant');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  // Merchant/3PL focused metrics
  const merchantMetrics = {
    activeShipments: 2847,
    avgDeliveryTime: 2.3,
    costPerShipment: 8.47,
    deliverySuccess: 98.2,
    recentShipments: [
      { id: "SH001", status: "in-transit", destination: "New York, NY", eta: "2 days" },
      { id: "SH002", status: "delivered", destination: "Los Angeles, CA", eta: "delivered" },
      { id: "SH003", status: "processing", destination: "Chicago, IL", eta: "3 days" }
    ],
    alerts: [
      { type: "delay", message: "5 shipments delayed due to weather", priority: "medium" },
      { type: "cost", message: "Zone 8 rates increased 3%", priority: "low" }
    ]
  };

  // Analyst/Consultant focused metrics  
  const analystMetrics = {
    totalAnalyses: 847,
    clientsSaved: 125400,
    avgOptimization: 18.7,
    activeProjects: 23,
    recentAnalyses: [
      { client: "RetailCorp", savings: 15600, optimization: 22.3, status: "completed" },
      { client: "LogisticsPro", savings: 8400, optimization: 15.8, status: "in-progress" },
      { client: "E-commerce Plus", savings: 21200, optimization: 31.2, status: "completed" }
    ],
    opportunities: [
      { client: "TechStartup", potential: 12000, type: "zone-optimization" },
      { client: "Fashion Brand", potential: 8900, type: "carrier-consolidation" }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Role-Based Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-semibold text-black">
              {userRole === 'merchant' ? 'Shipping Operations Center' : 'Rate Analysis Command Center'}
            </h1>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUserRole('merchant')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  userRole === 'merchant' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Merchant View
              </button>
              <button
                onClick={() => setUserRole('analyst')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  userRole === 'analyst' 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Analyst View
              </button>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            {userRole === 'merchant' 
              ? 'Monitor shipments, track performance, and optimize operations'
              : 'Analyze shipping data, identify opportunities, and deliver client value'
            }
          </p>
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
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            {userRole === 'merchant' ? 'New Shipment' : 'New Analysis'}
          </Button>
        </div>
      </div>

      {/* Role-Specific Content */}
      {userRole === 'merchant' ? (
        <MerchantDashboard metrics={merchantMetrics} />
      ) : (
        <AnalystDashboard metrics={analystMetrics} />
      )}
    </div>
  );
}

// Merchant/3PL Dashboard Component
function MerchantDashboard({ metrics }: { metrics: any }) {
  return (
    <>
      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">
                  {metrics.activeShipments.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Active Shipments</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+12% from last month</span>
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
                <div className="text-2xl font-medium text-black">
                  {metrics.avgDeliveryTime} days
                </div>
                <div className="text-sm text-gray-600">Avg Delivery Time</div>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">-0.3 days improved</span>
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
                <div className="text-2xl font-medium text-black">
                  ${metrics.costPerShipment}
                </div>
                <div className="text-sm text-gray-600">Cost per Shipment</div>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">-$0.73 optimized</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">
                  {metrics.deliverySuccess}%
                </div>
                <div className="text-sm text-gray-600">Delivery Success</div>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Excellent performance</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments */}
        <Card className="lg:col-span-2 shadow-sm hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Recent Shipments</span>
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentShipments.map((shipment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      shipment.status === 'delivered' ? 'bg-green-100' :
                      shipment.status === 'in-transit' ? 'bg-blue-100' : 'bg-amber-100'
                    }`}>
                      {shipment.status === 'delivered' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : shipment.status === 'in-transit' ? (
                        <Truck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-black">{shipment.id}</div>
                      <div className="text-xs text-gray-600">{shipment.destination}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      shipment.status === 'delivered' ? 'default' :
                      shipment.status === 'in-transit' ? 'secondary' : 'outline'
                    }>
                      {shipment.status === 'delivered' ? 'Delivered' :
                       shipment.status === 'in-transit' ? 'In Transit' : 'Processing'}
                    </Badge>
                    <div className="text-xs text-gray-600 mt-1">{shipment.eta}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="shadow-sm hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.alerts.map((alert: any, index: number) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.priority === 'high' ? 'bg-red-50 border-red-400' :
                  alert.priority === 'medium' ? 'bg-amber-50 border-amber-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{alert.message}</p>
                      <div className="flex items-center mt-2">
                        <Badge variant={
                          alert.priority === 'high' ? 'destructive' :
                          alert.priority === 'medium' ? 'secondary' : 'outline'
                        } className="text-xs">
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Analyst/Consultant Dashboard Component
function AnalystDashboard({ metrics }: { metrics: any }) {
  return (
    <>
      {/* Analysis Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">
                  {metrics.totalAnalyses.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Analyses</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+47 this month</span>
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
                <div className="text-2xl font-medium text-black">
                  ${(metrics.clientsSaved / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Client Savings</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+{metrics.avgOptimization}% avg optimization</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-black">
                  {metrics.activeProjects}
                </div>
                <div className="text-sm text-gray-600">Active Projects</div>
                <div className="flex items-center mt-1">
                  <Activity className="w-3 h-3 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-600">6 completing this week</span>
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
                <div className="text-2xl font-medium text-black">
                  {metrics.avgOptimization}%
                </div>
                <div className="text-sm text-gray-600">Avg Optimization</div>
                <div className="flex items-center mt-1">
                  <Zap className="w-3 h-3 text-amber-600 mr-1" />
                  <span className="text-xs text-amber-600">Industry leading</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Client Analyses */}
        <Card className="lg:col-span-2 shadow-sm hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Recent Client Analyses</span>
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentAnalyses.map((analysis: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      analysis.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {analysis.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-black">{analysis.client}</div>
                      <div className="text-xs text-gray-600">{analysis.optimization}% optimization achieved</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm text-green-600">
                      ${analysis.savings.toLocaleString()} saved
                    </div>
                    <Badge variant={analysis.status === 'completed' ? 'default' : 'secondary'}>
                      {analysis.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Opportunities */}
        <Card className="shadow-sm hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.opportunities.map((opp: any, index: number) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{opp.client}</p>
                      <p className="text-xs text-green-700 capitalize">{opp.type.replace('-', ' ')}</p>
                      <div className="flex items-center mt-2">
                        <DollarSign className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          ${opp.potential.toLocaleString()} potential
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}