import { useState, useEffect } from 'react';

export interface ViewConfiguration {
  id: string;
  name: string;
  title: string;
  description: string;
  component: string;
  icon: string;
  category: 'core' | 'operations' | 'analytics' | 'admin' | 'custom';
  visibility: {
    enabled: boolean;
    roles: ('merchant' | 'analyst' | 'admin')[];
    conditions?: {
      feature?: string;
      userProperty?: string;
      value?: any;
    }[];
  };
  customization: {
    allowEdit: boolean;
    customContent?: {
      header?: {
        title?: string;
        description?: string;
        actions?: any[];
      };
      sections?: {
        id: string;
        type: 'text' | 'chart' | 'table' | 'cards' | 'custom';
        title?: string;
        content?: any;
        config?: any;
        visible: boolean;
        order: number;
      }[];
    };
    theme?: {
      backgroundColor?: string;
      textColor?: string;
      accentColor?: string;
    };
  };
  navigation: {
    showInSidebar: boolean;
    sidebarOrder: number;
    breadcrumb?: string[];
    parentView?: string;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModified: string;
    version: string;
    isDefault: boolean;
  };
}

export interface ViewManagerSettings {
  defaultViews: ViewConfiguration[];
  customViews: ViewConfiguration[];
  globalSettings: {
    allowCustomViews: boolean;
    allowViewEditing: boolean;
    requireApprovalForChanges: boolean;
  };
}

