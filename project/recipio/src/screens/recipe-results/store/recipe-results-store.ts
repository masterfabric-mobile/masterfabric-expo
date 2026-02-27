import { create } from 'zustand';
import type { RecipeCardWithMatch } from '@/shared/services/recipe-service';
import type { RecipeSortType } from '../utils/recipe-results-utils';

interface RecipeResultsStore {
  recipes: RecipeCardWithMatch[];
  loading: boolean;
  sortType: RecipeSortType;
  setRecipes: (list: RecipeCardWithMatch[]) => void;
  setLoading: (value: boolean) => void;
  setSortType: (sortType: RecipeSortType) => void;
  reset: () => void;
}

const initialState = {
  recipes: [] as RecipeCardWithMatch[],
  loading: true,
  sortType: 'relevance' as RecipeSortType,
};

export const useRecipeResultsStore = create<RecipeResultsStore>((set) => ({
  ...initialState,

  setRecipes: (recipes) => set({ recipes }),

  setLoading: (loading) => set({ loading }),

  setSortType: (sortType) => set({ sortType }),

  reset: () => set(initialState),
}));
