// Custom hooks for shipping operations
import { useState, useEffect } from 'react';
import { shippingService, AnalysisResult, DashboardMetrics, RateQuote } from '../services/shipping';

export function useAnalysis(analysisId: string | null) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisId) return;

    setLoading(true);
    setError(null);

    const fetchAnalysis = async () => {
      try {
        const result = await shippingService.getAnalysisResults(analysisId);
        setAnalysis(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();

    // Poll for updates if analysis is still processing
    let interval: NodeJS.Timeout;
    if (analysis?.status === 'processing') {
      interval = setInterval(fetchAnalysis, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [analysisId, analysis?.status]);

  return { analysis, loading, error, refetch: () => {
    if (analysisId) {
      setLoading(true);
      shippingService.getAnalysisResults(analysisId)
        .then(setAnalysis)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }};
}

export function useDashboard(timeframe: '7d' | '30d' | '90d' = '30d') {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await shippingService.getDashboardMetrics(timeframe);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeframe]);

  const refreshMetrics = async () => {
    try {
      setLoading(true);
      const data = await shippingService.getDashboardMetrics(timeframe);
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh metrics');
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, refreshMetrics };
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (
    file: File, 
    options?: { carriersToAnalyze?: string[]; includeInternational?: boolean }
  ): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress (you'd implement real progress tracking with your backend)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await shippingService.uploadShipmentData(file, options);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return result.uploadId;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  };

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadFile,
    resetUpload
  };
}

export function useRateQuotes() {
  const [quotes, setQuotes] = useState<RateQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuotes = async (shipment: {
    origin: string;
    destination: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
    value?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await shippingService.getRateQuotes(shipment);
      setQuotes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quotes');
    } finally {
      setLoading(false);
    }
  };

  return { quotes, loading, error, getQuotes };
}