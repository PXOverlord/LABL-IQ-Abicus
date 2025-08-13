import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calculator, 
  MapPin, 
  Truck, 
  CheckCircle, 
  DollarSign,
  Package,
  Clock,
  Route,
  Search,
  Globe,
  Zap,
  Shield,
  Target,
  BarChart3,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';

const toolCategories = [
  {
    id: 'calculators',
    name: 'Rate Calculators',
    description: 'Calculate shipping rates and compare carriers',
    icon: Calculator,
    tools: [
      { name: 'Rate Calculator', description: 'Compare rates across all carriers', icon: DollarSign },
      { name: 'Dimensional Weight', description: 'Calculate DIM weight pricing', icon: Package },
      { name: 'Transit Time', description: 'Estimate delivery timeframes', icon: Clock },
      { name: 'Fuel Surcharge', description: 'Calculate current fuel adjustments', icon: Truck }
    ]
  },
  {
    id: 'lookup',
    name: 'Lookup Tools',
    description: 'Validate addresses and lookup shipping zones',
    icon: MapPin,
    tools: [
      { name: 'Zone Lookup', description: 'Find shipping zones by ZIP code', icon: Target },
      { name: 'Address Validation', description: 'Verify and standardize addresses', icon: CheckCircle },
      { name: 'Service Availability', description: 'Check carrier service coverage', icon: Globe },
      { name: 'Tracking Lookup', description: 'Track packages across carriers', icon: Route }
    ]
  },
  {
    id: 'optimization',
    name: 'Optimization Tools',
    description: 'Optimize routes and shipping decisions',
    icon: Zap,
    tools: [
      { name: 'Route Optimizer', description: 'Optimize delivery routes', icon: Route },
      { name: 'Carrier Selection', description: 'Get optimal carrier recommendations', icon: Truck },
      { name: 'Cost Analyzer', description: 'Analyze shipping cost patterns', icon: BarChart3 },
      { name: 'Service Optimizer', description: 'Balance cost vs. speed', icon: Shield }
    ]
  }
];

const carrierLogos = {
  ups: { name: 'UPS', color: 'bg-amber-100 text-amber-800' },
  fedex: { name: 'FedEx', color: 'bg-purple-100 text-purple-800' },
  usps: { name: 'USPS', color: 'bg-blue-100 text-blue-800' },
  dhl: { name: 'DHL', color: 'bg-yellow-100 text-yellow-800' }
};

export function ShippingTools() {
  const [activeCategory, setActiveCategory] = useState('calculators');
  const [fromZip, setFromZip] = useState('');
  const [toZip, setToZip] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [calculatedRates, setCalculatedRates] = useState<any[]>([]);

  const handleCalculateRates = () => {
    // Mock rate calculation
    const mockRates = [
      { carrier: 'ups', service: 'Ground', rate: 12.45, days: '3-5', savings: 15 },
      { carrier: 'fedex', service: 'Ground', rate: 13.20, days: '3-5', savings: 8 },
      { carrier: 'usps', service: 'Priority Mail', rate: 11.80, days: '2-3', savings: 22 },
      { carrier: 'ups', service: '3 Day Select', rate: 18.95, days: '3', savings: 5 },
      { carrier: 'fedex', service: '2Day', rate: 24.50, days: '2', savings: 12 }
    ];
    setCalculatedRates(mockRates);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {toolCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id}
              className={`shadow-sm hover-lift cursor-pointer transition-all duration-200 ${
                activeCategory === category.id ? 'border-blue-500 bg-blue-50' : 'bg-white hover:border-gray-300'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-black">{category.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  {category.description}
                </CardDescription>
                <div className="space-y-2">
                  {category.tools.map((tool, index) => {
                    const ToolIcon = tool.icon;
                    return (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <ToolIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{tool.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsContent value="calculators" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black flex items-center">
                <Calculator className="w-6 h-6 mr-3 text-blue-600" />
                Rate Calculator
              </CardTitle>
              <CardDescription className="text-gray-600">
                Compare shipping rates across all major carriers in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-zip">From ZIP Code</Label>
                  <Input
                    id="from-zip"
                    placeholder="10001"
                    value={fromZip}
                    onChange={(e) => setFromZip(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-zip">To ZIP Code</Label>
                  <Input
                    id="to-zip"
                    placeholder="90210"
                    value={toZip}
                    onChange={(e) => setToZip(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    placeholder="5.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="ground">Ground</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (in)</Label>
                  <Input
                    id="length"
                    placeholder="12"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (in)</Label>
                  <Input
                    id="width"
                    placeholder="8"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (in)</Label>
                  <Input
                    id="height"
                    placeholder="6"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleCalculateRates}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Rates
                </Button>
              </div>

              {calculatedRates.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-black mb-4">Rate Comparison Results</h3>
                  <div className="space-y-3">
                    {calculatedRates.map((rate, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Badge className={carrierLogos[rate.carrier as keyof typeof carrierLogos].color}>
                            {carrierLogos[rate.carrier as keyof typeof carrierLogos].name}
                          </Badge>
                          <div>
                            <div className="font-medium text-black">{rate.service}</div>
                            <div className="text-sm text-gray-600">{rate.days} business days</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xl font-medium text-black">${rate.rate}</div>
                            <div className="text-sm text-emerald-600">Save {rate.savings}%</div>
                          </div>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lookup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black flex items-center">
                  <Target className="w-6 h-6 mr-3 text-purple-600" />
                  Zone Lookup
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Find shipping zones between ZIP codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin-zip">Origin ZIP</Label>
                    <Input
                      id="origin-zip"
                      placeholder="10001"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-zip">Destination ZIP</Label>
                    <Input
                      id="dest-zip"
                      placeholder="90210"
                      className="bg-white"
                    />
                  </div>
                </div>
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <Search className="w-4 h-4 mr-2" />
                  Lookup Zone
                </Button>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Zone Information</div>
                  <div className="text-2xl font-medium text-black">Zone 8</div>
                  <div className="text-sm text-gray-600">Cross-country shipping zone</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-emerald-600" />
                  Address Validation
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Verify and standardize shipping addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    className="bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      className="bg-white"
                    />
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validate Address
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black flex items-center">
                <Zap className="w-6 h-6 mr-3 text-amber-600" />
                Smart Optimization Tools
              </CardTitle>
              <CardDescription className="text-gray-600">
                Advanced tools to optimize your shipping operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Route className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">Route Optimizer</h3>
                      <p className="text-sm text-gray-600">Optimize multiple delivery routes</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start Optimization
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">Carrier Selection</h3>
                      <p className="text-sm text-gray-600">AI-powered carrier recommendations</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">Cost Analyzer</h3>
                      <p className="text-sm text-gray-600">Analyze shipping cost patterns</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Analyze Costs
                  </Button>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black">Service Optimizer</h3>
                      <p className="text-sm text-gray-600">Balance cost vs. delivery speed</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Optimize Service
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}