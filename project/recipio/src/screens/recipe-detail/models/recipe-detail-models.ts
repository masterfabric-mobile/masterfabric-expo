import type { RecipeDetail } from '@/shared/services/recipe-service';

export interface RecipeDetailRouteParams {
  id: string;
}

export interface RecipeDetailState {
  recipe: RecipeDetail | null;
  loading: boolean;
  favorite: boolean;
  servings: number;
}

export const SERVINGS_OPTIONS = [1, 2, 3, 4] as const;
