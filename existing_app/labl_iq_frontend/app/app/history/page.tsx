

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { History, FileText, Download, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import { useAnalysisStore } from '../../hooks/useAnalysisStore';
import { analysisAPI } from '../../lib/api';

export default function HistoryPage() {
  const router = useRouter();
  const analyses = useAnalysisStore((state) => state.analyses);
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const loadHistory = useAnalysisStore((state) => state.loadHistory);
  const deleteAnalysis = useAnalysisStore((state) => state.deleteAnalysis);

  useEffect(() => {
    loadHistory().catch((error) => {
      console.error('Failed to load analyses history', error);
      toast.error('Unable to load analyses history');
    });
  }, [loadHistory]);

  const handleViewAnalysis = (analysisId: string) => {
    router.push(`/analysis/${analysisId}`);
  };

  const handleDownloadResults = async (analysisId: string) => {
    try {
      const { blob, filename } = await analysisAPI.exportAnalysis(analysisId, 'excel');
      saveAs(blob, filename);
      toast.success('Export ready');
    } catch (error) {
      console.error('Failed to export analysis', error);
      toast.error('Export failed');
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    const confirmed = window.confirm('Delete this analysis and its uploaded file? This cannot be undone.');
    if (!confirmed) return;
    try {
      await deleteAnalysis(analysisId);
      toast.success('Analysis deleted');
    } catch (error) {
      console.error('Failed to delete analysis', error);
      toast.error('Delete failed');
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
          {analyses.map((analysis) => {
            const createdAt = analysis.timestamp ? new Date(analysis.timestamp) : null;
            const shipmentCount = analysis.summary?.total_shipments ?? analysis.summary?.total_packages ?? 0;
            const totalSavings = analysis.summary?.total_savings ?? 0;
            const displayName = analysis.filename || analysis.fileName || analysis.id;
            const status = analysis.status?.toLowerCase() || 'unknown';

            return (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                      <h3 className="font-semibold">{displayName}</h3>
                      <p className="text-sm text-gray-500">
                        {createdAt ? createdAt.toLocaleString() : 'Recently generated'}
                      </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                      {status}
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
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Records Processed:</span>
                    <span className="ml-2 font-medium">{shipmentCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total Savings:</span>
                  <span className="ml-2 font-medium text-green-600">
                      ${Number(totalSavings).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
