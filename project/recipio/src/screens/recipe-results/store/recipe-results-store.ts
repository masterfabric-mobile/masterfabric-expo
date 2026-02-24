import { create } from 'zustand';
import type { RecipeCardWithMatch } from '@/shared/services/recipe-service';

interface RecipeResultsStore {
  recipes: RecipeCardWithMatch[];
  loading: boolean;
  setRecipes: (list: RecipeCardWithMatch[]) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  recipes: [] as RecipeCardWithMatch[],
  loading: true,
};

export const useRecipeResultsStore = create<RecipeResultsStore>((set) => ({
  ...initialState,

  setRecipes: (recipes) => set({ recipes }),

  setLoading: (loading) => set({ loading }),

  reset: () => set(initialState),
}));
