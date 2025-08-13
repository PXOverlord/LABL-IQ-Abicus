import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileText, 
  Plus, 
  Download, 
  Eye,
  Send,
  Settings,
  Palette,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Building,
  Sparkles,
  Filter,
  Search
} from 'lucide-react';
import { BrandSettingsManager } from './BrandSettingsManager';
import { ReportBuilder } from './ReportBuilder';
import { useBrandSettings } from '../hooks/useBrandSettings';
import { useUserJourney } from '../hooks/useUserJourney';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'analysis' | 'summary' | 'custom';
  status: 'draft' | 'sent' | 'viewed';
  merchantId?: string;
  merchantName?: string;
  createdAt: string;
  lastModified: string;
  dataRange: string;
  metrics: {
    totalShipments: number;
    costSavings: number;
    avgDeliveryTime: number;
    carriersAnalyzed: number;
  };
}

export function Reports() {
  const { currentJourney } = useUserJourney();
  const { brandSettings, merchantProfiles } = useBrandSettings(currentJourney);
  const [activeTab, setActiveTab] = useState('reports');
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Sample reports data - in real app this would come from API
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'report_1',
      name: 'Q2 2025 Shipping Analysis',
      description: 'Comprehensive analysis of shipping costs and carrier performance',
      type: 'analysis',
      status: 'sent',
      merchantId: currentJourney === 'analyst' ? 'merchant_1' : undefined,
      merchantName: currentJourney === 'analyst' ? 'TechCorp Solutions' : undefined,
      createdAt: '2025-06-15T10:30:00Z',
      lastModified: '2025-06-20T14:45:00Z',
      dataRange: 'Apr 1 - Jun 30, 2025',
      metrics: {
        totalShipments: 15420,
        costSavings: 23450,
        avgDeliveryTime: 2.8,
        carriersAnalyzed: 8
      }
    },
    {
      id: 'report_2',
      name: 'Cost Optimization Report',
      description: 'Detailed recommendations for reducing shipping costs',
      type: 'summary',
      status: 'viewed',
      merchantId: currentJourney === 'analyst' ? 'merchant_2' : undefined,
      merchantName: currentJourney === 'analyst' ? 'Global Logistics Inc' : undefined,
      createdAt: '2025-06-28T09:15:00Z',
      lastModified: '2025-07-01T11:30:00Z',
      dataRange: 'May 1 - Jun 30, 2025',
      metrics: {
        totalShipments: 8732,
        costSavings: 18920,
        avgDeliveryTime: 3.1,
        carriersAnalyzed: 6
      }
    },
    {
      id: 'report_3',
      name: 'Carrier Performance Review',
      description: 'Monthly review of carrier performance metrics',
      type: 'custom',
      status: 'draft',
      merchantId: currentJourney === 'analyst' ? 'merchant_3' : undefined,
      merchantName: currentJourney === 'analyst' ? 'EcoShip Green' : undefined,
      createdAt: '2025-07-01T16:20:00Z',
      lastModified: '2025-07-02T10:15:00Z',
      dataRange: 'Jun 1 - Jun 30, 2025',
      metrics: {
        totalShipments: 5234,
        costSavings: 12890,
        avgDeliveryTime: 2.5,
        carriersAnalyzed: 5
      }
    }
  ]);

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'viewed': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'draft': return Clock;
      case 'sent': return Send;
      case 'viewed': return CheckCircle;
      default: return Clock;
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'analysis': return BarChart3;
      case 'summary': return TrendingUp;
      case 'custom': return FileText;
      default: return FileText;
    }
  };

  const handleCreateReport = () => {
    setShowReportBuilder(true);
  };

  const handlePreviewReport = (report: Report) => {
    setSelectedReport(report);
    // In real app, this would open a preview modal
  };

  const handleDownloadReport = (report: Report) => {
    // In real app, this would trigger PDF download
    console.log('Downloading report:', report.name);
  };

  const handleSendReport = (report: Report) => {
    // In real app, this would open send modal
    console.log('Sending report:', report.name);
  };

  if (showReportBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black">Report Builder</h2>
            <p className="text-gray-600">Create custom branded reports for clients</p>
          </div>
          <Button variant="outline" onClick={() => setShowReportBuilder(false)}>
            Back to Reports
          </Button>
        </div>
        
        <ReportBuilder 
          onSave={(template) => {
            console.log('Template saved:', template);
            setShowReportBuilder(false);
          }}
          onPreview={(template) => {
            console.log('Preview template:', template);
          }}
          onSend={(template) => {
            console.log('Send template:', template);
            setShowReportBuilder(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black">
            {currentJourney === 'merchant' ? 'My Reports' : 'Client Reports'}
          </h2>
          <p className="text-gray-600">
            {currentJourney === 'merchant' 
              ? 'View and download your shipping analysis reports'
              : 'Create and manage branded reports for your clients'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {currentJourney === 'analyst' && (
            <Button onClick={handleCreateReport} className="bg-black text-white hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          )}
        </div>
      </div>

      {/* Role-specific tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">
            {currentJourney === 'merchant' ? 'My Reports' : 'Client Reports'}
          </TabsTrigger>
          <TabsTrigger value="branding">
            {currentJourney === 'merchant' ? 'Brand Settings' : 'Client Branding'}
          </TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        {/* Reports List */}
        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter by:</span>
                <Badge variant="outline">All Status</Badge>
                <Badge variant="outline">All Types</Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{reports.length} reports</span>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid gap-6">
            {reports.map((report) => {
              const StatusIcon = getStatusIcon(report.status);
              const TypeIcon = getTypeIcon(report.type);
              
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                            <Badge className={getStatusColor(report.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {report.status}
                            </Badge>
                          </div>
                          
                          <CardDescription className="text-sm">
                            {report.description}
                          </CardDescription>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{report.dataRange}</span>
                            </div>
                            
                            {report.merchantName && (
                              <div className="flex items-center space-x-1">
                                <Building className="w-3 h-3" />
                                <span>{report.merchantName}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-1">
                              <Package className="w-3 h-3" />
                              <span>{report.metrics.totalShipments.toLocaleString()} shipments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handlePreviewReport(report)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        {currentJourney === 'analyst' && report.status === 'draft' && (
                          <Button variant="ghost" size="sm" onClick={() => handleSendReport(report)}>
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-green-600">
                          ${report.metrics.costSavings.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Cost Savings</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-blue-600">
                          {report.metrics.avgDeliveryTime}d
                        </div>
                        <div className="text-xs text-gray-500">Avg Delivery</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-purple-600">
                          {report.metrics.carriersAnalyzed}
                        </div>
                        <div className="text-xs text-gray-500">Carriers</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-orange-600">
                          {((report.metrics.costSavings / (report.metrics.totalShipments * 12)) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Savings Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {reports.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">No Reports Yet</h3>
              <p className="text-gray-600 mb-6">
                {currentJourney === 'merchant' 
                  ? 'Your analysis reports will appear here once generated'
                  : 'Create your first branded report for a client'
                }
              </p>
              {currentJourney === 'analyst' && (
                <Button onClick={handleCreateReport} className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Report
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Brand Settings */}
        <TabsContent value="branding" className="space-y-6">
          <BrandSettingsManager userRole={currentJourney} />
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">Report Templates</h3>
            <p className="text-gray-600 mb-6">Pre-built templates will be available here</p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}