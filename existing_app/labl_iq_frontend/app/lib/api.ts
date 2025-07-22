
import axios from 'axios';

// FastAPI backend base URL - update this to your actual backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://labl-iq-backend.onrender.com';

// Demo mode - set to true to use mock data instead of API calls
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || false;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle token refresh and network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors (backend not available)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('Backend not available, using mock data');
      return Promise.reject(new Error('BACKEND_UNAVAILABLE'));
    }
    
    if (error.response?.status === 401) {
      // Token expired, try to refresh or redirect to login
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
  originZip?: string;
  defaultMarkup?: number;
  defaultSurcharge?: number;
}

export interface Analysis {
  id: string;
  filename: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  backendAnalysisId?: string;
  results?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnProfile {
  id: string;
  name: string;
  description?: string;
  mapping: any;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnMapping {
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  originZip?: string;
  destinationZip?: string;
  serviceLevel?: string;
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('jwt_token', response.data.access_token);
    }
    return response.data;
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  },

  me: async (): Promise<User> => {
    if (DEMO_MODE) {
      return {
        id: 'demo-user-1',
        email: 'john@doe.com',
        role: 'ADMIN',
        originZip: '90210',
        defaultMarkup: 15.0,
        defaultSurcharge: 2.50,
      };
    }
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  updateSettings: async (settings: Partial<User>): Promise<User> => {
    if (DEMO_MODE) {
      return {
        id: 'demo-user-1',
        email: 'john@doe.com',
        role: 'ADMIN',
        ...settings,
      };
    }
    const response = await api.put('/api/auth/settings', settings);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
  },
};

// Analysis API
export const analysisAPI = {
  // Public test upload endpoint (no authentication required)
  testUpload: async (file: File, onProgress?: (progress: number) => void): Promise<{
    status: string;
    message: string;
    fileName: string;
    fileSize: number;
    columns: string[];
    rowCount: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/test-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  upload: async (file: File, onProgress?: (progress: number) => void): Promise<{ analysis_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/analysis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  mapColumns: async (analysisId: string, mapping: ColumnMapping): Promise<void> => {
    await api.post('/api/analysis/map-columns', {
      analysis_id: analysisId,
      column_mapping: mapping,
    });
  },

  process: async (
    analysisId: string,
    settings: {
      originZip: string;
      markup: number;
      surcharge: number;
    }
  ): Promise<{ backend_analysis_id: string }> => {
    const response = await api.post('/api/analysis/process', {
      analysis_id: analysisId,
      settings,
    });
    return response.data;
  },

  testProcess: async (
    file: File,
    settings: {
      amazonRate: number;
      fuelSurcharge: number;
      markupPercent: number;
      serviceLevel: string;
    }
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('amazon_rate', settings.amazonRate.toString());
    formData.append('fuel_surcharge', settings.fuelSurcharge.toString());
    formData.append('markup_percent', settings.markupPercent.toString());
    formData.append('service_level', settings.serviceLevel);

    const response = await api.post('/api/test-process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getResults: async (analysisId: string): Promise<any> => {
    const response = await api.get(`/api/analysis/results/${analysisId}`);
    return response.data;
  },

  getHistory: async (): Promise<Analysis[]> => {
    if (DEMO_MODE) {
      return [
        {
          id: 'analysis-1',
          filename: 'shipping_data_q4_2024.csv',
          status: 'COMPLETED',
          backendAnalysisId: 'backend-1',
          results: { summary: { totalSavings: 2750.50 } },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'analysis-2',
          filename: 'monthly_shipments_nov.xlsx',
          status: 'COMPLETED',
          backendAnalysisId: 'backend-2',
          results: { summary: { totalSavings: 1890.25 } },
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 'analysis-3',
          filename: 'sample_data.csv',
          status: 'PROCESSING',
          createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          updatedAt: new Date(Date.now() - 600000).toISOString(),
        },
      ];
    }
    const response = await api.get('/api/analysis/history');
    return response.data;
  },

  getStatus: async (analysisId: string): Promise<{ status: string; progress?: number }> => {
    const response = await api.get(`/api/analysis/status/${analysisId}`);
    return response.data;
  },
};

// Column Profiles API
export const profilesAPI = {
  getAll: async (): Promise<ColumnProfile[]> => {
    if (DEMO_MODE) {
      return [
        {
          id: 'profile-1',
          name: 'Standard Shipping Profile',
          description: 'Standard column mapping for typical shipping data exports',
          mapping: {
            weight: 'Weight',
            length: 'Length',
            width: 'Width',
            height: 'Height',
            destinationZip: 'Destination ZIP',
            serviceLevel: 'Service Level'
          },
          createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
          updatedAt: new Date(Date.now() - 604800000).toISOString(),
        },
        {
          id: 'profile-2',
          name: 'E-commerce Profile',
          description: 'Optimized for online store shipments',
          mapping: {
            weight: 'Package Weight',
            length: 'Box Length',
            width: 'Box Width',
            height: 'Box Height',
            destinationZip: 'Customer ZIP',
            originZip: 'Warehouse ZIP'
          },
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 259200000).toISOString(),
        },
      ];
    }
    const response = await api.get('/api/profiles/list');
    return response.data.profiles || [];
  },

  create: async (profile: Omit<ColumnProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ColumnProfile> => {
    const response = await api.post('/api/profiles', profile);
    return response.data;
  },

  delete: async (profileId: string): Promise<void> => {
    await api.delete(`/api/profiles/${profileId}`);
  },
};

// Admin API
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    if (DEMO_MODE) {
      return [
        {
          id: 'demo-user-1',
          email: 'john@doe.com',
          role: 'ADMIN',
          originZip: '90210',
          defaultMarkup: 15.0,
          defaultSurcharge: 2.50,
        },
        {
          id: 'demo-user-2',
          email: 'jane.smith@company.com',
          role: 'USER',
          originZip: '10001',
          defaultMarkup: 10.0,
          defaultSurcharge: 1.50,
        },
        {
          id: 'demo-user-3',
          email: 'mike.jones@logistics.com',
          role: 'USER',
          originZip: '60601',
          defaultMarkup: 12.5,
          defaultSurcharge: 2.00,
        },
      ];
    }
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    if (DEMO_MODE) {
      return {
        id: userId,
        email: 'demo@user.com',
        role: role,
        originZip: '90210',
        defaultMarkup: 10.0,
        defaultSurcharge: 1.50,
      };
    }
    const response = await api.put(`/api/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deactivateUser: async (userId: string): Promise<void> => {
    if (DEMO_MODE) {
      // In demo mode, just return success
      return Promise.resolve();
    }
    await api.put(`/api/admin/users/${userId}/deactivate`);
  },
};

export default api;
