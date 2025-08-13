'use client';

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
import { exportAnalysisResults } from '../lib/export-service';
import toast from 'react-hot-toast';

interface AnalysisResultsProps {
  analysisData: any;
  isComplete: boolean;
  onExport: () => void;
}

export function AnalysisResults({ analysisData, isComplete, onExport }: AnalysisResultsProps) {
  const [filterCarrier, setFilterCarrier] = useState('all');
  const [filterZone, setFilterZone] = useState('all');

  if (!isComplete || !analysisData) {
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
                <span>Processing...</span>
              </div>
              <Progress value={75} className="h-3" />
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

  const results = analysisData.results || [];
  const summary = analysisData.summary || {};
  
  const totalSavings = summary.totalSavings || 0;
  const totalCurrent = summary.totalCurrentCost || 0;
  const totalShipments = summary.totalShipments || 0;
  const avgSavingsPercent = totalCurrent > 0 ? (totalSavings / totalCurrent) * 100 : 0;

  // Process results for display
  const processedResults = results.map((result: any, index: number) => ({
    id: index + 1,
    origin: result.from_zip || 'N/A',
    destination: result.to_zip || 'N/A',
    zone: result.zone || 'N/A',
    weight: result.weight || 0,
    currentCost: result.current_rate || 0,
    optimizedCost: result.amazon_rate || 0,
    savings: result.savings || 0,
    savingsPercent: result.savings_percent || 0,
    carrier: result.carrier || 'Unknown',
    service: 'Standard',
    billableWeight: result.billable_weight || 0,
    baseRate: result.base_rate || 0,
    fuelSurcharge: result.fuel_surcharge || 0,
    totalSurcharges: result.total_surcharges || 0
  }));

  // Calculate zone distribution
  const zoneCounts: { [key: string]: number } = {};
  processedResults.forEach((result: any) => {
    const zone = `Zone ${result.zone}`;
    zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
  });

  const zoneDistribution = Object.entries(zoneCounts).map(([zone, count]) => ({
    zone,
    count,
    color: '#222530'
  }));

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
            <div className="text-2xl font-medium">{totalShipments}</div>
            <p className="text-xs text-muted-foreground">
              100% successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Total Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">${totalCurrent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Before optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amazon Total Cost</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">${summary.totalAmazonCost?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              After optimization
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
          <Card>
            <CardHeader>
              <CardTitle className="font-medium">Zone Distribution</CardTitle>
              <CardDescription>Shipments by shipping zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {zoneDistribution.map((zone) => (
                  <div key={zone.zone} className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-semibold">{zone.count}</div>
                    <div className="text-sm text-muted-foreground">{zone.zone}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                    <TableHead>Carrier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedResults
                    .sort((a: any, b: any) => b.savings - a.savings)
                    .slice(0, 10)
                    .map((result: any) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {result.origin} → {result.destination}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Zone {result.zone}</Badge>
                      </TableCell>
                      <TableCell>${result.currentCost.toFixed(2)}</TableCell>
                      <TableCell className="text-primary font-medium">
                        ${result.optimizedCost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-primary font-medium">
                            ${result.savings.toFixed(2)}
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
                  <Select value={filterZone} onValueChange={setFilterZone}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {Array.from(new Set(processedResults.map((r: any) => r.zone))).map((zone) => (
                        <SelectItem key={String(zone)} value={String(zone)}>Zone {String(zone)}</SelectItem>
                      ))}
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
                    <TableHead>Billable Weight</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Optimized</TableHead>
                    <TableHead>Savings</TableHead>
                    <TableHead>Base Rate</TableHead>
                    <TableHead>Fuel Surcharge</TableHead>
                    <TableHead>Total Surcharges</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedResults
                    .filter((result: any) => filterZone === 'all' || result.zone.toString() === filterZone)
                    .map((result: any) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-mono">{result.id}</TableCell>
                      <TableCell>{result.origin}</TableCell>
                      <TableCell>{result.destination}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Zone {result.zone}</Badge>
                      </TableCell>
                      <TableCell>{result.weight.toFixed(2)} lbs</TableCell>
                      <TableCell>{result.billableWeight.toFixed(2)} lbs</TableCell>
                      <TableCell>${result.currentCost.toFixed(2)}</TableCell>
                      <TableCell className="text-primary font-medium">
                        ${result.optimizedCost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-primary font-medium">
                            ${result.savings.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {result.savingsPercent.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>${result.baseRate.toFixed(2)}</TableCell>
                      <TableCell>${result.fuelSurcharge.toFixed(2)}</TableCell>
                      <TableCell>${result.totalSurcharges.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-medium">Export Options</CardTitle>
                <CardDescription>Choose your preferred export format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" 
                  size="lg"
                  onClick={() => {
                    try {
                      exportAnalysisResults(analysisData, { format: 'csv' });
                      toast.success('CSV export completed!');
                    } catch (error) {
                      toast.error('Export failed: ' + (error as Error).message);
                    }
                  }}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>CSV Data</div>
                    <div className="text-sm opacity-80">Complete analysis data</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => toast.success('Excel export coming soon!')}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div>Excel Workbook</div>
                    <div className="text-sm text-muted-foreground">Complete analysis with charts</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="lg"
                  onClick={() => toast.success('PDF export coming soon!')}
                >
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
                  <span className="text-sm">Zone analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Rate breakdowns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Surcharge details</span>
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