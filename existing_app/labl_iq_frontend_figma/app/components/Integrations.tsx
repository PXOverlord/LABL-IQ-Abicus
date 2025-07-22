
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link2, Zap, Globe } from 'lucide-react';

export function Integrations() {
  return (
    <div className="space-y-8">
      {/* Coming Soon Placeholder */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto">
            <Link2 className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-medium text-black">Integrations Coming Soon</h3>
          <p className="text-gray-600 max-w-md">
            Third-party integrations with carriers, e-commerce platforms, and business tools are currently under development.
          </p>
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
            In Development
          </Badge>
        </div>
      </div>
    </div>
  );
}
