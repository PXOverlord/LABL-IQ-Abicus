
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Save, FileText, Zap } from 'lucide-react';
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

  // Auto-mapping function
  const autoMapColumns = () => {
    const autoMapping: IColumnMapping = {};
    
    columns.forEach(column => {
      const lowerColumn = column.toLowerCase();
      const cleanColumn = lowerColumn.replace(/[^a-z0-9]/g, ''); // Remove special characters
      
      // Weight mappings
      if (lowerColumn.includes('weight') || lowerColumn.includes('wt') || 
          lowerColumn.includes('lbs') || lowerColumn.includes('pound') ||
          cleanColumn.includes('weight') || cleanColumn.includes('wt')) {
        autoMapping.weight = column;
      }
      
      // Length mappings
      if (lowerColumn.includes('length') || lowerColumn.includes('len') || 
          lowerColumn.includes('l ') || cleanColumn.includes('length') ||
          (lowerColumn.includes('l') && lowerColumn.length <= 3)) {
        autoMapping.length = column;
      }
      
      // Width mappings
      if (lowerColumn.includes('width') || lowerColumn.includes('w ') || 
          cleanColumn.includes('width') ||
          (lowerColumn.includes('w') && lowerColumn.length <= 3)) {
        autoMapping.width = column;
      }
      
      // Height mappings
      if (lowerColumn.includes('height') || lowerColumn.includes('ht') || 
          lowerColumn.includes('h ') || cleanColumn.includes('height') ||
          (lowerColumn.includes('h') && lowerColumn.length <= 3)) {
        autoMapping.height = column;
      }
      
      // Destination ZIP mappings
      if ((lowerColumn.includes('dest') || lowerColumn.includes('to') || lowerColumn.includes('ship')) && 
          (lowerColumn.includes('zip') || lowerColumn.includes('postal') || lowerColumn.includes('code'))) {
        autoMapping.destinationZip = column;
      } else if ((lowerColumn.includes('zip') || lowerColumn.includes('postal') || lowerColumn.includes('code')) && 
                 !lowerColumn.includes('origin') && !lowerColumn.includes('from')) {
        autoMapping.destinationZip = column;
      }
      
      // Service Level mappings
      if (lowerColumn.includes('service') || lowerColumn.includes('level') || 
          lowerColumn.includes('type') || lowerColumn.includes('method') ||
          lowerColumn.includes('shipping') || lowerColumn.includes('delivery')) {
        autoMapping.serviceLevel = column;
      }
    });
    
    onMappingChange(autoMapping);
  };

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
          Use Auto-Map to automatically detect common column names.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-mapping and Load Profile */}
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={autoMapColumns}
            className="flex-1"
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto-Map Columns
          </Button>
          
          {profiles.length > 0 && (
            <div className="flex-1">
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
        </div>

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
