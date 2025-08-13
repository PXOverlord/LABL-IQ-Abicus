import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Palette, 
  Type, 
  Layout, 
  Building, 
  Save, 
  Eye,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Image,
  Phone,
  Mail,
  Globe,
  MapPin,
  Info
} from 'lucide-react';
import { useBrandSettings, BrandSettings } from '../hooks/useBrandSettings';

interface BrandSettingsManagerProps {
  userRole: 'merchant' | 'analyst';
  selectedMerchantId?: string;
}

export function BrandSettingsManager({ userRole, selectedMerchantId }: BrandSettingsManagerProps) {
  const { 
    brandSettings, 
    updateBrandSettings, 
    createBrandSettings,
    getBrandSettingsByMerchantId,
    applyBrandTheme,
    resetBrandTheme,
    exportBrandSettings,
    importBrandSettings,
    loading 
  } = useBrandSettings(userRole);

  const [currentSettings, setCurrentSettings] = useState<BrandSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');

  // Initialize settings based on user role
  useEffect(() => {
    if (userRole === 'merchant') {
      setCurrentSettings(brandSettings);
    } else if (userRole === 'analyst' && selectedMerchantId) {
      const merchantSettings = getBrandSettingsByMerchantId(selectedMerchantId);
      setCurrentSettings(merchantSettings);
    }
  }, [brandSettings, selectedMerchantId, userRole]);

  // Track changes
  useEffect(() => {
    if (currentSettings && brandSettings) {
      const hasChanges = JSON.stringify(currentSettings) !== JSON.stringify(brandSettings);
      setHasChanges(hasChanges);
    }
  }, [currentSettings, brandSettings]);

  const handleSettingChange = (path: string, value: any) => {
    if (!currentSettings) return;

    const newSettings = { ...currentSettings };
    const keys = path.split('.');
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setCurrentSettings(newSettings);
  };

  const handleSave = () => {
    if (currentSettings) {
      updateBrandSettings(currentSettings);
      setHasChanges(false);
    }
  };

  const handlePreview = () => {
    if (currentSettings && !previewMode) {
      applyBrandTheme(currentSettings);
      setPreviewMode(true);
    } else {
      resetBrandTheme();
      setPreviewMode(false);
    }
  };

  const handleCreateNew = () => {
    const newSettings = createBrandSettings('New Company');
    setCurrentSettings(newSettings);
  };

  const handleExport = () => {
    const data = exportBrandSettings();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (importBrandSettings(data)) {
          setCurrentSettings(data.brandSettings);
        }
      } catch (error) {
        console.error('Error importing brand settings:', error);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Palette className="w-6 h-6 text-gray-500 animate-pulse" />
        </div>
        <p className="text-gray-600">Loading brand settings...</p>
      </div>
    );
  }

  if (!currentSettings) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-black mb-2">No Brand Settings</h3>
        <p className="text-gray-600 mb-6">Create your brand settings to get started with custom reports</p>
        <Button onClick={handleCreateNew} className="bg-black text-white hover:bg-gray-800">
          <Sparkles className="w-4 h-4 mr-2" />
          Create Brand Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-black">Brand Settings</h3>
          <p className="text-sm text-gray-600">
            {userRole === 'merchant' 
              ? 'Customize how your reports look and feel'
              : 'Configure client brand settings for reports'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {previewMode && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <Eye className="w-3 h-3 mr-1" />
              Preview Mode
            </Badge>
          )}
          
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your brand settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Brand Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="customization">Options</TabsTrigger>
        </TabsList>

        {/* Company Information */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>
                Basic company details that appear on reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={currentSettings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={currentSettings.contact.website || ''}
                    onChange={(e) => handleSettingChange('contact.website', e.target.value)}
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentSettings.contact.email || ''}
                    onChange={(e) => handleSettingChange('contact.email', e.target.value)}
                    placeholder="contact@yourcompany.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={currentSettings.contact.phone || ''}
                    onChange={(e) => handleSettingChange('contact.phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={currentSettings.contact.address || ''}
                  onChange={(e) => handleSettingChange('contact.address', e.target.value)}
                  placeholder="Your company address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL (Optional)</Label>
                <Input
                  id="logo"
                  value={currentSettings.logoUrl || ''}
                  onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                  placeholder="https://yourcompany.com/logo.png"
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 200x60px or similar aspect ratio
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Color Settings */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-blue-600" />
                <span>Brand Colors</span>
              </CardTitle>
              <CardDescription>
                Define your brand colors for consistent report styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="primaryColor"
                      value={currentSettings.colors.primary}
                      onChange={(e) => handleSettingChange('colors.primary', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200"
                    />
                    <Input
                      value={currentSettings.colors.primary}
                      onChange={(e) => handleSettingChange('colors.primary', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={currentSettings.colors.secondary}
                      onChange={(e) => handleSettingChange('colors.secondary', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200"
                    />
                    <Input
                      value={currentSettings.colors.secondary}
                      onChange={(e) => handleSettingChange('colors.secondary', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="accentColor"
                      value={currentSettings.colors.accent}
                      onChange={(e) => handleSettingChange('colors.accent', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200"
                    />
                    <Input
                      value={currentSettings.colors.accent}
                      onChange={(e) => handleSettingChange('colors.accent', e.target.value)}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="backgroundColor"
                      value={currentSettings.colors.background}
                      onChange={(e) => handleSettingChange('colors.background', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200"
                    />
                    <Input
                      value={currentSettings.colors.background}
                      onChange={(e) => handleSettingChange('colors.background', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="textColor"
                      value={currentSettings.colors.text}
                      onChange={(e) => handleSettingChange('colors.text', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200"
                    />
                    <Input
                      value={currentSettings.colors.text}
                      onChange={(e) => handleSettingChange('colors.text', e.target.value)}
                      placeholder="#0e121b"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mutedColor">Muted Text</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="mutedColor"
                      value={currentSettings.colors.muted}
                      onChange={(e) => handleSettingChange('colors.muted', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-200"
                    />
                    <Input
                      value={currentSettings.colors.muted}
                      onChange={(e) => handleSettingChange('colors.muted', e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              <div className="p-4 rounded-lg border border-gray-200" style={{ backgroundColor: currentSettings.colors.background }}>
                <div className="space-y-3">
                  <h4 style={{ color: currentSettings.colors.primary }} className="font-semibold">
                    Sample Report Header
                  </h4>
                  <div style={{ color: currentSettings.colors.text }}>
                    This is how your report text will appear with these colors.
                  </div>
                  <div style={{ color: currentSettings.colors.muted }} className="text-sm">
                    This is muted text for secondary information.
                  </div>
                  <div className="flex space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: currentSettings.colors.primary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: currentSettings.colors.secondary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: currentSettings.colors.accent }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Settings */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="w-5 h-5 text-blue-600" />
                <span>Typography</span>
              </CardTitle>
              <CardDescription>
                Configure fonts and text styling for reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Body Font</Label>
                  <Select 
                    value={currentSettings.typography.fontFamily} 
                    onValueChange={(value) => handleSettingChange('typography.fontFamily', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Recommended)</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headingFont">Heading Font</Label>
                  <Select 
                    value={currentSettings.typography.headingFont} 
                    onValueChange={(value) => handleSettingChange('typography.headingFont', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Recommended)</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select 
                  value={currentSettings.typography.fontSize} 
                  onValueChange={(value) => handleSettingChange('typography.fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (12px base)</SelectItem>
                    <SelectItem value="medium">Medium (14px base)</SelectItem>
                    <SelectItem value="large">Large (16px base)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Typography Preview */}
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div 
                  className="space-y-4"
                  style={{ 
                    fontFamily: currentSettings.typography.fontFamily,
                    fontSize: currentSettings.typography.fontSize === 'small' ? '12px' : 
                             currentSettings.typography.fontSize === 'large' ? '16px' : '14px'
                  }}
                >
                  <h3 
                    style={{ fontFamily: currentSettings.typography.headingFont }}
                    className="text-xl font-semibold"
                  >
                    Sample Report Heading
                  </h3>
                  <p>This is how your report body text will appear with the selected typography settings.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Bullet point example</li>
                    <li>Another bullet point</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layout className="w-5 h-5 text-blue-600" />
                <span>Layout & Style</span>
              </CardTitle>
              <CardDescription>
                Configure report layout and styling options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headerStyle">Header Style</Label>
                  <Select 
                    value={currentSettings.layout.headerStyle} 
                    onValueChange={(value) => handleSettingChange('layout.headerStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="footerStyle">Footer Style</Label>
                  <Select 
                    value={currentSettings.layout.footerStyle} 
                    onValueChange={(value) => handleSettingChange('layout.footerStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportStyle">Report Style</Label>
                  <Select 
                    value={currentSettings.layout.reportStyle} 
                    onValueChange={(value) => handleSettingChange('layout.reportStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customization Options */}
        <TabsContent value="customization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Display Options</span>
              </CardTitle>
              <CardDescription>
                Control what information appears on reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Company Logo</Label>
                    <p className="text-sm text-gray-500">Display logo in report header</p>
                  </div>
                  <Switch
                    checked={currentSettings.customization.showLogo}
                    onCheckedChange={(checked) => handleSettingChange('customization.showLogo', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Contact Information</Label>
                    <p className="text-sm text-gray-500">Include contact details in reports</p>
                  </div>
                  <Switch
                    checked={currentSettings.customization.showContact}
                    onCheckedChange={(checked) => handleSettingChange('customization.showContact', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show labl Branding</Label>
                    <p className="text-sm text-gray-500">Include "Powered by labl" in footer</p>
                  </div>
                  <Switch
                    checked={currentSettings.customization.showBranding}
                    onCheckedChange={(checked) => handleSettingChange('customization.showBranding', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="watermark">Custom Watermark (Optional)</Label>
                <Input
                  id="watermark"
                  value={currentSettings.customization.watermark || ''}
                  onChange={(e) => handleSettingChange('customization.watermark', e.target.value)}
                  placeholder="CONFIDENTIAL, DRAFT, etc."
                />
                <p className="text-xs text-gray-500">
                  Watermark text will appear faintly in the background of reports
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}