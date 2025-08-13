
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '@radix-ui/react-label';
import { Settings, Play } from 'lucide-react';
import { useAuthStore } from '../../lib/stores/auth-store';

interface RateSettingsProps {
  settings: {
    originZip: string;
    markup: number;
    surcharge: number;
  };
  onSettingsChange: (settings: any) => void;
  onRunAnalysis: () => void;
  canRunAnalysis: boolean;
  isRunning: boolean;
}

export function RateSettings({ 
  settings, 
  onSettingsChange, 
  onRunAnalysis, 
  canRunAnalysis, 
  isRunning 
}: RateSettingsProps) {
  const { user } = useAuthStore();

  useEffect(() => {
    // Load default settings from user preferences
    if (user) {
      onSettingsChange({
        originZip: user.originZip || '',
        markup: user.defaultMarkup || 0,
        surcharge: user.defaultSurcharge || 0,
      });
    }
  }, [user, onSettingsChange]);

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
        {/* Origin ZIP */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Origin ZIP Code *</Label>
          <Input
            type="text"
            value={settings.originZip}
            onChange={(e) => handleChange('originZip', e.target.value)}
            placeholder="Enter your origin ZIP code"
            maxLength={5}
          />
          <p className="text-xs text-gray-500">
            The ZIP code where shipments originate from
          </p>
        </div>

        {/* Markup */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Markup (%)</Label>
          <Input
            type="number"
            value={settings.markup}
            onChange={(e) => handleChange('markup', parseFloat(e.target.value) || 0)}
            placeholder="0"
            min="0"
            max="100"
            step="0.1"
          />
          <p className="text-xs text-gray-500">
            Percentage markup to add to base rates
          </p>
        </div>

        {/* Surcharge */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Surcharge ($)</Label>
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
            className="w-full"
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
              Please upload a file, map required columns, and enter origin ZIP to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
