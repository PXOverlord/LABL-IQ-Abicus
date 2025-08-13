
// Update the existing types file with additional interfaces

export interface AnalysisResults {
  summary: {
    totalShipments: number;
    totalSavings: number;
    averageSavingsPercentage: number;
    currentTotalCost: number;
    optimizedTotalCost: number;
  };
  carrierComparison: {
    name: string;
    current: number;
    optimized: number;
  }[];
  serviceDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  shipments: {
    package_id: string;
    origin_zip: string;
    destination_zip: string;
    weight: number;
    current_carrier: string;
    current_cost: number;
    recommended_carrier: string;
    recommended_cost: number;
    savings: number;
  }[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface CarrierComparison {
  name: string;
  current: number;
  optimized: number;
}
