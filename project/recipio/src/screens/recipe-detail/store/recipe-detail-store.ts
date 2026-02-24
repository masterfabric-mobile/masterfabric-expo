import { create } from 'zustand';
import type { RecipeDetail } from '@/shared/services/recipe-service';

interface RecipeDetailStore {
  recipe: RecipeDetail | null;
  loading: boolean;
  favorite: boolean;
  servings: number;
  setRecipe: (recipe: RecipeDetail | null) => void;
  setLoading: (value: boolean) => void;
  setFavorite: (value: boolean) => void;
  setServings: (value: number) => void;
  toggleFavorite: () => void;
  reset: () => void;
}

const initialState = {
  recipe: null as RecipeDetail | null,
  loading: true,
  favorite: false,
  servings: 2,
};

export const useRecipeDetailStore = create<RecipeDetailStore>((set) => ({
  ...initialState,

  setRecipe: (recipe) => set({ recipe }),

  setLoading: (loading) => set({ loading }),

  setFavorite: (favorite) => set({ favorite }),

  setServings: (servings) => set({ servings }),

  toggleFavorite: () => set((state) => ({ favorite: !state.favorite })),

  reset: () => set(initialState),
}));