export function useViewManager() {
  const [viewConfigurations, setViewConfigurations] = useState<ViewConfiguration[]>([]);
  const [settings, setSettings] = useState<ViewManagerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = 'viewManagerSettings';

  // Default view configurations
  const getDefaultViewConfigurations = (): ViewConfiguration[] => [
    {
      id: 'dashboard',
      name: 'dashboard',
      title: 'Dashboard',
      description: 'Main overview and analytics dashboard',
      component: 'JourneyAwareDashboard',
      icon: 'BarChart3',
      category: 'core',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true,
        customContent: {
          header: {
            title: 'Dashboard',
            description: 'Monitor your shipping optimization performance and key metrics'
          },
          sections: [
            {
              id: 'metrics_overview',
              type: 'cards',
              title: 'Key Metrics',
              visible: true,
              order: 0,
              config: { cardCount: 4, layout: 'grid' }
            },
            {
              id: 'recent_activity',
              type: 'table',
              title: 'Recent Activity',
              visible: true,
              order: 1,
              config: { maxRows: 10, showPagination: false }
            },
            {
              id: 'analytics_charts',
              type: 'chart',
              title: 'Analytics Overview',
              visible: true,
              order: 2,
              config: { chartType: 'line', timeRange: '30d' }
            }
          ]
        }
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 0
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'upload',
      name: 'upload',
      title: 'Data Upload',
      description: 'Upload shipment data for analysis',
      component: 'FileUpload',
      icon: 'Upload',
      category: 'core',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true,
        customContent: {
          header: {
            title: 'Upload Shipment Data',
            description: 'Upload your shipment data in CSV or Excel format to begin comprehensive rate analysis'
          }
        }
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 1
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'analysis',
      name: 'analysis',
      title: 'Analysis Results',
      description: 'View detailed analysis results and recommendations',
      component: 'AnalysisResults',
      icon: 'Activity',
      category: 'analytics',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 2
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'reports',
      name: 'reports',
      title: 'Reports',
      description: 'Generate and manage branded reports',
      component: 'Reports',
      icon: 'FileText',
      category: 'analytics',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 3
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'shipping',
      name: 'shipping',
      title: 'Shipping Tools',
      description: 'Access shipping utilities and rate optimization tools',
      component: 'ShippingTools',
      icon: 'Truck',
      category: 'operations',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 4
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'analytics',
      name: 'analytics',
      title: 'Analytics',
      description: 'Deep dive into shipping analytics and trends',
      component: 'Analytics',
      icon: 'TrendingUp',
      category: 'analytics',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 5
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'integrations',
      name: 'integrations',
      title: 'Integrations',
      description: 'Connect with carriers and platforms',
      component: 'Integrations',
      icon: 'Globe',
      category: 'operations',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 6
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'account',
      name: 'account',
      title: 'Account Settings',
      description: 'Manage account settings and preferences',
      component: 'Account',
      icon: 'User',
      category: 'admin',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: false
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 7
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'help',
      name: 'help',
      title: 'Knowledge Base',
      description: 'Help documentation and guides',
      component: 'KnowledgeBase',
      icon: 'HelpCircle',
      category: 'admin',
      visibility: {
        enabled: true,
        roles: ['merchant', 'analyst', 'admin']
      },
      customization: {
        allowEdit: true
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 8
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    },
    {
      id: 'admin-settings',
      name: 'admin-settings',
      title: 'Admin Settings',
      description: 'Platform configuration and management',
      component: 'AdminSettings',
      icon: 'Settings',
      category: 'admin',
      visibility: {
        enabled: true,
        roles: ['admin']
      },
      customization: {
        allowEdit: false
      },
      navigation: {
        showInSidebar: true,
        sidebarOrder: 9
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: true
      }
    }
  ];

  // Load configurations on mount
  useEffect(() => {
    loadViewConfigurations();
  }, []);

  const loadViewConfigurations = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setViewConfigurations([...parsed.defaultViews, ...parsed.customViews]);
      } else {
        // Initialize with default configurations
        const defaultViews = getDefaultViewConfigurations();
        const initialSettings: ViewManagerSettings = {
          defaultViews,
          customViews: [],
          globalSettings: {
            allowCustomViews: true,
            allowViewEditing: true,
            requireApprovalForChanges: false
          }
        };
        setSettings(initialSettings);
        setViewConfigurations(defaultViews);
        localStorage.setItem(storageKey, JSON.stringify(initialSettings));
      }
    } catch (error) {
      console.error('Error loading view configurations:', error);
      setError('Failed to load view configurations');
    } finally {
      setLoading(false);
    }
  };

  // Save configurations
  const saveViewConfigurations = (newSettings: ViewManagerSettings) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
      setSettings(newSettings);
      setViewConfigurations([...newSettings.defaultViews, ...newSettings.customViews]);
    } catch (error) {
      console.error('Error saving view configurations:', error);
      setError('Failed to save view configurations');
    }
  };

  // Get visible views for a specific role
  const getVisibleViews = (userRole: 'merchant' | 'analyst' | 'admin') => {
    return viewConfigurations
      .filter(view => 
        view.visibility.enabled && 
        view.visibility.roles.includes(userRole) &&
        view.navigation.showInSidebar
      )
      .sort((a, b) => a.navigation.sidebarOrder - b.navigation.sidebarOrder);
  };

  // Get view configuration by ID
  const getViewById = (viewId: string): ViewConfiguration | null => {
    return viewConfigurations.find(view => view.id === viewId) || null;
  };

  // Update view configuration
  const updateViewConfiguration = (viewId: string, updates: Partial<ViewConfiguration>) => {
    if (!settings) return;

    const updatedDefaultViews = settings.defaultViews.map(view =>
      view.id === viewId ? { ...view, ...updates, metadata: { ...view.metadata, lastModified: new Date().toISOString() } } : view
    );

    const updatedCustomViews = settings.customViews.map(view =>
      view.id === viewId ? { ...view, ...updates, metadata: { ...view.metadata, lastModified: new Date().toISOString() } } : view
    );

    const newSettings = {
      ...settings,
      defaultViews: updatedDefaultViews,
      customViews: updatedCustomViews
    };

    saveViewConfigurations(newSettings);
  };

  // Create custom view
  const createCustomView = (viewData: Omit<ViewConfiguration, 'id' | 'metadata'>) => {
    if (!settings) return;

    const newView: ViewConfiguration = {
      ...viewData,
      id: `custom_${Date.now()}`,
      metadata: {
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0',
        isDefault: false
      }
    };

    const newSettings = {
      ...settings,
      customViews: [...settings.customViews, newView]
    };

    saveViewConfigurations(newSettings);
    return newView;
  };

  // Delete custom view
  const deleteCustomView = (viewId: string) => {
    if (!settings) return;

    const view = getViewById(viewId);
    if (!view || view.metadata.isDefault) return;

    const newSettings = {
      ...settings,
      customViews: settings.customViews.filter(view => view.id !== viewId)
    };

    saveViewConfigurations(newSettings);
  };

  // Toggle view visibility
  const toggleViewVisibility = (viewId: string, enabled: boolean) => {
    updateViewConfiguration(viewId, {
      visibility: {
        ...getViewById(viewId)?.visibility!,
        enabled
      }
    });
  };

  // Update view role access
  const updateViewRoles = (viewId: string, roles: ('merchant' | 'analyst' | 'admin')[]) => {
    updateViewConfiguration(viewId, {
      visibility: {
        ...getViewById(viewId)?.visibility!,
        roles
      }
    });
  };

  // Check if view is accessible by user
  const isViewAccessible = (viewId: string, userRole: 'merchant' | 'analyst' | 'admin') => {
    const view = getViewById(viewId);
    if (!view) return false;

    return view.visibility.enabled && view.visibility.roles.includes(userRole);
  };

  // Reset to default configurations
  const resetToDefaults = () => {
    const defaultViews = getDefaultViewConfigurations();
    const defaultSettings: ViewManagerSettings = {
      defaultViews,
      customViews: [],
      globalSettings: {
        allowCustomViews: true,
        allowViewEditing: true,
        requireApprovalForChanges: false
      }
    };
    saveViewConfigurations(defaultSettings);
  };

  // Export configurations
  const exportConfigurations = () => {
    return {
      viewManagerSettings: settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  };

  // Import configurations
  const importConfigurations = (importData: any) => {
    try {
      if (importData.viewManagerSettings) {
        saveViewConfigurations(importData.viewManagerSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing configurations:', error);
      return false;
    }
  };

  return {
    // Core state
    viewConfigurations,
    settings,
    loading,
    error,

    // View access
    getVisibleViews,
    getViewById,
    isViewAccessible,

    // View management
    updateViewConfiguration,
    createCustomView,
    deleteCustomView,
    toggleViewVisibility,
    updateViewRoles,

    // Utilities
    resetToDefaults,
    exportConfigurations,
    importConfigurations,

    // Settings
    saveViewConfigurations
  };
}