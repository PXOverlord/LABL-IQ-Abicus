
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { FileText, Download, ArrowLeft, TrendingUp, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for testing
    const mockAnalysis = {
      id: params.id,
      name: 'Amazon Shipping Analysis',
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      records: 1250,
      totalSavings: 2340.50,
      results: [
        { zone: 'Zone 2', count: 150, savings: 450.25 },
        { zone: 'Zone 3', count: 200, savings: 680.75 },
        { zone: 'Zone 4', count: 300, savings: 890.50 },
        { zone: 'Zone 5', count: 400, savings: 1200.00 },
        { zone: 'Zone 6', count: 200, savings: 750.00 }
      ]
    };
    
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const handleDownload = (format: string) => {
    toast.success(`Downloading ${format.toUpperCase()} report...`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Analysis not found
          </h3>
          <p className="text-gray-500 mb-6">
            The requested analysis could not be found.
          </p>
          <Button variant="black" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/history')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{analysis.name}</h1>
            <p className="text-gray-600">
              Analysis completed on {analysis.createdAt.toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="black" onClick={() => handleDownload('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="black" onClick={() => handleDownload('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {analysis.records.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Records Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${analysis.totalSavings.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${(analysis.totalSavings / analysis.records).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Avg. Savings/Record</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results by Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.results.map((result: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{result.zone}</Badge>
                  <span className="text-sm text-gray-600">
                    {result.count} records
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ${result.savings.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((result.savings / analysis.totalSavings) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
