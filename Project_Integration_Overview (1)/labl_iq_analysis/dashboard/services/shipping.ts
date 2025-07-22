// Shipping analysis service
interface ShipmentData {
  id: string;
  origin: {
    zipCode: string;
    city: string;
    state: string;
  };
  destination: {
    zipCode: string;
    city: string;
    state: string;
  };
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  service: string;
  carrier: string;
  actualCost: number;
  shipDate: string;
}

interface AnalysisResult {
  id: string;
  uploadId: string;
  totalShipments: number;
  totalCost: number;
  potentialSavings: number;
  avgSavingsPerShipment: number;
  topSavingsOpportunities: {
    carrier: string;
    service: string;
    currentCost: number;
    recommendedCost: number;
    savings: number;
  }[];
  carrierBreakdown: {
    carrier: string;
    shipments: number;
    cost: number;
    savings: number;
  }[];
  zoneAnalysis: {
    zone: string;
    shipments: number;
    avgCost: number;
    savings: number;
  }[];
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
}

interface DashboardMetrics {
  totalShipments: number;
  totalSavings: number;
  avgSavingsPerShipment: number;
  topCarrier: string;
  recentAnalyses: AnalysisResult[];
  monthlyTrends: {
    month: string;
    shipments: number;
    cost: number;
    savings: number;
  }[];
}

interface RateQuote {
  carrier: string;
  service: string;
  cost: number;
  deliveryDays: number;
  deliveryDate: string;
}

class ShippingService {
  async uploadShipmentData(file: File, options?: { 
    carriersToAnalyze?: string[];
    includeInternational?: boolean;
  }): Promise<{ uploadId: string; message: string }> {
    const response = await apiClient.uploadFile<{ uploadId: string; message: string }>(
      '/shipping/upload',
      file,
      options ? {
        carriersToAnalyze: JSON.stringify(options.carriersToAnalyze || []),
        includeInternational: String(options.includeInternational || false)
      } : undefined
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || 'Upload failed');
  }

  async getAnalysisStatus(uploadId: string): Promise<AnalysisResult> {
    const response = await apiClient.get<AnalysisResult>(`/shipping/analysis/${uploadId}`);
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get analysis status');
  }

  async getAnalysisResults(analysisId: string): Promise<AnalysisResult> {
    const response = await apiClient.get<AnalysisResult>(`/shipping/results/${analysisId}`);
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get analysis results');
  }

  async getDashboardMetrics(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>(`/shipping/dashboard?timeframe=${timeframe}`);
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get dashboard metrics');
  }

  async getRateQuotes(shipment: {
    origin: string;
    destination: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
    value?: number;
  }): Promise<RateQuote[]> {
    const response = await apiClient.post<RateQuote[]>('/shipping/quotes', shipment);
    
    if (response.success) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get rate quotes');
  }

  async exportAnalysis(analysisId: string, format: 'csv' | 'xlsx' | 'pdf' = 'xlsx'): Promise<Blob> {
    const url = `${apiClient['baseURL']}/shipping/export/${analysisId}?format=${format}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  async deleteAnalysis(analysisId: string): Promise<void> {
    const response = await apiClient.delete(`/shipping/analysis/${analysisId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete analysis');
    }
  }
}

export const shippingService = new ShippingService();
export type { 
  ShipmentData, 
  AnalysisResult, 
  DashboardMetrics, 
  RateQuote 
};