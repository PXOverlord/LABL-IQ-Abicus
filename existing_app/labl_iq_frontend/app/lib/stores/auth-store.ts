
import { create } from 'zustand';
import { authAPI, User, UserSettings } from '../api';

interface AuthState {
  user: User | null;
  settings: UserSettings | null;
  isSettingsLoading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<UserSettings>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  settings: null,
  isSettingsLoading: false,
  isLoading: false,
  isAuthenticated: false,
  authError: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    try {
      await authAPI.login(email, password);
      const user = await authAPI.me();
      set({ 
        user,
        isAuthenticated: true, 
        isLoading: false, 
        authError: null,
      });
      await get().fetchSettings();
    } catch (error) {
      console.error('Login failed:', error);
      set({ 
        isLoading: false, 
        authError: error instanceof Error ? error.message : 'Unable to login. Please try again.',
      });
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    try {
      await authAPI.register(email, password);
      await get().login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      set({ 
        isLoading: false, 
        authError: error instanceof Error ? error.message : 'Unable to register. Please try again.',
      });
    }
  },

  logout: () => {
    authAPI.logout();
    set({ 
      user: null, 
      settings: null,
      isAuthenticated: false,
      authError: null,
    });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, authError: null });
      return;
    }

    set({ isLoading: true, authError: null });
    try {
      const user = await authAPI.me();
      set({ user, isAuthenticated: true, isLoading: false, authError: null });
      await get().fetchSettings();
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      authAPI.logout();
      set({ user: null, settings: null, isAuthenticated: false, isLoading: false, authError: null });
    }
  },

  fetchSettings: async () => {
    const { isAuthenticated } = get();
    if (!isAuthenticated) return;
    set({ isSettingsLoading: true });
    try {
      const settings = await authAPI.getSettings();
      set({ settings, isSettingsLoading: false });
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
      set({ isSettingsLoading: false });
      throw error;
    }
  },

  updateSettings: async (settings) => {
    const { user } = get();
    if (!user) {
      throw new Error('User not authenticated');
    }
    set({ isSettingsLoading: true });
    try {
      const updated = await authAPI.updateSettings(settings);
      set({ settings: updated, isSettingsLoading: false });
      return updated;
    } catch (error) {
      console.error('Error updating settings:', error);
      set({ isSettingsLoading: false });
      throw error;
    }
  },
}));
