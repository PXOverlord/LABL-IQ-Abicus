
import { create } from 'zustand';
import { profilesAPI, ColumnProfile } from '../api';

interface ProfilesState {
  profiles: ColumnProfile[];
  isLoading: boolean;
  fetchProfiles: () => Promise<void>;
  createProfile: (profile: Omit<ColumnProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
}

export const useProfilesStore = create<ProfilesState>((set, get) => ({
  profiles: [],
  isLoading: false,

  fetchProfiles: async () => {
    set({ isLoading: true });
    try {
      const profiles = await profilesAPI.getAll();
      set({ profiles, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      // If backend unavailable, use empty array instead of throwing
      if (error.message === 'BACKEND_UNAVAILABLE') {
        set({ profiles: [] });
        return;
      }
      throw error;
    }
  },

  createProfile: async (profile) => {
    set({ isLoading: true });
    try {
      const newProfile = await profilesAPI.create(profile);
      set(state => ({ 
        profiles: [...state.profiles, newProfile], 
        isLoading: false 
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteProfile: async (profileId: string) => {
    set({ isLoading: true });
    try {
      await profilesAPI.delete(profileId);
      set(state => ({ 
        profiles: state.profiles.filter(p => p.id !== profileId), 
        isLoading: false 
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
