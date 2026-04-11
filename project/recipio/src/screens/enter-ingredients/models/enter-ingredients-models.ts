/** Route params for enter-ingredients → recipe-results */
export interface EnterIngredientsParams {
  ingredients?: string;
}

/** Parsed list from comma-separated param */
export type IngredientList = string[];
