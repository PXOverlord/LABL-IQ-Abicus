
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Settings, Sliders } from 'lucide-react';

interface ConfigurationPanelProps {
  onClose: () => void;
}

export function ConfigurationPanel({ onClose }: ConfigurationPanelProps) {
  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg text-black">Settings</h3>
            <p className="text-sm text-gray-600">Configure your preferences</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
              <Sliders className="w-6 h-6 text-gray-500" />
            </div>
            <h4 className="font-medium text-black">Settings Panel</h4>
            <p className="text-sm text-gray-600 max-w-sm">
              Configuration options are currently under development and will be available in a future update.
            </p>
            <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
              Coming Soon
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
