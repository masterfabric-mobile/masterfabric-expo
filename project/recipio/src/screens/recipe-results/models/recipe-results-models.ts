import type { RecipeCardWithMatch } from '@/shared/services/recipe-service';

export interface RecipeResultsParams {
  ingredients?: string;
}

export type RecipeResultsList = RecipeCardWithMatch[];
