
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Label } from '@radix-ui/react-label';
import { Save, FileText } from 'lucide-react';
import { ColumnMapping as IColumnMapping } from '../../lib/api';
import { useProfilesStore } from '../../lib/stores/profiles-store';

interface ColumnMappingProps {
  columns: string[];
  mapping: IColumnMapping;
  onMappingChange: (mapping: IColumnMapping) => void;
  onSaveProfile?: (name: string, description: string) => void;
}

const requiredFields = [
  { key: 'weight', label: 'Weight', required: true },
  { key: 'length', label: 'Length', required: false },
  { key: 'width', label: 'Width', required: false },
  { key: 'height', label: 'Height', required: false },
  { key: 'originZip', label: 'Origin ZIP', required: false },
  { key: 'destinationZip', label: 'Destination ZIP', required: true },
  { key: 'serviceLevel', label: 'Service Level', required: false },
];

export function ColumnMapping({ 
  columns, 
  mapping, 
  onMappingChange,
  onSaveProfile 
}: ColumnMappingProps) {
  const { profiles, fetchProfiles } = useProfilesStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileDescription, setProfileDescription] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleFieldChange = (field: string, value: string) => {
    onMappingChange({
      ...mapping,
      [field]: value === 'none' ? undefined : value,
    });
  };

  const loadProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      onMappingChange(profile.mapping);
    }
  };

  const handleSaveProfile = () => {
    if (profileName.trim() && onSaveProfile) {
      onSaveProfile(profileName.trim(), profileDescription.trim());
      setProfileName('');
      setProfileDescription('');
      setShowSaveDialog(false);
    }
  };

  const isComplete = requiredFields
    .filter(field => field.required)
    .every(field => mapping[field.key as keyof IColumnMapping]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Map Your Columns</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Map your file columns to the required data fields. Required fields are marked with *.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Load Existing Profile */}
        {profiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Load Saved Profile</Label>
            <Select onValueChange={loadProfile}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a saved profile..." />
              </SelectTrigger>
              <SelectContent>
                {profiles.map(profile => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Column Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredFields.map(field => (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-medium">
                {field.label} {field.required && '*'}
              </Label>
              <Select
                value={mapping[field.key as keyof IColumnMapping] || 'none'}
                onValueChange={(value) => handleFieldChange(field.key, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${field.label} column`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not mapped</SelectItem>
                  {columns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Save Profile */}
        <div className="pt-4 border-t">
          {!showSaveDialog ? (
            <Button 
              variant="outline" 
              onClick={() => setShowSaveDialog(true)}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Profile
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profile Name</Label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter profile name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description (optional)</Label>
                <textarea
                  value={profileDescription}
                  onChange={(e) => setProfileDescription(e.target.value)}
                  placeholder="Enter description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveProfile} disabled={!profileName.trim()}>
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <span className="text-sm">
            {isComplete ? '✓ All required fields mapped' : '⚠ Missing required fields'}
          </span>
          <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-yellow-500'}`} />
        </div>
      </CardContent>
    </Card>
  );
}
