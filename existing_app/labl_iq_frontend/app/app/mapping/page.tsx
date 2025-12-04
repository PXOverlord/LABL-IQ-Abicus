'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { analysisAPI, type AnalysisUploadResponse, type ColumnMapping } from '../../lib/api';
import { useProfilesStore } from '../../lib/stores/profiles-store';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Save,
  Loader2,
  RefreshCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';

const PROFILE_SUGGESTION = '__suggested';

type FieldDefinition = {
  key: keyof ColumnMapping;
  label: string;
  description: string;
  required?: boolean;
};

const REQUIRED_FIELDS: FieldDefinition[] = [
  { key: 'weight', label: 'Weight', description: 'Package weight (lbs, oz, kg, g supported).', required: true },
  { key: 'rate', label: 'Carrier Rate', description: 'Current carrier rate or total shipment cost.', required: true },
];

const OPTIONAL_FIELDS: FieldDefinition[] = [
  { key: 'from_zip', label: 'Origin ZIP', description: 'Origin ZIP code for surcharge lookups.' },
  { key: 'to_zip', label: 'Destination ZIP', description: 'Destination ZIP code for zone lookups.' },
  { key: 'length', label: 'Length', description: 'Package length (inches).' },
  { key: 'width', label: 'Width', description: 'Package width (inches).' },
  { key: 'height', label: 'Height', description: 'Package height (inches).' },
  { key: 'zone', label: 'Zone', description: 'Carrier zone (optional if ZIP codes provided).' },
  { key: 'carrier', label: 'Carrier', description: 'Carrier or service provider name.' },
  { key: 'service_level', label: 'Service Level', description: 'Shipping service level (standard, expedited, etc.).' },
  { key: 'package_type', label: 'Package Type', description: 'Box, envelope, pallet, etc.' },
  { key: 'shipment_id', label: 'Shipment ID', description: 'Tracking number or internal shipment identifier.' },
];

