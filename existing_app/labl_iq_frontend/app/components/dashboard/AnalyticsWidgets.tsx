'use client';

import React from 'react';

type MetricCardProps = {
  label: string;
  value: string | number;
  sub?: string;
};
const MetricCard: React.FC<MetricCardProps> = ({ label, value, sub }) => (
  <div className="rounded-md border p-4 bg-white">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-semibold">{value}</div>
    {sub ? <div className="text-xs text-gray-400 mt-1">{sub}</div> : null}
  </div>
);

type Props = {
  totalSavings: number;
  totalShipments: number;
  avgSavingsPerShipment: number;
};
export default function AnalyticsWidgets({
  totalSavings,
  totalShipments,
  avgSavingsPerShipment,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard label="Total savings" value={`$${totalSavings.toFixed(2)}`} />
      <MetricCard label="Shipments analyzed" value={totalShipments} />
      <MetricCard label="Avg savings / shipment" value={`$${avgSavingsPerShipment.toFixed(2)}`} />
    </div>
  );
}
