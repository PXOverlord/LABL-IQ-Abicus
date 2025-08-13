import React from 'react';
import { BarChart3, Upload, TrendingUp, Settings, User, Package, FileText, HelpCircle, Link2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import svgPaths from '../imports/svg-y1djhgjz9c';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
}

interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

interface MainNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
  isOpen: boolean;
}

// Custom SVG Icons from Figma imports
function UserIcon() {
  return (
    <div className="relative shrink-0 size-4">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <path
          d={svgPaths.p12d47180}
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function ShippingIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-4">
      <div className="absolute bottom-[18.75%] left-[13.75%] right-[13.75%] top-[18.75%]">
        <div className="absolute bottom-[-6%] left-[-5.172%] right-[-5.172%] top-[-6%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17 15"
          >
            <path
              d="M1 5H15.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M1 9.5H15.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M5 1V13.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d={svgPaths.p29d33680}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function AnalyticsIcon() {
  return (
    <div className="relative shrink-0 size-4">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <path
          d={svgPaths.p25c08880}
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function MainNavigation({ activeTab, onTabChange, onSettingsClick, isOpen }: MainNavigationProps) {
  const navigationSections: NavigationSection[] = [
    {
      title: "MAIN",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <BarChart3 className="w-4 h-4" />,
          active: activeTab === "dashboard"
        },
        {
          id: "upload",
          label: "Upload Data",
          icon: <Upload className="w-4 h-4" />,
          active: activeTab === "upload"
        },
        {
          id: "analysis",
          label: "Analysis Results",
          icon: <TrendingUp className="w-4 h-4" />,
          active: activeTab === "analysis"
        }
      ]
    },
    {
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: <FileText className="w-4 h-4" />
        },
        {
          id: "shipping",
          label: "Shipping Tools",
          icon: <ShippingIcon />
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: <AnalyticsIcon />
        },
        {
          id: "integrations",
          label: "Integrations",
          icon: <Link2 className="w-4 h-4" />
        }
      ]
    },
    {
      items: [
        {
          id: "account",
          label: "Account",
          icon: <UserIcon />
        },
        {
          id: "help",
          label: "Help",
          icon: <HelpCircle className="w-4 h-4" />
        }
      ]
    }
  ];

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = item.active;
    
    if (!isOpen) {
      // Collapsed view - icon only with tooltip
      return (
        <TooltipProvider key={item.id}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className={`relative rounded-lg shrink-0 w-full transition-colors duration-200 ${
                  isActive ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'
                }`}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-center px-3 py-3 h-auto font-medium text-sm transition-colors duration-200 ${
                    isActive 
                      ? 'text-black bg-transparent hover:bg-transparent' 
                      : 'text-gray-600 hover:text-black hover:bg-transparent'
                  }`}
                  onClick={() => onTabChange(item.id)}
                >
                  <div className={`transition-colors duration-200 ${
                    isActive ? 'text-black' : 'text-gray-500'
                  }`}>
                    {item.icon}
                  </div>
                </Button>
                
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute bg-black h-5 left-[-20px] rounded-br-[4px] rounded-tr-[4px] top-2 w-1"></div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{item.label}</p>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Expanded view - icon + text
    return (
      <div
        key={item.id}
        className={`relative rounded-lg shrink-0 w-full transition-colors duration-200 ${
          isActive ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-row items-center overflow-clip relative size-full">
          <Button
            variant="ghost"
            className={`w-full justify-start px-3 py-2 h-auto font-medium text-sm transition-colors duration-200 ${
              isActive 
                ? 'text-black bg-transparent hover:bg-transparent' 
                : 'text-gray-600 hover:text-black hover:bg-transparent'
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <div className="flex items-center space-x-2 w-full">
              <div className={`transition-colors duration-200 ${
                isActive ? 'text-black' : 'text-gray-500'
              }`}>
                {item.icon}
              </div>
              <span className="flex-1 text-left leading-5 text-nowrap tracking-[-0.084px]">
                {item.label}
              </span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {item.badge}
                </Badge>
              )}
            </div>
          </Button>
        </div>
        
        {/* Active indicator line */}
        {isActive && (
          <div className="absolute bg-black h-5 left-[-20px] rounded-br-[4px] rounded-tr-[4px] top-2 w-1"></div>
        )}
      </div>
    );
  };

  const renderSection = (section: NavigationSection, index: number) => (
    <div key={index} className="space-y-1">
      {section.title && isOpen && (
        <div className="px-1 mb-2">
          <div className="text-xs font-medium text-gray-400 leading-4 tracking-[0.48px] uppercase">
            {section.title}
          </div>
        </div>
      )}
      <div className="space-y-1">
        {section.items.map((item) => renderNavigationItem(item))}
      </div>
    </div>
  );

  return (
    <div className="bg-white relative h-full border-r border-gray-200 sticky top-0">
      <div className="relative h-full">
        <div className="flex flex-col h-full">
          {/* Header with logo - always visible */}
          <div className="p-3 border-b border-gray-200">
            {isOpen ? (
              // Expanded header
              <div className="bg-white box-border content-stretch flex flex-row gap-3 items-center justify-start overflow-clip p-3 rounded-lg border border-gray-100">
                {/* LABL Logo */}
                <div className="bg-[#222530] overflow-clip relative rounded-full shrink-0 size-10">
                  <div className="absolute h-5 left-1/2 translate-x-[-50%] translate-y-[-50%] w-5 top-1/2">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 20 20"
                    >
                      <g>
                        <path
                          d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z"
                          fill="white"
                        />
                        <path
                          d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
                
                {/* Company name */}
                <div className="flex flex-col gap-1 grow h-10 items-start justify-start min-h-px min-w-px">
                  <div className="font-medium text-sm text-black leading-5 tracking-[-0.084px]">
                    labl IQ Rate Analyzer
                  </div>
                  <div className="font-normal text-xs text-gray-500 leading-4">
                    Shipping Optimization
                  </div>
                </div>
              </div>
            ) : (
              // Collapsed header - just logo
              <div className="flex items-center justify-center">
                <div className="bg-[#222530] overflow-clip relative rounded-full shrink-0 size-10">
                  <div className="absolute h-5 left-1/2 translate-x-[-50%] translate-y-[-50%] w-5 top-1/2">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 20 20"
                    >
                      <g>
                        <path
                          d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z"
                          fill="white"
                        />
                        <path
                          d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className={`space-y-${isOpen ? '6' : '4'}`}>
              {navigationSections.map((section, index) => renderSection(section, index))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3">
            {isOpen ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettingsClick}
                className="w-full justify-start px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSettingsClick}
                      className="w-full justify-center px-3 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}