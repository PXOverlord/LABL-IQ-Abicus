import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { 
  Truck, 
  ShoppingCart, 
  Database, 
  BarChart3, 
  DollarSign,
  Warehouse,
  Users,
  Bell,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Settings,
  ExternalLink,
  Shield,
  TrendingUp,
  Package,
  Globe,
  MessageSquare,
  Mail,
  FileSpreadsheet,
  Calendar,
  Activity,
  Link2,
  ArrowRight,
  Ship,
  Code
} from 'lucide-react';

const integrationCategories = {
  platforms: {
    name: 'Shipping Platforms',
    icon: Ship,
    description: 'Multi-carrier shipping platforms and APIs for comprehensive rate management',
    integrations: [
      {
        id: 'lablpx',
        name: 'labl px',
        logo: '🏷️',
        description: 'Advanced shipping platform with intelligent rate optimization',
        status: 'connected',
        features: ['Multi-carrier rates', 'Smart routing', 'Label automation', 'Analytics API'],
        popularity: 94,
        savings: '$3,450'
      },
      {
        id: 'shipstation',
        name: 'ShipStation',
        logo: '🚢',
        description: 'Leading multi-carrier shipping software platform',
        status: 'connected',
        features: ['Order management', 'Batch processing', 'Branded tracking', 'Automation rules'],
        popularity: 89,
        savings: '$2,890'
      },
      {
        id: 'easypost',
        name: 'EasyPost',
        logo: '📮',
        description: 'Shipping API platform with extensive carrier network',
        status: 'available',
        features: ['RESTful API', 'Address validation', 'Tracking webhooks', 'Insurance options'],
        popularity: 85,
        savings: '$2,340'
      },
      {
        id: 'pirateship',
        name: 'PirateShip',
        logo: '🏴‍☠️',
        description: 'Free shipping software with commercial rates',
        status: 'connected',
        features: ['USPS commercial rates', 'No monthly fees', 'Cubic pricing', 'Simple interface'],
        popularity: 76,
        savings: '$1,670'
      },
      {
        id: 'goshippo',
        name: 'Shippo',
        logo: '📦',
        description: 'Multi-carrier shipping API and dashboard',
        status: 'available',
        features: ['Global carriers', 'Returns management', 'Rate shopping', 'Developer tools'],
        popularity: 81,
        savings: '$2,120'
      },
      {
        id: 'easyship',
        name: 'Easyship',
        logo: '🌍',
        description: 'Global shipping platform for cross-border commerce',
        status: 'beta',
        features: ['International shipping', 'Duties calculator', 'Multi-currency', 'Tax compliance'],
        popularity: 72,
        savings: '$1,980'
      }
    ]
  },
  carriers: {
    name: 'Shipping Carriers',
    icon: Truck,
    description: 'Get real-time rates and tracking from major carriers',
    integrations: [
      {
        id: 'ups',
        name: 'UPS',
        logo: '📦',
        description: 'Real-time rates, tracking, and shipping labels',
        status: 'connected',
        features: ['Live rates', 'Tracking API', 'Label generation', 'Address validation'],
        popularity: 98,
        savings: '$2,340'
      },
      {
        id: 'fedex',
        name: 'FedEx',
        logo: '🚚',
        description: 'Express and ground shipping with detailed analytics',
        status: 'connected',
        features: ['Rate shopping', 'Delivery dates', 'Transit times', 'Service mapping'],
        popularity: 95,
        savings: '$1,890'
      },
      {
        id: 'usps',
        name: 'USPS',
        logo: '📮',
        description: 'Postal service rates and residential delivery',
        status: 'available',
        features: ['Priority rates', 'Ground advantage', 'PO Box delivery', 'Rural rates'],
        popularity: 87,
        savings: '$980'
      },
      {
        id: 'dhl',
        name: 'DHL Express',
        logo: '✈️',
        description: 'International shipping and express delivery',
        status: 'available',
        features: ['International rates', 'Customs docs', 'Express delivery', 'Duty calc'],
        popularity: 76,
        savings: '$1,230'
      }
    ]
  },
  ecommerce: {
    name: 'E-commerce Platforms',
    icon: ShoppingCart,
    description: 'Sync order data and optimize shipping costs',
    integrations: [
      {
        id: 'shopify',
        name: 'Shopify',
        logo: '🛍️',
        description: 'Automatically analyze shipping costs for all orders',
        status: 'connected',
        features: ['Order sync', 'Cost analysis', 'Rate optimization', 'Bulk processing'],
        popularity: 92,
        savings: '$4,120'
      },
      {
        id: 'woocommerce',
        name: 'WooCommerce',
        logo: '🛒',
        description: 'WordPress e-commerce shipping optimization',
        status: 'available',
        features: ['Order import', 'Zone mapping', 'Rate comparison', 'Customer analysis'],
        popularity: 85,
        savings: '$2,890'
      },
      {
        id: 'magento',
        name: 'Magento',
        logo: '🏪',
        description: 'Enterprise e-commerce shipping analytics',
        status: 'available',
        features: ['Multi-store', 'Advanced rules', 'B2B rates', 'Custom zones'],
        popularity: 71,
        savings: '$3,450'
      },
      {
        id: 'amazon',
        name: 'Amazon Seller',
        logo: '📦',
        description: 'FBA cost analysis and merchant fulfillment',
        status: 'beta',
        features: ['FBA analysis', 'Merchant rates', 'Storage costs', 'Fee breakdown'],
        popularity: 89,
        savings: '$5,670'
      }
    ]
  },
  erp: {
    name: 'ERP & Business Systems',
    icon: Database,
    description: 'Integrate with your existing business systems',
    integrations: [
      {
        id: 'sap',
        name: 'SAP',
        logo: '🏢',
        description: 'Enterprise resource planning integration',
        status: 'available',
        features: ['Order sync', 'Cost centers', 'Approval flows', 'Multi-company'],
        popularity: 68,
        savings: '$8,900'
      },
      {
        id: 'netsuite',
        name: 'NetSuite',
        logo: '💼',
        description: 'Cloud ERP with shipping cost optimization',
        status: 'connected',
        features: ['Real-time sync', 'Financial reporting', 'Multi-subsidiary', 'Approval workflow'],
        popularity: 74,
        savings: '$6,780'
      },
      {
        id: 'quickbooks',
        name: 'QuickBooks',
        logo: '📊',
        description: 'Accounting software with shipping expense tracking',
        status: 'available',
        features: ['Expense tracking', 'P&L impact', 'Tax reporting', 'Cost allocation'],
        popularity: 91,
        savings: '$2,340'
      },
      {
        id: 'oracle',
        name: 'Oracle ERP',
        logo: '🏛️',
        description: 'Enterprise-grade business system integration',
        status: 'enterprise',
        features: ['Complex workflows', 'Multi-org', 'Advanced reporting', 'Custom fields'],
        popularity: 56,
        savings: '$12,500'
      }
    ]
  },
  analytics: {
    name: 'Analytics & BI',
    icon: BarChart3,
    description: 'Export data to your favorite analytics tools',
    integrations: [
      {
        id: 'tableau',
        name: 'Tableau',
        logo: '📈',
        description: 'Advanced data visualization and dashboards',
        status: 'connected',
        features: ['Live data', 'Custom dashboards', 'Executive reports', 'Drill-down'],
        popularity: 83,
        savings: 'N/A'
      },
      {
        id: 'powerbi',
        name: 'Power BI',
        logo: '📊',
        description: 'Microsoft business intelligence platform',
        status: 'available',
        features: ['Real-time data', 'Custom visuals', 'Automated reports', 'Sharing'],
        popularity: 79,
        savings: 'N/A'
      },
      {
        id: 'looker',
        name: 'Looker',
        logo: '🔍',
        description: 'Modern BI and data platform',
        status: 'available',
        features: ['SQL-based', 'Self-service', 'Embedded analytics', 'API access'],
        popularity: 67,
        savings: 'N/A'
      },
      {
        id: 'googleanalytics',
        name: 'Google Analytics',
        logo: '📱',
        description: 'Web analytics with shipping cost insights',
        status: 'beta',
        features: ['E-commerce tracking', 'Goal setup', 'Custom events', 'Attribution'],
        popularity: 94,
        savings: 'N/A'
      }
    ]
  },
  communication: {
    name: 'Communication & Alerts',
    icon: Bell,
    description: 'Stay informed with automated notifications',
    integrations: [
      {
        id: 'slack',
        name: 'Slack',
        logo: '💬',
        description: 'Team notifications and shipping alerts',
        status: 'connected',
        features: ['Rate alerts', 'Savings notifications', 'Daily summaries', 'Custom channels'],
        popularity: 88,
        savings: 'N/A'
      },
      {
        id: 'teams',
        name: 'Microsoft Teams',
        logo: '👥',
        description: 'Collaboration with shipping insights',
        status: 'available',
        features: ['Channel notifications', 'Bot commands', 'File sharing', 'Meeting integration'],
        popularity: 82,
        savings: 'N/A'
      },
      {
        id: 'email',
        name: 'Email Notifications',
        logo: '📧',
        description: 'Automated email reports and alerts',
        status: 'connected',
        features: ['Daily reports', 'Exception alerts', 'Savings summaries', 'Custom schedules'],
        popularity: 96,
        savings: 'N/A'
      },
      {
        id: 'webhook',
        name: 'Custom Webhooks',
        logo: '🔗',
        description: 'Build custom integrations with webhooks',
        status: 'available',
        features: ['Real-time events', 'Custom payloads', 'Retry logic', 'Authentication'],
        popularity: 45,
        savings: 'N/A'
      }
    ]
  }
};

