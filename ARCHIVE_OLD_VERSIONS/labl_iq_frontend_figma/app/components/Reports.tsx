
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-8">
      {/* Coming Soon Placeholder */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-black">Reports Coming Soon</h3>
          <p className="text-gray-600 max-w-md">
            Comprehensive reporting features are currently under development and will be available in a future update.
          </p>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            In Development
          </Badge>
        </div>
      </div>
    </div>
  );
}
