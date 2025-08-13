
import { create } from 'zustand';
import { analysisAPI, Analysis, ColumnMapping } from '../api';
import { useAuthStore } from './auth-store';

interface AnalysisState {
  currentAnalysis: Analysis | null;
  analyses: Analysis[];
  isLoading: boolean;
  uploadProgress: number;
  startAnalysis: (file: File, columnMapping?: ColumnMapping) => Promise<string>;
  mapColumns: (analysisId: string, mapping: ColumnMapping) => Promise<void>;
  processAnalysis: (analysisId: string, settings: any) => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchAnalysis: (analysisId: string) => Promise<void>;
  pollStatus: (analysisId: string) => void;
  stopPolling: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set: any, get: any) => {
  let pollInterval: NodeJS.Timeout | null = null;

  return {
    currentAnalysis: null,
    analyses: [],
    isLoading: false,
    uploadProgress: 0,

    startAnalysis: async (file: File, columnMapping?: ColumnMapping) => {
      set({ isLoading: true, uploadProgress: 0 });
      try {
        // Get user settings for origin ZIP
        const user = useAuthStore.getState().user;
        const originZip = user?.originZip;
        
        // Always send the file to the backend for processing
        const result = await analysisAPI.testProcess(
          file,
          {
            amazonRate: 15.0,
            fuelSurcharge: 16.0,
            markupPercent: 10.0,
            serviceLevel: 'standard',
            originZip: originZip
          },
          columnMapping
        );
        set({ uploadProgress: 100 });
        // Generate a new analysis ID every time
        const mockAnalysisId = `analysis-${Date.now()}-${Math.floor(Math.random()*10000)}`;
        
        // Map backend response to frontend expected format
        const mappedResults = {
          ...result,
          summary: {
            totalSavings: result.summary?.total_savings || 0,
            totalShipments: result.summary?.total_packages || 0,
            averageSavings: result.summary?.average_savings_per_package || 0,
            totalCurrentCost: result.summary?.total_current_cost || 0,
            totalAmazonCost: result.summary?.total_amazon_cost || 0,
            percentSavings: result.summary?.percent_savings || 0
          }
        };
        
        console.log('Backend response:', result);
        console.log('Mapped results:', mappedResults);
        
        set({ 
          currentAnalysis: {
            id: mockAnalysisId,
            filename: result.fileName,
            status: 'COMPLETED',
            results: mappedResults,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });
        
        // Add to history
        set((state: any) => ({
          analyses: [
            {
              id: mockAnalysisId,
              filename: result.fileName,
              status: 'COMPLETED',
              results: mappedResults,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.analyses.filter((a: any) => a.id !== mockAnalysisId)
          ]
        }));
        
        return mockAnalysisId;
      } catch (error) {
        set({ isLoading: false, uploadProgress: 0 });
        throw error;
      }
    },

    mapColumns: async (analysisId: string, mapping: ColumnMapping) => {
      set({ isLoading: true });
      try {
        // For testing, just store the mapping locally
        console.log('Mapping columns:', mapping);
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    processAnalysis: async (analysisId: string, settings: any) => {
      set({ isLoading: true });
      try {
        // Always update the current analysis with new settings
        set((state: any) => ({
          currentAnalysis: state.currentAnalysis ? {
            ...state.currentAnalysis,
            results: {
              ...state.currentAnalysis.results,
              settings: settings
            }
          } : null,
          isLoading: false
        }));
        // Add to history if not already there
        set((state: any) => ({
          analyses: [
            state.currentAnalysis,
            ...state.analyses.filter((a: any) => a.id !== state.currentAnalysis?.id)
          ]
        }));
      } catch (error) {
        console.error('Analysis processing error:', error);
        set({ isLoading: false });
        throw error;
      }
    },

    fetchHistory: async () => {
      set({ isLoading: true });
      try {
        const analyses = await analysisAPI.getHistory();
        set({ analyses, isLoading: false });
      } catch (error: any) {
        set({ isLoading: false });
        // If backend unavailable, use mock data for testing
        console.log('Using mock history data for testing');
        const mockAnalyses = [
          {
            id: 'analysis-1',
            filename: 'SolBrush Amazon - Shipstation.csv',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            results: {
              summary: {
                totalSavings: 15420.50,
                totalShipments: 3247,
                averageSavings: 12.45
              }
            }
          },
          {
            id: 'analysis-2', 
            filename: 'Test_Upload.csv',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 172800000).toISOString(),
            results: {
              summary: {
                totalSavings: 8920.30,
                totalShipments: 1892,
                averageSavings: 9.87
              }
            }
          }
        ];
        set({ analyses: mockAnalyses });
      }
    },

    fetchAnalysis: async (analysisId: string) => {
      set({ isLoading: true });
      try {
        const results = await analysisAPI.getResults(analysisId);
        set({ 
          currentAnalysis: results, 
          isLoading: false 
        });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    pollStatus: (analysisId: string) => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }

      pollInterval = setInterval(async () => {
        try {
          const status = await analysisAPI.getStatus(analysisId);
          
          if (status.status === 'COMPLETED' || status.status === 'FAILED') {
            get().stopPolling();
            get().fetchAnalysis(analysisId);
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 2000); // Poll every 2 seconds
    },

    stopPolling: () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    },
  };
});
