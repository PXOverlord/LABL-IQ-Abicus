
import axios from 'axios';
import { FASTAPI_BASE_URL } from './config';

// FastAPI backend base URL - update this to your actual backend URL
const BACKEND_URL = FASTAPI_BASE_URL || 'https://labl-iq-backend.onrender.com';

// Demo mode - set to true to use mock data instead of API calls
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || false;

const api = axios.create({
  baseURL: BACKEND_URL,
});

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
  const encoded = match?.[1];
  const simple = match?.[2];
  const candidate = encoded ? decodeURIComponent(encoded) : simple;
  return candidate?.trim() || fallback;
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

function storeTokens(accessToken?: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;
  if (accessToken) {
    localStorage.setItem('jwt_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
}

function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('refresh_token');
}

let refreshRequest: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshRequest) {
    return refreshRequest;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  refreshRequest = axios
    .post<AuthResponse>(
      `${BACKEND_URL}/api/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then((response) => {
      const { access_token, refresh_token } = response.data;
      if (access_token) {
        storeTokens(access_token, refresh_token || refreshToken);
      }
      return access_token ?? null;
    })
    .catch((error) => {
      console.error('Token refresh failed:', error);
      clearTokens();
      return null;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAccessToken();
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
    
    const { response: resp, config } = error;

    if (resp?.status === 401 && config) {
      const originalRequest = config as typeof config & { _retry?: boolean };
      if (originalRequest._retry) {
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  role: string;
  originZip?: string;
  defaultMarkup?: number;
  defaultSurcharge?: number;
  weightConversion?: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  originZip?: string | null;
  defaultMarkup: number;
  fuelSurcharge: number;
  dasSurcharge: number;
  edasSurcharge: number;
  remoteSurcharge: number;
  dimDivisor: number;
  standardMarkup: number;
  expeditedMarkup: number;
  priorityMarkup: number;
  nextDayMarkup: number;
  createdAt: string;
  updatedAt: string;
}

export interface Analysis {
  id: string;
  fileName?: string | null;
  filename?: string | null; // legacy support
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  fileSize?: number;
  columnMapping?: Record<string, any> | null;
  amazonRate?: number | null;
  fuelSurcharge?: number | null;
  serviceLevel?: string | null;
  markupPercent?: number | null;
  totalPackages?: number | null;
  totalCurrentCost?: number | null;
  totalAmazonCost?: number | null;
  totalSavings?: number | null;
  percentSavings?: number | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  merchant?: string | null;
  title?: string | null;
  tags?: string[] | null;
  notes?: string | null;
  results?: any[];
  settings?: Record<string, any> | null;
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
  from_zip?: string;
  to_zip?: string;
  carrier?: string;
  rate?: string;
  zone?: string;
  service_level?: string;
  package_type?: string;
  shipment_id?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  suggestions?: string[];
}

export interface AssistantSession {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  messages: AssistantMessage[];
}

export interface AnalysisComparisonItem {
  id: string;
  filename?: string | null;
  title?: string | null;
  merchant?: string | null;
  notes?: string | null;
  timestamp?: string | null;
  totalSavings: number;
  totalShipments: number;
  avgSavingsPerShipment: number;
  percentSavings?: number;
  totalCurrentCost?: number;
  totalAmazonCost?: number;
  error?: string;
}

export interface AnalysisComparisonSummary {
  totalSavings: number;
  totalShipments: number;
  avgSavingsPerShipment: number;
  totalCurrentCost: number;
  totalAmazonCost: number;
  trend: { date: string; savings: number; shipments: number }[];
  zones: { zone: number; count: number }[];
  weights: { bucket: string; count: number }[];
  merchants: {
    merchant: string;
    analyses: number;
    totalSavings: number;
    totalShipments: number;
    avgSavingsPerShipment: number;
  }[];
}

export interface AnalysisComparisonResponse {
  items: AnalysisComparisonItem[];
  summary: AnalysisComparisonSummary;
}

export interface AnalysisUploadResponse {
  analysisId: string;
  fileName: string;
  fileSize: number;
  columns: string[];
  suggestedMappings?: Record<string, string>;
  message?: string;
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.set('username', email);
    formData.set('password', password);

    const response = await api.post<AuthResponse>(
      '/api/auth/login',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = response.data;
    storeTokens(access_token, refresh_token);

    return response.data;
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<User>('/api/auth/register', { email, password });
    return {
      access_token: '',
      refresh_token: '',
      token_type: 'bearer',
      expires_in: 0,
    };
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
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  getSettings: async (): Promise<UserSettings> => {
    if (DEMO_MODE) {
      const now = new Date().toISOString();
      return {
        id: 'demo-settings',
        userId: 'demo-user-1',
        originZip: '90210',
        defaultMarkup: 10,
        fuelSurcharge: 16,
        dasSurcharge: 1.98,
        edasSurcharge: 3.92,
        remoteSurcharge: 14.15,
        dimDivisor: 139,
        standardMarkup: 0,
        expeditedMarkup: 10,
        priorityMarkup: 15,
        nextDayMarkup: 25,
        createdAt: now,
        updatedAt: now,
      };
    }
    const response = await api.get<UserSettings>('/api/auth/settings');
    return response.data;
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    if (DEMO_MODE) {
      const now = new Date().toISOString();
      return {
        id: 'demo-settings',
        userId: 'demo-user-1',
        originZip: settings.originZip ?? '90210',
        defaultMarkup: settings.defaultMarkup ?? 10,
        fuelSurcharge: settings.fuelSurcharge ?? 16,
        dasSurcharge: settings.dasSurcharge ?? 1.98,
        edasSurcharge: settings.edasSurcharge ?? 3.92,
        remoteSurcharge: settings.remoteSurcharge ?? 14.15,
        dimDivisor: settings.dimDivisor ?? 139,
        standardMarkup: settings.standardMarkup ?? 0,
        expeditedMarkup: settings.expeditedMarkup ?? 10,
        priorityMarkup: settings.priorityMarkup ?? 15,
        nextDayMarkup: settings.nextDayMarkup ?? 25,
        createdAt: now,
        updatedAt: now,
      };
    }
    const response = await api.put<UserSettings>('/api/auth/settings', settings);
    return response.data;
  },

  logout: () => {
    clearTokens();
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

  upload: async (file: File, onProgress?: (progress: number) => void): Promise<AnalysisUploadResponse> => {
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

  getUploadDetails: async (analysisId: string): Promise<AnalysisUploadResponse> => {
    const response = await api.get(`/api/analysis/upload/${analysisId}/columns`);
    const data = response.data ?? {};
    let suggestedMappings = data.suggestedMappings;
    if (typeof suggestedMappings === 'string') {
      try {
        suggestedMappings = JSON.parse(suggestedMappings);
      } catch {
        suggestedMappings = {};
      }
    }
    return {
      analysisId: data.analysisId,
      fileName: data.fileName,
      fileSize: data.fileSize,
      columns: Array.isArray(data.columns) ? data.columns : [],
      suggestedMappings: suggestedMappings ?? {},
      message: data.message ?? 'Columns loaded successfully',
    };
  },

  mapColumns: async (
    analysisId: string,
    mapping: ColumnMapping
  ): Promise<{ message?: string; rowCount?: number }> => {
    const sanitizedMapping: Record<string, string> = {};
    Object.entries(mapping).forEach(([key, value]) => {
      if (value) {
        sanitizedMapping[key] = value;
      }
    });
    const response = await api.post(`/api/analysis/map-columns/${analysisId}`, sanitizedMapping);
    return response.data ?? {};
  },

  compare: async (ids: string[]): Promise<AnalysisComparisonResponse> => {
    if (!ids.length) {
      return {
        items: [],
        summary: {
          totalSavings: 0,
          totalShipments: 0,
          avgSavingsPerShipment: 0,
          totalCurrentCost: 0,
          totalAmazonCost: 0,
          trend: [],
          zones: [],
          weights: [],
          merchants: [],
        },
      };
    }
    const response = await api.get('/api/analysis/compare', {
      params: { ids: ids.join(',') },
    });
    return response.data as AnalysisComparisonResponse;
  },

  process: async (
    analysisId: string,
    payload: {
      amazonRate?: number;
      fuelSurcharge?: number;
      serviceLevel?: string;
      markupPercent?: number;
      useAdvancedSettings?: boolean;
    }
  ): Promise<any> => {
    const response = await api.post('/api/analysis/process', {
      analysisId,
      amazonRate: payload.amazonRate ?? 0.5,
      fuelSurcharge: payload.fuelSurcharge ?? 16.0,
      serviceLevel: payload.serviceLevel ?? 'standard',
      markupPercent: payload.markupPercent,
      useAdvancedSettings: payload.useAdvancedSettings ?? true,
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
      originZip?: string;
    },
    columnMapping?: ColumnMapping
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('amazon_rate', settings.amazonRate.toString());
    formData.append('fuel_surcharge', settings.fuelSurcharge.toString());
    formData.append('markup_percent', settings.markupPercent.toString());
    formData.append('service_level', settings.serviceLevel);
    
    if (settings.originZip) {
      formData.append('origin_zip', settings.originZip);
    }
    
    if (columnMapping) {
      formData.append('column_mapping', JSON.stringify(columnMapping));
    }

    const response = await api.post('/api/test-process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getResults: async (analysisId: string): Promise<any> => {
    const response = await api.get(`/api/analysis/results/${analysisId}`);
    const data = response.data || {};
    if (typeof data.columnMapping === 'string') {
      try {
        data.columnMapping = JSON.parse(data.columnMapping);
      } catch {
        data.columnMapping = null;
      }
    }
    if (typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags);
      } catch {
        data.tags = data.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean);
      }
    }
    data.results = data.results || [];
    data.settings = data.settings || {};
    if (data.visualizations && typeof data.visualizations === 'object') {
      const parsed: Record<string, any> = {};
      Object.entries(data.visualizations).forEach(([key, value]) => {
        if (typeof value === 'string') {
          try {
            parsed[key] = JSON.parse(value);
          } catch {
            parsed[key] = value;
          }
        } else {
          parsed[key] = value;
        }
      });
      data.visualizations = parsed;
    }
    return data;
  },

  deleteAnalysis: async (analysisId: string): Promise<void> => {
    await api.delete(`/api/analysis/${analysisId}`);
  },

  updateMetadata: async (analysisId: string, payload: { merchant?: string; title?: string; tags?: string[]; notes?: string }): Promise<Analysis> => {
    const response = await api.patch(`/api/analysis/${analysisId}/meta`, payload);
    return response.data;
  },

  exportAnalysis: async (analysisId: string, format: 'csv' | 'excel' | 'pdf'): Promise<{ blob: Blob; filename: string }> => {
    const response = await api.get(`/api/analysis/export/${analysisId}/${format}`, {
      responseType: 'blob',
    });
    const fallbackName = `analysis_${analysisId}.${format === 'excel' ? 'xlsx' : format}`;
    const filename = extractFilename(response.headers['content-disposition'], fallbackName);
    const blob = response.data instanceof Blob
      ? response.data
      : new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
    return { blob, filename };
  },

  getHistory: async (options?: { offset?: number; limit?: number }): Promise<Analysis[]> => {
    if (DEMO_MODE) {
      return [
        {
          id: 'analysis-1',
          fileName: 'shipping_data_q4_2024.csv',
          filename: 'shipping_data_q4_2024.csv',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'analysis-2',
          fileName: 'monthly_shipments_nov.xlsx',
          filename: 'monthly_shipments_nov.xlsx',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 'analysis-3',
          fileName: 'sample_data.csv',
          filename: 'sample_data.csv',
          status: 'PROCESSING',
          createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          updatedAt: new Date(Date.now() - 600000).toISOString(),
        },
      ];
    }
    const params: Record<string, number> = {};
    if (typeof options?.offset === 'number') {
      params.skip = options.offset;
    }
    if (typeof options?.limit === 'number') {
      params.limit = options.limit;
    }

    const response = await api.get('/api/analysis', {
      params,
    });

    const records: Analysis[] = (response.data || []).map((item: any) => {
      let columnMapping = item.columnMapping;
      if (typeof columnMapping === 'string') {
        try {
          columnMapping = JSON.parse(columnMapping);
        } catch {
          columnMapping = null;
        }
      }

      let tags = item.tags;
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags);
        } catch {
          tags = tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter(Boolean);
        }
      }

      let visualizations = item.visualizations;
      if (visualizations && typeof visualizations === 'object') {
        const parsed: Record<string, any> = {};
        Object.entries(visualizations).forEach(([key, value]) => {
          if (typeof value === 'string') {
            try {
              parsed[key] = JSON.parse(value);
            } catch {
              parsed[key] = value;
            }
          } else {
            parsed[key] = value;
          }
        });
        visualizations = parsed;
      }

      return {
        id: item.id,
        fileName: item.fileName,
        filename: item.fileName, // maintain legacy accessor
        status: item.status,
        fileSize: item.fileSize,
        columnMapping,
        amazonRate: item.amazonRate,
        fuelSurcharge: item.fuelSurcharge,
        serviceLevel: item.serviceLevel,
        markupPercent: item.markupPercent,
        totalPackages: item.totalPackages,
        totalCurrentCost: item.totalCurrentCost,
        totalAmazonCost: item.totalAmazonCost,
        totalSavings: item.totalSavings,
        percentSavings: item.percentSavings,
        errorMessage: item.errorMessage,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        completedAt: item.completedAt,
        merchant: item.merchant,
        title: item.title,
        tags,
        notes: item.notes,
        results: item.results || [],
        settings: item.settings || {},
        totalResults: item.totalResults ?? item.totalPackages ?? item.results?.length ?? 0,
        previewCount: item.previewCount ?? item.results?.length ?? 0,
        visualizations: visualizations ?? null,
      };
    });

    return records;
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
    const response = await api.get('/api/analysis/profiles');
    const profiles: ColumnProfile[] = (response.data || []).map((profile: any) => {
      let mapping = profile.mapping;
      if (typeof mapping === 'string') {
        try {
          mapping = JSON.parse(mapping);
        } catch {
          mapping = {};
        }
      }
      return {
        ...profile,
        mapping,
      };
    });

    return profiles;
  },

  create: async (profile: { name: string; description?: string; mapping: Record<string, any>; isPublic?: boolean }): Promise<ColumnProfile> => {
    const response = await api.post('/api/analysis/profiles', {
      name: profile.name,
      description: profile.description,
      mapping: profile.mapping,
      isPublic: profile.isPublic ?? false,
    });
    const data = response.data;
    let mapping = data.mapping;
    if (typeof mapping === 'string') {
      try {
        mapping = JSON.parse(mapping);
      } catch {
        mapping = {};
      }
    }
    return {
      ...data,
      mapping,
    };
  },

  delete: async (profileId: string): Promise<void> => {
    await api.delete(`/api/analysis/profiles/${profileId}`);
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

// Assistant API
const mapAssistantMessage = (payload: any): AssistantMessage => ({
  id: payload?.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role: (payload?.role ?? 'assistant') as AssistantMessage['role'],
  content: payload?.content ?? '',
  createdAt: payload?.createdAt ?? payload?.created_at ?? new Date().toISOString(),
  suggestions: Array.isArray(payload?.suggestions)
    ? (payload.suggestions as string[])
    : undefined,
});

const mapAssistantSession = (payload: any): AssistantSession => ({
  sessionId: payload?.sessionId ?? payload?.session_id ?? '',
  createdAt: payload?.createdAt ?? payload?.created_at ?? new Date().toISOString(),
  updatedAt: payload?.updatedAt ?? payload?.updated_at ?? payload?.createdAt ?? new Date().toISOString(),
  messages: Array.isArray(payload?.messages)
    ? (payload.messages as any[]).map(mapAssistantMessage)
    : [],
});

export const assistantAPI = {
  async createSession(context?: Record<string, any>): Promise<AssistantSession> {
    const response = await api.post('/api/assistant/sessions', { context });
    return mapAssistantSession(response.data);
  },

  async getSession(sessionId: string): Promise<AssistantSession> {
    const response = await api.get(`/api/assistant/sessions/${sessionId}`);
    return mapAssistantSession(response.data);
  },

  async sendMessage(
    sessionId: string,
    message: string,
    context?: Record<string, any>
  ): Promise<{ message: AssistantMessage; session: AssistantSession }> {
    const response = await api.post(`/api/assistant/sessions/${sessionId}/messages`, {
      message,
      context,
    });
    return {
      message: mapAssistantMessage(response.data.message),
      session: mapAssistantSession(response.data.session),
    };
  },
};
