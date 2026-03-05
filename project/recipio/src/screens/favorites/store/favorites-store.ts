import { create } from 'zustand';
import type { RecipeCard } from '@/shared/services/recipe-service';

interface FavoritesStore {
  isLoading: boolean;
  recipes: RecipeCard[];
  setLoading: (value: boolean) => void;
  setRecipes: (recipes: RecipeCard[]) => void;
}

export const useFavoritesStore = create<FavoritesStore>((set) => ({
  isLoading: false,
  recipes: [],
  setLoading: (isLoading) => set({ isLoading }),
  setRecipes: (recipes) => set({ recipes }),
}));
