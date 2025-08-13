// Authentication service with development mode bypass
import { env } from '../utils/env';

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
    expiresAt: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Development mode bypass
    if (env.isDevelopment && !env.useBackend) {
      // Allow demo credentials or any email/password for development
      if (credentials.email === 'demo@labl.com' || credentials.email.includes('@')) {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
          company: 'Demo Company',
          role: 'admin',
          subscription: {
            plan: 'pro',
            status: 'active',
            expiresAt: '2025-12-31T23:59:59Z'
          }
        };
        
        const mockToken = 'mock-jwt-token-for-development';
        
        // Store in localStorage for persistence
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        
        return { user: mockUser, token: mockToken };
      } else {
        throw new Error('Invalid credentials');
      }
    }

    // Production mode - make actual API call
    try {
      const { apiClient } = await import('./api');
      const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);
      
      if (response.success) {
        apiClient.setAuthToken(response.data.token);
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      if (error instanceof Error && error.message === 'Network error occurred') {
        throw new Error('Unable to connect to server. Please check if the backend is running or enable development mode.');
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Development mode bypass
    if (env.isDevelopment && !env.useBackend) {
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: data.name,
        company: data.company,
        role: 'user',
        subscription: {
          plan: 'free',
          status: 'active',
          expiresAt: '2025-12-31T23:59:59Z'
        }
      };
      
      const mockToken = 'mock-jwt-token-for-development';
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      return { user: mockUser, token: mockToken };
    }

    // Production mode - make actual API call
    try {
      const { apiClient } = await import('./api');
      const response = await apiClient.post<{ user: User; token: string }>('/auth/register', data);
      
      if (response.success) {
        apiClient.setAuthToken(response.data.token);
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      if (error instanceof Error && error.message === 'Network error occurred') {
        throw new Error('Unable to connect to server. Please check if the backend is running or enable development mode.');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Development mode
    if (env.isDevelopment && !env.useBackend) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return;
    }

    // Production mode
    try {
      const { apiClient } = await import('./api');
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed, continuing with local cleanup');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Clear API client token
      try {
        const { apiClient } = await import('./api');
        apiClient.clearAuthToken();
      } catch (error) {
        // Ignore error if api module fails to load
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    // Development mode - get from localStorage
    if (env.isDevelopment && !env.useBackend) {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      throw new Error('No user found');
    }

    // Production mode - make actual API call
    try {
      const { apiClient } = await import('./api');
      const response = await apiClient.get<User>('/auth/me');
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get user');
    } catch (error) {
      // Try fallback to localStorage
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    // Development mode
    if (env.isDevelopment && !env.useBackend) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        return token;
      }
      throw new Error('No token to refresh');
    }

    // Production mode
    const { apiClient } = await import('./api');
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    
    if (response.success) {
      apiClient.setAuthToken(response.data.token);
      return response.data.token;
    }
    
    throw new Error('Token refresh failed');
  }
}

export const authService = new AuthService();
export type { User, LoginCredentials, RegisterData };