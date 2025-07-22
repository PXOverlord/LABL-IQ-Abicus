
// API configuration for production deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
  },
  analysis: {
    upload: '/api/analysis/upload',
    analyze: '/api/analysis/analyze',
    history: '/api/analysis/history',
    download: '/api/analysis/download',
  },
  admin: {
    users: '/api/admin/users',
    analytics: '/api/admin/analytics',
    settings: '/api/admin/settings',
  },
  health: '/api/health',
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function for authenticated requests
export const getAuthHeaders = (token?: string) => {
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  
  return {
    ...apiConfig.headers,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

// API client configuration for different environments
export const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Error handling helper
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null,
    };
  }
};
