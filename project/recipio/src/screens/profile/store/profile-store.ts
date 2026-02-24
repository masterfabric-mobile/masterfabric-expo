import { create } from 'zustand';

interface ProfileStore {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
