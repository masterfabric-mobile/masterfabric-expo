import { create } from 'zustand';

interface FavoritesStore {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
