'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileText, Download, Eye, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  date: string;
  type: 'analysis' | 'performance' | 'historical';
  status: 'completed' | 'processing' | 'failed';
  savings?: number;
  recordCount?: number;
  downloadUrl?: string;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Mock data
  const reports: Report[] = [
    {
      id: '1',
      name: 'Q4 Shipping Analysis Report',
      date: '2024-01-15',
      type: 'analysis',
      status: 'completed',
      savings: 2450,
      recordCount: 1250,
      downloadUrl: '/api/reports/1/download'
    },
    {
      id: '2',
      name: 'January Performance Report',
      date: '2024-01-10',
      type: 'performance',
      status: 'completed',
      savings: 1890,
      recordCount: 890,
      downloadUrl: '/api/reports/2/download'
    },
    {
      id: '3',
      name: 'Holiday Shipping Analysis',
      date: '2024-01-05',
      type: 'historical',
      status: 'completed',
      savings: 3120,
      recordCount: 2100,
      downloadUrl: '/api/reports/3/download'
    },
    {
      id: '4',
      name: 'December Rate Review',
      date: '2023-12-28',
      type: 'analysis',
      status: 'completed',
      savings: 1560,
      recordCount: 750,
      downloadUrl: '/api/reports/4/download'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return <TrendingUp className="h-4 w-4" />;
      case 'performance':
        return <DollarSign className="h-4 w-4" />;
      case 'historical':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">View and export your analysis reports</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Savings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${reports.reduce((sum, report) => sum + (report.savings || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gray-100">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(report.date).toLocaleDateString()}</span>
                        </span>
                        {report.recordCount && (
                          <span>{report.recordCount.toLocaleString()} records</span>
                        )}
                        {report.savings && (
                          <span className="text-green-600 font-medium">
                            ${report.savings.toLocaleString()} savings
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {report.downloadUrl && (
                      <Button
                        variant="black"
                        size="sm"
                        onClick={() => window.open(report.downloadUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