const sanitizeMapping = (mapping: ColumnMapping): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  Object.entries(mapping).forEach(([key, value]) => {
    if (value) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

const normalizeMapping = (candidate: ColumnMapping | undefined, availableColumns: string[]): ColumnMapping => {
  const normalized: ColumnMapping = {};
  if (!candidate) {
    return normalized;
  }
  Object.entries(candidate).forEach(([key, value]) => {
    if (value && availableColumns.includes(value)) {
      normalized[key as keyof ColumnMapping] = value;
    }
  });
  return normalized;
};

function MappingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('analysisId');

  const [uploadInfo, setUploadInfo] = useState<AnalysisUploadResponse | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [suggestedMapping, setSuggestedMapping] = useState<ColumnMapping>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [profileNotice, setProfileNotice] = useState<string>('');

  const {
    profiles,
    profilesLoading,
    fetchProfiles,
    createProfile,
    deleteProfile: removeProfile,
  } = useProfilesStore((state) => ({
    profiles: state.profiles,
    profilesLoading: state.isLoading,
    fetchProfiles: state.fetchProfiles,
    createProfile: state.createProfile,
    deleteProfile: state.deleteProfile,
  }));

  useEffect(() => {
    void fetchProfiles();
  }, [fetchProfiles]);

  const loadAnalysisData = useCallback(async () => {
    if (!analysisId) {
      setError('No analysis ID provided');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setRowCount(null);
    setProfileNotice('');

    try {
      const [details, analysis] = await Promise.all([
        analysisAPI.getUploadDetails(analysisId),
        analysisAPI.getResults(analysisId).catch(() => null),
      ]);

      setUploadInfo(details);
      const availableColumns = details.columns ?? [];
      setColumns(availableColumns);

      const suggested = normalizeMapping(details.suggestedMappings, availableColumns);
      setSuggestedMapping(suggested);

      let initialMapping = suggested;
      if (analysis && analysis.columnMapping && Object.keys(analysis.columnMapping).length) {
        const normalized = normalizeMapping(analysis.columnMapping as ColumnMapping, availableColumns);
        initialMapping = normalized;
        if (Object.keys(normalized).length < Object.keys(analysis.columnMapping || {}).length) {
          setProfileNotice('Some previously saved mappings could not be applied because their columns were not found in this file.');
        }
      }

      setMapping(initialMapping);
      if (analysis && analysis.columnMapping && Object.keys(initialMapping).length) {
        setSuccessMessage('Existing column mapping loaded. Save again if you make changes.');
        setRowCount(null);
      }
    } catch (err) {
      console.error('Failed to load analysis data', err);
      setError(err instanceof Error ? err.message : 'Failed to load analysis data');
    } finally {
      setIsLoading(false);
    }
  }, [analysisId]);

  useEffect(() => {
    void loadAnalysisData();
  }, [loadAnalysisData]);

  const missingRequired = useMemo(() => {
    return REQUIRED_FIELDS.filter((field) => !mapping[field.key]);
  }, [mapping]);

  const duplicateColumns = useMemo(() => {
    const counts = new Map<string, number>();
    Object.values(mapping).forEach((column) => {
      if (!column) return;
      counts.set(column, (counts.get(column) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([column]) => column);
  }, [mapping]);

  const handleMappingChange = useCallback((fieldKey: keyof ColumnMapping, columnName: string) => {
    setMapping((prev) => {
      const next = { ...prev };
      if (columnName === 'none') {
        delete next[fieldKey];
      } else {
        next[fieldKey] = columnName;
      }
      return next;
    });
    setSelectedProfile('');
    setSuccessMessage('');
    setRowCount(null);
    setError('');
    setProfileNotice('');
  }, []);

  const handleRestoreSuggestions = () => {
    setMapping(normalizeMapping(suggestedMapping, columns));
    setSelectedProfile('');
    setSuccessMessage('');
    setRowCount(null);
    setProfileNotice('');
  };

  const handleSelectProfile = async (profileId: string) => {
    if (profileId === PROFILE_SUGGESTION) {
      handleRestoreSuggestions();
      return;
    }

    const profile = profiles.find((p) => p.id === profileId);
    if (!profile) {
      return;
    }

    const normalized = normalizeMapping(profile.mapping as ColumnMapping, columns);
    setMapping(normalized);
    setSelectedProfile(profileId);
    setSuccessMessage('');
    setRowCount(null);
    if (Object.keys(normalized).length < Object.keys(profile.mapping || {}).length) {
      setProfileNotice('Some fields from this profile were ignored because the file does not include those columns.');
    } else {
      setProfileNotice('');
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Delete this saved mapping profile?')) {
      return;
    }

    try {
      await removeProfile(profileId);
      if (selectedProfile === profileId) {
        setSelectedProfile('');
      }
      setSuccessMessage('Mapping profile deleted.');
    } catch (err) {
      console.error('Failed to delete profile', err);
      setError('Failed to delete profile. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    const sanitized = sanitizeMapping(mapping);
    if (Object.keys(sanitized).length === 0) {
      setError('Map at least one column before saving the profile.');
      return;
    }

    const name = prompt('Enter a name for this mapping profile:');
    if (!name) {
      return;
    }

    try {
      setIsSavingProfile(true);
      const profile = await createProfile({ name, mapping: sanitized });
      setSelectedProfile(profile.id);
      setSuccessMessage('Mapping saved as a profile.');
      setError('');
    } catch (err) {
      console.error('Failed to save profile', err);
      setError(err instanceof Error ? err.message : 'Failed to save mapping profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleMapColumns = async () => {
    if (!analysisId) {
      setError('No analysis ID provided.');
      return;
    }

    if (missingRequired.length > 0) {
      setError(`Please map the following required fields: ${missingRequired.map((field) => field.label).join(', ')}`);
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccessMessage('');
    setRowCount(null);

    try {
      const response = await analysisAPI.mapColumns(analysisId, mapping);
      setSuccessMessage(response.message ?? 'Columns mapped successfully.');
      setRowCount(typeof response.rowCount === 'number' ? response.rowCount : null);
    } catch (err) {
      console.error('Failed to map columns', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to map columns. Please ensure you are authenticated and try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueToSettings = () => {
    if (!analysisId) {
      return;
    }
    router.push(`/upload?analysisId=${analysisId}&step=settings`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground">Loading uploaded file details…</p>
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
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Column Mapping</h1>
          <p className="text-muted-foreground">
            Map your file columns to the required fields before running rate analysis.
          </p>
          {uploadInfo ? (
            <p className="text-xs text-muted-foreground">
              File: <span className="font-medium">{uploadInfo.fileName}</span> — {columns.length} columns detected
            </p>
          ) : null}
        </header>

        {profileNotice ? (
          <Alert className="border-amber-200 bg-amber-50">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">{profileNotice}</AlertDescription>
          </Alert>
        ) : null}

        {duplicateColumns.length > 0 ? (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              These columns are mapped more than once: {duplicateColumns.join(', ')}. Consider adjusting to avoid overrides.
            </AlertDescription>
          </Alert>
        ) : null}

        {missingRequired.length > 0 ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Required fields missing: {missingRequired.map((field) => field.label).join(', ')}.
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Saved Profiles
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Apply a saved mapping profile or use the suggested mapping from the upload.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={selectedProfile || ''}
                onValueChange={handleSelectProfile}
                disabled={profilesLoading || !profiles.length}
              >
                <SelectTrigger className="w-60">
                  <SelectValue placeholder={profilesLoading ? 'Loading profiles…' : 'Apply saved profile'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PROFILE_SUGGESTION}>Suggested mapping</SelectItem>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProfile ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteProfile(selectedProfile)}
                  title="Delete selected profile"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
              <Button
                variant="outline"
                onClick={handleRestoreSuggestions}
                disabled={columns.length === 0}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Restore suggestions
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveProfile}
                disabled={isSavingProfile || columns.length === 0}
                className="flex items-center gap-2"
              >
                {isSavingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save as profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Required fields
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These fields are required before the analysis can run.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {REQUIRED_FIELDS.map((field) => (
              <div key={field.key} className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
                <div>
                  <Label htmlFor={field.key} className="font-medium">
                    {field.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{field.description}</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optional fields</CardTitle>
            <p className="text-sm text-muted-foreground">
              Map optional fields to unlock more detailed reporting and surcharge insights.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {OPTIONAL_FIELDS.map((field) => (
              <div key={field.key} className="grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
                <div>
                  <Label htmlFor={field.key} className="font-medium">
                    {field.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                </div>
                <div className="md:col-span-2">
                  <Select
                    value={mapping[field.key] || 'none'}
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
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Mapped fields: {Object.keys(sanitizeMapping(mapping)).length} • Required remaining: {missingRequired.length}
            </p>
            {rowCount != null ? (
              <p>Preview rows processed: {rowCount}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleMapColumns}
              disabled={isProcessing || columns.length === 0}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Save mapping
            </Button>
            <Button
              onClick={handleContinueToSettings}
              disabled={!successMessage || isProcessing}
              className="flex items-center gap-2"
            >
              Configure settings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              {successMessage}
              {rowCount != null ? ` • ${rowCount} preview rows validated.` : ''}
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}

export default function MappingPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <MappingPageContent />
    </Suspense>
  );
}
