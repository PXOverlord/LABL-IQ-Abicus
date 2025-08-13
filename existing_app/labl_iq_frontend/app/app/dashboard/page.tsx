
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  BarChart3, 
  FileText, 
  Download, 
  TrendingUp, 
  Package, 
  DollarSign, 
  MapPin,
  Plus,
  Clock,
  ArrowRight
} from 'lucide-react';

type AnalysisSummary = {
  id: string;
  fileName: string;
  date: string;
  shipmentCount: number;
  totalValue: number;
  avgRate: number;
  zones: number[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisSummary[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalShipments: 0,
    totalValue: 0,
    avgRate: 0
  });

  // Mock data for now - in real app this would come from your backend
  useEffect(() => {
    // Simulate loading recent analyses
    const mockAnalyses: AnalysisSummary[] = [
      {
        id: '1',
        fileName: 'Q4_Shipping_Data.csv',
        date: '2025-08-11',
        shipmentCount: 6920,
        totalValue: 156420,
        avgRate: 22.6,
        zones: [1, 2, 3, 4, 5, 6, 7, 8]
      },
      {
        id: '2',
        fileName: 'August_Shipping.csv',
        date: '2025-08-05',
        shipmentCount: 5430,
        totalValue: 123450,
        avgRate: 22.7,
        zones: [1, 2, 3, 4, 5]
      }
    ];
    
    setRecentAnalyses(mockAnalyses);
    
    // Calculate total stats
    const totalShipments = mockAnalyses.reduce((sum, a) => sum + a.shipmentCount, 0);
    const totalValue = mockAnalyses.reduce((sum, a) => sum + a.totalValue, 0);
    const avgRate = totalValue / totalShipments;
    
    setStats({
      totalAnalyses: mockAnalyses.length,
      totalShipments,
      totalValue,
      avgRate: avgRate || 0
    });
  }, []);

  const handleNewAnalysis = () => {
    router.push('/upload');
  };

  const handleViewAnalysis = (analysisId: string) => {
    // In real app, this would navigate to a specific analysis
    router.push(`/analysis?id=${analysisId}`);
  };

  const handleViewAllAnalyses = () => {
    router.push('/analysis');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Labl IQ</h1>
        <p className="text-lg text-gray-600">Shipping Intelligence Platform</p>
        <p className="text-sm text-gray-500">Analyze, optimize, and manage your shipping operations</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNewAnalysis}>
          <CardContent className="p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">New Analysis</h3>
            <p className="text-sm text-gray-600 mb-4">Upload new shipping data and run analysis</p>
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              Start Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewAllAnalyses}>
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">View Analyses</h3>
            <p className="text-sm text-gray-600 mb-4">Browse all your previous analyses and results</p>
            <Button variant="outline" className="w-full">
              Browse Results
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <p className="text-sm text-gray-600 mb-4">Generate detailed reports and insights</p>
            <Button variant="outline" className="w-full">
              Generate Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold">{stats.totalShipments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Rate</p>
                <p className="text-2xl font-bold">${stats.avgRate.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Analyses</span>
            </CardTitle>
            <Button variant="outline" onClick={handleViewAllAnalyses}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentAnalyses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No analyses yet. Start your first analysis!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div 
                  key={analysis.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewAnalysis(analysis.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{analysis.fileName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{analysis.date}</span>
                        <span>•</span>
                        <span>{analysis.shipmentCount.toLocaleString()} shipments</span>
                        <span>•</span>
                        <span>${analysis.avgRate.toFixed(2)} avg rate</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${analysis.totalValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total value</p>
                    </div>
                    <div className="flex space-x-1">
                      {analysis.zones.slice(0, 3).map(zone => (
                        <Badge key={zone} variant="secondary" className="text-xs">
                          Z{zone}
                        </Badge>
                      ))}
                      {analysis.zones.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{analysis.zones.length - 3}
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Getting Started</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-medium mb-2">Upload Your Data</h4>
              <p className="text-sm text-gray-600">Upload CSV files with shipping data including weights, rates, and zones</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-medium mb-2">Map Your Columns</h4>
              <p className="text-sm text-gray-600">Tell us which columns contain weight, rates, zones, and other data</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-medium mb-2">Analyze & Optimize</h4>
              <p className="text-sm text-gray-600">Get insights, identify patterns, and optimize your shipping costs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
