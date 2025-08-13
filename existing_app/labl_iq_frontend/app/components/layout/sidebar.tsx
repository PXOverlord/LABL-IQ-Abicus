
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  FileText, 
  Download, 
  Settings, 
  User, 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  Percent,
  DollarSign,
  Sliders,
  Columns,
  TrendingUp,
  Activity,
  Shield,
  Database,
  Lock,
  Unlock
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    corePlatform: false, // Core Platform expanded by default
    settings: true,      // Settings collapsed by default
    analytics: true,      // Analytics collapsed by default
    reports: true,        // Reports collapsed by default
    operations: true,     // Operations collapsed by default
    administration: true  // Administration collapsed by default
  });
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({
    settings: false // Settings not locked by default
  });

  const corePlatform = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Data', href: '/upload', icon: Upload },
    { name: 'View Analyses', href: '/analysis', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Export Rate Sheet', href: '/export', icon: Download },
  ];

  const settings = [
    { name: 'Basic Settings', href: '/settings/basic', icon: Settings },
    { name: 'Rate Settings', href: '/settings/rates', icon: Percent },
    { name: 'Surcharge Settings', href: '/settings/surcharges', icon: DollarSign },
    { name: 'Advanced Settings', href: '/settings/advanced', icon: Sliders },
    { name: 'Column Mapping', href: '/settings/mapping', icon: Columns },
  ];

  const analytics = [
    { name: 'Cost Analytics', href: '/analytics/costs', icon: TrendingUp },
    { name: 'Performance Metrics', href: '/analytics/performance', icon: Activity },
    { name: 'Carrier Recommendations', href: '/analytics/carriers', icon: BarChart3 },
  ];

  const reports = [
    { name: 'Historical Reports', href: '/reports/historical', icon: FileText },
    { name: 'Performance Reports', href: '/reports/performance', icon: FileText },
    { name: 'Export Reports', href: '/reports/export', icon: Download },
  ];

  const operations = [
    { name: 'Operations Hub', href: '/operations', icon: Database },
    { name: 'Cost Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const administration = [
    { name: 'Admin', href: '/admin', icon: Shield },
    { name: 'User Management', href: '/users', icon: User },
  ];

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleLock = (section: string) => {
    setLockedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderNavItem = (item: any, isActive: boolean) => (
    <div
      key={item.name}
      className={`relative rounded-lg shrink-0 w-full transition-colors duration-200 ${
        isActive ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'
      }`}
    >
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <Link
          href={item.href}
          className={`w-full justify-start px-3 py-2 h-auto font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
            isActive 
              ? 'text-black bg-transparent hover:bg-transparent' 
              : 'text-gray-600 hover:text-black hover:bg-transparent'
          } ${!isOpen ? 'justify-center' : ''}`}
        >
          <div className={`transition-colors duration-200 ${
            isActive ? 'text-black' : 'text-gray-500'
          }`}>
            <item.icon className="w-4 h-4" />
          </div>
          {isOpen && (
            <span className="flex-1 text-left leading-5 text-nowrap tracking-[-0.084px]">
              {item.name}
            </span>
          )}
        </Link>
      </div>
      
      {/* Active indicator line */}
      {isActive && isOpen && (
        <div className="absolute bg-black h-5 left-[-20px] rounded-br-[4px] rounded-tr-[4px] top-2 w-1"></div>
      )}
    </div>
  );

  const renderCollapsibleSection = (title: string, items: any[], sectionKey: string, showLock = false) => {
    const isCollapsed = collapsedSections[sectionKey];
    const isLocked = lockedSections[sectionKey];
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {isOpen && (
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </span>
          )}
          <div className="flex items-center space-x-1">
            {showLock && isOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLock(sectionKey)}
                className="h-4 w-4 p-0 hover:bg-gray-100"
              >
                {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(sectionKey)}
              className={`h-4 w-4 p-0 hover:bg-gray-100 ${!isOpen ? 'mx-auto' : ''}`}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        {(!isCollapsed || isLocked) && (
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return renderNavItem(item, isActive);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isOpen ? 'w-80' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Logo - Always maintain shape */}
          <div className="bg-[#222530] w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
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
                Shipping Intelligence
              </div>
            </div>
          )}
        </div>
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

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Core Platform */}
          <div className="space-y-4">
            {renderCollapsibleSection('Core Platform', corePlatform, 'corePlatform')}
            
            {/* Settings within Core Platform */}
            {renderCollapsibleSection('Settings', settings, 'settings', true)}
          </div>

          {/* Analytics */}
          {renderCollapsibleSection('Analytics', analytics, 'analytics')}

          {/* Reports */}
          {renderCollapsibleSection('Reports', reports, 'reports')}

          {/* Operations */}
          {renderCollapsibleSection('Operations', operations, 'operations')}

          {/* Administration */}
          {renderCollapsibleSection('Administration', administration, 'administration')}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Settings */}
        <Button
          variant="ghost"
          size="default"
          className="w-full justify-start text-gray-700 hover:text-black hover:bg-gray-100"
        >
          <Settings className="w-4 h-4 mr-3" />
          {isOpen && 'Settings'}
        </Button>

        {/* Account */}
        <Button
          variant={pathname === '/account' ? 'default' : 'ghost'}
          size="default"
          className={`w-full justify-start ${
            pathname === '/account'
              ? 'bg-black text-white'
              : 'text-gray-700 hover:text-black hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4 mr-3" />
          {isOpen && 'Account'}
        </Button>

        {/* Help */}
        <Button
          variant={pathname === '/help' ? 'default' : 'ghost'}
          size="default"
          className={`w-full justify-start ${
            pathname === '/help'
              ? 'bg-black text-white'
              : 'text-gray-700 hover:text-black hover:bg-gray-100'
          }`}
        >
          <HelpCircle className="w-4 h-4 mr-3" />
          {isOpen && 'Help & Support'}
        </Button>
      </div>
    </div>
  );
}
