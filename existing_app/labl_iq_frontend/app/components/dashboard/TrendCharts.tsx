'use client';

import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement, PointElement, LinearScale, CategoryScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement, Tooltip, Legend);

type TrendPoint = { date: string; savings: number; shipments: number };
type ZonePoint = { zone: number; count: number };
type WeightPoint = { bucket: string; count: number };

export default function TrendCharts({
  trend,
  zones,
  weights,
}: {
  trend: TrendPoint[];
  zones: ZonePoint[];
  weights: WeightPoint[];
}) {
  const lineData = useMemo(() => ({
    labels: trend.map(t => t.date),
    datasets: [
      { label: 'Savings', data: trend.map(t => t.savings) },
      { label: 'Shipments', data: trend.map(t => t.shipments) },
    ],
  }), [trend]);

  const zoneData = useMemo(() => ({
    labels: zones.map(z => `Z${z.zone}`),
    datasets: [{ label: 'Count', data: zones.map(z => z.count) }],
  }), [zones]);

  const weightData = useMemo(() => ({
    labels: weights.map(w => w.bucket),
    datasets: [{ label: 'Count', data: weights.map(w => w.count) }],
  }), [weights]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="rounded-md border p-4 bg-white">
        <div className="text-sm text-gray-500 mb-2">Trend</div>
        <Line data={lineData} />
      </div>
      <div className="rounded-md border p-4 bg-white">
        <div className="text-sm text-gray-500 mb-2">Zones</div>
        <Bar data={zoneData} />
      </div>
      <div className="rounded-md border p-4 bg-white">
        <div className="text-sm text-gray-500 mb-2">Weights</div>
        <Bar data={weightData} />
      </div>
    </div>
  );
}
