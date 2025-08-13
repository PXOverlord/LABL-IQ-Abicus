'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/hooks/useAnalysisStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronUp, 
  ChevronDown,
  TrendingUp,
  DollarSign,
  Package,
  MapPin,
  Upload,
  BarChart3,
  ArrowRight
} from 'lucide-react';

type Row = {
  rowIndex: number;
  weight_lbs?: number;
  weight?: number;
  carrier_rate: number;
  zone: number | null;
  base_rate: number;
  fuel_surcharge: number;
  das_surcharge: number;
  edas_surcharge: number;
  remote_surcharge: number;
  other_surcharge?: number;
  surcharge_total?: number;
  total_surcharges?: number;
  final_rate: number;
  savings: number;
  savings_percent: number;
  dest_zip?: string;
  orig_zip?: string;
  // optional nested shape fallback
  surcharges?: {
    fuel?: number;
    das?: number;
    edas?: number;
    remote?: number;
    other?: number;
  };
};

type AnySummary = Record<string, any>;

function normalizeSummary(s?: AnySummary) {
  if (!s) return { count: 0, avg_final: 0, min_final: 0, max_final: 0 };
  return {
    count: s.count ?? s.total_shipments ?? 0,
    avg_final: s.avg_final ?? s.avg_final_rate ?? 0,
    min_final: s.min_final ?? s.min_final_rate ?? null,
    max_final: s.max_final ?? s.max_final_rate ?? null,
    total_base_rate: s.total_base_rate ?? 0,
    total_surcharges: s.total_surcharges ?? 0,
    total_final_rate: s.total_final_rate ?? 0,
    total_savings: s.total_savings ?? 0,
    avg_savings_percent: s.avg_savings_percent ?? 0,
  };
}

// helper so UI works with old/new API shapes
const getS = (r: Row, key: 'fuel'|'das'|'edas'|'remote'|'other') =>
  (key === 'fuel'   ? r.fuel_surcharge   : undefined) ??
  (key === 'das'    ? r.das_surcharge    : undefined) ??
  (key === 'edas'   ? r.edas_surcharge   : undefined) ??
  (key === 'remote' ? r.remote_surcharge : undefined) ??
  (key === 'other'  ? r.other_surcharge  : undefined) ??
  r.surcharges?.[key] ?? 0;

type SortConfig = {
  key: keyof Row;
  direction: 'asc' | 'desc';
};

