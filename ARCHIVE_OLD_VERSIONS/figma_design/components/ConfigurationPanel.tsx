import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  X, 
  Settings, 
  MapPin, 
  Package, 
  Globe, 
  Bell, 
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info,
  Truck,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Target,
  Star,
  Plus,
  ExternalLink,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

interface ConfigurationPanelProps {
  onClose: () => void;
}

// Carrier Logo Component with SVG representations
function CarrierLogo({ carrier, size = 'md' }: { carrier: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const getCarrierColor = (carrier: string) => {
    const colors: Record<string, string> = {
      'ups': '#8B4513',
      'fedex': '#4B0082',
      'usps': '#004B87',
      'dhl': '#FFCC00',
      'amazon': '#FF9900',
      'ontrac': '#0066CC',
      'lasership': '#E31837',
      'ensenda': '#FF6B35',
      'lso': '#8B0000',
      'eastern': '#228B22',
      'spee-dee': '#DC143C',
      'gso': '#FFD700',
      'rl-carriers': '#4169E1',
      'abf': '#800080',
      'old-dominion': '#FF4500',
      'yrc': '#B22222',
      'estes': '#006400',
      'saia': '#1E90FF',
      'xpo': '#FF1493',
      'easypost': '#3B82F6',
      'shipstation': '#00A651',
      'shippo': '#6366F1',
      'pirateship': '#1F2937',
      'easyship': '#EC4899',
      'shipbob': '#8B5CF6',
      'shipengine': '#059669'
    };
    return colors[carrier.toLowerCase().replace(/\s+/g, '-')] || '#6B7280';
  };

  const color = getCarrierColor(carrier);

  // Simple professional logo representations
  return (
    <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center text-white font-semibold text-xs`}
         style={{ backgroundColor: color }}>
      {carrier.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
    </div>
  );
}

export function ConfigurationPanel({ onClose }: ConfigurationPanelProps) {
  const [activeTab, setActiveTab] = useState('shipping');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  // Enhanced configuration state with more carriers
  const [config, setConfig] = useState({
    shipping: {
      originZip: '90210',
      defaultCarrier: 'all',
      serviceLevel: 'ground',
      dimensions: { length: 12, width: 8, height: 6 },
      weight: 2.5
    },
    preferences: {
      autoAnalyze: true,
      savingsThreshold: 5,
      alertsEnabled: true,
      weeklyReports: false
    },
    integrations: {
      // Major Carriers
      ups: { connected: true, apiKey: 'ups_live_***', status: 'active', lastSync: '2 hours ago' },
      fedex: { connected: true, apiKey: 'fdx_***', status: 'active', lastSync: '1 hour ago' },
      usps: { connected: false, apiKey: '', status: 'available', lastSync: null },
      dhl: { connected: false, apiKey: '', status: 'available', lastSync: null },
      amazon: { connected: true, apiKey: 'amzn_mws_***', status: 'active', lastSync: '30 min ago', featured: true },
      
      // Regional Carriers
      ontrac: { connected: true, apiKey: 'ont_***', status: 'active', lastSync: '3 hours ago' },
      lasership: { connected: false, apiKey: '', status: 'available', lastSync: null },
      ensenda: { connected: false, apiKey: '', status: 'available', lastSync: null },
      lso: { connected: false, apiKey: '', status: 'available', lastSync: null },
      eastern: { connected: false, apiKey: '', status: 'available', lastSync: null },
      'spee-dee': { connected: false, apiKey: '', status: 'available', lastSync: null },
      gso: { connected: false, apiKey: '', status: 'available', lastSync: null },
      'rl-carriers': { connected: false, apiKey: '', status: 'available', lastSync: null },
      
      // LTL/Freight Carriers
      abf: { connected: false, apiKey: '', status: 'available', lastSync: null },
      'old-dominion': { connected: false, apiKey: '', status: 'available', lastSync: null },
      yrc: { connected: false, apiKey: '', status: 'available', lastSync: null },
      estes: { connected: false, apiKey: '', status: 'available', lastSync: null },
      saia: { connected: false, apiKey: '', status: 'available', lastSync: null },
      xpo: { connected: false, apiKey: '', status: 'available', lastSync: null },
      
      // API Platforms
      easypost: { connected: true, apiKey: 'ep_live_***', status: 'active', lastSync: '15 min ago' },
      shipstation: { connected: false, apiKey: '', status: 'available', lastSync: null },
      shippo: { connected: false, apiKey: '', status: 'available', lastSync: null },
      pirateship: { connected: false, apiKey: '', status: 'available', lastSync: null },
      easyship: { connected: false, apiKey: '', status: 'available', lastSync: null },
      shipbob: { connected: false, apiKey: '', status: 'available', lastSync: null },
      shipengine: { connected: false, apiKey: '', status: 'available', lastSync: null },
      
      // Communication
      slack: { connected: true, channel: '#shipping' },
      teams: { connected: false, channel: '' }
    }
  });

  const handleConfigChange = (section: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    console.log('Saving configuration:', config);
  };

  const handleReset = () => {
    setHasUnsavedChanges(false);
    console.log('Resetting configuration');
  };

  const toggleApiKeyVisibility = (carrier: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [carrier]: !prev[carrier]
    }));
  };

  const getCarrierDisplayName = (carrier: string) => {
    const names: Record<string, string> = {
      'ups': 'UPS',
      'fedex': 'FedEx',
      'usps': 'USPS',
      'dhl': 'DHL Express',
      'amazon': 'Amazon Shipping',
      'ontrac': 'OnTrac',
      'lasership': 'LaserShip',
      'ensenda': 'Ensenda',
      'lso': 'Lone Star Overnight',
      'eastern': 'Eastern Connection',
      'spee-dee': 'Spee-Dee Delivery',
      'gso': 'Golden State Overnight',
      'rl-carriers': 'RL Carriers',
      'abf': 'ABF Freight',
      'old-dominion': 'Old Dominion',
      'yrc': 'YRC Freight',
      'estes': 'Estes Express',
      'saia': 'Saia LTL',
      'xpo': 'XPO Logistics',
      'easypost': 'EasyPost',
      'shipstation': 'ShipStation',
      'shippo': 'Shippo',
      'pirateship': 'PirateShip',
      'easyship': 'Easyship',
      'shipbob': 'ShipBob',
      'shipengine': 'ShipEngine'
    };
    return names[carrier] || carrier;
  };

  const carrierCategories = {
    major: {
      title: 'Major Carriers',
      description: 'National shipping carriers with comprehensive coverage',
      carriers: ['ups', 'fedex', 'usps', 'dhl', 'amazon']
    },
    regional: {
      title: 'Regional Carriers',
      description: 'Regional and specialized shipping providers',
      carriers: ['ontrac', 'lasership', 'ensenda', 'lso', 'eastern', 'spee-dee', 'gso', 'rl-carriers']
    },
    freight: {
      title: 'LTL & Freight',
      description: 'Less-than-truckload and freight shipping',
      carriers: ['abf', 'old-dominion', 'yrc', 'estes', 'saia', 'xpo']
    },
    platforms: {
      title: 'API Platforms',
      description: 'Multi-carrier shipping platforms and APIs',
      carriers: ['easypost', 'shipstation', 'shippo', 'pirateship', 'easyship', 'shipbob', 'shipengine']
    }
  };

  const getConnectedCount = () => {
    return Object.values(config.integrations).filter(integration => 
      typeof integration === 'object' && 'connected' in integration && integration.connected
    ).length;
  };

  const getTotalCarriers = () => {
    return Object.keys(carrierCategories).reduce((total, category) => 
      total + carrierCategories[category as keyof typeof carrierCategories].carriers.length, 0
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div>
          <h2 className="text-xl font-semibold text-black">Configuration</h2>
          <p className="text-sm text-gray-600">Customize your shipping analysis settings</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-black hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Unsaved Changes</span>
          </div>
          <p className="text-xs text-amber-700 mt-1">
            You have unsaved configuration changes
          </p>
        </div>
      )}

      {/* Configuration Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="shipping" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span className="hidden sm:inline">Shipping</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Shipping Configuration */}
            <TabsContent value="shipping" className="space-y-6 mt-0">
              {/* Origin Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Origin Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your primary shipping origin and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin-zip">Origin ZIP Code</Label>
                      <Input
                        id="origin-zip"
                        value={config.shipping.originZip}
                        onChange={(e) => handleConfigChange('shipping', 'originZip', e.target.value)}
                        placeholder="90210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carrier-preference">Default Carrier</Label>
                      <Select 
                        value={config.shipping.defaultCarrier}
                        onValueChange={(value) => handleConfigChange('shipping', 'defaultCarrier', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Carriers</SelectItem>
                          <SelectItem value="ups">UPS</SelectItem>
                          <SelectItem value="fedex">FedEx</SelectItem>
                          <SelectItem value="usps">USPS</SelectItem>
                          <SelectItem value="amazon">Amazon Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-level">Default Service Level</Label>
                    <Select 
                      value={config.shipping.serviceLevel}
                      onValueChange={(value) => handleConfigChange('shipping', 'serviceLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ground">Ground</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="overnight">Overnight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Package Defaults */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Package className="w-5 h-5 text-green-600" />
                    <span>Package Defaults</span>
                  </CardTitle>
                  <CardDescription>
                    Set default package dimensions and weight for calculations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length (in)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={config.shipping.dimensions.length}
                        onChange={(e) => handleConfigChange('shipping', 'dimensions', {
                          ...config.shipping.dimensions,
                          length: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (in)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={config.shipping.dimensions.width}
                        onChange={(e) => handleConfigChange('shipping', 'dimensions', {
                          ...config.shipping.dimensions,
                          width: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (in)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={config.shipping.dimensions.height}
                        onChange={(e) => handleConfigChange('shipping', 'dimensions', {
                          ...config.shipping.dimensions,
                          height: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Default Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={config.shipping.weight}
                      onChange={(e) => handleConfigChange('shipping', 'weight', parseFloat(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span>Analysis Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Customize how your shipping data is analyzed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="auto-analyze" className="text-sm font-medium">
                        Auto-analyze uploads
                      </Label>
                      <p className="text-xs text-gray-600">
                        Automatically start analysis when files are uploaded
                      </p>
                    </div>
                    <Switch
                      id="auto-analyze"
                      checked={config.preferences.autoAnalyze}
                      onCheckedChange={(checked) => handleConfigChange('preferences', 'autoAnalyze', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="savings-threshold">Minimum Savings Threshold (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="savings-threshold"
                        type="number"
                        value={config.preferences.savingsThreshold}
                        onChange={(e) => handleConfigChange('preferences', 'savingsThreshold', parseFloat(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">
                        Only highlight opportunities above this threshold
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="weekly-reports" className="text-sm font-medium">
                        Weekly reports
                      </Label>
                      <p className="text-xs text-gray-600">
                        Receive weekly summary reports via email
                      </p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={config.preferences.weeklyReports}
                      onCheckedChange={(checked) => handleConfigChange('preferences', 'weeklyReports', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Integrations */}
            <TabsContent value="integrations" className="space-y-6 mt-0">
              {/* Integration Status Overview */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-black">{getConnectedCount()}</div>
                        <div className="text-sm text-gray-600">Connected</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-black">{getTotalCarriers()}</div>
                        <div className="text-sm text-gray-600">Available</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-black">Real-time</div>
                        <div className="text-sm text-gray-600">Rate Updates</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Carrier Categories */}
              {Object.entries(carrierCategories).map(([categoryKey, category]) => (
                <Card key={categoryKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <span>{category.title}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.carriers.filter(c => config.integrations[c as keyof typeof config.integrations]?.connected).length}/{category.carriers.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {category.carriers.map((carrier) => {
                        const integration = config.integrations[carrier as keyof typeof config.integrations];
                        const isConnected = integration && typeof integration === 'object' && 'connected' in integration && integration.connected;
                        const isFeatured = integration && typeof integration === 'object' && 'featured' in integration && integration.featured;
                        
                        return (
                          <div key={carrier} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                            isConnected ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <CarrierLogo carrier={carrier} size="md" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">{getCarrierDisplayName(carrier)}</span>
                                  {isFeatured && (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                      New
                                    </Badge>
                                  )}
                                </div>
                                {isConnected && integration && typeof integration === 'object' && 'lastSync' in integration && (
                                  <div className="text-xs text-gray-600">
                                    Last sync: {integration.lastSync}
                                  </div>
                                )}
                                {isConnected && integration && typeof integration === 'object' && 'apiKey' in integration && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="text-xs text-gray-500 font-mono">
                                      {showApiKeys[carrier] ? integration.apiKey : '••••••••••'}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleApiKeyVisibility(carrier)}
                                      className="h-4 w-4 p-0"
                                    >
                                      {showApiKeys[carrier] ? (
                                        <EyeOff className="w-3 h-3" />
                                      ) : (
                                        <Eye className="w-3 h-3" />
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={isConnected ? "secondary" : "outline"} 
                                     className={isConnected ? "bg-green-100 text-green-800" : ""}>
                                {isConnected ? 'Connected' : 'Available'}
                              </Badge>
                              <Button variant="outline" size="sm">
                                {isConnected ? 'Configure' : 'Connect'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Alerts & Notifications */}
            <TabsContent value="alerts" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <span>Notification Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how and when you receive alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="alerts-enabled" className="text-sm font-medium">
                        Enable notifications
                      </Label>
                      <p className="text-xs text-gray-600">
                        Receive alerts for savings opportunities and issues
                      </p>
                    </div>
                    <Switch
                      id="alerts-enabled"
                      checked={config.preferences.alertsEnabled}
                      onCheckedChange={(checked) => handleConfigChange('preferences', 'alertsEnabled', checked)}
                    />
                  </div>

                  <Separator />

                  {/* Communication Channels */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-black">Communication Channels</h4>
                    
                    {/* Slack Integration */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Bell className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Slack</div>
                          <div className="text-xs text-gray-600">
                            {config.integrations.slack.connected 
                              ? `Connected to ${config.integrations.slack.channel}`
                              : 'Team notifications and alerts'
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={config.integrations.slack.connected ? "secondary" : "outline"} 
                               className={config.integrations.slack.connected ? "bg-green-50 text-green-700" : ""}>
                          {config.integrations.slack.connected ? 'Connected' : 'Available'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {config.integrations.slack.connected ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    </div>

                    {/* Microsoft Teams Integration */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Bell className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Microsoft Teams</div>
                          <div className="text-xs text-gray-600">
                            Collaboration with shipping insights
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Available</Badge>
                        <Button variant="outline" size="sm">Connect</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}