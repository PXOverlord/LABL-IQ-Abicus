
'use client';

import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { ConfigurationPanel } from './ConfigurationPanel';
import { Dashboard } from './Dashboard';
import { AnalysisResults } from './AnalysisResults';
import { Reports } from './Reports';
import { ShippingTools } from './ShippingTools';
import { Analytics } from './Analytics';
import { Account } from './Account';
import { Integrations } from './Integrations';
import { MainNavigation } from './MainNavigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarChart3, User, Bell, Menu, X, Activity, Calendar, Search } from 'lucide-react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LoginForm } from './LoginForm';

// Main authenticated app component
function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    setActiveTab('analysis');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isConfigOpen) {
      setIsConfigOpen(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-gray-500 animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'upload':
        return 'Upload Shipment Data';
      case 'analysis':
        return 'Analysis Results';
      case 'reports':
        return 'Reports';
      case 'shipping':
        return 'Shipping Tools';
      case 'analytics':
        return 'Analytics';
      case 'integrations':
        return 'Integrations';
      case 'account':
        return 'Account Settings';
      case 'help':
        return 'Help & Support';
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Monitor your shipping optimization performance and key metrics';
      case 'upload':
        return 'Upload your shipment data in CSV or Excel format to begin comprehensive rate analysis and optimization';
      case 'analysis':
        return 'Review detailed analysis results and optimization recommendations';
      case 'reports':
        return 'Generate and download comprehensive shipping analysis reports';
      case 'shipping':
        return 'Access shipping tools and utilities for rate optimization';
      case 'analytics':
        return 'Deep dive into your shipping analytics and trends';
      case 'integrations':
        return 'Connect with shipping carriers, e-commerce platforms, and business tools';
      case 'account':
        return 'Manage your account settings and preferences';
      case 'help':
        return 'Get help and support for using labl IQ Rate Analyzer';
      default:
        return 'Monitor your shipping optimization performance and key metrics';
    }
  };

  const renderPageContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <FileUpload onFileUpload={handleFileUpload} onAnalysisStart={setCurrentAnalysisId} />;
      case 'analysis':
        return <AnalysisResults analysisId={currentAnalysisId} />;
      case 'reports':
        return <Reports />;
      case 'shipping':
        return <ShippingTools />;
      case 'analytics':
        return <Analytics />;
      case 'integrations':
        return <Integrations />;
      case 'account':
        return <Account />;
      case 'help':
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-black">Coming Soon</h3>
              <p className="text-gray-600 max-w-md">
                This feature is currently under development and will be available in a future update.
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const getPageActions = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-black">
              Export Report
            </Button>
            <Button 
              size="sm" 
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => setActiveTab('upload')}
            >
              Analyze New Data
            </Button>
          </>
        );
      case 'upload':
        return (
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">
            Browse Files
          </Button>
        );
      case 'reports':
        return (
          <>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-black">
              Schedule Report
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Generate Report
            </Button>
          </>
        );
      case 'shipping':
        return (
          <>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-black">
              Save Configuration
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Calculate Rates
            </Button>
          </>
        );
      case 'analytics':
        return (
          <>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-black">
              Export Data
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Create Alert
            </Button>
          </>
        );
      case 'integrations':
        return (
          <>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-black">
              View API Docs
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Add Integration
            </Button>
          </>
        );
      case 'account':
        return (
          <>
            <Button variant="outline" size="sm" className="text-gray-600 hover:text-black">
              Download Data
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Save Settings
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Side Navigation - Fixed and responsive width */}
      <div className={`transition-all duration-300 ${isNavOpen ? 'w-64' : 'w-16'} shrink-0`}>
        <div className="fixed h-full overflow-hidden">
          <div className={`h-full ${isNavOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
            <MainNavigation 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onSettingsClick={() => setIsConfigOpen(!isConfigOpen)}
              isOpen={isNavOpen}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Menu Toggle and Context */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    className="p-2 text-black hover:bg-gray-100"
                  >
                    {isNavOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Menu className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {/* Current page context */}
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                {/* Search - shown when navigation is open */}
                {isNavOpen && (
                  <div className="hidden lg:flex items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search shipments, rates..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Section - Status and Actions */}
              <div className="flex items-center space-x-4">
                {/* User info */}
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>July 2, 2025</span>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1.5">
                    <Activity className="w-3 h-3 mr-2" />
                    System Ready
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hidden sm:flex relative text-gray-600 hover:text-black hover:bg-gray-100">
                    <Bell className="w-4 h-4" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  </Button>
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-600 hover:text-black hover:bg-gray-100">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="flex flex-1">
          {/* Configuration Panel */}
          {isConfigOpen && (
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto shadow-sm">
              <ConfigurationPanel onClose={() => setIsConfigOpen(false)} />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6">
              <div className="max-w-7xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-black mb-2">
                      {getPageTitle()}
                    </h1>
                    <p className="text-lg text-gray-600">
                      {getPageDescription()}
                    </p>
                  </div>
                  
                  {/* Page-specific actions */}
                  <div className="flex items-center space-x-3">
                    {getPageActions()}
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6 bg-gray-50 min-h-screen">
              <div className="max-w-7xl">
                {renderPageContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Root App component with authentication provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
