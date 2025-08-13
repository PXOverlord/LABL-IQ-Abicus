'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  X, 
  Command,
  FileText,
  BarChart3,
  Settings,
  User,
  Calendar,
  TrendingUp,
  Upload,
  History,
  Cog
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '../lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'action' | 'setting';
  icon: React.ComponentType<any>;
  href?: string;
  action?: () => void;
  keywords: string[];
}

const searchResults: SearchResult[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview and analytics',
    type: 'page',
    icon: BarChart3,
    href: '/dashboard',
    keywords: ['dashboard', 'overview', 'analytics', 'home', 'main']
  },
  {
    id: 'upload',
    title: 'Upload Files',
    description: 'Upload and process shipping data',
    type: 'action',
    icon: Upload,
    href: '/upload',
    keywords: ['upload', 'file', 'data', 'import', 'process']
  },
  {
    id: 'analysis',
    title: 'Rate Analysis',
    description: 'Analyze shipping rates and costs',
    type: 'page',
    icon: FileText,
    href: '/analysis',
    keywords: ['analysis', 'rates', 'shipping', 'costs', 'calculate']
  },
  {
    id: 'history',
    title: 'Analysis History',
    description: 'View past analyses and results',
    type: 'page',
    icon: History,
    href: '/history',
    keywords: ['history', 'past', 'results', 'previous', 'recent']
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Advanced analytics and insights',
    type: 'page',
    icon: TrendingUp,
    href: '/analytics',
    keywords: ['analytics', 'insights', 'trends', 'advanced', 'reports']
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure user preferences',
    type: 'page',
    icon: Settings,
    href: '/settings',
    keywords: ['settings', 'preferences', 'configure', 'options']
  },
  {
    id: 'profiles',
    title: 'Column Profiles',
    description: 'Manage column mapping profiles',
    type: 'page',
    icon: User,
    href: '/profiles',
    keywords: ['profiles', 'columns', 'mapping', 'templates']
  },
  {
    id: 'admin',
    title: 'Admin Settings',
    description: 'Administrative settings and configuration',
    type: 'page',
    icon: Cog,
    href: '/admin',
    keywords: ['admin', 'administrative', 'system', 'configuration']
  }
];

interface GlobalSearchProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function GlobalSearch({ isOpen = false, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults(searchResults);
    } else {
      const searchTerm = query.toLowerCase();
      const filtered = searchResults.filter(result =>
        result.keywords.some(keyword => keyword.includes(searchTerm)) ||
        result.title.toLowerCase().includes(searchTerm) ||
        result.description.toLowerCase().includes(searchTerm)
      );
      setFilteredResults(filtered);
      setSelectedIndex(0);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredResults.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredResults.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            handleResultSelect(filteredResults[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose]);

  const handleResultSelect = (result: SearchResult) => {
    if (result.href) {
      router.push(result.href);
    }
    if (result.action) {
      result.action();
    }
    onClose?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleResultSelect(filteredResults[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <Card className="w-full max-w-2xl mx-4 shadow-2xl border-2">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search for pages, actions, or settings..."
                className="flex-1 border-0 focus-visible:ring-0 text-lg"
              />
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded">⌘</kbd>
                <kbd className="px-2 py-1 bg-muted rounded">K</kbd>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredResults.length > 0 ? (
              <div className="p-2">
                {filteredResults.map((result, index) => {
                  const Icon = result.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <div
                      key={result.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                        isSelected ? "bg-accent" : "hover:bg-muted/50"
                      )}
                      onClick={() => handleResultSelect(result)}
                    >
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium truncate">{result.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.description}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <div className="text-xs text-muted-foreground">
                          Press Enter
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching for something else or browse the available options.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-muted/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Use ↑↓ to navigate</span>
                <span>Press Enter to select</span>
              </div>
              <span>ESC to close</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
