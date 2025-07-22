import { useState, useEffect } from 'react';

export interface Bookmark {
  id: string;
  name: string;
  icon: string;
  tab: string;
  url: string;
  description?: string;
  userRole?: 'merchant' | 'analyst' | 'both';
  order: number;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useBookmarks(userRole: 'merchant' | 'analyst') {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Storage key based on user role for isolation
  const storageKey = `bookmarks_${userRole}`;

  // Default bookmarks for different user types
  const getDefaultBookmarks = (): Bookmark[] => {
    if (userRole === 'merchant') {
      return [
        {
          id: 'default-operations',
          name: 'Operations Hub',
          icon: 'Package',
          tab: 'shipping',
          url: '/shipping',
          description: 'Quick access to shipping operations',
          userRole: 'merchant',
          order: 0,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'default-analytics',
          name: 'Cost Analytics',
          icon: 'TrendingUp',
          tab: 'analytics',
          url: '/analytics',
          description: 'Monitor shipping costs and trends',
          userRole: 'merchant',
          order: 1,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } else {
      return [
        {
          id: 'default-clients',
          name: 'Client Projects',
          icon: 'Users',
          tab: 'client-projects',
          url: '/client-projects',
          description: 'Manage client analysis projects',
          userRole: 'analyst',
          order: 0,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'default-bulk',
          name: 'Bulk Analysis',
          icon: 'Zap',
          tab: 'bulk-analysis',
          url: '/bulk-analysis',
          description: 'Process multiple datasets',
          userRole: 'analyst',
          order: 1,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  };

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsedBookmarks = JSON.parse(saved);
          setBookmarks(parsedBookmarks);
        } else {
          // Initialize with default bookmarks for new users
          const defaults = getDefaultBookmarks();
          setBookmarks(defaults);
          localStorage.setItem(storageKey, JSON.stringify(defaults));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [userRole]);

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  // Add a new bookmark
  const addBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: bookmarks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(updatedBookmarks);
    return newBookmark;
  };

  // Add bookmark for current page
  const addCurrentPageBookmark = (currentTab: string, customName?: string) => {
    // Check if bookmark already exists
    const existingBookmark = bookmarks.find(b => b.tab === currentTab);
    if (existingBookmark) {
      return existingBookmark;
    }

    // Page mapping for auto-detection
    const pageMapping: Record<string, { name: string; icon: string; description: string }> = {
      'dashboard': { name: 'Dashboard', icon: 'BarChart3', description: 'Main overview page' },
      'upload': { name: 'Upload Data', icon: 'Upload', description: 'File upload page' },
      'analysis': { name: 'Analysis Results', icon: 'Activity', description: 'Analysis and insights' },
      'reports': { name: 'Reports', icon: 'FileText', description: 'Generate and view reports' },
      'shipping': { name: 'Shipping Tools', icon: 'Truck', description: 'Shipping utilities' },
      'analytics': { name: 'Analytics', icon: 'TrendingUp', description: 'Data analytics dashboard' },
      'integrations': { name: 'Integrations', icon: 'Globe', description: 'Connect external services' },
      'account': { name: 'Account', icon: 'User', description: 'Account settings' },
      'help': { name: 'Knowledge Base', icon: 'HelpCircle', description: 'Help and documentation' },
      'admin-settings': { name: 'Admin Settings', icon: 'Settings', description: 'Platform configuration' }
    };

    const pageData = pageMapping[currentTab] || {
      name: customName || currentTab,
      icon: 'Star',
      description: 'Custom bookmark'
    };

    return addBookmark({
      name: customName || pageData.name,
      icon: pageData.icon,
      tab: currentTab,
      url: `/${currentTab}`,
      description: pageData.description,
      userRole: 'both'
    });
  };

  // Update a bookmark
  const updateBookmark = (bookmarkId: string, updates: Partial<Bookmark>) => {
    const updatedBookmarks = bookmarks.map(bookmark =>
      bookmark.id === bookmarkId
        ? { ...bookmark, ...updates, updatedAt: new Date().toISOString() }
        : bookmark
    );
    saveBookmarks(updatedBookmarks);
  };

  // Delete a bookmark
  const deleteBookmark = (bookmarkId: string) => {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (bookmark?.isDefault) {
      console.warn('Cannot delete default bookmark');
      return;
    }

    const updatedBookmarks = bookmarks
      .filter(b => b.id !== bookmarkId)
      .map((bookmark, index) => ({ ...bookmark, order: index }));
    
    saveBookmarks(updatedBookmarks);
  };

  // Reorder bookmarks
  const reorderBookmarks = (newBookmarks: Bookmark[]) => {
    const reorderedBookmarks = newBookmarks.map((bookmark, index) => ({
      ...bookmark,
      order: index,
      updatedAt: new Date().toISOString()
    }));
    saveBookmarks(reorderedBookmarks);
  };

  // Get bookmarks filtered by role
  const getFilteredBookmarks = () => {
    return bookmarks
      .filter(bookmark => bookmark.userRole === 'both' || bookmark.userRole === userRole)
      .sort((a, b) => a.order - b.order);
  };

  // Check if a page is bookmarked
  const isBookmarked = (tab: string) => {
    return bookmarks.some(bookmark => bookmark.tab === tab);
  };

  // Get bookmark by tab
  const getBookmarkByTab = (tab: string) => {
    return bookmarks.find(bookmark => bookmark.tab === tab);
  };

  // Reset to default bookmarks
  const resetToDefaults = () => {
    const defaults = getDefaultBookmarks();
    saveBookmarks(defaults);
  };

  // Export bookmarks
  const exportBookmarks = () => {
    return {
      bookmarks,
      exportDate: new Date().toISOString(),
      userRole,
      version: '1.0'
    };
  };

  // Import bookmarks
  const importBookmarks = (importData: any) => {
    try {
      if (importData.bookmarks && Array.isArray(importData.bookmarks)) {
        const importedBookmarks = importData.bookmarks.map((bookmark: any, index: number) => ({
          ...bookmark,
          id: `imported_${Date.now()}_${index}`,
          order: bookmarks.length + index,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        const allBookmarks = [...bookmarks, ...importedBookmarks];
        saveBookmarks(allBookmarks);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing bookmarks:', error);
      return false;
    }
  };

  return {
    bookmarks: getFilteredBookmarks(),
    loading,
    addBookmark,
    addCurrentPageBookmark,
    updateBookmark,
    deleteBookmark,
    reorderBookmarks,
    isBookmarked,
    getBookmarkByTab,
    resetToDefaults,
    exportBookmarks,
    importBookmarks,
    saveBookmarks: (newBookmarks: Bookmark[]) => {
      const reorderedBookmarks = newBookmarks.map((bookmark, index) => ({
        ...bookmark,
        order: index,
        updatedAt: new Date().toISOString()
      }));
      saveBookmarks(reorderedBookmarks);
    }
  };
}