
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { History, FileText, Download, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Analysis {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  records: number;
  totalSavings: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for testing
    const mockAnalyses: Analysis[] = [
      {
        id: 'analysis-1',
        name: 'Amazon Shipping Analysis',
        status: 'completed',
        createdAt: new Date('2024-01-15'),
        records: 1250,
        totalSavings: 2340.50
      },
      {
        id: 'analysis-2',
        name: 'Q4 Rate Comparison',
        status: 'completed',
        createdAt: new Date('2024-01-10'),
        records: 890,
        totalSavings: 1567.25
      }
    ];
    
    setTimeout(() => {
      setAnalyses(mockAnalyses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleViewAnalysis = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`);
  };

  const handleDownloadResults = (analysisId: string) => {
    toast.success(`Downloading results for ${analysisId}`);
  };

  const handleDeleteAnalysis = (analysisId: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      setAnalyses(prev => prev.filter(a => a.id !== analysisId));
      toast.success('Analysis deleted successfully');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
        <p className="text-gray-600">
          View and manage your previous shipping rate analyses.
        </p>
      </div>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No analyses yet
            </h3>
            <p className="text-gray-500 mb-6">
              Run your first analysis to see results here.
            </p>
            <Button variant="black" onClick={() => router.push('/dashboard')}>
              Start New Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{analysis.name}</h3>
                      <p className="text-sm text-gray-500">
                        {format(analysis.createdAt, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {analysis.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewAnalysis(analysis.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadResults(analysis.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAnalysis(analysis.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Records Processed:</span>
                    <span className="ml-2 font-medium">{analysis.records}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Savings:</span>
                    <span className="ml-2 font-medium text-green-600">
                      ${analysis.totalSavings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
