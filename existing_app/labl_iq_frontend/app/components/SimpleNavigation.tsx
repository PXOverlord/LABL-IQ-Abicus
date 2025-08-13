'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  User, 
  Menu, 
  X,
  BarChart3,
  Upload,
  Settings,
  FileText
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { id: 'upload', label: 'Upload', href: '/upload', icon: Upload },
  { id: 'analysis', label: 'Analysis', href: '/analysis', icon: FileText },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

export function SimpleNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsNavOpen(false);
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
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out z-40
        ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {/* LABL Logo */}
              <div className="bg-[#222530] w-10 h-10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z" fill="white" />
                    <path d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z" fill="white" />
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-black">Labl IQ</h1>
                <p className="text-sm text-gray-600">Shipping Intelligence</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-8 h-8 bg-[#222530] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-black">Test User</p>
                <p className="text-xs text-gray-600 truncate">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsNavOpen(false)}
        />
      )}
    </>
  );
}
