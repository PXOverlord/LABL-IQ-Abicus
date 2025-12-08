
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuthStore } from '../../lib/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, Save } from 'lucide-react';

type FormState = {
  originZip: string;
  defaultMarkup: number;
  fuelSurcharge: number;
  dasSurcharge: number;
  edasSurcharge: number;
  remoteSurcharge: number;
  dimDivisor: number;
  standardMarkup: number;
  expeditedMarkup: number;
  priorityMarkup: number;
  nextDayMarkup: number;
};

const DEFAULT_FORM: FormState = {
  originZip: '',
  defaultMarkup: 10,
  fuelSurcharge: 16,
  dasSurcharge: 1.98,
  edasSurcharge: 3.92,
  remoteSurcharge: 14.15,
  dimDivisor: 139,
  standardMarkup: 0,
  expeditedMarkup: 10,
  priorityMarkup: 15,
  nextDayMarkup: 25,
};

const numberFields: Array<keyof FormState> = [
  'defaultMarkup',
  'fuelSurcharge',
  'dasSurcharge',
  'edasSurcharge',
  'remoteSurcharge',
  'dimDivisor',
  'standardMarkup',
  'expeditedMarkup',
  'priorityMarkup',
  'nextDayMarkup',
];

export default function SettingsPage() {
  const settings = useAuthStore((state) => state.settings);
  const isSettingsLoading = useAuthStore((state) => state.isSettingsLoading);
  const fetchSettings = useAuthStore((state) => state.fetchSettings);
  const updateSettings = useAuthStore((state) => state.updateSettings);

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const lastAppliedSnapshot = useRef<string | null>(null);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchSettings().catch((err) => {
      console.error('Failed to load user settings', err);
      setError('Unable to load settings. Please refresh the page.');
    });
  }, [fetchSettings]);

  useEffect(() => {
    if (!settings) return;
    const snapshot = JSON.stringify(settings);
    if (lastAppliedSnapshot.current === snapshot) return;
    lastAppliedSnapshot.current = snapshot;

    const mapped: FormState = {
      originZip: settings.originZip || '',
      defaultMarkup: settings.defaultMarkup ?? DEFAULT_FORM.defaultMarkup,
      fuelSurcharge: settings.fuelSurcharge ?? DEFAULT_FORM.fuelSurcharge,
      dasSurcharge: settings.dasSurcharge ?? DEFAULT_FORM.dasSurcharge,
      edasSurcharge: settings.edasSurcharge ?? DEFAULT_FORM.edasSurcharge,
      remoteSurcharge: settings.remoteSurcharge ?? DEFAULT_FORM.remoteSurcharge,
      dimDivisor: settings.dimDivisor ?? DEFAULT_FORM.dimDivisor,
      standardMarkup: settings.standardMarkup ?? DEFAULT_FORM.standardMarkup,
      expeditedMarkup: settings.expeditedMarkup ?? DEFAULT_FORM.expeditedMarkup,
      priorityMarkup: settings.priorityMarkup ?? DEFAULT_FORM.priorityMarkup,
      nextDayMarkup: settings.nextDayMarkup ?? DEFAULT_FORM.nextDayMarkup,
    };

    setForm(mapped);
  }, [settings]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    if (field === 'originZip') {
      setForm((prev) => ({ ...prev, originZip: value }));
      return;
    }

    const numeric = Number(value);
    setForm((prev) => ({
      ...prev,
      [field]: Number.isFinite(numeric) ? numeric : prev[field],
    }));
  };

  const hasChanges = useMemo(() => {
    if (!settings) return true;
    return (
      form.originZip !== (settings.originZip || '') ||
      numberFields.some((field) => form[field] !== (settings[field] ?? DEFAULT_FORM[field]))
    );
  }, [form, settings]);

  const handleReset = () => {
    if (!settings) {
      setForm(DEFAULT_FORM);
      return;
    }
    lastAppliedSnapshot.current = null;
    setForm({
      originZip: settings.originZip || '',
      defaultMarkup: settings.defaultMarkup ?? DEFAULT_FORM.defaultMarkup,
      fuelSurcharge: settings.fuelSurcharge ?? DEFAULT_FORM.fuelSurcharge,
      dasSurcharge: settings.dasSurcharge ?? DEFAULT_FORM.dasSurcharge,
      edasSurcharge: settings.edasSurcharge ?? DEFAULT_FORM.edasSurcharge,
      remoteSurcharge: settings.remoteSurcharge ?? DEFAULT_FORM.remoteSurcharge,
      dimDivisor: settings.dimDivisor ?? DEFAULT_FORM.dimDivisor,
      standardMarkup: settings.standardMarkup ?? DEFAULT_FORM.standardMarkup,
      expeditedMarkup: settings.expeditedMarkup ?? DEFAULT_FORM.expeditedMarkup,
      priorityMarkup: settings.priorityMarkup ?? DEFAULT_FORM.priorityMarkup,
      nextDayMarkup: settings.nextDayMarkup ?? DEFAULT_FORM.nextDayMarkup,
    });
  };

  const onSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    setError(null);
    try {
      await updateSettings({
        originZip: form.originZip || null,
        defaultMarkup: form.defaultMarkup,
        fuelSurcharge: form.fuelSurcharge,
        dasSurcharge: form.dasSurcharge,
        edasSurcharge: form.edasSurcharge,
        remoteSurcharge: form.remoteSurcharge,
        dimDivisor: form.dimDivisor,
        standardMarkup: form.standardMarkup,
        expeditedMarkup: form.expeditedMarkup,
        priorityMarkup: form.priorityMarkup,
        nextDayMarkup: form.nextDayMarkup,
      });
      setSaveMessage('Settings saved');
      toast.success('Settings saved');
    } catch (err: any) {
      console.error('Failed to save settings', err);
      const msg = err?.response?.data?.detail || 'Unable to save changes. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-600">
          Update your default calculation preferences. These values are used to pre-fill new analyses.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : saveMessage ? (
        <Alert>
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Default Rate Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="originZip">Origin ZIP</Label>
              <Input
                id="originZip"
                value={form.originZip}
                onChange={(event) => handleInputChange('originZip', event.target.value)}
                maxLength={10}
                placeholder="46307"
                disabled={isSettingsLoading}
              />
              <p className="text-xs text-gray-500">Default origin ZIP used when calculating surcharges.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultMarkup">Default Markup (%)</Label>
              <Input
                id="defaultMarkup"
                type="number"
                min={0}
                step={0.1}
                value={form.defaultMarkup}
                onChange={(event) => handleInputChange('defaultMarkup', event.target.value)}
                disabled={isSettingsLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelSurcharge">Fuel Surcharge (%)</Label>
              <Input
                id="fuelSurcharge"
                type="number"
                min={0}
                step={0.1}
                value={form.fuelSurcharge}
                onChange={(event) => handleInputChange('fuelSurcharge', event.target.value)}
                disabled={isSettingsLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimDivisor">Dimensional Divisor</Label>
              <Input
                id="dimDivisor"
                type="number"
                min={1}
                value={form.dimDivisor}
                onChange={(event) => handleInputChange('dimDivisor', event.target.value)}
                disabled={isSettingsLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dasSurcharge">DAS Surcharge ($)</Label>
              <Input
                id="dasSurcharge"
                type="number"
                min={0}
                step={0.01}
                value={form.dasSurcharge}
                onChange={(event) => handleInputChange('dasSurcharge', event.target.value)}
                disabled={isSettingsLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edasSurcharge">eDAS Surcharge ($)</Label>
              <Input
                id="edasSurcharge"
                type="number"
                min={0}
                step={0.01}
                value={form.edasSurcharge}
                onChange={(event) => handleInputChange('edasSurcharge', event.target.value)}
                disabled={isSettingsLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remoteSurcharge">Remote Surcharge ($)</Label>
              <Input
                id="remoteSurcharge"
                type="number"
                min={0}
                step={0.01}
                value={form.remoteSurcharge}
                onChange={(event) => handleInputChange('remoteSurcharge', event.target.value)}
                disabled={isSettingsLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Service Level Markups (%)</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.standardMarkup}
                  onChange={(event) => handleInputChange('standardMarkup', event.target.value)}
                  placeholder="Standard"
                  disabled={isSettingsLoading}
                />
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.expeditedMarkup}
                  onChange={(event) => handleInputChange('expeditedMarkup', event.target.value)}
                  placeholder="Expedited"
                  disabled={isSettingsLoading}
                />
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.priorityMarkup}
                  onChange={(event) => handleInputChange('priorityMarkup', event.target.value)}
                  placeholder="Priority"
                  disabled={isSettingsLoading}
                />
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.nextDayMarkup}
                  onChange={(event) => handleInputChange('nextDayMarkup', event.target.value)}
                  placeholder="Next Day"
                  disabled={isSettingsLoading}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" type="button" onClick={handleReset} disabled={isSettingsLoading || isSaving}>
              Reset
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={!hasChanges || isSaving || isSettingsLoading}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Saved values are used to pre-fill new analyses in the upload wizard. You can still adjust them per analysis if needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
