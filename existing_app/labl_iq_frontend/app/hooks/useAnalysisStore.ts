'use client';

import { create } from 'zustand';
import { analysisAPI, type Analysis as FastApiAnalysis } from '../lib/api';

export type Settings = {
  markup_percent?: number | null;
  fuel_surcharge_percent?: number | null;
  das_surcharge?: number | null;
  edas_surcharge?: number | null;
  remote_surcharge?: number | null;
  dim_divisor?: number | null;
  origin_zip?: string | null;
  weightUnit?: string;
  markupPct?: number;
  fuelSurchargePct?: number;
  dimDivisor?: number;
  minMargin?: number;
  merchant?: string;
  serviceLevel?: string | null;
  [k: string]: any;
};

export type AnalysisResult = {
  id: string;
  timestamp: string;
  filename?: string | null;
  merchant?: string | null;
  title?: string | null;
  tags?: string[] | null;
  notes?: string | null;
  status?: string;
  results: any[];
  summary: any;
  settings: Settings;
  totalResults?: number;
  previewCount?: number;
  visualizations?: Record<string, any> | null;
};

type State = {
  analyses: any[];
  current: AnalysisResult | null;
  isLoading: boolean;
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
  loadHistory: (filters?: { merchant?: string; q?: string; limit?: number; offset?: number }) => Promise<void>;
  loadAnalysis: (id: string) => Promise<void>;
  updateAnalysisMeta: (id: string, payload: Partial<Pick<AnalysisResult, 'merchant' | 'title' | 'tags' | 'notes'>>) => Promise<AnalysisResult>;
  deleteAnalysis: (id: string) => Promise<void>;
  loadMerchants: () => Promise<{ merchant: string; count: number }[]>;
};

export const useAnalysisStore = create<State>((set, get) => ({
  analyses: [],
  current: null,
  isLoading: false,
  settings: {
    weightUnit: 'oz',
    markupPct: 0.1,
    fuelSurchargePct: 0.16,
    dimDivisor: 139,
    minMargin: 0.5,
    merchant: '',
    origin_zip: '',
    das_surcharge: 1.98,
    edas_surcharge: 3.92,
    remote_surcharge: 14.15,
  },
  setSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  loadHistory: async (filters) => {
    set({ isLoading: true });
    try {
      const raw = await analysisAPI.getHistory({
        offset: filters?.offset,
        limit: filters?.limit,
      });

      const hasMerchantData = raw.some((item: FastApiAnalysis & { merchant?: string | null }) => !!item.merchant);

      const mapped = raw.map(mapFastApiAnalysisResult);

      const filtered = mapped.filter((record) => {
        const matchesMerchant = !filters?.merchant || !hasMerchantData || (record.merchant && record.merchant.toLowerCase() === filters.merchant!.toLowerCase());
        const matchesQuery = !filters?.q || filterByQuery(record, filters.q);
        return matchesMerchant && matchesQuery;
      });

      set({ analyses: filtered, isLoading: false });
    } catch (error) {
      console.error('Failed to load analyses from FastAPI:', error);
      set({ isLoading: false });
    }
  },

  loadAnalysis: async (id) => {
    set({ isLoading: true, current: null });
    try {
      const raw = await analysisAPI.getResults(id);
      const mapped = mapFastApiAnalysisResult(raw);
      set({ current: mapped, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateAnalysisMeta: async (id, payload) => {
    const normalizedPayload = {
      merchant: payload.merchant ?? undefined,
      title: payload.title ?? undefined,
      tags: payload.tags ?? undefined,
      notes: payload.notes ?? undefined,
    };
    const updated = await analysisAPI.updateMetadata(id, normalizedPayload);
    const mapped = mapFastApiAnalysisResult(updated);
    set({ current: mapped });
    get().loadHistory().catch(() => {});
    return mapped;
  },

  deleteAnalysis: async (id) => {
    await analysisAPI.deleteAnalysis(id);
    set((state) => ({
      analyses: state.analyses.filter((item: AnalysisResult) => item.id !== id),
      current: state.current?.id === id ? null : state.current,
    }));
  },

  loadMerchants: async () => {
    const counts = new Map<string, number>();
    const { analyses } = get();
    analyses.forEach((analysis: AnalysisResult) => {
      if (!analysis.merchant) return;
      counts.set(analysis.merchant, (counts.get(analysis.merchant) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([merchant, count]) => ({ merchant, count }));
  },
}));

function mapFastApiAnalysisResult(item: FastApiAnalysis & { merchant?: string | null; title?: string | null; tags?: string[] | null; notes?: string | null }): AnalysisResult {
  const summary = {
    total_savings: item.totalSavings ?? 0,
    total_packages: item.totalPackages ?? 0,
    total_shipments: item.totalPackages ?? 0,
    total_current_cost: item.totalCurrentCost ?? 0,
    total_amazon_cost: item.totalAmazonCost ?? 0,
    percent_savings: item.percentSavings ?? 0,
    total_final_rate: item.totalAmazonCost ?? 0,
    avg_final_rate:
      item.totalAmazonCost && item.totalPackages
        ? Number(item.totalAmazonCost) / Math.max(1, Number(item.totalPackages))
        : 0,
  };

  const settings: Settings = {
    markup_percent: item.markupPercent ?? null,
    fuel_surcharge_percent: item.fuelSurcharge ?? null,
    serviceLevel: item.serviceLevel,
    ...(item.settings ?? {}),
  } as Settings;

  return {
    id: item.id,
    timestamp: item.createdAt || new Date().toISOString(),
    filename: item.fileName ?? item.filename ?? null,
    merchant: item.merchant ?? null,
    title: item.title ?? null,
    tags: item.tags ?? null,
    notes: item.notes ?? null,
    status: item.status,
    results: item.results ?? [],
    summary,
    settings,
    totalResults:
      (item as any).totalResults ??
      item.totalPackages ??
      (Array.isArray(item.results) ? item.results.length : 0),
    previewCount:
      (item as any).previewCount ??
      (Array.isArray(item.results) ? item.results.length : 0),
    visualizations: item.visualizations ?? null,
  };
}

function filterByQuery(record: AnalysisResult, query: string): boolean {
  const q = query.toLowerCase();
  const haystacks = [
    record.id,
    record.filename || '',
    record.title || '',
    record.merchant || '',
    record.notes || '',
    record.status || '',
  ];

  if (haystacks.some((value) => value.toLowerCase().includes(q))) {
    return true;
  }

  const summaryValues = Object.values(record.summary || {});
  return summaryValues.some((value) => String(value).toLowerCase().includes(q));
}
