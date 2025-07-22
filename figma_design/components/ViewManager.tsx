import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit3, 
  Save,
  Settings,
  Users,
  Layout,
  Palette,
  GripVertical,
  Download,
  Upload,
  RotateCcw,
  Info,
  Sparkles,
  BarChart3,
  FileText,
  Activity,
  Truck,
  TrendingUp,
  Globe,
  User,
  HelpCircle,
  Package,
  Calendar,
  Search,
  Building,
  Target,
  Zap
} from 'lucide-react';
import { useViewManager, ViewConfiguration } from '../hooks/useViewManager';

interface ViewManagerProps {
  onViewConfigUpdate?: (config: ViewConfiguration) => void;
}

export function ViewManager({ onViewConfigUpdate }: ViewManagerProps) {
  const {
    viewConfigurations,
    settings,
    loading,
    getVisibleViews,
    updateViewConfiguration,
    createCustomView,
    deleteCustomView,
    toggleViewVisibility,
    updateViewRoles,
    resetToDefaults,
    exportConfigurations,
    importConfigurations
  } = useViewManager();

  const [activeTab, setActiveTab] = useState('overview');
  const [editingView, setEditingView] = useState<string | null>(null);
  const [draggedView, setDraggedView] = useState<string | null>(null);
  const [showCreateView, setShowCreateView] = useState(false);

  // Icon mapping for view icons
  const iconMap: Record<string, any> = {
    BarChart3, FileText, Activity, Truck, TrendingUp, Globe, User, HelpCircle,
    Settings, Package, Calendar, Search, Building, Target, Zap, Plus, Eye, Layout
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Layout;
  };

  const handleViewUpdate = (viewId: string, updates: Partial<ViewConfiguration>) => {
    updateViewConfiguration(viewId, updates);
    if (onViewConfigUpdate) {
      const updatedView = viewConfigurations.find(v => v.id === viewId);
      if (updatedView) {
        onViewConfigUpdate({ ...updatedView, ...updates });
      }
    }
  };

  const handleRoleToggle = (viewId: string, role: 'merchant' | 'analyst' | 'admin', enabled: boolean) => {
    const view = viewConfigurations.find(v => v.id === viewId);
    if (!view) return;

    let newRoles = [...view.visibility.roles];
    if (enabled) {
      if (!newRoles.includes(role)) {
        newRoles.push(role);
      }
    } else {
      newRoles = newRoles.filter(r => r !== role);
    }

    updateViewRoles(viewId, newRoles);
  };

  const handleReorder = (draggedId: string, targetId: string) => {
    const draggedView = viewConfigurations.find(v => v.id === draggedId);
    const targetView = viewConfigurations.find(v => v.id === targetId);

    if (!draggedView || !targetView) return;

    const draggedOrder = draggedView.navigation.sidebarOrder;
    const targetOrder = targetView.navigation.sidebarOrder;

    // Update the dragged view's order
    handleViewUpdate(draggedId, {
      navigation: {
        ...draggedView.navigation,
        sidebarOrder: targetOrder
      }
    });

    // Update target view's order
    handleViewUpdate(targetId, {
      navigation: {
        ...targetView.navigation,
        sidebarOrder: draggedOrder
      }
    });
  };

  const handleExport = () => {
    const data = exportConfigurations();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `view-configurations-${new Date().toISOString().split('T')[0]}.json`;
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
        if (importConfigurations(data)) {
          // Success feedback
        }
      } catch (error) {
        console.error('Error importing view configurations:', error);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Layout className="w-6 h-6 text-gray-500 animate-pulse" />
        </div>
        <p className="text-gray-600">Loading view configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-black">View Manager</h3>
          <p className="text-sm text-gray-600">
            Control which views are visible and customize their behavior
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
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
          
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button size="sm" onClick={() => setShowCreateView(true)} className="bg-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Create View
          </Button>
        </div>
      </div>

      {/* View Manager Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visibility">Visibility</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              {viewConfigurations.length} total views configured. 
              {viewConfigurations.filter(v => v.visibility.enabled).length} are currently enabled.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {viewConfigurations
              .sort((a, b) => a.navigation.sidebarOrder - b.navigation.sidebarOrder)
              .map((view) => {
                const IconComponent = getIconComponent(view.icon);
                
                return (
                  <Card key={view.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                          </div>
                          
                          <div>
                            <CardTitle className="text-lg">{view.title}</CardTitle>
                            <CardDescription>{view.description}</CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {view.category}
                          </Badge>
                          
                          {view.metadata.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                          
                          <Badge className={view.visibility.enabled 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                          }>
                            {view.visibility.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm font-medium">Roles</p>
                            <div className="flex space-x-1 mt-1">
                              {view.visibility.roles.map(role => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Order</p>
                            <p className="text-sm text-gray-600">{view.navigation.sidebarOrder}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Customizable</p>
                            <p className="text-sm text-gray-600">
                              {view.customization.allowEdit ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleViewVisibility(view.id, !view.visibility.enabled)}
                          >
                            {view.visibility.enabled ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingView(view.id)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          
                          {!view.metadata.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCustomView(view.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* Visibility Tab */}
        <TabsContent value="visibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>View Visibility & Access Control</CardTitle>
              <CardDescription>
                Control which users can see and access each view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {viewConfigurations.map((view) => (
                  <div key={view.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {React.createElement(getIconComponent(view.icon), { 
                          className: "w-4 h-4 text-gray-600" 
                        })}
                        <span className="font-medium">{view.title}</span>
                      </div>
                      
                      <Switch
                        checked={view.visibility.enabled}
                        onCheckedChange={(enabled) => toggleViewVisibility(view.id, enabled)}
                      />
                    </div>
                    
                    {view.visibility.enabled && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Merchants</Label>
                          <Switch
                            checked={view.visibility.roles.includes('merchant')}
                            onCheckedChange={(enabled) => handleRoleToggle(view.id, 'merchant', enabled)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Analysts</Label>
                          <Switch
                            checked={view.visibility.roles.includes('analyst')}
                            onCheckedChange={(enabled) => handleRoleToggle(view.id, 'analyst', enabled)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Admins</Label>
                          <Switch
                            checked={view.visibility.roles.includes('admin')}
                            onCheckedChange={(enabled) => handleRoleToggle(view.id, 'admin', enabled)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customization Tab */}
        <TabsContent value="customization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>View Customization</CardTitle>
              <CardDescription>
                Configure how views can be customized and their content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-black mb-2">Advanced Customization</h3>
                <p className="text-gray-600 mb-6">
                  View content editor and advanced customization options coming soon
                </p>
                <Badge variant="outline">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global View Settings</CardTitle>
              <CardDescription>
                Configure global behavior for view management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Custom Views</Label>
                      <p className="text-sm text-gray-500">Users can create custom views</p>
                    </div>
                    <Switch
                      checked={settings.globalSettings.allowCustomViews}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...settings,
                          globalSettings: {
                            ...settings.globalSettings,
                            allowCustomViews: checked
                          }
                        };
                        // saveViewConfigurations(newSettings);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow View Editing</Label>
                      <p className="text-sm text-gray-500">Users can modify view content</p>
                    </div>
                    <Switch
                      checked={settings.globalSettings.allowViewEditing}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...settings,
                          globalSettings: {
                            ...settings.globalSettings,
                            allowViewEditing: checked
                          }
                        };
                        // saveViewConfigurations(newSettings);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Change Approval</Label>
                      <p className="text-sm text-gray-500">Changes need admin approval</p>
                    </div>
                    <Switch
                      checked={settings.globalSettings.requireApprovalForChanges}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...settings,
                          globalSettings: {
                            ...settings.globalSettings,
                            requireApprovalForChanges: checked
                          }
                        };
                        // saveViewConfigurations(newSettings);
                      }}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}