import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';

interface EnhancedNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
  isOpen: boolean;
  userRole: 'merchant' | 'analyst' | 'admin';
}

export function EnhancedNavigation({ 
  activeTab, 
  onTabChange, 
  onSettingsClick,
  isOpen,
  userRole 
}: EnhancedNavigationProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('core');

  // Define navigation structure based on user role
  const getNavigationStructure = () => {
    const baseStructure = {
      core: {
        title: 'Core Platform',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3, notifications: 0 },
          { id: 'upload', label: 'Data Upload', icon: Upload, notifications: 0 },
          { id: 'analysis', label: 'Analysis Results', icon: Activity, notifications: 2 },
          { id: 'reports', label: 'Reports', icon: FileText, notifications: 0 }
        ]
      }
    };

    if (userRole === 'merchant') {
      return {
        ...baseStructure,
        operations: {
          title: 'Operations',
          items: [
            { id: 'shipments', label: 'Shipment Tracking', icon: Package, notifications: 5 },
            { id: 'shipping', label: 'Shipping Tools', icon: Truck, notifications: 0 },
            { id: 'logistics', label: 'Logistics Hub', icon: Globe, notifications: 1 }
          ]
        },
        business: {
          title: 'Business Intelligence',
          items: [
            { id: 'analytics', label: 'Analytics', icon: TrendingUp, notifications: 0 },
            { id: 'performance', label: 'Performance', icon: Target, notifications: 0 },
            { id: 'alerts', label: 'Alerts & Monitoring', icon: AlertTriangle, notifications: 3 }
          ]
        }
      };
    } else if (userRole === 'analyst') {
      return {
        ...baseStructure,
        analysis: {
          title: 'Analysis Tools',
          items: [
            { id: 'bulk-analysis', label: 'Bulk Analysis', icon: Zap, notifications: 0 },
            { id: 'optimization', label: 'Optimization Engine', icon: Target, notifications: 0 },
            { id: 'client-projects', label: 'Client Projects', icon: Users, notifications: 4 }
          ]
        },
        consulting: {
          title: 'Consulting Tools',
          items: [
            { id: 'proposals', label: 'Proposals', icon: FileText, notifications: 2 },
            { id: 'presentations', label: 'Presentations', icon: BarChart3, notifications: 0 },
            { id: 'client-portal', label: 'Client Portal', icon: Globe, notifications: 1 }
          ]
        }
      };
    } else {
      return {
        ...baseStructure,
        admin: {
          title: 'Administration',
          items: [
            { id: 'users', label: 'User Management', icon: Users, notifications: 0 },
            { id: 'system', label: 'System Health', icon: Activity, notifications: 1 },
            { id: 'billing', label: 'Billing & Usage', icon: TrendingUp, notifications: 0 }
          ]
        }
      };
    }
  };

  const navigationStructure = getNavigationStructure();

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

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
                <div className="font-semibold text-black">labl</div>
                <div className="text-xs text-gray-600 capitalize">
                  {userRole === 'merchant' ? 'Operations' : userRole === 'analyst' ? 'Analytics' : 'Admin'} Suite
                </div>
              </div>
            )}
          </div>

          {/* Role Badge */}
          {isOpen && (
            <div className="mt-4">
              <Badge variant={
                userRole === 'merchant' ? 'default' : 
                userRole === 'analyst' ? 'secondary' : 'outline'
              } className="w-full justify-center">
                {userRole === 'merchant' ? 'Merchant/3PL' : 
                 userRole === 'analyst' ? 'Rate Analyst' : 'Administrator'}
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

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(navigationStructure).map(([sectionId, section]) => (
            <div key={sectionId}>
              {/* Section Header */}
              {isOpen && (
                <button
                  onClick={() => toggleSection(sectionId)}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${
                    expandedSection === sectionId ? 'rotate-180' : ''
                  }`} />
                </button>
              )}

              {/* Navigation Items */}
              <div className={`space-y-1 ${!isOpen || expandedSection === sectionId ? 'block' : 'hidden'}`}>
                {section.items.map((item) => (
                  <Tooltip key={item.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeTab === item.id ? 'default' : 'ghost'}
                        size={isOpen ? 'default' : 'sm'}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full justify-start transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-black text-white shadow-sm'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-black'
                        } ${!isOpen ? 'px-2' : ''}`}
                      >
                        <item.icon className={`${isOpen ? 'w-4 h-4 mr-3' : 'w-4 h-4'}`} />
                        {isOpen && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.notifications > 0 && (
                              <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0.5">
                                {item.notifications}
                              </Badge>
                            )}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right" className="flex items-center space-x-2">
                        <span>{item.label}</span>
                        {item.notifications > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {item.notifications}
                          </Badge>
                        )}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>

              {isOpen && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Integrations */}
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === 'integrations' ? 'default' : 'ghost'}
                size={isOpen ? 'default' : 'sm'}
                onClick={() => onTabChange('integrations')}
                className={`w-full justify-start ${
                  activeTab === 'integrations'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                } ${!isOpen ? 'px-2' : ''}`}
              >
                <Globe className={`${isOpen ? 'w-4 h-4 mr-3' : 'w-4 h-4'}`} />
                {isOpen && 'Integrations'}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                Integrations
              </TooltipContent>
            )}
          </Tooltip>

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