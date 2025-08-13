
'use client';

import { useState, useEffect } from 'react';
import { useAnalysisStore } from '@/hooks/useAnalysisStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Fuel, 
  TrendingUp, 
  Package, 
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, setSettings } = useAnalysisStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Update local settings when global settings change
  useEffect(() => {
    setLocalSettings(settings);
    setIsDirty(false);
  }, [settings]);

  // Check if settings have changed
  useEffect(() => {
    const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);
    setIsDirty(hasChanges);
  }, [localSettings, settings]);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Update global settings
    setSettings(localSettings);
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setIsDirty(false);
  };

  const handleResetToDefaults = () => {
    const defaults = {
      weightUnit: 'oz' as const,
      fuelSurchargePct: 0,
      markupPct: 0,
      dimDivisor: 139,
      dasSurcharge: 1.98,
      edasSurcharge: 3.92,
      remoteSurcharge: 14.15,
      discountPercent: 0,
      markupPercentage: 10
    };
    setLocalSettings(defaults);
    setIsDirty(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your analysis parameters and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={!isDirty}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Changes
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isDirty || saveStatus === 'saving'}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus === 'saved' && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Settings saved successfully!</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">Error saving settings. Please try again.</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Basic Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weightUnit">Default Weight Unit</Label>
              <Select 
                value={localSettings.weightUnit} 
                onValueChange={(value) => handleSettingChange('weightUnit', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oz">Ounces (oz)</SelectItem>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="g">Grams (g)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dimDivisor">Dimensional Divisor</Label>
              <Input
                id="dimDivisor"
                type="number"
                value={localSettings.dimDivisor || 139}
                onChange={(e) => handleSettingChange('dimDivisor', parseFloat(e.target.value) || 139)}
                placeholder="139"
              />
              <p className="text-sm text-gray-500 mt-1">Used for dimensional weight calculations</p>
            </div>
          </CardContent>
        </Card>

        {/* Surcharge Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Fuel className="w-5 h-5" />
              <span>Surcharges</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fuelSurcharge">Fuel Surcharge (%)</Label>
              <Input
                id="fuelSurcharge"
                type="number"
                step="0.01"
                value={localSettings.fuelSurchargePct || 0}
                onChange={(e) => handleSettingChange('fuelSurchargePct', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="dasSurcharge">DAS Surcharge ($)</Label>
              <Input
                id="dasSurcharge"
                type="number"
                step="0.01"
                value={localSettings.dasSurcharge || 1.98}
                onChange={(e) => handleSettingChange('dasSurcharge', parseFloat(e.target.value) || 1.98)}
                placeholder="1.98"
              />
            </div>

            <div>
              <Label htmlFor="edasSurcharge">EDAS Surcharge ($)</Label>
              <Input
                id="edasSurcharge"
                type="number"
                step="0.01"
                value={localSettings.edasSurcharge || 3.92}
                onChange={(e) => handleSettingChange('edasSurcharge', parseFloat(e.target.value) || 3.92)}
                placeholder="3.92"
              />
            </div>

            <div>
              <Label htmlFor="remoteSurcharge">Remote Surcharge ($)</Label>
              <Input
                id="remoteSurcharge"
                type="number"
                step="0.01"
                value={localSettings.remoteSurcharge || 14.15}
                onChange={(e) => handleSettingChange('remoteSurcharge', parseFloat(e.target.value) || 14.15)}
                placeholder="14.15"
              />
            </div>
          </CardContent>
        </Card>

        {/* Markup & Discount Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Markup & Discounts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="markupPct">Default Markup (%)</Label>
              <Input
                id="markupPct"
                type="number"
                step="0.01"
                value={localSettings.markupPct || 0}
                onChange={(e) => handleSettingChange('markupPct', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="discountPercent">Discount (%)</Label>
              <Input
                id="discountPercent"
                type="number"
                step="0.01"
                value={localSettings.discountPercent || 0}
                onChange={(e) => handleSettingChange('discountPercent', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="markupPercentage">Markup Percentage (%)</Label>
              <Input
                id="markupPercentage"
                type="number"
                step="0.01"
                value={localSettings.markupPercentage || 10}
                onChange={(e) => handleSettingChange('markupPercentage', parseFloat(e.target.value) || 10)}
                placeholder="10.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Zone & Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Zone & Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="originZip">Default Origin ZIP</Label>
              <Input
                id="originZip"
                type="text"
                value={localSettings.originZip || '46307'}
                onChange={(e) => handleSettingChange('originZip', e.target.value)}
                placeholder="46307"
              />
              <p className="text-sm text-gray-500 mt-1">Used when origin ZIP is not provided</p>
            </div>

            <div>
              <Label htmlFor="destinationZip">Default Destination ZIP</Label>
              <Input
                id="destinationZip"
                type="text"
                value={localSettings.destinationZip || '60601'}
                onChange={(e) => handleSettingChange('destinationZip', e.target.value)}
                placeholder="60601"
              />
              <p className="text-sm text-gray-500 mt-1">Used when destination ZIP is not provided</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleResetToDefaults}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // Export settings
                const dataStr = JSON.stringify(localSettings, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'labl-iq-settings.json';
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
