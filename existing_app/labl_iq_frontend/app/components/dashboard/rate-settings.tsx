
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Settings, Play, Fuel, MapPin, Package } from 'lucide-react';

interface RateSettingsProps {
  settings: {
    originZip: string;
    markup: number;
    surcharge: number;
    fuelSurcharge: number;
    dasSurcharge: number;
    edasSurcharge: number;
    remoteSurcharge: number;
    dimDivisor: number;
    discountPercent: number;
  };
  onSettingsChange: (settings: any) => void;
  onRunAnalysis: () => void;
  canRunAnalysis: boolean;
  isRunning: boolean;
  savedOriginZip?: string;
}

export function RateSettings({ 
  settings, 
  onSettingsChange, 
  onRunAnalysis, 
  canRunAnalysis, 
  isRunning,
  savedOriginZip = '46307' // Default origin ZIP
}: RateSettingsProps) {
  // For testing, use default settings
  useEffect(() => {
    // Set default settings for testing
    onSettingsChange({
      originZip: settings.originZip || savedOriginZip,
      markup: settings.markup || 10.0,
      surcharge: settings.surcharge || 0.0,
      fuelSurcharge: settings.fuelSurcharge || 16.0,
      dasSurcharge: settings.dasSurcharge || 1.98,
      edasSurcharge: settings.edasSurcharge || 3.92,
      remoteSurcharge: settings.remoteSurcharge || 14.15,
      dimDivisor: settings.dimDivisor || 139.0,
      discountPercent: settings.discountPercent || 0.0,
    });
  }, [onSettingsChange, savedOriginZip]);

  const handleChange = (field: string, value: string | number) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Rate Analysis Settings</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your origin ZIP code and pricing adjustments for the analysis.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Origin ZIP - Now Editable */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Origin ZIP Code</span>
          </Label>
          <Input
            type="text"
            value={settings.originZip}
            onChange={(e) => handleChange('originZip', e.target.value)}
            placeholder="Enter origin ZIP"
            maxLength={5}
          />
          <p className="text-xs text-gray-500">
            ZIP code where shipments originate from
          </p>
        </div>

        {/* Fuel Surcharge */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Fuel className="h-4 w-4" />
            <span>Fuel Surcharge (%)</span>
          </Label>
          <Input
            type="number"
            value={settings.fuelSurcharge}
            onChange={(e) => handleChange('fuelSurcharge', parseFloat(e.target.value) || 0)}
            placeholder="16.0"
            min="0"
            max="50"
            step="0.1"
          />
          <p className="text-xs text-gray-500">
            Current fuel surcharge percentage
          </p>
        </div>

        {/* DAS Surcharge */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">DAS Surcharge ($)</Label>
          <Input
            type="number"
            value={settings.dasSurcharge}
            onChange={(e) => handleChange('dasSurcharge', parseFloat(e.target.value) || 0)}
            placeholder="1.98"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500">
            Delivery Area Surcharge amount
          </p>
        </div>

        {/* EDAS Surcharge */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">EDAS Surcharge ($)</Label>
          <Input
            type="number"
            value={settings.edasSurcharge}
            onChange={(e) => handleChange('edasSurcharge', parseFloat(e.target.value) || 0)}
            placeholder="3.92"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500">
            Extended Delivery Area Surcharge amount
          </p>
        </div>

        {/* Remote Surcharge */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Remote Surcharge ($)</Label>
          <Input
            type="number"
            value={settings.remoteSurcharge}
            onChange={(e) => handleChange('remoteSurcharge', parseFloat(e.target.value) || 0)}
            placeholder="14.15"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500">
            Remote Area Surcharge amount
          </p>
        </div>

        {/* Dimensional Divisor */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Dimensional Divisor</span>
          </Label>
          <Input
            type="number"
            value={settings.dimDivisor}
            onChange={(e) => handleChange('dimDivisor', parseFloat(e.target.value) || 139)}
            placeholder="139"
            min="100"
            max="200"
            step="1"
          />
          <p className="text-xs text-gray-500">
            Divisor for dimensional weight calculation
          </p>
        </div>

        {/* Markup */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Markup (%)</Label>
          <Input
            type="number"
            value={settings.markup}
            onChange={(e) => handleChange('markup', parseFloat(e.target.value) || 0)}
            placeholder="10.0"
            min="0"
            max="100"
            step="0.1"
          />
          <p className="text-xs text-gray-500">
            Percentage markup to add to base rates
          </p>
        </div>

        {/* Discount */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Discount (%)</Label>
          <Input
            type="number"
            value={settings.discountPercent}
            onChange={(e) => handleChange('discountPercent', parseFloat(e.target.value) || 0)}
            placeholder="0.0"
            min="0"
            max="50"
            step="0.1"
          />
          <p className="text-xs text-gray-500">
            Percentage discount to apply to rates
          </p>
        </div>

        {/* Fixed Surcharge */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fixed Surcharge ($)</Label>
          <Input
            type="number"
            value={settings.surcharge}
            onChange={(e) => handleChange('surcharge', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          <p className="text-xs text-gray-500">
            Fixed dollar amount to add per shipment
          </p>
        </div>

        {/* Run Analysis Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={onRunAnalysis}
            disabled={!canRunAnalysis || isRunning}
            className="w-full bg-black text-white hover:bg-gray-800"
            size="lg"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Running Analysis...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Rate Analysis
              </>
            )}
          </Button>
          
          {!canRunAnalysis && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Please upload a file and map required columns to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
