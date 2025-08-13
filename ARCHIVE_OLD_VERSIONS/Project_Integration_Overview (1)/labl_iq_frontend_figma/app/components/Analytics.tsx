
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

export function Analytics() {
  return (
    <div className="space-y-8">
      {/* Coming Soon Placeholder */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-black">Advanced Analytics Coming Soon</h3>
          <p className="text-gray-600 max-w-md">
            Deep analytics and data insights features are currently under development and will be available in a future update.
          </p>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            In Development
          </Badge>
        </div>
      </div>
    </div>
  );
}
