import { create } from 'zustand';
import type { RecipeCard } from '@/shared/services/recipe-service';

interface RecipeSearchStore {
  recentSearches: string[];
  setRecentSearches: (list: string[]) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (query: string) => void;
}

export const useRecipeSearchStore = create<RecipeSearchStore>((set) => ({
  recentSearches: [],

  setRecentSearches: (list) => set({ recentSearches: list }),

  addRecentSearch: (query) =>
    set((state) => {
      const trimmed = query.trim();
      if (!trimmed) return state;
      const next = [
        trimmed,
        ...state.recentSearches.filter((q) => q !== trimmed),
      ].slice(0, 8);
      return { recentSearches: next };
    }),

  clearRecentSearches: () => set({ recentSearches: [] }),

  removeRecentSearch: (query) =>
    set((state) => ({
      recentSearches: state.recentSearches.filter((q) => q !== query),
    })),
}));
