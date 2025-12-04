'use client';

import { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  Calendar,
  Zap,
  Bot
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface HeaderProps {
  onMenuToggle?: () => void;
  onAssistantOpen?: () => void;
}

export function Header({ onMenuToggle, onAssistantOpen }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center - Global Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search features, data, or ask AI..."
              className={`w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                isSearchFocused ? 'bg-white shadow-sm' : ''
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-600">
                K
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side - Date, Demo Mode, Notifications, AI, Settings, Profile */}
        <div className="flex items-center space-x-4">
          {/* Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span>{currentDate}</span>
          </div>

          {/* Demo Mode */}
          <Button
            variant="outline"
            size="sm"
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Zap className="h-3 w-3 mr-1" />
            Demo Mode
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-gray-100 text-gray-700"
          >
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
          </Button>

          {/* AI Assistant */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 text-gray-700"
            onClick={onAssistantOpen}
          >
            <Bot className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 text-gray-700"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 text-gray-700"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
