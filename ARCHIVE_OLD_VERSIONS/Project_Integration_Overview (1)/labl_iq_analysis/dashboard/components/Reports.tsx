import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search,
  Eye,
  Share,
  MoreHorizontal,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  FilePlus
} from 'lucide-react';

const reportTemplates = [
  {
    id: 1,
    name: 'Monthly Savings Summary',
    description: 'Comprehensive monthly analysis of shipping cost savings and optimization results',
    icon: TrendingUp,
    category: 'Savings',
    estimatedTime: '2-3 minutes',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 2,
    name: 'Carrier Performance Report',
    description: 'Detailed breakdown of carrier performance, delivery times, and cost analysis',
    icon: BarChart3,
    category: 'Performance',
    estimatedTime: '3-5 minutes',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 3,
    name: 'Zone Analysis Report',
    description: 'Geographic shipping zone analysis with cost optimization recommendations',
    icon: PieChart,
    category: 'Geographic',
    estimatedTime: '2-4 minutes',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 4,
    name: 'Custom Data Export',
    description: 'Export raw shipment data with custom filters and field selection',
    icon: FileSpreadsheet,
    category: 'Data',
    estimatedTime: '1-2 minutes',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  }
];

const recentReports = [
  {
    id: 1,
    name: 'June 2025 Savings Summary',
    type: 'Monthly Savings Summary',
    created: '2025-07-01',
    status: 'completed',
    fileSize: '2.4 MB',
    author: 'System Generated',
    downloads: 12,
    format: 'PDF'
  },
  {
    id: 2,
    name: 'Q2 Carrier Performance Analysis',
    type: 'Carrier Performance Report',
    created: '2025-06-28',
    status: 'completed',
    fileSize: '5.1 MB',
    author: 'John Smith',
    downloads: 8,
    format: 'Excel'
  },
  {
    id: 3,
    name: 'East Coast Zone Analysis',
    type: 'Zone Analysis Report',
    created: '2025-06-25',
    status: 'processing',
    fileSize: '—',
    author: 'Sarah Johnson',
    downloads: 0,
    format: 'PDF'
  },
  {
    id: 4,
    name: 'May Shipment Data Export',
    type: 'Custom Data Export',
    created: '2025-06-20',
    status: 'completed',
    fileSize: '12.8 MB',
    author: 'System Generated',
    downloads: 23,
    format: 'CSV'
  },
  {
    id: 5,
    name: 'Holiday Season Prep Report',
    type: 'Monthly Savings Summary',
    created: '2025-06-18',
    status: 'failed',
    fileSize: '—',
    author: 'Mike Wilson',
    downloads: 0,
    format: 'PDF'
  }
];

export function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = recentReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-50 text-red-700 border-red-200"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="generate" className="data-[state=active]:bg-white">Generate Reports</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white">Report History</TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-white">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black">Report Templates</CardTitle>
              <CardDescription className="text-gray-600">
                Choose from our pre-built report templates or create a custom report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <div
                      key={template.id}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${template.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-black mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {template.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedTemplate && (
            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Report Configuration</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure your report parameters and output format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7-days">Last 7 days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 days</SelectItem>
                        <SelectItem value="last-quarter">Last quarter</SelectItem>
                        <SelectItem value="last-year">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Output Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Workbook</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carrier-filter">Carrier Filter</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All carriers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Carriers</SelectItem>
                        <SelectItem value="ups">UPS</SelectItem>
                        <SelectItem value="fedex">FedEx</SelectItem>
                        <SelectItem value="usps">USPS</SelectItem>
                        <SelectItem value="dhl">DHL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input 
                      id="report-name"
                      placeholder="Enter custom report name"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Estimated generation time: 2-3 minutes
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                      Cancel
                    </Button>
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <FilePlus className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-medium text-black">Report History</CardTitle>
                  <CardDescription className="text-gray-600">
                    View and manage your generated reports
                  </CardDescription>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>

              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-medium text-black">{report.name}</h4>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {report.created}
                          </span>
                          <span>•</span>
                          <span>{report.fileSize}</span>
                          <span>•</span>
                          <span>{report.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === 'completed' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                            <Share className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-medium text-black">Scheduled Reports</CardTitle>
                  <CardDescription className="text-gray-600">
                    Automate report generation with scheduled runs
                  </CardDescription>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-black mb-2">No Scheduled Reports</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Set up automated report generation to receive regular insights without manual work.
                </p>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}