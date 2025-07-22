
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Truck, Calculator, Package, BarChart3 } from 'lucide-react';

export function ShippingTools() {
  return (
    <div className="space-y-8">
      {/* Coming Soon Placeholder */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-medium text-black">Shipping Tools Coming Soon</h3>
          <p className="text-gray-600 max-w-md">
            Advanced shipping tools and calculators are currently under development and will be available in a future update.
          </p>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
            In Development
          </Badge>
        </div>
      </div>
    </div>
  );
}
