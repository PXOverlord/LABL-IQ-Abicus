
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarChart3, FileText, Download, Upload } from 'lucide-react';

interface AnalysisResultsProps {
  analysisId: string | null;
}

export function AnalysisResults({ analysisId }: AnalysisResultsProps) {
  if (!analysisId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-black">No Analysis Selected</h3>
          <p className="text-gray-600 max-w-md">
            Upload shipping data to begin analysis and see detailed results here.
          </p>
          <Button className="bg-black text-white hover:bg-gray-800">
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-black">Analysis Results</h2>
          <p className="text-gray-600">Detailed shipping rate analysis and optimization recommendations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-black">Analysis In Progress</h3>
          <p className="text-gray-600 max-w-md">
            This feature is currently under development. Your analysis results will be displayed here once processing is complete.
          </p>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            Coming Soon
          </Badge>
        </div>
      </div>
    </div>
  );
}
