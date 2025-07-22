
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
      const user = await authAPI.me();
      set({ 
        user, 
        isAuthenticated: true 
      });
    } catch (error: any) {
      // If backend is not available, don't update auth state
      if (error.message === 'BACKEND_UNAVAILABLE') {
        console.warn('Backend not available, keeping current auth state');
        return;
      }
      set({ 
        user: null, 
        isAuthenticated: false 
      });
    }
  },

  updateSettings: async (settings: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateSettings(settings);
      set({ user: updatedUser });
    } catch (error) {
      throw error;
    }
  },
}));
