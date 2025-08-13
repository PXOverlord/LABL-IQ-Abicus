export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeCharts?: boolean;
  includeSummary?: boolean;
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAnalysisResults(analysisData: any, options: ExportOptions) {
  if (!analysisData || !analysisData.results) {
    throw new Error('No analysis data to export');
  }

  const results = analysisData.results;
  const summary = analysisData.summary || {};

  // Process results for export
  const exportData = results.map((result: any, index: number) => ({
    'Package ID': index + 1,
    'Origin ZIP': result.from_zip || 'N/A',
    'Destination ZIP': result.to_zip || 'N/A',
    'Zone': result.zone || 'N/A',
    'Weight (lbs)': result.weight?.toFixed(2) || '0.00',
    'Billable Weight (lbs)': result.billable_weight?.toFixed(2) || '0.00',
    'Current Rate ($)': result.current_rate?.toFixed(2) || '0.00',
    'Amazon Rate ($)': result.amazon_rate?.toFixed(2) || '0.00',
    'Savings ($)': result.savings?.toFixed(2) || '0.00',
    'Savings (%)': result.savings_percent?.toFixed(1) || '0.0',
    'Base Rate ($)': result.base_rate?.toFixed(2) || '0.00',
    'Fuel Surcharge ($)': result.fuel_surcharge?.toFixed(2) || '0.00',
    'Total Surcharges ($)': result.total_surcharges?.toFixed(2) || '0.00',
    'Carrier': result.carrier || 'Unknown',
    'Service Level': 'Standard'
  }));

  // Add summary row
  const summaryRow = {
    'Package ID': 'SUMMARY',
    'Origin ZIP': '',
    'Destination ZIP': '',
    'Zone': '',
    'Weight (lbs)': '',
    'Billable Weight (lbs)': '',
    'Current Rate ($)': summary.totalCurrentCost?.toFixed(2) || '0.00',
    'Amazon Rate ($)': summary.totalAmazonCost?.toFixed(2) || '0.00',
    'Savings ($)': summary.totalSavings?.toFixed(2) || '0.00',
    'Savings (%)': summary.percentSavings?.toFixed(1) || '0.0',
    'Base Rate ($)': '',
    'Fuel Surcharge ($)': '',
    'Total Surcharges ($)': '',
    'Carrier': '',
    'Service Level': ''
  };

  const dataWithSummary = [...exportData, summaryRow];

  switch (options.format) {
    case 'csv':
      exportToCSV(dataWithSummary, `analysis_results_${new Date().toISOString().split('T')[0]}`);
      break;
    case 'excel':
      // TODO: Implement Excel export
      throw new Error('Excel export not yet implemented');
    case 'pdf':
      // TODO: Implement PDF export
      throw new Error('PDF export not yet implemented');
    default:
      throw new Error('Unsupported export format');
  }
} 