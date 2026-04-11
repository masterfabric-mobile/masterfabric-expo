import type { RecipeCard } from '@/shared/services/recipe-service';

export interface FavoritesState {
  isLoading: boolean;
  recipes: RecipeCard[];
}
