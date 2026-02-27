import { create } from 'zustand';
import type { ProfileUser, ProfileStats, ProfileSettings } from '../models/profile-models';

interface ProfileStore {
  isLoading: boolean;
  isSignedIn: boolean;
  user: ProfileUser | null;
  stats: ProfileStats;
  settings: ProfileSettings;
  setLoading: (value: boolean) => void;
  setSignedIn: (signedIn: boolean, user?: ProfileUser | null) => void;
  setStats: (stats: Partial<ProfileStats>) => void;
  setSettings: (settings: Partial<ProfileSettings>) => void;
  signOut: () => void;
}

const defaultStats: ProfileStats = {
  saved: 0,
  created: 0,
  followers: 0,
};

const defaultSettings: ProfileSettings = {
  language: 'en',
  theme: 'dark',
  notifications: true,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  isLoading: false,
  isSignedIn: false,
  user: null,
  stats: defaultStats,
  settings: defaultSettings,
  setLoading: (isLoading) => set({ isLoading }),
  setSignedIn: (isSignedIn, user = null) => set({ isSignedIn, user }),
  setStats: (stats) =>
    set((s) => ({ stats: { ...s.stats, ...stats } })),
  setSettings: (settings) =>
    set((s) => ({ settings: { ...s.settings, ...settings } })),
  signOut: () =>
    set({
      isSignedIn: false,
      user: null,
      stats: defaultStats,
    }),
}));
