
import { create } from 'zustand';
import { authAPI, User } from '../api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateSettings: (settings: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(email, password);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await authAPI.register(email, password);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authAPI.logout();
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  fetchUser: async () => {
    try {
      // For testing, create a mock user with saved settings
      const savedSettings = localStorage.getItem('user_settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      
      const mockUser: User = {
        id: 'demo-user-1',
        email: 'test@example.com',
        role: 'ADMIN',
        originZip: settings.originZip || '',
        defaultMarkup: settings.defaultMarkup || 0,
        defaultSurcharge: settings.defaultSurcharge || 0,
        weightConversion: settings.weightConversion || 'lbs'
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true 
      });
    } catch (error: any) {
      // If there's an error, still create a basic mock user
      const mockUser: User = {
        id: 'demo-user-1',
        email: 'test@example.com',
        role: 'ADMIN'
      };
      set({ 
        user: mockUser, 
        isAuthenticated: true 
      });
    }
  },

  updateSettings: async (settings: Partial<User>) => {
    try {
      // For testing, just update the local state
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...settings };
        set({ user: updatedUser });
        
        // Also save to localStorage for persistence
        localStorage.setItem('user_settings', JSON.stringify(settings));
        
        return updatedUser;
      } else {
        // Create a mock user if none exists
        const mockUser: User = {
          id: 'demo-user-1',
          email: 'test@example.com',
          role: 'ADMIN',
          ...settings
        };
        set({ user: mockUser });
        localStorage.setItem('user_settings', JSON.stringify(settings));
        return mockUser;
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
}));
