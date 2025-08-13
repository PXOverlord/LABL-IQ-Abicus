import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { BarChart3, User, Bell, Menu, X, Activity, Calendar, Search, Bot, Sparkles, Settings as SettingsIcon, Bookmark } from 'lucide-react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserJourneyProvider, useUserJourney } from './hooks/useUserJourney';
import { useBookmarks } from './hooks/useBookmarks';
import { useViewManager } from './hooks/useViewManager';
import { LoginForm } from './components/LoginForm';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { BookmarkManager } from './components/BookmarkManager';
import { ViewManager } from './components/ViewManager';
import { AIAssistant } from './components/AIAssistant';
import { OnboardingWizard } from './components/OnboardingWizard';
import { GlobalSearch } from './components/GlobalSearch';
import { EnhancedMainNavigation } from './components/EnhancedMainNavigation';
import { DynamicViewRenderer } from './components/DynamicViewRenderer';
import { AdminSettings } from './components/AdminSettings';
import { env } from './utils/env';

// Main authenticated app component
function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { currentJourney, switchJourney, canSwitchJourney, updateJourneyFromOnboarding } = useUserJourney();
  const { 
    bookmarks, 
    addCurrentPageBookmark, 
    saveBookmarks,
    isBookmarked,
    loading: bookmarksLoading 
  } = useBookmarks(currentJourney);
  
  const {
    viewConfigurations,
    getVisibleViews,
    getViewById,
    isViewAccessible,
    loading: viewsLoading
  } = useViewManager();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  
  // AI Assistant state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAIAssistantMinimized, setIsAIAssistantMinimized] = useState(false);
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Global search state
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Admin settings state
  const [adminSettings, setAdminSettings] = useState<any>(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Debug environment configuration in development
  useEffect(() => {
    if (env.isDevelopment) {
      env.debugConfig();
    }
  }, []);

  // Responsive detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse navigation on mobile
      if (window.innerWidth < 768) {
        setIsNavOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Load admin settings
  useEffect(() => {
    const savedAdminSettings = localStorage.getItem('adminSettings');
    if (savedAdminSettings) {
      setAdminSettings(JSON.parse(savedAdminSettings));
    }
  }, []);

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !userProfile?.setupComplete) {
      // Check if user has completed onboarding
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else if (adminSettings?.onboarding?.enabled !== false) {
        setShowOnboarding(true);
      }
    }
  }, [user, adminSettings]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for global search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      
      // Cmd/Ctrl + / for AI assistant
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsAIAssistantOpen(true);
        setIsAIAssistantMinimized(false);
      }

      // Cmd/Ctrl + B for bookmark current page
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        handleAddBookmark(activeTab);
      }

      // Cmd/Ctrl + \ to toggle navigation
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setIsNavOpen(!isNavOpen);
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
        if (isAIAssistantOpen && !isAIAssistantMinimized) {
          setIsAIAssistantMinimized(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAIAssistantOpen, isAIAssistantMinimized, activeTab, isNavOpen]);

  const handleFileUpload = async (files: File[]) => {
    setActiveTab('analysis');
  };

  const handleTabChange = (tab: string) => {
    // Check if view is accessible before allowing navigation
    if (!isViewAccessible(tab, currentJourney as any)) {
      return;
    }
    
    setActiveTab(tab);
    // Close config panel when navigating
    if (isConfigOpen) {
      setIsConfigOpen(false);
    }
    // Auto-close navigation on mobile after navigation
    if (isMobile) {
      setIsNavOpen(false);
    }
  };

  const handleAddBookmark = (tab: string) => {
    if (!isBookmarked(tab)) {
      addCurrentPageBookmark(tab);
    }
  };

  const handleOnboardingComplete = (userData: any) => {
    setUserProfile(userData);
    localStorage.setItem('userProfile', JSON.stringify(userData));
    setShowOnboarding(false);
    
    // Update journey based on onboarding data
    updateJourneyFromOnboarding(userData);
    
    // Show AI assistant after onboarding if enabled
    if (adminSettings?.features?.aiAssistant !== false) {
      setTimeout(() => {
        setIsAIAssistantOpen(true);
      }, 1000);
    }
  };

  const handleOnboardingSkip = () => {
    const basicProfile = {
      role: currentJourney,
      setupComplete: false,
      skipped: true
    };
    setUserProfile(basicProfile);
    localStorage.setItem('userProfile', JSON.stringify(basicProfile));
    setShowOnboarding(false);
  };

  const handleAdminSettingsUpdate = (newSettings: any) => {
    setAdminSettings(newSettings);
    // Force reload to apply new settings
    window.location.reload();
  };

  const getCurrentContext = () => {
    return {
      page: activeTab,
      hasData: !!currentAnalysisId,
      recentAnalysis: currentAnalysisId,
      integrations: userProfile?.integrations || []
    };
  };

  // Show loading spinner during auth check
  if (authLoading || bookmarksLoading || viewsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-card">
            <Activity className="w-8 h-8 text-gray-500 animate-pulse" />
          </div>
          <p className="text-body text-muted-foreground">Loading Labl IQ...</p>
        </div>
      </div>
    );
  }

  // Show login form if user is not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Get current view configuration
  const currentView = getViewById(activeTab);
  const visibleViews = getVisibleViews(currentJourney as any);

  const getPageTitle = () => {
    return currentView?.title || 'Dashboard';
  };

  const getPageDescription = () => {
    return currentView?.description || 'Your shipping intelligence and optimization insights';
  };

  const renderPageContent = () => {
    // Handle special admin views
    if (activeTab === 'admin-settings') {
      return (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmark Manager</TabsTrigger>
            <TabsTrigger value="views">View Manager</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Config</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="animate-fade-in">
            <AdminSettings onSettingsUpdate={handleAdminSettingsUpdate} />
          </TabsContent>
          <TabsContent value="bookmarks" className="animate-fade-in">
            <BookmarkManager 
              bookmarks={bookmarks}
              onBookmarksUpdate={saveBookmarks}
              userRole={currentJourney}
            />
          </TabsContent>
          <TabsContent value="views" className="animate-fade-in">
            <ViewManager />
          </TabsContent>
          <TabsContent value="advanced" className="animate-fade-in">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-body text-muted-foreground">Advanced configuration options coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      );
    }

    if (activeTab === 'bookmark-manager') {
      return (
        <BookmarkManager 
          bookmarks={bookmarks}
          onBookmarksUpdate={saveBookmarks}
          userRole={currentJourney}
        />
      );
    }

    // Render dynamic view if configuration exists
    if (currentView) {
      return (
        <DynamicViewRenderer 
          viewConfig={currentView}
          isCustomizable={currentView.customization.allowEdit}
          onFileUpload={handleFileUpload}
          onAnalysisStart={setCurrentAnalysisId}
          onSettingsUpdate={handleAdminSettingsUpdate}
          analysisId={currentAnalysisId}
        />
      );
    }

    // Fallback for unknown views
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-black mb-2">View Not Found</h3>
        <p className="text-gray-600">The requested view is not available or accessible.</p>
      </div>
    );
  };

  const getPageActions = () => {
    // Journey-aware page actions
    const baseActions = currentJourney === 'merchant' ? (
      <>
        <Button variant="outline" size="sm" className="text-gray-600 hover:text-black focus-ring">
          Export Report
        </Button>
        <Button 
          size="sm" 
          className="bg-black text-white hover:bg-gray-800 focus-ring"
          onClick={() => setActiveTab('upload')}
        >
          Analyze Shipments
        </Button>
      </>
    ) : (
      <>
        <Button variant="outline" size="sm" className="text-gray-600 hover:text-black focus-ring">
          Export Analysis
        </Button>
        <Button 
          size="sm" 
          className="bg-black text-white hover:bg-gray-800 focus-ring"
          onClick={() => setActiveTab('upload')}
        >
          New Client Analysis
        </Button>
      </>
    );

    // Add bookmark button if not bookmarked
    const bookmarkAction = !isBookmarked(activeTab) ? (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleAddBookmark(activeTab)}
        className="text-gray-600 hover:text-black focus-ring"
      >
        <Bookmark className="w-3 h-3 mr-2" />
        Bookmark
      </Button>
    ) : null;

    return (
      <>
        {baseActions}
        {bookmarkAction}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Onboarding Wizard */}
      {showOnboarding && adminSettings?.onboarding?.enabled !== false && (
        <div className="fixed inset-0 z-[70] animate-fade-in">
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
            onClose={handleOnboardingSkip}
          />
        </div>
      )}

      {/* Global Search */}
      {adminSettings?.features?.globalSearch !== false && (
        <div className={`fixed inset-0 z-[65] ${isGlobalSearchOpen ? 'animate-fade-in' : 'hidden'}`}>
          <GlobalSearch
            isOpen={isGlobalSearchOpen}
            onClose={() => setIsGlobalSearchOpen(false)}
            onNavigate={handleTabChange}
          />
        </div>
      )}

      {/* AI Assistant */}
      {isAIAssistantOpen && adminSettings?.features?.aiAssistant !== false && (
        <div className="fixed bottom-4 right-4 z-[60] animate-slide-in-right">
          <AIAssistant
            isMinimized={isAIAssistantMinimized}
            onToggleMinimize={() => setIsAIAssistantMinimized(!isAIAssistantMinimized)}
            onClose={() => setIsAIAssistantOpen(false)}
            userRole={currentJourney}
            currentContext={getCurrentContext()}
          />
        </div>
      )}

      {/* Enhanced Side Navigation with Dynamic Views */}
      <div className={`
        transition-all duration-300 ease-in-out shrink-0 relative z-[30]
        ${isNavOpen ? 'w-[280px]' : 'w-16'} 
        ${isMobile && isNavOpen ? 'absolute inset-y-0 left-0 bg-white shadow-2xl' : ''}
      `}>
        <div className="h-full overflow-hidden">
          <div className={`h-full transition-all duration-300 ease-in-out ${isNavOpen ? 'w-[280px]' : 'w-16'}`}>
            <EnhancedMainNavigation 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onSettingsClick={() => setIsConfigOpen(!isConfigOpen)}
              isOpen={isNavOpen}
              userRole={currentJourney}
              bookmarks={bookmarks}
              onBookmarkAdd={handleAddBookmark}
              availableViews={visibleViews}
            />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isNavOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[25] animate-fade-in"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-[40] layout-header">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center space-x-4 lg:space-x-6 min-w-0">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    className="p-2 text-black hover:bg-gray-100 focus-ring"
                    aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
                  >
                    {isNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </Button>
                  
                  {/* Journey indicator */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full status-dot ${
                      currentJourney === 'merchant' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                    {canSwitchJourney() && !isMobile && (
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-gray-100 focus-ring transition-colors"
                        onClick={() => switchJourney(currentJourney === 'merchant' ? 'analyst' : 'merchant')}
                      >
                        {currentJourney === 'merchant' ? 'Merchant' : 'Analyst'} Mode
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Enhanced Search */}
                {!isMobile && isNavOpen && adminSettings?.features?.globalSearch !== false && (
                  <div className="hidden lg:flex items-center flex-1 max-w-md">
                    <button
                      onClick={() => setIsGlobalSearchOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors w-full focus-ring"
                    >
                      <Search className="w-4 h-4 shrink-0" />
                      <span className="truncate">Search features, data, or ask AI...</span>
                      <div className="flex items-center space-x-1 ml-auto shrink-0">
                        <Badge variant="secondary" className="text-xs">⌘K</Badge>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
                {/* User info - Hidden on mobile */}
                {!isMobile && (
                  <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>July 2, 2025</span>
                  </div>
                )}

                {/* Bookmark indicator */}
                {isBookmarked(activeTab) && (
                  <Badge variant="secondary" className="bg-yellow-50 text-yellow-800 border-yellow-200 animate-scale-in">
                    <Bookmark className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Bookmarked</span>
                  </Badge>
                )}

                {/* View configuration indicator */}
                {currentView && !currentView.metadata.isDefault && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Custom View</span>
                  </Badge>
                )}

                {/* Status Badge - Hidden on mobile */}
                {!isMobile && (
                  <div className="hidden sm:flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5">
                      <Activity className="w-3 h-3 mr-2" />
                      <span className="hidden lg:inline">
                        {env.isDevelopment ? (env.useBackend ? 'Connected' : 'Demo Mode') : 'System Ready'}
                      </span>
                    </Badge>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* Mobile search button */}
                  {isMobile && adminSettings?.features?.globalSearch !== false && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsGlobalSearchOpen(true)}
                      className="text-gray-600 hover:text-black hover:bg-gray-100 focus-ring"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" className="relative text-gray-600 hover:text-black hover:bg-gray-100 focus-ring">
                    <Bell className="w-4 h-4" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </Button>
                  
                  {/* AI Assistant Toggle */}
                  {adminSettings?.features?.aiAssistant !== false && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setIsAIAssistantOpen(true);
                        setIsAIAssistantMinimized(false);
                      }}
                      className="text-gray-600 hover:text-black hover:bg-gray-100 relative focus-ring"
                    >
                      <Bot className="w-4 h-4" />
                      {!isAIAssistantOpen && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </Button>
                  )}

                  {/* Admin Settings Access */}
                  {!isMobile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('admin-settings')}
                      className="text-gray-600 hover:text-black hover:bg-gray-100 focus-ring"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-100 focus-ring">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Configuration Panel */}
          {isConfigOpen && !isMobile && (
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto shadow-sm z-[35] animate-slide-in-right scrollbar-thin">
              <ConfigurationPanel onClose={() => setIsConfigOpen(false)} />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
            {/* Page Header - Only show if view doesn't have custom header */}
            {!(currentView?.customization?.customContent?.header) && (
              <div className="bg-white border-b border-gray-200 layout-page-header">
                <div className="layout-container">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                        <h1 className="text-heading-3 truncate">
                          {getPageTitle()}
                        </h1>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          {/* Smart hints for new users */}
                          {!userProfile?.setupComplete && activeTab === 'dashboard' && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center space-x-1 animate-bounce-subtle">
                              <Sparkles className="w-3 h-3" />
                              <span>New User</span>
                            </Badge>
                          )}
                          {/* Keyboard shortcut hint */}
                          {!isMobile && !isBookmarked(activeTab) && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              ⌘B to bookmark
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-body-large text-muted-foreground">
                        {getPageDescription()}
                      </p>
                    </div>
                    
                    {/* Page-specific actions */}
                    <div className="flex items-center space-x-3 shrink-0">
                      {getPageActions()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin">
              <div className="layout-content">
                <div className="layout-container animate-fade-in">
                  {renderPageContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Root App component with providers
export default function App() {
  return (
    <AuthProvider>
      <UserJourneyProvider>
        <AppContent />
      </UserJourneyProvider>
    </AuthProvider>
  );
}