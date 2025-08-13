import { useState, useEffect } from 'react';

export interface BrandSettings {
  id: string;
  merchantId: string;
  companyName: string;
  logo?: string;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  layout: {
    headerStyle: 'minimal' | 'standard' | 'detailed';
    footerStyle: 'simple' | 'standard' | 'comprehensive';
    reportStyle: 'modern' | 'classic' | 'executive';
  };
  contact: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  customization: {
    showLogo: boolean;
    showContact: boolean;
    showBranding: boolean;
    watermark?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MerchantProfile {
  id: string;
  name: string;
  email: string;
  brandSettings?: BrandSettings;
  isActive: boolean;
}

export function useBrandSettings(userRole: 'merchant' | 'analyst') {
  const [brandSettings, setBrandSettings] = useState<BrandSettings | null>(null);
  const [merchantProfiles, setMerchantProfiles] = useState<MerchantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Storage keys
  const brandSettingsKey = 'brandSettings';
  const merchantProfilesKey = 'merchantProfiles';

  // Default brand settings
  const getDefaultBrandSettings = (merchantId: string, companyName: string): BrandSettings => ({
    id: `brand_${Date.now()}`,
    merchantId,
    companyName,
    colors: {
      primary: '#0e121b',
      secondary: '#3b82f6',
      accent: '#10b981',
      background: '#ffffff',
      text: '#0e121b',
      muted: '#64748b'
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: 'medium'
    },
    layout: {
      headerStyle: 'standard',
      footerStyle: 'standard',
      reportStyle: 'modern'
    },
    contact: {},
    customization: {
      showLogo: true,
      showContact: true,
      showBranding: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Load settings on mount
  useEffect(() => {
    loadBrandSettings();
    if (userRole === 'analyst') {
      loadMerchantProfiles();
    }
  }, [userRole]);

  const loadBrandSettings = () => {
    try {
      if (userRole === 'merchant') {
        const saved = localStorage.getItem(brandSettingsKey);
        if (saved) {
          setBrandSettings(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
      setError('Failed to load brand settings');
    } finally {
      setLoading(false);
    }
  };

  const loadMerchantProfiles = () => {
    try {
      const saved = localStorage.getItem(merchantProfilesKey);
      if (saved) {
        setMerchantProfiles(JSON.parse(saved));
      } else {
        // Create sample merchant profiles for demo
        const sampleProfiles: MerchantProfile[] = [
          {
            id: 'merchant_1',
            name: 'TechCorp Solutions',
            email: 'contact@techcorp.com',
            isActive: true,
            brandSettings: getDefaultBrandSettings('merchant_1', 'TechCorp Solutions')
          },
          {
            id: 'merchant_2',
            name: 'Global Logistics Inc',
            email: 'info@globallogistics.com',
            isActive: true,
            brandSettings: {
              ...getDefaultBrandSettings('merchant_2', 'Global Logistics Inc'),
              colors: {
                primary: '#1e40af',
                secondary: '#f59e0b',
                accent: '#10b981',
                background: '#ffffff',
                text: '#1e293b',
                muted: '#64748b'
              },
              layout: {
                headerStyle: 'detailed',
                footerStyle: 'comprehensive',
                reportStyle: 'executive'
              }
            }
          },
          {
            id: 'merchant_3',
            name: 'EcoShip Green',
            email: 'hello@ecoship.green',
            isActive: true,
            brandSettings: {
              ...getDefaultBrandSettings('merchant_3', 'EcoShip Green'),
              colors: {
                primary: '#059669',
                secondary: '#0891b2',
                accent: '#eab308',
                background: '#f8fafc',
                text: '#0f172a',
                muted: '#475569'
              },
              layout: {
                headerStyle: 'minimal',
                footerStyle: 'simple',
                reportStyle: 'modern'
              }
            }
          }
        ];
        setMerchantProfiles(sampleProfiles);
        localStorage.setItem(merchantProfilesKey, JSON.stringify(sampleProfiles));
      }
    } catch (error) {
      console.error('Error loading merchant profiles:', error);
    }
  };

  // Save brand settings
  const saveBrandSettings = (settings: BrandSettings) => {
    try {
      settings.updatedAt = new Date().toISOString();
      
      if (userRole === 'merchant') {
        localStorage.setItem(brandSettingsKey, JSON.stringify(settings));
        setBrandSettings(settings);
      } else if (userRole === 'analyst') {
        // Update merchant profile
        const updatedProfiles = merchantProfiles.map(profile =>
          profile.id === settings.merchantId
            ? { ...profile, brandSettings: settings }
            : profile
        );
        setMerchantProfiles(updatedProfiles);
        localStorage.setItem(merchantProfilesKey, JSON.stringify(updatedProfiles));
      }
    } catch (error) {
      console.error('Error saving brand settings:', error);
      setError('Failed to save brand settings');
    }
  };

  // Create new brand settings
  const createBrandSettings = (companyName: string, merchantId?: string) => {
    const id = merchantId || 'current_merchant';
    const newSettings = getDefaultBrandSettings(id, companyName);
    saveBrandSettings(newSettings);
    return newSettings;
  };

  // Update brand settings
  const updateBrandSettings = (updates: Partial<BrandSettings>) => {
    if (!brandSettings && userRole === 'merchant') {
      return createBrandSettings(updates.companyName || 'My Company');
    }

    const updatedSettings = {
      ...brandSettings!,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveBrandSettings(updatedSettings);
    return updatedSettings;
  };

  // Get brand settings by merchant ID (for analysts)
  const getBrandSettingsByMerchantId = (merchantId: string): BrandSettings | null => {
    const profile = merchantProfiles.find(p => p.id === merchantId);
    return profile?.brandSettings || null;
  };

  // Generate CSS variables from brand settings
  const generateBrandCSSVariables = (settings: BrandSettings) => {
    return {
      '--brand-primary': settings.colors.primary,
      '--brand-secondary': settings.colors.secondary,
      '--brand-accent': settings.colors.accent,
      '--brand-background': settings.colors.background,
      '--brand-text': settings.colors.text,
      '--brand-muted': settings.colors.muted,
      '--brand-font-family': settings.typography.fontFamily,
      '--brand-heading-font': settings.typography.headingFont,
    };
  };

  // Apply brand theme to document
  const applyBrandTheme = (settings: BrandSettings) => {
    const root = document.documentElement;
    const variables = generateBrandCSSVariables(settings);
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  // Reset brand theme
  const resetBrandTheme = () => {
    const root = document.documentElement;
    const brandVariables = [
      '--brand-primary',
      '--brand-secondary', 
      '--brand-accent',
      '--brand-background',
      '--brand-text',
      '--brand-muted',
      '--brand-font-family',
      '--brand-heading-font'
    ];
    
    brandVariables.forEach(variable => {
      root.style.removeProperty(variable);
    });
  };

  // Export brand settings
  const exportBrandSettings = () => {
    return {
      brandSettings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  };

  // Import brand settings
  const importBrandSettings = (importData: any) => {
    try {
      if (importData.brandSettings) {
        saveBrandSettings(importData.brandSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing brand settings:', error);
      return false;
    }
  };

  return {
    // Core state
    brandSettings,
    merchantProfiles,
    loading,
    error,
    
    // Settings management
    saveBrandSettings,
    createBrandSettings,
    updateBrandSettings,
    getBrandSettingsByMerchantId,
    
    // Theme management
    generateBrandCSSVariables,
    applyBrandTheme,
    resetBrandTheme,
    
    // Import/Export
    exportBrandSettings,
    importBrandSettings,
    
    // Utilities
    getDefaultBrandSettings
  };
}