
import { create } from 'zustand';
import { analysisAPI, Analysis, ColumnMapping } from '../api';

interface AnalysisState {
  currentAnalysis: Analysis | null;
  analyses: Analysis[];
  isLoading: boolean;
  uploadProgress: number;
  startAnalysis: (file: File) => Promise<string>;
  mapColumns: (analysisId: string, mapping: ColumnMapping) => Promise<void>;
  processAnalysis: (analysisId: string, settings: any) => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchAnalysis: (analysisId: string) => Promise<void>;
  pollStatus: (analysisId: string) => void;
  stopPolling: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => {
  let pollInterval: NodeJS.Timeout | null = null;

  return {
    currentAnalysis: null,
    analyses: [],
    isLoading: false,
    uploadProgress: 0,

    startAnalysis: async (file: File) => {
      set({ isLoading: true, uploadProgress: 0 });
      try {
        const result = await analysisAPI.upload(file, (progress) => {
          set({ uploadProgress: progress });
        });
        set({ isLoading: false, uploadProgress: 100 });
        return result.analysis_id;
      } catch (error) {
        set({ isLoading: false, uploadProgress: 0 });
        throw error;
      }
    },

    mapColumns: async (analysisId: string, mapping: ColumnMapping) => {
      set({ isLoading: true });
      try {
        await analysisAPI.mapColumns(analysisId, mapping);
        set({ isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    processAnalysis: async (analysisId: string, settings: any) => {
      set({ isLoading: true });
      try {
        await analysisAPI.process(analysisId, settings);
        // Start polling for status
        get().pollStatus(analysisId);
        set({ isLoading: false });
      } catch (error) {
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
        // If backend unavailable, use empty array instead of throwing
        if (error.message === 'BACKEND_UNAVAILABLE') {
          set({ analyses: [] });
          return;
        }
        throw error;
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
