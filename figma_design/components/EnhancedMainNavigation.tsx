import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  BarChart3, 
  Upload, 
  Activity, 
  FileText, 
  Truck, 
  Settings, 
  Users, 
  Globe, 
  Package, 
  TrendingUp,
  Bell,
  HelpCircle,
  User,
  ChevronDown,
  Search,
  Filter,
  Zap,
  Target,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Bookmark,
  Plus,
  GripVertical,
  Calculator,
  X
} from 'lucide-react';

interface Bookmark {
  id: string;
  name: string;
  icon: string;
  tab: string;
  url: string;
  description?: string;
  userRole?: 'merchant' | 'analyst' | 'both';
  order: number;
  isDefault?: boolean;
}

interface ViewConfiguration {
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
  };
  navigation: {
    showInSidebar: boolean;
    sidebarOrder: number;
  };
}

interface EnhancedMainNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
  isOpen: boolean;
  userRole: 'merchant' | 'analyst';
  bookmarks?: Bookmark[];
  onBookmarkAdd?: (currentTab: string) => void;
  availableViews?: ViewConfiguration[];
}

export function EnhancedMainNavigation({ 
  activeTab, 
  onTabChange, 
  onSettingsClick,
  isOpen,
  userRole,
  bookmarks = [],
  onBookmarkAdd,
  availableViews = []
}: EnhancedMainNavigationProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('core');
  const [showBookmarkHint, setShowBookmarkHint] = useState(false);

  // Icon mapping for views and bookmarks
  const iconMap: Record<string, any> = {
    Package, Truck, BarChart3, FileText, Users, Globe, Settings, Calendar, Clock,
    Target, Zap, Bell, Search, Upload, Activity, Star, Bookmark, Plus, HelpCircle,
    User, CheckCircle, AlertTriangle, TrendingUp, Filter, Calculator
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Star;
  };

  // Group available views by category
  const groupedViews = availableViews.reduce((acc, view) => {
    if (!acc[view.category]) {
      acc[view.category] = [];
    }
    acc[view.category].push(view);
    return acc;
  }, {} as Record<string, ViewConfiguration[]>);

  // Sort views within each category by sidebar order
  Object.keys(groupedViews).forEach(category => {
    groupedViews[category].sort((a, b) => a.navigation.sidebarOrder - b.navigation.sidebarOrder);
  });

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      core: 'Core Platform',
      operations: userRole === 'merchant' ? 'Operations' : 'Client Operations',
      analytics: 'Analytics & Reports',
      admin: 'Administration',
      custom: 'Custom Tools'
    };
    return titles[category] || category;
  };

  // Filter bookmarks for current user role
  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.userRole === 'both' || bookmark.userRole === userRole
  ).sort((a, b) => a.order - b.order);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleBookmarkTab = (tab: string) => {
    onTabChange(tab);
  };

  const handleAddBookmark = () => {
    if (onBookmarkAdd) {
      onBookmarkAdd(activeTab);
      setShowBookmarkHint(false);
    }
  };

  // Show bookmark hint for new users
  useEffect(() => {
    if (filteredBookmarks.length === 0 && isOpen) {
      const timer = setTimeout(() => setShowBookmarkHint(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [filteredBookmarks.length, isOpen]);

  return (
    <TooltipProvider>
      <div className="h-full bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="bg-[#222530] w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g>
                  <path d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z" fill="white" />
                  <path d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z" fill="white" />
                </g>
              </svg>
            </div>
            
            {isOpen && (
              <div className="flex-1">
                <div className="font-semibold text-black">Labl IQ</div>
                <div className="text-xs text-gray-600 capitalize">
                  Your shipping intelligence platform
                </div>
              </div>
            )}
          </div>

          {/* Role Badge */}
          {isOpen && (
            <div className="mt-4">
              <Badge variant={
                userRole === 'merchant' ? 'default' : 'secondary'
              } className="w-full justify-center">
                {userRole === 'merchant' ? 'Merchant/3PL' : 'Rate Analyst'}
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Search */}
        {isOpen && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search features..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Bookmarks Section */}
        {filteredBookmarks.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            {isOpen && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookmarks
                </span>
                {onBookmarkAdd && (
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddBookmark}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Add current page to bookmarks
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
            
            <div className="space-y-1">
              {filteredBookmarks.map((bookmark) => {
                const IconComponent = getIconComponent(bookmark.icon);
                
                return (
                  <Tooltip key={bookmark.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeTab === bookmark.tab ? 'default' : 'ghost'}
                        size={isOpen ? 'default' : 'sm'}
                        onClick={() => handleBookmarkTab(bookmark.tab)}
                        className={`w-full justify-start transition-all duration-200 ${
                          activeTab === bookmark.tab
                            ? 'bg-black text-white shadow-sm'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-black'
                        } ${!isOpen ? 'px-2' : ''}`}
                      >
                        <IconComponent className={`${isOpen ? 'w-4 h-4 mr-3' : 'w-4 h-4'}`} />
                        {isOpen && (
                          <span className="flex-1 text-left">{bookmark.name}</span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right">
                        <div>
                          <div className="font-medium">{bookmark.name}</div>
                          {bookmark.description && (
                            <div className="text-xs text-gray-400">{bookmark.description}</div>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
            
            {isOpen && <Separator className="mt-4" />}
          </div>
        )}

        {/* Bookmark Hint */}
        {showBookmarkHint && filteredBookmarks.length === 0 && isOpen && onBookmarkAdd && (
          <div className="p-4 border-b border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Star className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-800">Create Bookmarks</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Add your favorite pages here for quick access
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddBookmark}
                    className="mt-2 text-xs h-7"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Bookmark This Page
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookmarkHint(false)}
                  className="h-4 w-4 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedViews).map(([category, views]) => (
            <div key={category}>
              {/* Section Header */}
              {isOpen && (
                <button
                  onClick={() => toggleSection(category)}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getCategoryTitle(category)}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${
                    expandedSection === category ? 'rotate-180' : ''
                  }`} />
                </button>
              )}

              {/* Navigation Items */}
              <div className={`space-y-1 ${!isOpen || expandedSection === category ? 'block' : 'hidden'}`}>
                {views.map((view) => {
                  const IconComponent = getIconComponent(view.icon);
                  
                  return (
                    <Tooltip key={view.id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTab === view.name ? 'default' : 'ghost'}
                          size={isOpen ? 'default' : 'sm'}
                          onClick={() => onTabChange(view.name)}
                          className={`w-full justify-start transition-all duration-200 ${
                            activeTab === view.name
                              ? 'bg-black text-white shadow-sm'
                              : 'hover:bg-gray-100 text-gray-700 hover:text-black'
                          } ${!isOpen ? 'px-2' : ''}`}
                        >
                          <IconComponent className={`${isOpen ? 'w-4 h-4 mr-3' : 'w-4 h-4'}`} />
                          {isOpen && (
                            <span className="flex-1 text-left">{view.title}</span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      {!isOpen && (
                        <TooltipContent side="right">
                          <div>
                            <div className="font-medium">{view.title}</div>
                            <div className="text-xs text-gray-400">{view.description}</div>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>

              {isOpen && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Settings */}
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isOpen ? 'default' : 'sm'}
                onClick={onSettingsClick}
                className={`w-full justify-start text-gray-700 hover:text-black hover:bg-gray-100 ${!isOpen ? 'px-2' : ''}`}
              >
                <Settings className={`${isOpen ? 'w-4 h-4 mr-3' : 'w-4 h-4'}`} />
                {isOpen && 'Settings'}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                Settings
              </TooltipContent>
            )}
          </Tooltip>

          {/* Account */}
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === 'account' ? 'default' : 'ghost'}
                size={isOpen ? 'default' : 'sm'}
                onClick={() => onTabChange('account')}
                className={`w-full justify-start ${
                  activeTab === 'account'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                } ${!isOpen ? 'px-2' : ''}`}
              >
                <User className={`${isOpen ? 'w-4 h-4 mr-3' : 'w-4 h-4'}`} />
                {isOpen && 'Account'}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                Account
              </TooltipContent>
            )}
          </Tooltip>

          {/* Help */}
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === 'help' ? 'default' : 'ghost'}
                size={isOpen ? 'default' : 'sm'}
                onClick={() => onTabChange('help')}
                className={`w-full justify-start ${
                  activeTab === 'help'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                } ${!isOpen ? 'px-2' : ''}`}
              >
                <HelpCircle className={`${isOpen ? 'w-4 h-4 mr-3' : 'w-4 h-4'}`} />
                {isOpen && 'Help & Support'}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                Help & Support
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}