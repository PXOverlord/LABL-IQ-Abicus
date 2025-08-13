
'use client';

import { useState, useEffect } from 'react';

interface Metrics {
  totalShipments: number;
  totalSavings: number;
  avgSavingsPerShipment: number;
  topCarrier: string;
  recentAnalyses: Analysis[];
  monthlyTrends: MonthlyTrend[];
}

interface Analysis {
  id: string;
  uploadId: string;
  totalShipments: number;
  totalCost: number;
  potentialSavings: number;
  avgSavingsPerShipment: number;
  topSavingsOpportunities: any[];
  carrierBreakdown: any[];
  zoneAnalysis: any[];
  createdAt: string;
  status: 'completed' | 'processing' | 'error';
}

interface MonthlyTrend {
  month: string;
  shipments: number;
  cost: number;
  savings: number;
}

const mockMetrics: Metrics = {
  totalShipments: 12540,
  totalSavings: 47250,
  avgSavingsPerShipment: 3.77,
  topCarrier: "UPS",
  recentAnalyses: [
    {
      id: "1",
      uploadId: "upload-1",
      totalShipments: 2450,
      totalCost: 18500,
      potentialSavings: 3200,
      avgSavingsPerShipment: 1.31,
      topSavingsOpportunities: [],
      carrierBreakdown: [],
      zoneAnalysis: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed" as const
    },
    {
      id: "2",
      uploadId: "upload-2", 
      totalShipments: 1850,
      totalCost: 14200,
      potentialSavings: 2850,
      avgSavingsPerShipment: 1.54,
      topSavingsOpportunities: [],
      carrierBreakdown: [],
      zoneAnalysis: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed" as const
    },
    {
      id: "3",
      uploadId: "upload-3",
      totalShipments: 3200,
      totalCost: 24800,
      potentialSavings: 4100,
      avgSavingsPerShipment: 1.28,
      topSavingsOpportunities: [],
      carrierBreakdown: [],
      zoneAnalysis: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed" as const
    }
  ],
  monthlyTrends: [
    { month: "Jan 2025", shipments: 4200, cost: 32500, savings: 15750 },
    { month: "Dec 2024", shipments: 3800, cost: 29200, savings: 14200 },
    { month: "Nov 2024", shipments: 4540, cost: 35800, savings: 17300 }
  ]
};

export function useDashboard(timeframe: '7d' | '30d' | '90d' = '30d') {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for now
      setMetrics(mockMetrics);
    } catch (err) {
      setError('Failed to load dashboard metrics');
      console.error('Dashboard metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMetrics();
  }, [timeframe]);

  return {
    metrics,
    loading,
    error,
    refreshMetrics
  };
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setProgress(100);

      // Return mock upload ID
      return `upload-${Date.now()}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    progress
  };
}
