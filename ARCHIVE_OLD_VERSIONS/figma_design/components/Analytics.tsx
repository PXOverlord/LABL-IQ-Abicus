import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Globe,
  Clock,
  DollarSign,
  Package,
  Truck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Scatter,
  ScatterChart
} from 'recharts';

const monthlyTrends = [
  { month: 'Jan', shipped: 1450, cost: 18500, optimized: 14200, savings: 4300, avgZone: 4.2 },
  { month: 'Feb', shipped: 1680, cost: 21200, optimized: 16800, savings: 4400, avgZone: 4.1 },
  { month: 'Mar', shipped: 1520, cost: 19800, optimized: 15200, savings: 4600, avgZone: 4.3 },
  { month: 'Apr', shipped: 1890, cost: 24100, optimized: 18500, savings: 5600, avgZone: 4.0 },
  { month: 'May', shipped: 2150, cost: 28200, optimized: 21800, savings: 6400, avgZone: 3.9 },
  { month: 'Jun', shipped: 1980, cost: 25800, optimized: 19200, savings: 6600, avgZone: 4.1 }
];

const carrierAnalytics = [
  { name: 'UPS', volume: 45, avgCost: 12.50, onTime: 94, satisfaction: 4.2, color: '#f59e0b' },
  { name: 'FedEx', volume: 35, avgCost: 14.20, onTime: 96, satisfaction: 4.4, color: '#8b5cf6' },
  { name: 'USPS', volume: 20, avgCost: 9.80, onTime: 87, satisfaction: 3.8, color: '#3b82f6' }
];

const zoneDistribution = [
  { zone: 'Zone 1-2', volume: 25, avgCost: 8.50, color: '#10b981' },
  { zone: 'Zone 3-4', volume: 35, avgCost: 11.20, color: '#3b82f6' },
  { zone: 'Zone 5-6', volume: 28, avgCost: 14.80, color: '#f59e0b' },
  { zone: 'Zone 7-8', volume: 12, avgCost: 18.90, color: '#dc2626' }
];

const predictiveData = [
  { month: 'Jul', predicted: 2200, confidence: 85, lower: 2100, upper: 2300 },
  { month: 'Aug', predicted: 2350, confidence: 82, lower: 2200, upper: 2500 },
  { month: 'Sep', predicted: 2180, confidence: 78, lower: 2000, upper: 2400 },
  { month: 'Oct', predicted: 2450, confidence: 75, lower: 2250, upper: 2650 }
];

const costEfficiencyData = [
  { weight: 1, cost: 8.5, efficiency: 8.5, packages: 120 },
  { weight: 2, cost: 10.2, efficiency: 5.1, packages: 180 },
  { weight: 5, cost: 12.8, efficiency: 2.56, packages: 340 },
  { weight: 10, cost: 18.5, efficiency: 1.85, packages: 220 },
  { weight: 15, cost: 24.2, efficiency: 1.61, packages: 150 },
  { weight: 20, cost: 28.9, efficiency: 1.45, packages: 95 }
];

