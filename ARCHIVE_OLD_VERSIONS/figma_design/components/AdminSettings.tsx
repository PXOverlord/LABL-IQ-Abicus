import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { 
  Settings, 
  Users, 
  Palette, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe, 
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Eye,
  Code,
  Workflow,
  Target,
  Building,
  Briefcase,
  Package,
  Truck,
  FileText,
  Bell,
  Layout,
  Sparkles
} from 'lucide-react';

interface AdminSettingsProps {
  onSettingsUpdate: (settings: any) => void;
}

export function AdminSettings({ onSettingsUpdate }: AdminSettingsProps) {
  const [settings, setSettings] = useState({
    // User Journey Configuration
    defaultUserJourney: 'auto', // 'merchant', 'analyst', 'auto'
    allowJourneySwitch: true,
    forceJourneyFromOnboarding: true,
    
    // UI/UX Customization
    merchantTheme: {
      primaryColor: '#0e121b',
      accentColor: '#3b82f6',
      focusArea: 'operations', // 'operations', 'analytics', 'automation'
      dashboardLayout: 'operational', // 'operational', 'analytical', 'hybrid'
      navigationStyle: 'expanded', // 'expanded', 'compact', 'contextual'
      defaultLandingPage: 'dashboard'
    },
    
    analystTheme: {
      primaryColor: '#0e121b',
      accentColor: '#8b5cf6',
      focusArea: 'analytics', // 'analytics', 'reporting', 'client-management'
      dashboardLayout: 'analytical', // 'analytical', 'reporting', 'hybrid'
      navigationStyle: 'contextual', // 'contextual', 'expanded', 'compact'
      defaultLandingPage: 'dashboard'
    },
    
    // Feature Toggles
    features: {
      aiAssistant: true,
      globalSearch: true,
      onboardingWizard: true,
      advancedAnalytics: true,
      clientPortal: false,
      whiteLabeling: false,
      bulkOperations: true,
      realTimeAlerts: true,
      customReporting: true,
      apiAccess: true,
      mobileApp: false,
      workflowAutomation: false
    },
    
    // Navigation Configuration
    navigation: {
      merchantSections: [
        { id: 'core', enabled: true, items: ['dashboard', 'upload', 'analysis', 'reports'] },
        { id: 'operations', enabled: true, items: ['shipments', 'shipping', 'logistics'] },
        { id: 'business', enabled: true, items: ['analytics', 'performance', 'alerts'] }
      ],
      analystSections: [
        { id: 'core', enabled: true, items: ['dashboard', 'upload', 'analysis', 'reports'] },
        { id: 'analysis', enabled: true, items: ['bulk-analysis', 'optimization', 'client-projects'] },
        { id: 'consulting', enabled: true, items: ['proposals', 'presentations', 'client-portal'] }
      ]
    },
    
    // Onboarding Configuration
    onboarding: {
      enabled: true,
      skipAllowed: true,
      steps: {
        welcome: true,
        roleSelection: true,
        businessInfo: true,
        goals: true,
        integrations: true,
        configuration: true
      },
      autoConfigureFromAnswers: true,
      showSampleData: true
    },
    
    // Platform Branding
    branding: {
      platformName: 'labl IQ',
      logo: '/logo.svg',
      favicon: '/favicon.ico',
      allowCustomBranding: false,
      footerText: 'Powered by labl IQ',
      supportEmail: 'support@labl.com'
    },
    
    // Security & Access
    security: {
      enforceRoleBasedAccess: true,
      allowRoleSwitching: true,
      sessionTimeout: 480, // minutes
      requireMFA: false,
      auditLogging: true
    },
    
    // Integration Defaults
    integrations: {
      autoConfigurePopularCarriers: true,
      suggestBasedOnVolume: true,
      enableTestMode: true,
      defaultCarriers: ['ups', 'fedex', 'usps', 'amazon'],
      autoConnectEcommerce: false
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('journey');

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (section: string, field: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [field]: value
      }
    };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateNestedSettings = (section: string, subsection: string, field: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section as keyof typeof settings],
        [subsection]: {
          ...(settings[section as keyof typeof settings] as any)[subsection],
          [field]: value
        }
      }
    };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    onSettingsUpdate(settings);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    // Reset to default settings
    setHasUnsavedChanges(false);
  };

  const previewJourney = (journey: 'merchant' | 'analyst') => {
    // Show preview of the journey
    console.log('Previewing journey:', journey);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black">Admin Settings</h2>
          <p className="text-gray-600">Configure user journeys, features, and platform behavior</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <Badge variant="destructive" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="journey" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">User Journeys</span>
          </TabsTrigger>
          <TabsTrigger value="ui" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">UI/UX</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Features</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center space-x-2">
            <Layout className="w-4 h-4" />
            <span className="hidden sm:inline">Navigation</span>
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Onboarding</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Platform</span>
          </TabsTrigger>
        </TabsList>

        {/* User Journey Configuration */}
        <TabsContent value="journey" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>User Journey Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure how users experience the platform based on their role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default Journey */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Default User Journey</Label>
                <Select 
                  value={settings.defaultUserJourney} 
                  onValueChange={(value) => updateSettings('', 'defaultUserJourney', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect from onboarding</SelectItem>
                    <SelectItem value="merchant">Always Merchant/3PL</SelectItem>
                    <SelectItem value="analyst">Always Analyst/Consultant</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  Choose how to determine the user journey for new users
                </p>
              </div>

              <Separator />

              {/* Journey Switching */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Allow Journey Switching</Label>
                  <p className="text-sm text-gray-600">
                    Let users switch between merchant and analyst views
                  </p>
                </div>
                <Switch
                  checked={settings.allowJourneySwitch}
                  onCheckedChange={(checked) => updateSettings('', 'allowJourneySwitch', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Force Journey from Onboarding</Label>
                  <p className="text-sm text-gray-600">
                    Use onboarding answers to determine and lock user journey
                  </p>
                </div>
                <Switch
                  checked={settings.forceJourneyFromOnboarding}
                  onCheckedChange={(checked) => updateSettings('', 'forceJourneyFromOnboarding', checked)}
                />
              </div>

              <Separator />

              {/* Journey Previews */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Journey Previews</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">Merchant/3PL Journey</h4>
                          <p className="text-xs text-gray-600">Operations-focused experience</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-700">
                          • Shipment tracking dashboard
                        </div>
                        <div className="text-xs text-gray-700">
                          • Cost optimization tools
                        </div>
                        <div className="text-xs text-gray-700">
                          • Operational metrics
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => previewJourney('merchant')}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        Preview
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">Analyst/Consultant Journey</h4>
                          <p className="text-xs text-gray-600">Analytics-focused experience</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-700">
                          • Client project management
                        </div>
                        <div className="text-xs text-gray-700">
                          • Advanced analytics tools
                        </div>
                        <div className="text-xs text-gray-700">
                          • Presentation & reporting
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => previewJourney('analyst')}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        Preview
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UI/UX Configuration */}
        <TabsContent value="ui" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Merchant Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>Merchant/3PL Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Focus Area</Label>
                  <Select 
                    value={settings.merchantTheme.focusArea}
                    onValueChange={(value) => updateNestedSettings('merchantTheme', '', 'focusArea', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="automation">Automation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <Select 
                    value={settings.merchantTheme.dashboardLayout}
                    onValueChange={(value) => updateNestedSettings('merchantTheme', '', 'dashboardLayout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational Focus</SelectItem>
                      <SelectItem value="analytical">Analytical Focus</SelectItem>
                      <SelectItem value="hybrid">Hybrid View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Navigation Style</Label>
                  <Select 
                    value={settings.merchantTheme.navigationStyle}
                    onValueChange={(value) => updateNestedSettings('merchantTheme', '', 'navigationStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expanded">Expanded</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="contextual">Contextual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Analyst Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span>Analyst/Consultant Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Focus Area</Label>
                  <Select 
                    value={settings.analystTheme.focusArea}
                    onValueChange={(value) => updateNestedSettings('analystTheme', '', 'focusArea', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="reporting">Reporting</SelectItem>
                      <SelectItem value="client-management">Client Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <Select 
                    value={settings.analystTheme.dashboardLayout}
                    onValueChange={(value) => updateNestedSettings('analystTheme', '', 'dashboardLayout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analytical">Analytical Focus</SelectItem>
                      <SelectItem value="reporting">Reporting Focus</SelectItem>
                      <SelectItem value="hybrid">Hybrid View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Navigation Style</Label>
                  <Select 
                    value={settings.analystTheme.navigationStyle}
                    onValueChange={(value) => updateNestedSettings('analystTheme', '', 'navigationStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contextual">Contextual</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Toggles */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span>Feature Toggles</span>
              </CardTitle>
              <CardDescription>
                Enable or disable platform features for different user types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(settings.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {getFeatureDescription(feature)}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => updateNestedSettings('features', '', feature, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Configuration */}
        <TabsContent value="navigation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Merchant Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Merchant Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.navigation.merchantSections.map((section, index) => (
                  <div key={section.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{section.id}</h4>
                      <Switch
                        checked={section.enabled}
                        onCheckedChange={(checked) => {
                          const newSections = [...settings.navigation.merchantSections];
                          newSections[index].enabled = checked;
                          updateNestedSettings('navigation', '', 'merchantSections', newSections);
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pl-4">
                      {section.items.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Analyst Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Analyst Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.navigation.analystSections.map((section, index) => (
                  <div key={section.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{section.id}</h4>
                      <Switch
                        checked={section.enabled}
                        onCheckedChange={(checked) => {
                          const newSections = [...settings.navigation.analystSections];
                          newSections[index].enabled = checked;
                          updateNestedSettings('navigation', '', 'analystSections', newSections);
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pl-4">
                      {section.items.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onboarding Configuration */}
        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Onboarding Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Enable Onboarding</Label>
                  <p className="text-sm text-gray-600">Show onboarding wizard to new users</p>
                </div>
                <Switch
                  checked={settings.onboarding.enabled}
                  onCheckedChange={(checked) => updateNestedSettings('onboarding', '', 'enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Allow Skip</Label>
                  <p className="text-sm text-gray-600">Let users skip the onboarding process</p>
                </div>
                <Switch
                  checked={settings.onboarding.skipAllowed}
                  onCheckedChange={(checked) => updateNestedSettings('onboarding', '', 'skipAllowed', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Auto-Configure Journey</Label>
                  <p className="text-sm text-gray-600">Automatically set user journey based on onboarding answers</p>
                </div>
                <Switch
                  checked={settings.onboarding.autoConfigureFromAnswers}
                  onCheckedChange={(checked) => updateNestedSettings('onboarding', '', 'autoConfigureFromAnswers', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Onboarding Steps</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.onboarding.steps).map(([step, enabled]) => (
                    <div key={step} className="flex items-center justify-between">
                      <Label className="capitalize">{step.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => updateNestedSettings('onboarding', 'steps', step, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Configuration */}
        <TabsContent value="platform" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branding */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input
                    value={settings.branding.platformName}
                    onChange={(e) => updateNestedSettings('branding', '', 'platformName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={settings.branding.supportEmail}
                    onChange={(e) => updateNestedSettings('branding', '', 'supportEmail', e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Custom Branding</Label>
                    <p className="text-xs text-gray-600">Let analysts white-label for clients</p>
                  </div>
                  <Switch
                    checked={settings.branding.allowCustomBranding}
                    onCheckedChange={(checked) => updateNestedSettings('branding', '', 'allowCustomBranding', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Role-Based Access</Label>
                    <p className="text-xs text-gray-600">Enforce strict role permissions</p>
                  </div>
                  <Switch
                    checked={settings.security.enforceRoleBasedAccess}
                    onCheckedChange={(checked) => updateNestedSettings('security', '', 'enforceRoleBasedAccess', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Role Switching</Label>
                    <p className="text-xs text-gray-600">Let users switch between roles</p>
                  </div>
                  <Switch
                    checked={settings.security.allowRoleSwitching}
                    onCheckedChange={(checked) => updateNestedSettings('security', '', 'allowRoleSwitching', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateNestedSettings('security', '', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get feature descriptions
function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    aiAssistant: 'AI-powered assistance and recommendations',
    globalSearch: 'Universal search across all platform features',
    onboardingWizard: 'Guided setup for new users',
    advancedAnalytics: 'Deep data analysis and insights',
    clientPortal: 'Secure client access and sharing',
    whiteLabeling: 'Custom branding for consultants',
    bulkOperations: 'Batch processing and operations',
    realTimeAlerts: 'Live notifications and monitoring',
    customReporting: 'Flexible report generation',
    apiAccess: 'REST API for integrations',
    mobileApp: 'Native mobile applications',
    workflowAutomation: 'Automated business processes'
  };
  
  return descriptions[feature] || 'Feature configuration';
}