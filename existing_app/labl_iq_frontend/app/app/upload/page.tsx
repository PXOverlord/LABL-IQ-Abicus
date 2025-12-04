'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAnalysisStore } from '../../hooks/useAnalysisStore';
import { analysisAPI, ColumnMapping } from '../../lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2, ArrowRight, Settings, Map } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../lib/stores/auth-store';
import { useProfilesStore } from '../../lib/stores/profiles-store';

interface UploadResult {
  analysisId: string;
  fileName?: string;
  fileSize?: number;
  columns?: string[];
  suggestedMappings?: Record<string, string>;
  message?: string;
}

const REQUIRED_FIELDS = [
  { key: 'weight', label: 'Weight', placeholder: 'weight, wt, weight (oz), weight (lbs), weight (kg)' },
  { key: 'rate', label: 'Carrier Rate', placeholder: 'carrier rate, rate, cost, shipping cost, total cost, postage cost' }
];

const OPTIONAL_FIELDS = [
  { key: 'from_zip', label: 'Origin ZIP (Optional)', placeholder: 'origin zip, from zip, ship from' },
  { key: 'to_zip', label: 'Destination ZIP (Optional)', placeholder: 'destination zip, dest zip, ship postal, postal code' },
  { key: 'length', label: 'Length (Optional)', placeholder: 'length, l, dim1' },
  { key: 'width', label: 'Width (Optional)', placeholder: 'width, w, dim2' },
  { key: 'height', label: 'Height (Optional)', placeholder: 'height, h, dim3' },
  { key: 'zone', label: 'Zone (Optional)', placeholder: 'zone, shipping zone, delivery zone' },
  { key: 'carrier', label: 'Carrier (Optional)', placeholder: 'carrier, shipper, shipping company' },
  { key: 'service_level', label: 'Service Level (Optional)', placeholder: 'service level, service type, delivery speed' },
  { key: 'package_type', label: 'Package Type (Optional)', placeholder: 'package type, box type, container type' },
  { key: 'shipment_id', label: 'Shipment ID (Optional)', placeholder: 'shipment id, order id, tracking number, reference' }
];

