'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAnalysisStore } from '../../hooks/useAnalysisStore';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2, ArrowRight, Settings, Map } from 'lucide-react';

interface UploadResult {
  success: boolean;
  fileName?: string;
  fileSize?: number;
  columns?: string[];
  recordCount?: number;
  filePath?: string;
  fileId?: string;
  message?: string;
  error?: string;
}

interface ColumnMapping {
  [key: string]: string;
}

interface MappingProfile {
  id: string;
  name: string;
  mapping: ColumnMapping;
  createdAt: Date;
}

const REQUIRED_FIELDS = [
  { key: 'weight', label: 'Weight', placeholder: 'weight, wt, weight (oz), weight (lbs), weight (kg)' },
  { key: 'carrier_rate', label: 'Carrier Rate', placeholder: 'carrier rate, rate, cost, shipping cost, total cost, postage cost' }
];

const OPTIONAL_FIELDS = [
  { key: 'destination_zip', label: 'Destination ZIP (Optional)', placeholder: 'destination zip, dest zip, zip, postal code, postcode' },
  { key: 'length', label: 'Length (Optional)', placeholder: 'length, l, len, package length' },
  { key: 'width', label: 'Width (Optional)', placeholder: 'width, w, wid, package width' },
  { key: 'height', label: 'Height (Optional)', placeholder: 'height, h, ht, package height' },
  { key: 'zone', label: 'Zone (Optional)', placeholder: 'zone, shipping zone, delivery zone' },
  { key: 'shipment_id', label: 'Shipment ID (Optional)', placeholder: 'shipment id, order id, tracking number, reference' },
  { key: 'service_level', label: 'Service Level (Optional)', placeholder: 'service level, service type, delivery speed, priority' },
  { key: 'package_type', label: 'Package Type (Optional)', placeholder: 'package type, box type, container type' }
];

