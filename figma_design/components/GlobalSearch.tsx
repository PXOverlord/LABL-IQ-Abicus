import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Command, 
  ArrowRight, 
  Clock, 
  FileText, 
  BarChart3, 
  Package, 
  Truck, 
  Settings, 
  Users, 
  Globe,
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  X
} from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, params?: any) => void;
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'shipping costs last month',
    'UPS vs FedEx comparison',
    'zone optimization report'
  ]);

  // Search data structure
  const searchData = {
    pages: [
      { id: 'dashboard', title: 'Dashboard', description: 'Main overview and metrics', icon: BarChart3, tab: 'dashboard' },
      { id: 'upload', title: 'Upload Data', description: 'Upload shipping data files', icon: Package, tab: 'upload' },
      { id: 'analysis', title: 'Analysis Results', description: 'View analysis and recommendations', icon: TrendingUp, tab: 'analysis' },
      { id: 'reports', title: 'Reports', description: 'Generate and view reports', icon: FileText, tab: 'reports' },
      { id: 'integrations', title: 'Integrations', description: 'Connect with carriers and platforms', icon: Globe, tab: 'integrations' },
      { id: 'settings', title: 'Settings', description: 'Account and platform settings', icon: Settings, tab: 'account' }
    ],
    features: [
      { id: 'rate-calculator', title: 'Rate Calculator', description: 'Calculate shipping rates', icon: Calculator, action: 'openRateCalculator' },
      { id: 'cost-optimizer', title: 'Cost Optimizer', description: 'Find cost savings opportunities', icon: Zap, action: 'runOptimization' },
      { id: 'carrier-comparison', title: 'Carrier Comparison', description: 'Compare carrier rates and performance', icon: Truck, action: 'compareCarriers' },
      { id: 'alert-setup', title: 'Set Up Alerts', description: 'Configure shipping alerts', icon: AlertTriangle, action: 'setupAlerts' },
      { id: 'export-data', title: 'Export Data', description: 'Export analysis results', icon: FileText, action: 'exportData' }
    ],
    quickActions: [
      { id: 'new-analysis', title: 'Start New Analysis', description: 'Begin a new shipping analysis', icon: BarChart3, action: 'newAnalysis' },
      { id: 'upload-file', title: 'Upload File', description: 'Upload shipping data', icon: Package, action: 'uploadFile' },
      { id: 'generate-report', title: 'Generate Report', description: 'Create a new report', icon: FileText, action: 'generateReport' },
      { id: 'add-integration', title: 'Add Integration', description: 'Connect a new service', icon: Globe, action: 'addIntegration' }
    ],
    data: [
      { id: 'recent-analyses', title: 'Recent Analyses', description: 'Last 30 days shipping analysis', icon: Clock, type: 'analysis' },
      { id: 'cost-savings', title: 'Cost Savings Summary', description: 'Monthly savings breakdown', icon: TrendingUp, type: 'metric' },
      { id: 'carrier-performance', title: 'Carrier Performance', description: 'Delivery and cost metrics', icon: Truck, type: 'metric' },
      { id: 'optimization-opportunities', title: 'Optimization Opportunities', description: 'Identified improvement areas', icon: Zap, type: 'recommendation' }
    ]
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[activeIndex]) {
            handleSelectResult(results[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex]);

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const allResults: any[] = [];

    // Search pages
    searchData.pages.forEach(page => {
      if (page.title.toLowerCase().includes(query) || page.description.toLowerCase().includes(query)) {
        allResults.push({ ...page, category: 'Pages' });
      }
    });

    // Search features
    searchData.features.forEach(feature => {
      if (feature.title.toLowerCase().includes(query) || feature.description.toLowerCase().includes(query)) {
        allResults.push({ ...feature, category: 'Features' });
      }
    });

    // Search quick actions
    searchData.quickActions.forEach(action => {
      if (action.title.toLowerCase().includes(query) || action.description.toLowerCase().includes(query)) {
        allResults.push({ ...action, category: 'Quick Actions' });
      }
    });

    // Search data
    searchData.data.forEach(data => {
      if (data.title.toLowerCase().includes(query) || data.description.toLowerCase().includes(query)) {
        allResults.push({ ...data, category: 'Data & Reports' });
      }
    });

    // Smart suggestions based on query
    if (query.includes('cost') || query.includes('save')) {
      allResults.unshift({
        id: 'cost-analysis',
        title: 'Cost Analysis Report',
        description: 'Generate comprehensive cost analysis',
        icon: TrendingUp,
        category: 'Suggested',
        action: 'costAnalysis'
      });
    }

    if (query.includes('carrier') || query.includes('ups') || query.includes('fedex')) {
      allResults.unshift({
        id: 'carrier-setup',
        title: 'Carrier Integration',
        description: 'Set up or configure carrier connections',
        icon: Truck,
        category: 'Suggested',
        action: 'carrierSetup'
      });
    }

    if (query.includes('report') || query.includes('export')) {
      allResults.unshift({
        id: 'report-generator',
        title: 'Report Generator',
        description: 'Create custom reports',
        icon: FileText,
        category: 'Suggested',
        action: 'reportGenerator'
      });
    }

    setResults(allResults.slice(0, 10)); // Limit to 10 results
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleSelectResult = (result: any) => {
    // Add to recent searches
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    // Handle different result types
    if (result.tab) {
      onNavigate(result.tab);
    } else if (result.action) {
      handleAction(result.action);
    }

    onClose();
    setQuery('');
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'newAnalysis':
        onNavigate('upload');
        break;
      case 'uploadFile':
        onNavigate('upload');
        break;
      case 'generateReport':
        onNavigate('reports');
        break;
      case 'addIntegration':
        onNavigate('integrations');
        break;
      case 'costAnalysis':
        onNavigate('analytics');
        break;
      case 'carrierSetup':
        onNavigate('integrations');
        break;
      case 'reportGenerator':
        onNavigate('reports');
        break;
      default:
        console.log('Action:', action);
    }
  };

  const getDefaultSuggestions = () => {
    return [
      ...searchData.quickActions.slice(0, 3),
      ...searchData.pages.slice(0, 3)
    ].map(item => ({ ...item, category: item.title.includes('Upload') ? 'Quick Actions' : 'Pages' }));
  };

  const displayResults = query.trim() ? results : getDefaultSuggestions();
  const groupedResults = displayResults.reduce((groups, result) => {
    const category = result.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(result);
    return groups;
  }, {} as Record<string, any[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 p-4 z-50">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search features, data, or ask a question..."
                className="pl-10 pr-10 py-3 text-base border-0 focus:ring-0 bg-gray-50"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </Badge>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {displayResults.length === 0 && query.trim() ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">No results found for "{query}"</p>
                <p className="text-sm text-gray-500">Try searching for features, reports, or data</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {category}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {items.map((result, index) => {
                        const globalIndex = displayResults.indexOf(result);
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleSelectResult(result)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              globalIndex === activeIndex
                                ? 'bg-gray-100'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                {React.createElement(result.icon, { 
                                  className: "w-4 h-4 text-gray-600" 
                                })}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-black text-sm truncate">
                                    {result.title}
                                  </h4>
                                  {result.category === 'Suggested' && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                      Suggested
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 truncate">
                                  {result.description}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{search}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="text-xs">↑↓</Badge>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="text-xs">↵</Badge>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="text-xs">ESC</Badge>
                <span>Close</span>
              </div>
            </div>
            <span>Press Cmd+K anytime to search</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}