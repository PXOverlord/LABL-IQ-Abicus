import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Package, 
  Settings, 
  Calculator,
  Save,
  RotateCcw
} from 'lucide-react';

interface ConfigurationPanelProps {
  onClose: () => void;
}

export function ConfigurationPanel({ onClose }: ConfigurationPanelProps) {
  const [originZip, setOriginZip] = useState('90210');
  const [markupPercentage, setMarkupPercentage] = useState('15');
  const [fuelSurcharge, setFuelSurcharge] = useState('12.5');
  const [includeAccessorial, setIncludeAccessorial] = useState(true);
  const [carrierPreference, setCarrierPreference] = useState('all');
  const [serviceLevel, setServiceLevel] = useState('ground');

  const handleSave = () => {
    console.log('Configuration saved');
  };

  const handleReset = () => {
    setOriginZip('90210');
    setMarkupPercentage('15');
    setFuelSurcharge('12.5');
    setIncludeAccessorial(true);
    setCarrierPreference('all');
    setServiceLevel('ground');
  };

  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-sidebar-foreground" />
          <h2 className="font-medium text-sidebar-foreground">Configuration</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="shipping" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-sidebar-accent">
            <TabsTrigger value="shipping" className="data-[state=active]:bg-sidebar">Shipping</TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-sidebar">Pricing</TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-sidebar">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Origin Settings</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Configure your primary shipping origin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="origin-zip">Origin ZIP Code</Label>
                  <Input
                    id="origin-zip"
                    value={originZip}
                    onChange={(e) => setOriginZip(e.target.value)}
                    placeholder="Enter ZIP code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrier-preference">Carrier Preference</Label>
                  <Select value={carrierPreference} onValueChange={setCarrierPreference}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Carriers</SelectItem>
                      <SelectItem value="fedex">FedEx Only</SelectItem>
                      <SelectItem value="ups">UPS Only</SelectItem>
                      <SelectItem value="usps">USPS Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-level">Default Service Level</Label>
                  <Select value={serviceLevel} onValueChange={setServiceLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">Ground</SelectItem>
                      <SelectItem value="2day">2-Day</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Package Defaults</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Length (in)</Label>
                    <Input placeholder="12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Width (in)</Label>
                    <Input placeholder="8" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Height (in)</Label>
                    <Input placeholder="6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default Weight (lbs)</Label>
                  <Input placeholder="2.5" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Pricing Adjustments</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Configure markup and surcharges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="markup">Markup Percentage</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="markup"
                      value={markupPercentage}
                      onChange={(e) => setMarkupPercentage(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel-surcharge">Fuel Surcharge</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="fuel-surcharge"
                      value={fuelSurcharge}
                      onChange={(e) => setFuelSurcharge(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Accessorial Charges</Label>
                    <p className="text-xs text-muted-foreground">
                      Add residential delivery and other fees
                    </p>
                  </div>
                  <Switch
                    checked={includeAccessorial}
                    onCheckedChange={setIncludeAccessorial}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Discount Tiers</CardTitle>
                <CardDescription className="text-sm">
                  Volume-based discount structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">0-100 shipments</span>
                  <Badge variant="outline">Base Rate</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">101-500 shipments</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">-5%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">500+ shipments</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">-12%</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>Analysis Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Zone Skipping</Label>
                    <p className="text-xs text-muted-foreground">
                      Analyze zone skipping opportunities
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Multi-Carrier Comparison</Label>
                    <p className="text-xs text-muted-foreground">
                      Compare rates across all carriers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dimensional Weight Analysis</Label>
                    <p className="text-xs text-muted-foreground">
                      Factor in DIM weight calculations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Peak Season Rates</Label>
                    <p className="text-xs text-muted-foreground">
                      Include peak season surcharges
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="excel">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Charts</Label>
                    <p className="text-xs text-muted-foreground">
                      Add charts to exported reports
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}