export function Analytics() {
  const [timeRange, setTimeRange] = useState('6-months');
  const [selectedMetric, setSelectedMetric] = useState('cost-savings');

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-month">Last Month</SelectItem>
              <SelectItem value="3-months">Last 3 Months</SelectItem>
              <SelectItem value="6-months">Last 6 Months</SelectItem>
              <SelectItem value="1-year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white">Performance</TabsTrigger>
          <TabsTrigger value="carriers" className="data-[state=active]:bg-white">Carriers</TabsTrigger>
          <TabsTrigger value="geography" className="data-[state=active]:bg-white">Geography</TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:bg-white">Predictive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm hover-lift bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+18.2%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium text-black">$32,100</div>
                <div className="text-sm text-gray-600">Total Savings (6 months)</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover-lift bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+12.5%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium text-black">10,670</div>
                <div className="text-sm text-gray-600">Packages Shipped</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover-lift bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm font-medium">+3.2%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium text-black">26.4%</div>
                <div className="text-sm text-gray-600">Avg. Savings Rate</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover-lift bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-red-600">
                    <ArrowDownRight className="w-4 h-4" />
                    <span className="text-sm font-medium">-8.1%</span>
                  </div>
                </div>
                <div className="text-2xl font-medium text-black">2.1 min</div>
                <div className="text-sm text-gray-600">Avg. Processing Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Trends Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Cost Optimization Trends</CardTitle>
                <CardDescription className="text-gray-600">
                  Monthly comparison of actual costs vs. optimized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#000000'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#dc2626" 
                      fill="url(#costGradient)"
                      strokeWidth={2}
                      name="Actual Cost"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="optimized" 
                      stroke="#10b981" 
                      fill="url(#optimizedGradient)"
                      strokeWidth={2}
                      name="Optimized Cost"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Savings"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Savings Breakdown</CardTitle>
                <CardDescription className="text-gray-600">
                  Distribution of cost savings by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Carrier Optimization', value: 45, color: '#10b981' },
                        { name: 'Service Selection', value: 28, color: '#3b82f6' },
                        { name: 'Zone Efficiency', value: 18, color: '#f59e0b' },
                        { name: 'Package Optimization', value: 9, color: '#8b5cf6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                    >
                      {[
                        { name: 'Carrier Optimization', value: 45, color: '#10b981' },
                        { name: 'Service Selection', value: 28, color: '#3b82f6' },
                        { name: 'Zone Efficiency', value: 18, color: '#f59e0b' },
                        { name: 'Package Optimization', value: 9, color: '#8b5cf6' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#000000'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black">Cost Efficiency Analysis</CardTitle>
              <CardDescription className="text-gray-600">
                Cost per pound vs. package weight distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={costEfficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="weight" stroke="#64748b" name="Weight (lbs)" />
                  <YAxis dataKey="efficiency" stroke="#64748b" name="Cost per Pound" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: '#000000'
                    }} 
                    formatter={(value, name) => [
                      name === 'efficiency' ? `$${value}` : value,
                      name === 'efficiency' ? 'Cost per Pound' : name
                    ]}
                  />
                  <Scatter dataKey="efficiency" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carriers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Carrier Performance</CardTitle>
                <CardDescription className="text-gray-600">
                  Comparative analysis of carrier metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {carrierAnalytics.map((carrier, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: carrier.color }}
                          ></div>
                          <span className="font-medium text-black">{carrier.name}</span>
                          <Badge variant="outline">{carrier.volume}% volume</Badge>
                        </div>
                        <div className="text-lg font-medium text-black">
                          ${carrier.avgCost}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">On-Time Rate</div>
                          <div className="font-medium text-black">{carrier.onTime}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Satisfaction</div>
                          <div className="font-medium text-black">{carrier.satisfaction}/5.0</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Volume by Carrier</CardTitle>
                <CardDescription className="text-gray-600">
                  Monthly shipment volume distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={carrierAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#000000'
                      }}
                    />
                    <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black">Zone Distribution Analysis</CardTitle>
              <CardDescription className="text-gray-600">
                Shipping volume and costs by geographic zones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {zoneDistribution.map((zone, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          ></div>
                          <span className="font-medium text-black">{zone.zone}</span>
                        </div>
                        <Badge variant="outline">{zone.volume}% volume</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Cost: <span className="font-medium text-black">${zone.avgCost}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={zoneDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="volume"
                      label={({ zone, volume }) => `${zone}: ${volume}%`}
                    >
                      {zoneDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#000000'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black flex items-center">
                <Zap className="w-6 h-6 mr-3 text-amber-600" />
                Predictive Analytics
              </CardTitle>
              <CardDescription className="text-gray-600">
                AI-powered forecasting for shipping volume and costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={predictiveData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: '#000000'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="upper" 
                    stroke="transparent" 
                    fill="#8b5cf6" 
                    fillOpacity={0.1}
                    name="Upper Bound"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower" 
                    stroke="transparent" 
                    fill="#ffffff"
                    name="Lower Bound"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    name="Predicted Volume"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-800">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">AI Insights</span>
                </div>
                <p className="text-sm text-amber-700 mt-2">
                  Based on historical trends, we predict a 12% increase in shipping volume during August, 
                  primarily driven by back-to-school season. Consider optimizing carrier mix for increased capacity.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}