export default function UploadPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'settings' | 'ready'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>('');
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [filePath, setFilePath] = useState<string>('');
  
  // Use the global settings store instead of local state
  const { settings, setSettings } = useAnalysisStore();
  const [savedProfiles, setSavedProfiles] = useState<MappingProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  // Local state for UI (these will sync with global settings)

  // Helper function to find best match for column mapping
  const findBestMatch = (fieldKey: string, availableColumns: string[]): string => {
    const field = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].find(f => f.key === fieldKey);
    if (!field) return 'none';

    // For dimensions, be very strict about matching
    if (['length', 'width', 'height'].includes(fieldKey)) {
      const dimensionMatches = availableColumns.filter(col => {
        const colLower = col.toLowerCase();
        // Only match if it's clearly a dimension field
        return (colLower.includes('length') && fieldKey === 'length') ||
               (colLower.includes('width') && fieldKey === 'width') ||
               (colLower.includes('height') && fieldKey === 'height') ||
               (colLower.includes('dimension') && fieldKey === 'length') ||
               (colLower.includes('size') && fieldKey === 'length');
      });
      
      if (dimensionMatches.length > 0) {
        return dimensionMatches[0];
      }
      return 'none'; // Default to none for dimensions if no good match
    }

    // For weight, look for weight-related fields
    if (fieldKey === 'weight') {
      const weightMatches = availableColumns.filter(col => {
        const colLower = col.toLowerCase();
        return colLower.includes('weight') || 
               colLower.includes('wt') ||
               colLower.includes('lbs') ||
               colLower.includes('oz') ||
               colLower.includes('kg') ||
               colLower.includes('g');
      });
      
      if (weightMatches.length > 0) {
        return weightMatches[0];
      }
    }

    // For destination_zip, look for ZIP-related fields
    if (fieldKey === 'destination_zip') {
      const zipMatches = availableColumns.filter(col => {
        const colLower = col.toLowerCase();
        return colLower.includes('zip') || 
               colLower.includes('postal') ||
               colLower.includes('postcode') ||
               colLower.includes('destination') ||
               colLower.includes('dest');
      });
      
      if (zipMatches.length > 0) {
        return zipMatches[0];
      }
    }

    // For carrier_rate, look for cost/rate fields
    if (fieldKey === 'carrier_rate') {
      const costMatches = availableColumns.filter(col => {
        const colLower = col.toLowerCase();
        // Be more specific - avoid matching 'Carrier' field
        return (colLower.includes('cost') && !colLower.includes('carrier')) || 
               (colLower.includes('rate') && !colLower.includes('carrier')) ||
               (colLower.includes('fee') && !colLower.includes('carrier')) ||
               (colLower.includes('shipping') && colLower.includes('cost')) ||
               (colLower.includes('postage') && colLower.includes('cost')) ||
               (colLower.includes('total') && colLower.includes('cost'));
      });
      
      if (costMatches.length > 0) {
        return costMatches[0];
      }
    }

    // For zone, look for zone-related fields
    if (fieldKey === 'zone') {
      const zoneMatches = availableColumns.filter(col => {
        const colLower = col.toLowerCase();
        return colLower.includes('zone') || 
               colLower.includes('shipping zone') ||
               colLower.includes('delivery zone');
      });
      
      if (zoneMatches.length > 0) {
        return zoneMatches[0];
      }
    }

    // For other fields, use the existing logic
    const matches = availableColumns.filter(col => {
      const colLower = col.toLowerCase();
      return field.placeholder.toLowerCase().split(',').some(placeholder => 
        colLower.includes(placeholder.trim()) ||
        colLower.includes(field.key)
      );
    });

    return matches.length > 0 ? matches[0] : 'none';
  };

  // Load saved profiles from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('labl_iq_mapping_profiles');
    if (saved) {
      try {
        const profiles = JSON.parse(saved);
        setSavedProfiles(profiles);
      } catch (e) {
        console.error('Failed to load saved profiles:', e);
      }
    }

    // Load saved upload data from sessionStorage
    const savedUploadData = sessionStorage.getItem('labl_iq_upload_data');
    if (savedUploadData) {
      try {
        const data = JSON.parse(savedUploadData);
        if (data.filePath) {
          setFilePath(data.filePath);
          setAvailableColumns(data.columns || []);
          setColumnMapping(data.columnMapping || {});
          setUploadResult(data.uploadResult);
          setCurrentStep(data.currentStep || 'upload');
        }
      } catch (e) {
        console.error('Failed to load saved upload data:', e);
      }
    }
  }, []);

  // Save upload data to sessionStorage whenever it changes
  useEffect(() => {
    if (filePath || uploadResult || Object.keys(columnMapping).length > 0) {
      const uploadData = {
        filePath,
        columns: availableColumns,
        columnMapping,
        uploadResult,
        currentStep
      };
      sessionStorage.setItem('labl_iq_upload_data', JSON.stringify(uploadData));
    }
  }, [filePath, availableColumns, columnMapping, uploadResult, currentStep]);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (savedProfiles.length > 0) {
      localStorage.setItem('labl_iq_mapping_profiles', JSON.stringify(savedProfiles));
    }
  }, [savedProfiles]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
      // Always start at step 1 when a new file is selected
      setCurrentStep('upload');
      // Clear any saved step from session storage
      sessionStorage.removeItem('currentStep');
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
    
    if (!isValidType) {
      setError('Please select a valid CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
        setFilePath(result.filePath || '');
        
        // Use actual columns from the API response
        const columns = result.columns || [];
        setAvailableColumns(columns);
        
        // Smart column mapping based on available columns
        const suggestedMappings: ColumnMapping = {};
        
        // Find weight column (look for weight-related columns)
        const weightColumn = columns.find((col: string) => 
          col.toLowerCase().includes('weight') || 
          col.toLowerCase().includes('wt') ||
          col.toLowerCase().includes('oz') ||
          col.toLowerCase().includes('lbs')
        );
        if (weightColumn) {
          suggestedMappings.weight = weightColumn;
        }
        
        // Find carrier rate column (look for cost/rate/fee columns)
        const rateColumn = columns.find((col: string) => 
          col.toLowerCase().includes('cost') || 
          col.toLowerCase().includes('rate') ||
          col.toLowerCase().includes('fee') ||
          col.toLowerCase().includes('charge') ||
          col.toLowerCase().includes('amount') ||
          col.toLowerCase().includes('price')
        );
        if (rateColumn) {
          suggestedMappings.carrier_rate = rateColumn;
        }
        
        // Find zone column
        const zoneColumn = columns.find((col: string) => 
          col.toLowerCase().includes('zone')
        );
        if (zoneColumn) {
          suggestedMappings.zone = zoneColumn;
        }
        
        // Find destination ZIP column
        const destZipColumn = columns.find((col: string) => 
          col.toLowerCase().includes('zip') || 
          col.toLowerCase().includes('postal') ||
          col.toLowerCase().includes('destination') ||
          col.toLowerCase().includes('dest') ||
          col.toLowerCase().includes('ship postal') ||
          col.toLowerCase().includes('shipping postal')
        );
        if (destZipColumn) {
          suggestedMappings.dest_zip = destZipColumn;
        }
        
        // Find origin ZIP column (same logic for now, can be enhanced later)
        const origZipColumn = columns.find((col: string) => 
          col.toLowerCase().includes('zip') || 
          col.toLowerCase().includes('postal') ||
          col.toLowerCase().includes('origin') ||
          col.toLowerCase().includes('from') ||
          col.toLowerCase().includes('ship postal') ||
          col.toLowerCase().includes('shipping postal')
        );
        if (origZipColumn) {
          suggestedMappings.orig_zip = origZipColumn;
        }
        
        console.log('SMART MAPPING APPLIED:', suggestedMappings);
        console.log('Available columns:', columns);
        
        setColumnMapping(suggestedMappings);
        setCurrentStep('mapping');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setError('');
    setUploadProgress(0);
    setColumnMapping({});
    setAvailableColumns([]);
    setFilePath('');
    setCurrentStep('upload');
    // Clear saved data from sessionStorage
    sessionStorage.removeItem('labl_iq_upload_data');
  };

  const clearSavedData = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setColumnMapping({});
    setAvailableColumns([]);
    setFilePath('');
    setCurrentStep('upload');
    // Clear session storage
    sessionStorage.removeItem('labl_iq_upload_data');
  };

  const resetColumnMapping = () => {
    setColumnMapping({});
    // Re-run auto-mapping
    if (availableColumns.length > 0) {
      const suggestedMappings: ColumnMapping = {};
      
      // Map required fields
      REQUIRED_FIELDS.forEach(field => {
        const matchedColumn = findBestMatch(field.key, availableColumns);
        if (matchedColumn !== 'none') {
          suggestedMappings[field.key] = matchedColumn;
        }
      });
      
      // Map optional fields
      OPTIONAL_FIELDS.forEach(field => {
        const matchedColumn = findBestMatch(field.key, availableColumns);
        if (matchedColumn !== 'none') {
          suggestedMappings[field.key] = matchedColumn;
        }
      });
      
      // Manual override for known file structure
      if (availableColumns.includes('Weight')) {
        suggestedMappings.weight = 'Weight';
      }
      if (availableColumns.includes('Carrier Fee')) {
        suggestedMappings.carrier_rate = 'Carrier Fee';
      }
      if (availableColumns.includes('Zone')) {
        suggestedMappings.zone = 'Zone';
      }
      if (availableColumns.includes('Ship Postal Code')) {
        suggestedMappings.dest_zip = 'Ship Postal Code';
        suggestedMappings.orig_zip = 'Ship Postal Code';
      }
      
      setColumnMapping(suggestedMappings);
    }
  };

  const handleMappingChange = (fieldKey: string, columnName: string) => {
    if (columnName === 'none') {
      // Remove the mapping for this field
      setColumnMapping(prev => {
        const newMapping = { ...prev };
        delete newMapping[fieldKey];
        return newMapping;
      });
    } else {
      // Set the mapping for this field
      setColumnMapping(prev => ({
        ...prev,
        [fieldKey]: columnName
      }));
    }
  };

  const handleSaveProfile = () => {
    const profileName = prompt('Enter a name for this mapping profile:');
    if (profileName && Object.keys(columnMapping).length > 0) {
      const newProfile: MappingProfile = {
        id: Date.now().toString(),
        name: profileName,
        mapping: { ...columnMapping },
        createdAt: new Date()
      };
      
      setSavedProfiles(prev => [...prev, newProfile]);
      alert(`Profile "${profileName}" saved successfully!`);
    }
  };

  const handleLoadProfile = (profileId: string) => {
    const profile = savedProfiles.find(p => p.id === profileId);
    if (profile) {
      setColumnMapping(profile.mapping);
      setSelectedProfile(profileId);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
      if (selectedProfile === profileId) {
        setSelectedProfile('');
      }
    }
  };

  const handleContinueToSettings = () => {
    setCurrentStep('settings');
  };

  const handleContinueToAnalysis = () => {
    setCurrentStep('ready');
  };

