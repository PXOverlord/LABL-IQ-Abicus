import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ColumnMapping = {
  weight: string;
  carrier_rate: string;
  zone?: string;
  dest_zip?: string;
  orig_zip?: string;
};

type Settings = {
  weightUnit: 'oz' | 'lb' | 'lbs' | 'g' | 'kg';
  fuelSurchargePct?: number;
  markupPct?: number;
  dimDivisor?: number;
  dasSurcharge?: number;
  edasSurcharge?: number;
  remoteSurcharge?: number;
  discountPercent?: number;
  markupPercentage?: number;
  originZip?: string;
  destinationZip?: string;
  minMargin?: number;
};

type AnalysisState = {
  mapping: ColumnMapping | null;
  settings: Settings;
  setMapping: (m: ColumnMapping) => void;
  setSettings: (s: Partial<Settings>) => void;
  clear: () => void;
};

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      mapping: null,
      settings: { 
        weightUnit: 'oz', 
        fuelSurchargePct: 0, 
        markupPct: 0,
        dimDivisor: 139,
        dasSurcharge: 1.98,
        edasSurcharge: 3.92,
        remoteSurcharge: 14.15,
        discountPercent: 0,
        markupPercentage: 10,
        originZip: '46307',
        destinationZip: '60601',
        minMargin: 0.5
      },
      setMapping: (m) => set({ mapping: m }),
      setSettings: (s) => set({ settings: { ...get().settings, ...s } }),
      clear: () => set({ mapping: null }),
    }),
    { name: 'labl-iq-analysis' }
  )
);
