import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Download, 
  TrendingDown, 
  TrendingUp, 
  Package, 
  DollarSign, 
  BarChart3,
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalysisResultsProps {
  isComplete: boolean;
  onExport: () => void;
}

const sampleResults = [
  {
    id: 1,
    origin: '90210',
    destination: '10001', 
    zone: 8,
    weight: 2.5,
    currentCost: 12.45,
    optimizedCost: 9.85,
    savings: 2.60,
    savingsPercent: 20.9,
    carrier: 'FedEx',
    service: 'Ground'
  },
  {
    id: 2,
    origin: '90210',
    destination: '30309',
    zone: 6,
    weight: 1.8,
    currentCost: 9.25,
    optimizedCost: 7.10,
    savings: 2.15,
    savingsPercent: 23.2,
    carrier: 'UPS',
    service: 'Ground'
  },
  {
    id: 3,
    origin: '90210',
    destination: '60601',
    zone: 5,
    weight: 3.2,
    currentCost: 11.80,
    optimizedCost: 8.95,
    savings: 2.85,
    savingsPercent: 24.2,
    carrier: 'USPS',
    service: 'Priority'
  },
  {
    id: 4,
    origin: '90210',
    destination: '75201',
    zone: 4,
    weight: 2.1,
    currentCost: 8.75,
    optimizedCost: 6.50,
    savings: 2.25,
    savingsPercent: 25.7,
    carrier: 'FedEx',
    service: 'Ground'
  },
  {
    id: 5,
    origin: '90210',
    destination: '98101',
    zone: 3,
    weight: 4.5,
    currentCost: 14.25,
    optimizedCost: 10.80,
    savings: 3.45,
    savingsPercent: 24.2,
    carrier: 'UPS',
    service: 'Ground'
  }
];

// Updated to monochrome colors
const zoneDistribution = [
  { zone: 'Zone 2', count: 245, color: '#222530' },
  { zone: 'Zone 3', count: 382, color: '#475569' },
  { zone: 'Zone 4', count: 451, color: '#64748b' },
  { zone: 'Zone 5', count: 298, color: '#94a3b8' },
  { zone: 'Zone 6', count: 187, color: '#cbd5e1' },
  { zone: 'Zone 7', count: 124, color: '#e2e8f0' },
  { zone: 'Zone 8', count: 89, color: '#f1f5f9' }
];

// Updated to monochrome colors
const savingsByCarrier = [
  { carrier: 'FedEx', current: 15420, optimized: 11890, savings: 3530 },
  { carrier: 'UPS', current: 18250, optimized: 13640, savings: 4610 },
  { carrier: 'USPS', current: 9840, optimized: 7320, savings: 2520 }
];

export function AnalysisResults({ isComplete, onExport }: AnalysisResultsProps) {
  const [filterCarrier, setFilterCarrier] = useState('all');
  const [filterZone, setFilterZone] = useState('all');

  const totalSavings = sampleResults.reduce((sum, result) => sum + result.savings, 0);
  const totalCurrent = sampleResults.reduce((sum, result) => sum + result.currentCost, 0);
  const avgSavingsPercent = (totalSavings / totalCurrent) * 100;

  if (!isComplete) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Processing Analysis</span>
            </CardTitle>
            <CardDescription>
              Analyzing your shipment data and calculating optimal rates...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing shipments</span>
                <span>1,847 / 2,430</span>
              </div>
              <Progress value={76} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Zone calculations complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Rate comparisons complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Optimizing routes...</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>Generating reports...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-primary">
              ${totalSavings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1" />
              {avgSavingsPercent.toFixed(1)}% average savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipments Analyzed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">{sampleResults.length}</div>
            <p className="text-xs text-muted-foreground">
              100% successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Carrier</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">UPS</div>
            <p className="text-xs text-muted-foreground">
              25.2% average savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">92</div>
            <p className="text-xs text-muted-foreground">
              Excellent optimization potential
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            <TabsTrigger value="charts">Analytics</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button onClick={onExport} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-medium">Savings by Carrier</CardTitle>
                <CardDescription>Potential savings per carrier</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={savingsByCarrier}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="carrier" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="current" fill="#94a3b8" name="Current Cost" />
                    <Bar dataKey="optimized" fill="#222530" name="Optimized Cost" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-medium">Zone Distribution</CardTitle>
                <CardDescription>Shipments by shipping zone</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={zoneDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ zone, percent }) => `${zone} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {zoneDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-medium">Top Savings Opportunities</CardTitle>
              <CardDescription>Shipments with the highest savings potential</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origin → Destination</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Current Cost</TableHead>
                    <TableHead>Optimized Cost</TableHead>
                    <TableHead>Savings</TableHead>
                    <TableHead>Recommended Carrier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleResults.slice(0, 5).map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {result.origin} → {result.destination}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Zone {result.zone}</Badge>
                      </TableCell>
                      <TableCell>${result.currentCost}</TableCell>
                      <TableCell className="text-primary font-medium">
                        ${result.optimizedCost}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-primary font-medium">
                            ${result.savings}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {result.savingsPercent.toFixed(1)}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.carrier}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-medium">Detailed Analysis Results</CardTitle>
                  <CardDescription>Complete breakdown of all analyzed shipments</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={filterCarrier} onValueChange={setFilterCarrier}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Carriers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Carriers</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterZone} onValueChange={setFilterZone}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      <SelectItem value="2">Zone 2</SelectItem>
                      <SelectItem value="3">Zone 3</SelectItem>
                      <SelectItem value="4">Zone 4</SelectItem>
                      <SelectItem value="5">Zone 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Optimized</TableHead>
                    <TableHead>Savings</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-mono">{result.id}</TableCell>
                      <TableCell>{result.origin}</TableCell>
                      <TableCell>{result.destination}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Zone {result.zone}</Badge>
                      </TableCell>
                      <TableCell>{result.weight} lbs</TableCell>
                      <TableCell>${result.currentCost}</TableCell>
                      <TableCell className="text-primary font-medium">
                        ${result.optimizedCost}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-primary font-medium">
                            ${result.savings}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {result.savingsPercent.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.carrier}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{result.service}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-medium">Savings Distribution</CardTitle>
                <CardDescription>Range of savings percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { range: '0-10%', count: 45 },
                    { range: '10-20%', count: 123 },
                    { range: '20-30%', count: 187 },
                    { range: '30%+', count: 89 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="range" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#222530" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-medium">Weight vs Savings</CardTitle>
                <CardDescription>Correlation between package weight and savings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { weight: '0-1 lbs', avgSavings: 18.5 },
                    { weight: '1-2 lbs', avgSavings: 22.3 },
                    { weight: '2-3 lbs', avgSavings: 24.8 },
                    { weight: '3-4 lbs', avgSavings: 26.1 },
                    { weight: '4-5 lbs', avgSavings: 23.9 },
                    { weight: '5+ lbs', avgSavings: 21.2 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="weight" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgSavings" stroke="#222530" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-medium">Export Options</CardTitle>
                <CardDescription>Choose your preferred export format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>Excel Workbook</div>
                    <div className="text-sm opacity-80">Complete analysis with charts</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>CSV Data</div>
                    <div className="text-sm text-muted-foreground">Raw data for further analysis</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>PDF Report</div>
                    <div className="text-sm text-muted-foreground">Executive summary report</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-medium">Export Summary</CardTitle>
                <CardDescription>What will be included in your export</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Complete shipment analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Savings calculations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Carrier recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Zone analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Visual charts and graphs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Executive summary</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}