const handleRunAnalysis = () => {
  const { setMapping, setSettings } = useAnalysisStore.getState();
  
  // Store mapping and settings in Zustand
  setMapping({
    weight: 'Weight',
    carrier_rate: 'Carrier Fee', // This will need to be added to your CSV
    zone: 'Zone', // This will need to be added to your CSV
    dest_zip: 'Ship Postal Code', // Use the actual column name from your CSV
    orig_zip: 'Ship Postal Code', // Use the same column for both since it's the destination
  });
  
  setSettings({
    weightUnit: settings.weightUnit,
    fuelSurchargePct: settings.fuelSurchargePct,
    markupPct: settings.markupPct,
    dimDivisor: settings.dimDivisor,
  });

  // Navigate to analysis page with only the fileId
  const params = new URLSearchParams({
    uploaded: 'true',
    fileId: uploadResult?.fileId || '', // Use fileId instead of filePath
  });
  router.push(`/analysis?${params.toString()}`);
};
  const renderUploadStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Step 1: Upload Your Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-gray-600">
                  Supports CSV, Excel (.xlsx, .xls) files up to 50MB
                </p>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer"
              >
                Choose File
              </label>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {selectedFile && !isUploading && (
            <div className="flex justify-end">
              <Button variant="black" onClick={handleUpload}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload File
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderMappingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5" />
            <span>Step 2: Map Your Columns</span>
          </div>
          <div className="flex items-center space-x-2">
            {savedProfiles.length > 0 && (
              <Select value={selectedProfile} onValueChange={handleLoadProfile}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Load saved profile" />
                </SelectTrigger>
                <SelectContent>
                  {savedProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="sm" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Saved Profiles Display */}
          {savedProfiles.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Saved Mapping Profiles</h4>
              <div className="flex flex-wrap gap-2">
                {savedProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border">
                    <span className="text-sm font-medium">{profile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoadProfile(profile.id)}
                      className="h-6 px-2 text-xs"
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Column Mapping */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Map CSV Columns to Fields</h3>
              <Button variant="outline" onClick={resetColumnMapping}>
                Reset Auto-Mapping
              </Button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Required Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REQUIRED_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Select
                      value={columnMapping[field.key] || ''}
                      onValueChange={(value) => handleMappingChange(field.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColumns.length > 0 ? (
                          availableColumns.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-columns" disabled>
                            No columns available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Suggested: {field.placeholder}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Optional Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OPTIONAL_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Select
                      value={columnMapping[field.key] || 'none'}
                      onValueChange={(value) => handleMappingChange(field.key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()} (optional)`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableColumns.length > 0 ? (
                          availableColumns.map((column) => (
                            <SelectItem key={column} value={column}>
                              {column}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-columns" disabled>
                            No columns available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Suggested: {field.placeholder}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                Back
              </Button>
              <Button variant="black" onClick={handleContinueToSettings}>
                Continue to Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSettingsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Step 3: Configure Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weightUnit">Weight Unit</Label>
              <Select value={settings.weightUnit} onValueChange={(value) => setSettings({ weightUnit: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weight unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="oz">Ounces (oz)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="g">Grams (g)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Specify the weight unit in your uploaded file
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="markup">Default Markup (%)</Label>
              <input
                type="number"
                id="markup"
                value={settings.markupPct ? settings.markupPct * 100 : 0}
                onChange={(e) => setSettings({ markupPct: parseFloat(e.target.value) / 100 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelSurcharge">Fuel Surcharge (%)</Label>
              <input
                type="number"
                id="fuelSurcharge"
                value={settings.fuelSurchargePct ? settings.fuelSurchargePct * 100 : 0}
                onChange={(e) => setSettings({ fuelSurchargePct: parseFloat(e.target.value) / 100 })}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimDivisor">Dimensional Divisor</Label>
              <input
                type="number"
                id="dimDivisor"
                value={settings.dimDivisor || 139}
                onChange={(e) => setSettings({ dimDivisor: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minMargin">Minimum Margin ($)</Label>
              <input
                type="number"
                id="minMargin"
                value={settings.minMargin || 0.5}
                onChange={(e) => setSettings({ minMargin: parseFloat(e.target.value) })}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
              Back
            </Button>
            <Button variant="black" onClick={handleContinueToAnalysis}>
              Continue to Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReadyStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Step 4: Ready for Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              File Uploaded Successfully!
            </h3>
            <p className="text-gray-600">
              Your file has been processed and is ready for analysis. Click the button below to start the rate analysis.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Upload Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">File:</span>
                <span className="ml-2 font-medium">{selectedFile?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Records:</span>
                <span className="ml-2 font-medium">{uploadResult?.recordCount || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600">Columns:</span>
                <span className="ml-2 font-medium">{availableColumns.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Mapped Fields:</span>
                <span className="ml-2 font-medium">
                  {Object.keys(columnMapping).filter(key => columnMapping[key]).length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep('settings')}>
              Back
            </Button>
            <Button variant="black" onClick={handleRunAnalysis}>
              Run Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Data</h1>
          <p className="text-gray-600 mt-2">Upload your shipping data for analysis</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['upload', 'mapping', 'settings', 'ready'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step
                      ? 'bg-black text-white'
                      : index < ['upload', 'mapping', 'settings', 'ready'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      index < ['upload', 'mapping', 'settings', 'ready'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'mapping' && renderMappingStep()}
        {currentStep === 'settings' && renderSettingsStep()}
        {currentStep === 'ready' && renderReadyStep()}
      </div>
    </div>
  );
}