export function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState('platforms');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'available':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <Plus className="w-3 h-3 mr-1" />
            Available
          </Badge>
        );
      case 'beta':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Beta
          </Badge>
        );
      case 'enterprise':
        return (
          <Badge className="bg-purple-50 text-purple-700 border-purple-200">
            <Shield className="w-3 h-3 mr-1" />
            Enterprise
          </Badge>
        );
      default:
        return null;
    }
  };

  const getActionButton = (integration: any) => {
    switch (integration.status) {
      case 'connected':
        return (
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        );
      case 'available':
        return (
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Connect
          </Button>
        );
      case 'beta':
        return (
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Join Beta
          </Button>
        );
      case 'enterprise':
        return (
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Contact Sales
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredCategories = Object.entries(integrationCategories).map(([key, category]) => ({
    key,
    ...category,
    integrations: category.integrations.filter(integration =>
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  const connectedCount = Object.values(integrationCategories)
    .flatMap(category => category.integrations)
    .filter(integration => integration.status === 'connected').length;

  const totalSavings = Object.values(integrationCategories)
    .flatMap(category => category.integrations)
    .filter(integration => integration.status === 'connected' && integration.savings !== 'N/A')
    .reduce((sum, integration) => sum + parseFloat(integration.savings.replace('$', '').replace(',', '')), 0);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-medium text-black">{connectedCount}</div>
                <div className="text-sm text-gray-600">Connected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-medium text-black">30</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-medium text-black">${totalSavings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Monthly Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover-lift bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-medium text-black">6</div>
                <div className="text-sm text-gray-600">New This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm hover-lift bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <Label htmlFor="search">Search Integrations</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export List
              </Button>
              <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Request Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100">
          {Object.entries(integrationCategories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={key} value={key} className="data-[state=active]:bg-white">
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(integrationCategories).map(([categoryKey, category]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-medium text-black">{category.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.integrations
                .filter(integration =>
                  integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  integration.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((integration) => (
                  <Card key={integration.id} className="shadow-sm hover-lift bg-white">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{integration.logo}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <CardTitle className="text-lg font-medium text-black">
                                {integration.name}
                              </CardTitle>
                              {getStatusBadge(integration.status)}
                            </div>
                            <CardDescription className="text-gray-600">
                              {integration.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {integration.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-50 text-gray-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{integration.popularity}% use this</span>
                          </div>
                          {integration.savings !== 'N/A' && (
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">{integration.savings}/mo saved</span>
                            </div>
                          )}
                        </div>
                        {getActionButton(integration)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Integration Benefits */}
      <Card className="shadow-sm hover-lift bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
              <Link2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-medium text-black">Need a Custom Integration?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team can build custom integrations for your specific business needs. 
              Connect any system, API, or data source to maximize your shipping optimization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Button className="bg-black text-white hover:bg-gray-800">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Integration Team
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View API Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}