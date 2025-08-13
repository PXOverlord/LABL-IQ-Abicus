'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, CheckCircle, ArrowRight, Save } from 'lucide-react';

interface ColumnMapping {
  [key: string]: string;
}

interface MappingPageProps {
  analysisId?: string;
  columns?: string[];
}

const REQUIRED_FIELDS = [
  { key: 'weight', label: 'Weight (lbs)', description: 'Package weight in pounds' },
  { key: 'length', label: 'Length (in)', description: 'Package length in inches' },
  { key: 'width', label: 'Width (in)', description: 'Package width in inches' },
  { key: 'height', label: 'Height (in)', description: 'Package height in inches' },
  { key: 'from_zip', label: 'Origin ZIP', description: 'Origin ZIP code' },
  { key: 'to_zip', label: 'Destination ZIP', description: 'Destination ZIP code' },
  { key: 'carrier_rate', label: 'Carrier Rate', description: 'Current carrier rate' }
];

const OPTIONAL_FIELDS = [
  { key: 'shipment_id', label: 'Shipment ID', description: 'Unique shipment identifier' },
  { key: 'service_level', label: 'Service Level', description: 'Shipping service level' },
  { key: 'package_type', label: 'Package Type', description: 'Type of package' }
];

export default function MappingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [suggestedMapping, setSuggestedMapping] = useState<ColumnMapping>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (analysisId) {
      loadAnalysisData(analysisId);
    } else {
      setError('No analysis ID provided');
      setIsLoading(false);
    }
  }, [analysisId]);

  const loadAnalysisData = async (id: string) => {
    try {
      // In a real app, this would fetch from your backend
      // For now, we'll simulate the data
      const mockColumns = [
        'Weight (lbs)', 'Length (in)', 'Width (in)', 'Height (in)',
        'Origin ZIP', 'Destination ZIP', 'Carrier Rate', 'Shipment ID',
        'Service Level', 'Package Type', 'Order Date', 'Customer Name'
      ];
      
      setColumns(mockColumns);
      
      // Generate suggested mapping
      const suggestions: ColumnMapping = {};
      REQUIRED_FIELDS.forEach(field => {
        const match = mockColumns.find(col => 
          col.toLowerCase().includes(field.key.toLowerCase()) ||
          col.toLowerCase().includes(field.label.toLowerCase().split(' ')[0].toLowerCase())
        );
        if (match) {
          suggestions[field.key] = match;
        }
      });
      
      setSuggestedMapping(suggestions);
      setMapping(suggestions);
      
    } catch (err) {
      setError('Failed to load analysis data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (fieldKey: string, columnName: string) => {
    if (columnName === 'none') {
      // Remove the mapping for this field
      setMapping(prev => {
        const newMapping = { ...prev };
        delete newMapping[fieldKey];
        return newMapping;
      });
    } else {
      // Set the mapping for this field
      setMapping(prev => ({
        ...prev,
        [fieldKey]: columnName
      }));
    }
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    
    try {
      // Validate required fields
      const missingFields = REQUIRED_FIELDS.filter(field => !mapping[field.key]);
      
      if (missingFields.length > 0) {
        setError(`Please map the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
        setIsProcessing(false);
        return;
      }

      // In a real app, this would save the mapping to your backend
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to analysis page
      router.push(`/analysis?analysisId=${analysisId}`);
      
    } catch (err) {
      setError('Failed to process mapping');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveMapping = () => {
    // In a real app, this would save the mapping as a profile
    console.log('Saving mapping:', mapping);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading analysis data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !columns.length) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Column Mapping</h1>
          <p className="text-muted-foreground mt-2">
            Map your file columns to the required fields for analysis
          </p>
        </div>

        <div className="grid gap-6">
          {/* Required Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Required Fields
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                These fields are necessary for rate calculation and analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {REQUIRED_FIELDS.map((field) => (
                  <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <Label htmlFor={field.key} className="font-medium">
                        {field.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {field.description}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Select
                        value={mapping[field.key] || 'none'}
                        onValueChange={(value) => handleMappingChange(field.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {columns.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optional Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Optional Fields</CardTitle>
              <p className="text-sm text-muted-foreground">
                These fields provide additional information for enhanced analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {OPTIONAL_FIELDS.map((field) => (
                  <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <Label htmlFor={field.key} className="font-medium">
                        {field.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {field.description}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <Select
                        value={mapping[field.key] || ''}
                        onValueChange={(value) => handleMappingChange(field.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a column (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {columns.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleSaveMapping}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Mapping
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Continue to Analysis
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