export default function AnalysisPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const fileId = sp.get('fileId');
  const { mapping, settings } = useAnalysisStore();
  
  const [data, setData] = useState<{ results: Row[]; summary: any } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rowIndex', direction: 'asc' });
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  useEffect(() => {
    if (!fileId) { 
      setErr('No analysis selected'); 
      return; 
    }
    if (!mapping) { 
      setErr('Missing mapping. Go back to Upload.'); 
      return; 
    }
    
    setLoading(true);
    fetch('/api/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, mapping, settings }),
    })
      .then(r => r.json())
      .then(j => j.error ? setErr(j.error) : setData(j))
      .catch(() => setErr('Request failed'))
      .finally(() => setLoading(false));
  }, [fileId, mapping, settings]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    if (!data?.results) return [];
    
    let filtered = data.results;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row => 
        row.rowIndex.toString().includes(searchTerm) ||
        (row.weight_lbs || row.weight || 0).toString().includes(searchTerm) ||
        row.carrier_rate.toString().includes(searchTerm) ||
        row.final_rate.toString().includes(searchTerm) ||
        (row.zone?.toString() || '').includes(searchTerm)
      );
    }
    
    // Apply zone filter
    if (zoneFilter !== 'all') {
      const zoneNum = parseInt(zoneFilter);
      filtered = filtered.filter(row => row.zone === zoneNum);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === null || bVal === null) return 0;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });
    
    return filtered;
  }, [data?.results, searchTerm, zoneFilter, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: keyof Row) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportToCSV = () => {
    if (!filteredData.length) return;
    
    const headers = ['Row', 'Weight (lbs)', 'Zone', 'Carrier Rate', 'Base Rate', 'Savings ($)', 'Savings (%)', 'Fuel Surcharge', 'DAS Surcharge', 'EDAS Surcharge', 'Remote Surcharge', 'Final Rate'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.rowIndex,
        (row.weight_lbs || row.weight || 0).toFixed(2),
        row.zone || '',
        row.carrier_rate.toFixed(2),
        row.base_rate.toFixed(2),
        row.savings.toFixed(2),
        row.savings_percent.toFixed(1),
        row.fuel_surcharge.toFixed(2),
        (row.das_surcharge || 0).toFixed(2),
        (row.edas_surcharge || 0).toFixed(2),
        (row.remote_surcharge || 0).toFixed(2),
        row.final_rate.toFixed(2)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipping_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleNewAnalysis = () => {
    router.push('/upload');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  // Show welcome/selection screen when no fileId
  if (!fileId) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Rate Analysis</h1>
          <p className="text-lg text-gray-600">Select an analysis to view or start a new one</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNewAnalysis}>
            <CardContent className="p-8 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Start New Analysis</h3>
              <p className="text-gray-600 mb-6">Upload new shipping data and run analysis</p>
              <Button className="bg-black text-white hover:bg-gray-800">
                Upload Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleBackToDashboard}>
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">View Recent Analyses</h3>
              <p className="text-gray-600 mb-6">Browse your dashboard for recent analyses</p>
              <Button variant="outline">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Or use the sidebar navigation to access specific features</p>
        </div>
      </div>
    );
  }

                  if (loading) return (
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center">
                      <div className="mx-auto mb-6">
                        <div className="bg-[#222530] w-24 h-24 rounded-full flex items-center justify-center shadow-xl relative overflow-hidden">
                          {/* LABL Logo */}
                          <svg className="w-12 h-12 relative z-10" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                            <g>
                              <path d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z" fill="white"></path>
                              <path d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z" fill="white"></path>
                            </g>
                          </svg>
                          
                          {/* Gentle pulsing ring */}
                          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-pulse"></div>
                          
                          {/* Rotating gradient ring */}
                          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
                        </div>
                      </div>
                      
                      <p className="text-2xl font-semibold text-gray-800">Crunching numbers with LABL IQ...</p>
                      <p className="text-gray-600 mt-3">Processing your shipping data</p>
                      
                      {/* Gentle wave animation */}
                      <div className="mt-6 flex justify-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-6 w-64 mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                );
  
  if (err) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error: {err}</p>
        <div className="mt-4 flex space-x-3">
          <Button onClick={handleNewAnalysis} variant="outline">
            Start New Analysis
          </Button>
          <Button onClick={handleBackToDashboard} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
  
  if (!data) return null;

  const { results, summary } = data;
  
  // Normalize summary to handle any key format from backend
  const safeSummary = normalizeSummary(summary);
  
  // Optional safety net: if min_final or max_final are still null, compute from results
  if ((safeSummary.min_final == null || safeSummary.max_final == null) && results?.length) {
    const finals = results.map((r: any) => r.final_rate).filter((n: any) => typeof n === 'number' && !Number.isNaN(n));
    if (finals.length) {
      safeSummary.min_final = Math.min(...finals);
      safeSummary.max_final = Math.max(...finals);
    } else {
      safeSummary.min_final = safeSummary.min_final ?? 0;
      safeSummary.max_final = safeSummary.max_final ?? 0;
    }
  }
  
  // Debug logging to confirm normalization worked
  console.log('summary(normalized):', safeSummary);
  
  const uniqueZones = [...new Set(results.map(r => r.zone).filter(Boolean))].sort((a, b) => (a || 0) - (b || 0));

  return (
    <div className="p-6 space-y-6">
      {/* Header and Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Analysis Results</h1>
          <p className="text-gray-600 mt-1">
            {safeSummary.count.toLocaleString()} shipments analyzed • 
            Avg: ${safeSummary.avg_final.toFixed(2)} • 
            Min: ${safeSummary.min_final.toFixed(2)} • 
            Max: ${safeSummary.max_final.toFixed(2)}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleNewAnalysis} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button onClick={exportToCSV} className="bg-black text-white hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold">{safeSummary.count.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Average Rate</p>
                <p className="text-2xl font-bold">${safeSummary.avg_final.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${(safeSummary.avg_final * safeSummary.count).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${data.results.reduce((sum, r) => sum + r.savings, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Zones Covered</p>
                <p className="text-2xl font-bold">{uniqueZones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zone Filter</label>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Zones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  {uniqueZones.map(zone => (
                    <SelectItem key={zone} value={zone?.toString() || ''}>
                      Zone {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                  <SelectItem value="200">200 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} shipments
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50" 
                      onClick={() => handleSort('rowIndex')}>
                    <div className="flex items-center space-x-1">
                      <span>#</span>
                      {sortConfig.key === 'rowIndex' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('weight_lbs')}>
                    <div className="flex items-center space-x-1">
                      <span>Weight (lbs)</span>
                      {sortConfig.key === 'weight_lbs' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('zone')}>
                    <div className="flex items-center space-x-1">
                      <span>Zone</span>
                      {sortConfig.key === 'zone' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('carrier_rate')}>
                    <div className="flex items-center space-x-1">
                      <span>Carrier Rate</span>
                      {sortConfig.key === 'carrier_rate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('base_rate')}>
                    <div className="flex items-center space-x-1">
                      <span>Base Rate</span>
                      {sortConfig.key === 'base_rate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('savings')}>
                    <div className="flex items-center space-x-1">
                      <span>Savings</span>
                      {sortConfig.key === 'savings' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleSort('fuel_surcharge')}>
                                <div className="flex items-center space-x-1">
                                  <span>Fuel Surcharge</span>
                                  {sortConfig.key === 'fuel_surcharge' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                  )}
                                </div>
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleSort('das_surcharge')}>
                                <div className="flex items-center space-x-1">
                                  <span>DAS Surcharge</span>
                                  {sortConfig.key === 'das_surcharge' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                  )}
                                </div>
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleSort('edas_surcharge')}>
                                <div className="flex items-center space-x-1">
                                  <span>EDAS Surcharge</span>
                                  {sortConfig.key === 'edas_surcharge' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                  )}
                                </div>
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleSort('remote_surcharge')}>
                                <div className="flex items-center space-x-1">
                                  <span>Remote Surcharge</span>
                                  {sortConfig.key === 'remote_surcharge' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                  )}
                                </div>
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-900">
                                <div className="flex items-center space-x-1">
                                  <span>Surcharges Total</span>
                                </div>
                              </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('final_rate')}>
                    <div className="flex items-center space-x-1">
                      <span>Final Rate</span>
                      {sortConfig.key === 'final_rate' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{row.rowIndex}</td>
                    <td className="py-3 px-4">{(row.weight || row.weight_lbs || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {row.zone ? (
                        <Badge variant="secondary">Zone {row.zone}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">${(row.carrier_rate || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">${(row.base_rate || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className={`font-medium ${(row.savings || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(row.savings || 0).toFixed(2)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({(row.savings_percent || 0) >= 0 ? '+' : ''}{(row.savings_percent || 0).toFixed(1)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">${(row.fuel_surcharge || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">${(row.das_surcharge || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">${(row.edas_surcharge || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">${(row.remote_surcharge || 0).toFixed(2)}</td>
                    <td className="py-3 px-4 font-medium text-blue-600">
                      ${(row.total_surcharges || (row.fuel_surcharge || 0) + (row.das_surcharge || 0) + (row.edas_surcharge || 0) + (row.remote_surcharge || 0)).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">${(row.final_rate || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="h-8 px-3">
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-3">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
