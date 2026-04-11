import type { RecipeCard } from '@/shared/services/recipe-service';

export interface RecipeSearchState {
  query: string;
  recent: string[];
  results: RecipeCard[];
  loading: boolean;
  searched: boolean;
}

export const DEBOUNCE_MS = 300;