const normalizeMappingForColumns = (candidate: Record<string, string> | undefined | null, columns: string[]): ColumnMapping => {
  const normalized: ColumnMapping = {};
  if (!candidate) {
    return normalized;
  }
  Object.entries(candidate).forEach(([key, value]) => {
    if (value && columns.includes(value)) {
      normalized[key as keyof ColumnMapping] = value;
    }
  });
  return normalized;
};

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStep = searchParams.get('step');
  const queryAnalysisId = searchParams.get('analysisId');
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'settings' | 'ready'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const previousAnalysisId = useRef<string | null>(null);
  
  // Use the global settings store instead of local state
  const { settings, setSettings } = useAnalysisStore();
  const {
    settings: userSettings,
    isSettingsLoading: isUserSettingsLoading,
    fetchSettings,
    updateSettings: persistUserSettings,
  } = useAuthStore();
  const hasLoadedUserSettings = useRef(false);
  const lastAppliedSettings = useRef<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [isSavingDefaults, setIsSavingDefaults] = useState(false);
  const {
    profiles,
    isLoading: profilesLoading,
    fetchProfiles: loadProfiles,
    createProfile,
    deleteProfile: removeProfile,
  } = useProfilesStore();
  const hasLoadedProfiles = useRef(false);
  // Local state for UI (these will sync with global settings)

  const hydrateExistingAnalysis = useCallback(async (id: string) => {
    try {
      const [details, analysis] = await Promise.all([
        analysisAPI.getUploadDetails(id),
        analysisAPI.getResults(id).catch(() => null),
      ]);

      setUploadResult({
        analysisId: details.analysisId,
        fileName: details.fileName,
        fileSize: details.fileSize,
        columns: details.columns,
        suggestedMappings: details.suggestedMappings,
        message: details.message,
      });

      const available = details.columns ?? [];
      setAvailableColumns(available);
      const suggested = normalizeMappingForColumns(details.suggestedMappings, available);
      const existing =
        analysis && analysis.columnMapping && Object.keys(analysis.columnMapping).length
          ? normalizeMappingForColumns(analysis.columnMapping as Record<string, string>, available)
          : suggested;
      setColumnMapping(existing);
      setSelectedProfile('');
      setError('');
    } catch (err) {
      console.error('Failed to hydrate existing analysis', err);
      setError('Unable to load existing analysis context. You may need to re-upload the file.');
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedUserSettings.current) {
      fetchSettings().catch(() => {
        /* ignore */
      });
      hasLoadedUserSettings.current = true;
    }
  }, [fetchSettings]);

  useEffect(() => {
    if (!userSettings) return;
    const marker = userSettings.updatedAt ?? JSON.stringify(userSettings);
    if (lastAppliedSettings.current === marker) {
      return;
    }
    lastAppliedSettings.current = marker;

    const current = useAnalysisStore.getState().settings;
    const next = {
      weightUnit: current.weightUnit || 'oz',
      origin_zip: userSettings.originZip || current.origin_zip || '',
      markupPct:
        typeof userSettings.defaultMarkup === 'number'
          ? userSettings.defaultMarkup / 100
          : current.markupPct ?? 0.1,
      fuelSurchargePct:
        typeof userSettings.fuelSurcharge === 'number'
          ? userSettings.fuelSurcharge / 100
          : current.fuelSurchargePct ?? 0.16,
      dimDivisor: userSettings.dimDivisor ?? current.dimDivisor ?? 139,
      das_surcharge: userSettings.dasSurcharge ?? current.das_surcharge ?? 1.98,
      edas_surcharge: userSettings.edasSurcharge ?? current.edas_surcharge ?? 3.92,
      remote_surcharge: userSettings.remoteSurcharge ?? current.remote_surcharge ?? 14.15,
    } as Partial<typeof current>;

    const changed = Object.entries(next).some(([key, value]) => current[key as keyof typeof current] !== value);
    if (!changed) {
      return;
    }

    setSettings(next);
  }, [userSettings, setSettings]);

  useEffect(() => {
    if (hasLoadedProfiles.current) return;
    loadProfiles()
      .then(() => {
        hasLoadedProfiles.current = true;
      })
      .catch(() => {
        hasLoadedProfiles.current = true;
      });
  }, [loadProfiles]);

  useEffect(() => {
    if (!queryAnalysisId) {
      return;
    }
    if (previousAnalysisId.current === queryAnalysisId) {
      return;
    }
    previousAnalysisId.current = queryAnalysisId;
    setAnalysisId(queryAnalysisId);
    hydrateExistingAnalysis(queryAnalysisId).catch(() => {
      /* errors handled inside helper */
    });
  }, [queryAnalysisId, hydrateExistingAnalysis]);

  useEffect(() => {
    if (!queryStep) {
      return;
    }
    if (queryStep === 'upload' || queryStep === 'mapping' || queryStep === 'settings' || queryStep === 'ready') {
      setCurrentStep(queryStep);
    }
  }, [queryStep]);

  useEffect(() => {
    if (queryAnalysisId && !queryStep) {
      setCurrentStep((prev) => (prev === 'upload' ? 'mapping' : prev));
    }
  }, [queryAnalysisId, queryStep]);

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
    if (fieldKey === 'to_zip') {
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

    // For origin ZIP
    if (fieldKey === 'from_zip') {
      const originMatches = availableColumns.filter(col => {
        const colLower = col.toLowerCase();
        return (colLower.includes('origin') || colLower.includes('from')) &&
               (colLower.includes('zip') || colLower.includes('postal') || colLower.includes('code'));
      });

      if (originMatches.length > 0) {
        return originMatches[0];
      }
    }

    // For rate, look for cost/rate fields
    if (fieldKey === 'rate') {
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
      const result = await analysisAPI.upload(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadProgress(100);

      setAnalysisId(result.analysisId);
      setUploadResult(result);

      const columns = result.columns || [];
      setAvailableColumns(columns);

      let suggestedMappings = result.suggestedMappings || {};
      if (!suggestedMappings || Object.keys(suggestedMappings).length === 0) {
        suggestedMappings = {};
        REQUIRED_FIELDS.concat(OPTIONAL_FIELDS).forEach(({ key }) => {
          const match = findBestMatch(key, columns);
          if (match !== 'none') {
            suggestedMappings[key] = match;
          }
        });
      }

      setColumnMapping(suggestedMappings);
      setCurrentStep('mapping');
    } catch (err) {
      console.error('Upload failed', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Upload failed. Please ensure you are logged in and try again.'
      );
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
    setAnalysisId(null);
    setCurrentStep('upload');
  };

  const clearSavedData = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setColumnMapping({});
    setAvailableColumns([]);
    setAnalysisId(null);
    setCurrentStep('upload');
  };

  const resetColumnMapping = () => {
    setColumnMapping({});
    // Re-run auto-mapping
    if (availableColumns.length > 0) {
      const suggestedMappings: Record<string, string> = {};
      
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
        suggestedMappings.rate = 'Carrier Fee';
      }
      if (availableColumns.includes('Zone')) {
        suggestedMappings.zone = 'Zone';
      }
      if (availableColumns.includes('Ship Postal Code')) {
        suggestedMappings.to_zip = 'Ship Postal Code';
      }
      
      setColumnMapping(suggestedMappings as ColumnMapping);
    }
  };

  const handleMappingChange = (fieldKey: string, columnName: string) => {
    if (columnName === 'none') {
      // Remove the mapping for this field
      setColumnMapping(prev => {
        const newMapping: Record<string, string> = { ...prev } as Record<string, string>;
        delete newMapping[fieldKey];
        return newMapping;
      });
    } else {
      // Set the mapping for this field
      setColumnMapping(prev => ({
        ...(prev as Record<string, string>),
        [fieldKey]: columnName,
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!columnMapping || Object.keys(columnMapping).length === 0) {
      toast.error('Map at least one column before saving a profile');
      return;
    }
    const profileName = prompt('Enter a name for this mapping profile:');
    if (!profileName) return;

    try {
      const newProfile = await createProfile({
        name: profileName,
        mapping: { ...columnMapping },
      });
      setSelectedProfile(newProfile.id);
      toast.success(`Profile "${profileName}" saved`);
    } catch (error) {
      console.error('Failed to save profile', error);
      toast.error('Failed to save profile');
    }
  };

  const handleLoadProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setColumnMapping(profile.mapping);
      setSelectedProfile(profileId);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    removeProfile(profileId)
      .then(() => {
        if (selectedProfile === profileId) {
          setSelectedProfile('');
        }
        toast.success('Profile deleted');
      })
      .catch((error) => {
        console.error('Failed to delete profile', error);
        toast.error('Failed to delete profile');
      });
  };

  const handleContinueToSettings = async () => {
    if (!analysisId) {
      setError('No analysis ID found. Please upload a file first.');
      return;
    }

    const mappingRecord: Record<string, string | undefined> = {
      ...(columnMapping as Record<string, string | undefined>),
    };

    // Ensure required mappings are provided
    for (const field of REQUIRED_FIELDS) {
      if (!mappingRecord[field.key]) {
        setError(`Please map a column for ${field.label}.`);
        return;
      }
    }

    try {
      setError('');
      await analysisAPI.mapColumns(analysisId, columnMapping);
      setCurrentStep('settings');
    } catch (err) {
      console.error('Column mapping failed', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to map columns. Ensure you are authenticated and try again.'
      );
    }
  };

  const handleContinueToAnalysis = () => {
    if (!analysisId) {
      setError('Upload and map your file before continuing to analysis.');
      return;
    }
    setError('');
    setCurrentStep('ready');
  };

  const handleSaveDefaults = async () => {
    if (isSavingDefaults || isUserSettingsLoading) return;
    try {
      setIsSavingDefaults(true);
      await persistUserSettings({
        originZip: settings.origin_zip,
        defaultMarkup: typeof settings.markupPct === 'number' ? settings.markupPct * 100 : undefined,
        fuelSurcharge: typeof settings.fuelSurchargePct === 'number' ? settings.fuelSurchargePct * 100 : undefined,
        dasSurcharge: settings.das_surcharge,
        edasSurcharge: settings.edas_surcharge,
        remoteSurcharge: settings.remote_surcharge,
        dimDivisor: settings.dimDivisor,
      });
      toast.success('Default settings saved');
    } catch (err) {
      console.error('Failed to save default settings', err);
      toast.error('Failed to save default settings');
    } finally {
      setIsSavingDefaults(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!analysisId) {
      setError('No analysis ID found. Please upload and map your file first.');
      return;
    }

    setIsAnalyzing(true);

    const { setSettings, loadHistory } = useAnalysisStore.getState();

    const completeSettings = {
      weightUnit: settings.weightUnit,
      fuelSurchargePct: settings.fuelSurchargePct,
      markupPct: settings.markupPct,
      dimDivisor: settings.dimDivisor,
      minMargin: settings.minMargin,
      merchant: settings.merchant,
      origin_zip: settings.origin_zip,
      das_surcharge: settings.das_surcharge ?? settings.dasSurcharge ?? 1.98,
      edas_surcharge: settings.edas_surcharge ?? settings.edasSurcharge ?? 3.92,
      remote_surcharge: settings.remote_surcharge ?? settings.remoteSurcharge ?? 14.15,
      serviceLevel: (settings as any).serviceLevel || 'standard',
    } as any;
    setSettings(completeSettings);

    try {
      setError('');

      const markupPercent = typeof completeSettings.markupPct === 'number'
        ? completeSettings.markupPct * 100
        : undefined;
      const fuelSurcharge = typeof completeSettings.fuelSurchargePct === 'number'
        ? completeSettings.fuelSurchargePct * 100
        : undefined;

      await analysisAPI.process(analysisId, {
        amazonRate: 0.5,
        fuelSurcharge,
        markupPercent,
        serviceLevel: completeSettings.serviceLevel || 'standard',
        useAdvancedSettings: true,
      });

      if (completeSettings.merchant !== undefined) {
        await analysisAPI.updateMetadata(analysisId, { merchant: completeSettings.merchant || undefined });
      }

      await loadHistory().catch(() => {});
      router.push(`/analysis/${analysisId}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      const message = error instanceof Error
        ? error.message
        : 'Analysis failed. Please ensure you are authenticated and try again.';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
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
            {profiles.length > 0 && (
              <Select value={selectedProfile} onValueChange={handleLoadProfile}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Load saved profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
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
          {profilesLoading ? (
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
              Loading saved profiles…
            </div>
          ) : profiles.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Saved Mapping Profiles</h4>
              <div className="flex flex-wrap gap-2">
                {profiles.map((profile) => (
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
          ) : null}

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
              <Label htmlFor="originZip">Origin ZIP</Label>
              <input
                type="text"
                id="originZip"
                value={settings.origin_zip || ''}
                onChange={(e) => setSettings({ origin_zip: e.target.value })}
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">Default origin ZIP for surcharge calculations</p>
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant Name</Label>
              <input
                type="text"
                id="merchant"
                value={settings.merchant || ''}
                onChange={(e) => setSettings({ merchant: e.target.value })}
                placeholder="Enter merchant name (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Name of the merchant for this analysis
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDefaults}
              disabled={isSavingDefaults || isUserSettingsLoading}
            >
              {isSavingDefaults ? 'Saving…' : 'Save as Default'}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
                Back
              </Button>
              <Button variant="black" onClick={handleContinueToAnalysis}>
                Continue to Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {isUserSettingsLoading ? (
            <p className="text-xs text-gray-500">Loading your saved defaults…</p>
          ) : null}

          <p className="text-xs text-gray-400">
            Changes made here apply to this analysis. Use “Save as Default” to persist your preferences for future uploads.
          </p>
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
                <span className="text-gray-600">File size:</span>
                <span className="ml-2 font-medium">
                  {uploadResult?.fileSize ? `${(uploadResult.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                </span>
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
              <div>
                <span className="text-gray-600">Analysis ID:</span>
                <span className="ml-2 font-medium">{analysisId || 'Pending'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setCurrentStep('settings')}>
              Back
            </Button>
            <Button variant="black" onClick={handleRunAnalysis} disabled={isAnalyzing || !analysisId}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Analysis...
                </>
              ) : (
                <>
                  Run Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
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
