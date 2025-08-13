'use client';

import { useState, useEffect } from 'react';

interface ViewConfiguration {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'analysis' | 'settings' | 'admin';
  isVisible: boolean;
  isAccessible: boolean;
  order: number;
}

const defaultViews: ViewConfiguration[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard with overview',
    type: 'dashboard',
    isVisible: true,
    isAccessible: true,
    order: 1
  },
  {
    id: 'analysis',
    name: 'Rate Analysis',
    description: 'Shipping rate analysis tools',
    type: 'analysis',
    isVisible: true,
    isAccessible: true,
    order: 2
  },
  {
    id: 'upload',
    name: 'File Upload',
    description: 'Upload and process files',
    type: 'analysis',
    isVisible: true,
    isAccessible: true,
    order: 3
  },
  {
    id: 'history',
    name: 'Analysis History',
    description: 'View past analyses',
    type: 'analysis',
    isVisible: true,
    isAccessible: true,
    order: 4
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Advanced analytics and insights',
    type: 'dashboard',
    isVisible: true,
    isAccessible: true,
    order: 5
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'User preferences and configuration',
    type: 'settings',
    isVisible: true,
    isAccessible: true,
    order: 6
  },
  {
    id: 'profiles',
    name: 'Column Profiles',
    description: 'Manage column mapping profiles',
    type: 'settings',
    isVisible: true,
    isAccessible: true,
    order: 7
  },
  {
    id: 'admin',
    name: 'Admin Settings',
    description: 'Administrative settings',
    type: 'admin',
    isVisible: false,
    isAccessible: false,
    order: 8
  }
];

export function useViewManager() {
  const [viewConfigurations, setViewConfigurations] = useState<ViewConfiguration[]>(defaultViews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadViewConfigurations();
  }, []);

  const loadViewConfigurations = () => {
    try {
      const stored = localStorage.getItem('view_configurations');
      if (stored) {
        setViewConfigurations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load view configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveViewConfigurations = (configs: ViewConfiguration[]) => {
    try {
      localStorage.setItem('view_configurations', JSON.stringify(configs));
      setViewConfigurations(configs);
    } catch (error) {
      console.error('Failed to save view configurations:', error);
    }
  };

  const getVisibleViews = () => {
    return viewConfigurations
      .filter(view => view.isVisible)
      .sort((a, b) => a.order - b.order);
  };

  const getViewById = (id: string) => {
    return viewConfigurations.find(view => view.id === id);
  };

  const isViewAccessible = (id: string) => {
    const view = getViewById(id);
    return view?.isAccessible ?? false;
  };

  const updateViewVisibility = (id: string, isVisible: boolean) => {
    const updated = viewConfigurations.map(view =>
      view.id === id ? { ...view, isVisible } : view
    );
    saveViewConfigurations(updated);
  };

  const updateViewAccessibility = (id: string, isAccessible: boolean) => {
    const updated = viewConfigurations.map(view =>
      view.id === id ? { ...view, isAccessible } : view
    );
    saveViewConfigurations(updated);
  };

  const reorderViews = (newOrder: { id: string; order: number }[]) => {
    const updated = viewConfigurations.map(view => {
      const newOrderItem = newOrder.find(item => item.id === view.id);
      return newOrderItem ? { ...view, order: newOrderItem.order } : view;
    });
    saveViewConfigurations(updated);
  };

  return {
    viewConfigurations,
    loading,
    getVisibleViews,
    getViewById,
    isViewAccessible,
    updateViewVisibility,
    updateViewAccessibility,
    reorderViews
  };
}
