import { useState, useEffect, useContext, createContext } from 'react';

// User Journey Context
interface UserJourneyContextType {
  currentJourney: 'merchant' | 'analyst';
  journeySettings: any;
  adminSettings: any;
  switchJourney: (journey: 'merchant' | 'analyst') => void;
  updateJourneyFromOnboarding: (onboardingData: any) => void;
  canSwitchJourney: () => boolean;
  getJourneyConfig: () => any;
}

const UserJourneyContext = createContext<UserJourneyContextType | null>(null);

export function UserJourneyProvider({ children }: { children: React.ReactNode }) {
  const [currentJourney, setCurrentJourney] = useState<'merchant' | 'analyst'>('merchant');
  const [adminSettings, setAdminSettings] = useState<any>(null);
  const [journeySettings, setJourneySettings] = useState<any>(null);

  useEffect(() => {
    // Load admin settings and user journey settings
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load admin settings
    const savedAdminSettings = localStorage.getItem('adminSettings');
    if (savedAdminSettings) {
      const settings = JSON.parse(savedAdminSettings);
      setAdminSettings(settings);
      
      // Load user journey settings
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        determineUserJourney(profile, settings);
      } else if (settings.defaultUserJourney !== 'auto') {
        setCurrentJourney(settings.defaultUserJourney);
      }
    }
  };

  const determineUserJourney = (userProfile: any, adminSettings: any) => {
    if (adminSettings.forceJourneyFromOnboarding && userProfile.role) {
      setCurrentJourney(userProfile.role);
    } else if (adminSettings.defaultUserJourney !== 'auto') {
      setCurrentJourney(adminSettings.defaultUserJourney);
    } else {
      // Auto-detect based on user profile
      const journey = detectJourneyFromProfile(userProfile);
      setCurrentJourney(journey);
    }
    
    // Set journey-specific settings
    updateJourneySettings(userProfile.role || currentJourney, adminSettings);
  };

  const detectJourneyFromProfile = (profile: any): 'merchant' | 'analyst' => {
    // Logic to detect journey from onboarding answers
    const indicators = {
      merchant: 0,
      analyst: 0
    };

    // Business type indicators
    if (['ecommerce', '3pl', 'manufacturer', 'distributor'].includes(profile.businessType)) {
      indicators.merchant += 2;
    }
    if (profile.businessType === 'consultant') {
      indicators.analyst += 3;
    }

    // Goal indicators
    if (profile.primaryGoals?.includes('cost-reduction')) indicators.merchant += 1;
    if (profile.primaryGoals?.includes('automation')) indicators.merchant += 1;
    if (profile.primaryGoals?.includes('client-service')) indicators.analyst += 2;
    if (profile.primaryGoals?.includes('analytics')) indicators.analyst += 1;

    // Volume indicators
    if (['low', 'medium'].includes(profile.shippingVolume)) {
      indicators.merchant += 1;
    }
    if (['high', 'enterprise'].includes(profile.shippingVolume)) {
      indicators.analyst += 1;
    }

    return indicators.analyst > indicators.merchant ? 'analyst' : 'merchant';
  };

  const updateJourneySettings = (journey: 'merchant' | 'analyst', adminSettings: any) => {
    const themeKey = journey === 'merchant' ? 'merchantTheme' : 'analystTheme';
    const theme = adminSettings[themeKey];
    
    setJourneySettings({
      theme,
      navigation: adminSettings.navigation[`${journey}Sections`],
      features: getJourneyFeatures(journey, adminSettings.features),
      defaultLandingPage: theme.defaultLandingPage
    });
  };

  const getJourneyFeatures = (journey: 'merchant' | 'analyst', allFeatures: any) => {
    // Filter features based on journey type
    const journeyFeatures = { ...allFeatures };
    
    if (journey === 'merchant') {
      // Merchant-specific feature adjustments
      journeyFeatures.clientPortal = false;
      journeyFeatures.whiteLabeling = false;
    } else {
      // Analyst-specific feature adjustments
      journeyFeatures.bulkOperations = true;
      journeyFeatures.clientPortal = true;
      journeyFeatures.customReporting = true;
    }
    
    return journeyFeatures;
  };

  const switchJourney = (journey: 'merchant' | 'analyst') => {
    if (!canSwitchJourney()) return;
    
    setCurrentJourney(journey);
    updateJourneySettings(journey, adminSettings);
    
    // Save preference
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    userProfile.role = journey;
    userProfile.lastJourneySwitch = new Date().toISOString();
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  };

  const updateJourneyFromOnboarding = (onboardingData: any) => {
    if (adminSettings?.onboarding?.autoConfigureFromAnswers) {
      const detectedJourney = detectJourneyFromProfile(onboardingData);
      setCurrentJourney(detectedJourney);
      updateJourneySettings(detectedJourney, adminSettings);
    }
  };

  const canSwitchJourney = (): boolean => {
    return adminSettings?.allowJourneySwitch && 
           adminSettings?.security?.allowRoleSwitching;
  };

  const getJourneyConfig = () => {
    return {
      currentJourney,
      journeySettings,
      adminSettings,
      features: journeySettings?.features || {},
      theme: journeySettings?.theme || {},
      navigation: journeySettings?.navigation || []
    };
  };

  const value = {
    currentJourney,
    journeySettings,
    adminSettings,
    switchJourney,
    updateJourneyFromOnboarding,
    canSwitchJourney,
    getJourneyConfig
  };

  return (
    <UserJourneyContext.Provider value={value}>
      {children}
    </UserJourneyContext.Provider>
  );
}

export function useUserJourney() {
  const context = useContext(UserJourneyContext);
  if (!context) {
    throw new Error('useUserJourney must be used within a UserJourneyProvider');
  }
  return context;
}