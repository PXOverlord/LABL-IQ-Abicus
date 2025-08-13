'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3, 
  User, 
  Bell, 
  Menu, 
  X, 
  Activity, 
  Calendar, 
  Search, 
  Bot, 
  Sparkles, 
  Settings as SettingsIcon, 
  Bookmark,
  Upload,
  FileText,
  TrendingUp,
  Cog,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useBookmarks } from '../hooks/useBookmarks';
import { useViewManager } from '../hooks/useViewManager';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    href: '/dashboard',
    description: 'Overview and analytics'
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: FileText,
    href: '/analysis',
    description: 'Rate analysis and calculations'
  },
  {
    id: 'upload',
    label: 'Upload',
    icon: Upload,
    href: '/upload',
    description: 'Upload and process files'
  },
  {
    id: 'history',
    label: 'History',
    icon: Calendar,
    href: '/history',
    description: 'Analysis history and results'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: TrendingUp,
    href: '/analytics',
    description: 'Advanced analytics and insights'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Cog,
    href: '/settings',
    description: 'User preferences and configuration'
  },
  {
    id: 'profiles',
    label: 'Profiles',
    icon: User,
    href: '/profiles',
    description: 'Column mapping profiles'
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: SettingsIcon,
    href: '/admin',
    description: 'Administrative settings',
    badge: 'Admin'
  }
];

export function EnhancedMainNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { bookmarks, addCurrentPageBookmark, isBookmarked } = useBookmarks('main');
  const { viewConfigurations, getVisibleViews } = useViewManager();
  
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsNavOpen(false);
      } else {
        setIsNavOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Set active tab based on current path
  useEffect(() => {
    const currentTab = navigationItems.find(item => pathname.startsWith(item.href))?.id || 'dashboard';
    setActiveTab(currentTab);
  }, [pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const item = navigationItems.find(nav => nav.id === tab);
    if (item) {
      router.push(item.href);
    }
  };

  const handleAddBookmark = (tab: string) => {
    const item = navigationItems.find(nav => nav.id === tab);
    if (item) {
      addCurrentPageBookmark({
        id: item.id,
        title: item.label,
        url: item.href,
        description: item.description
      });
    }
  };

  const handleGlobalSearch = () => {
    setIsGlobalSearchOpen(true);
  };

  const handleAIAssistant = () => {
    setIsAIAssistantOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-background border-r border-border
        transform transition-transform duration-300 ease-in-out z-40
        ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">LABL IQ</h1>
                <p className="text-sm text-muted-foreground">Rate Analyzer</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isBookmarkedItem = isBookmarked(item.id);
                  
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="w-full justify-start h-12 px-4 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddBookmark(item.id);
                          }}
                        >
                          <Bookmark className={`w-3 h-3 ${isBookmarkedItem ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleAIAssistant}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    AI Assistant
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/login')}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Top Bar */}
      <div className="lg:ml-64">
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <Badge variant="secondary">
                {navigationItems.find(item => item.id === activeTab)?.description || 'Overview'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleGlobalSearch}
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleAIAssistant}
              >
                <Bot className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
              >
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
              >
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isNavOpen && isMobile && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsNavOpen(false)}
        />
      )}
    </>
  );
}
