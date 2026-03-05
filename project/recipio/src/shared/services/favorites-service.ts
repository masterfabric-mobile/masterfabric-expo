/**
 * Favorites service — add/remove/list user favorites via Supabase
 * Table: favorites (user_id, recipe_id)
 */

import { getSupabaseClient } from './supabase-service';
import type { RecipeCard } from './recipe-service';
import { getRecipesByIds } from './recipe-service';
import type { DietaryPrefsForFilter } from '@/shared/utils/dietary-filter';

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

/** Get list of recipe IDs favorited by the current user */
export async function getFavoriteRecipeIds(): Promise<number[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('recipe_id')
    .eq('user_id', userId);

  if (error) {
    console.warn('getFavoriteRecipeIds error:', error);
    return [];
  }
  return (data ?? []).map((r: { recipe_id: number }) => r.recipe_id);
}

/** Get recent favorites with created_at, ordered by newest first (for recent activity). */
export async function getRecentFavoritesWithDates(limit: number = 10): Promise<{ recipe_id: number; created_at: string }[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('recipe_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('getRecentFavoritesWithDates error:', error);
    return [];
  }
  return (data ?? []).map((r: { recipe_id: number; created_at: string }) => ({
    recipe_id: r.recipe_id,
    created_at: r.created_at,
  }));
}

/** Check if current user has favorited a recipe */
export async function isFavorite(recipeId: number): Promise<boolean> {
  const ids = await getFavoriteRecipeIds();
  return ids.includes(recipeId);
}

export type FavoriteResult = { success: true } | { success: false; reason: 'not_signed_in' | 'error' };

/** Add recipe to favorites. */
export async function addFavorite(recipeId: number): Promise<FavoriteResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, reason: 'not_signed_in' };

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, reason: 'error' };

  const { error } = await supabase.from('favorites').insert({
    user_id: userId,
    recipe_id: recipeId,
  });

  if (error) {
    if (error.code === '23505') return { success: true }; // already exists
    console.warn('addFavorite error:', error.code, error.message);
    return { success: false, reason: 'error' };
  }
  return { success: true };
}

/** Remove recipe from favorites. */
export async function removeFavorite(recipeId: number): Promise<FavoriteResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, reason: 'not_signed_in' };

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, reason: 'error' };

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);

  if (error) {
    console.warn('removeFavorite error:', error.code, error.message);
    return { success: false, reason: 'error' };
  }
  return { success: true };
}

/** Get full recipe cards for the current user's favorites, in order of favorite ids */
export async function getFavoriteRecipes(options?: {
  locale?: string;
  dietaryPreferences?: DietaryPrefsForFilter | null;
}): Promise<RecipeCard[]> {
  const ids = await getFavoriteRecipeIds();
  if (ids.length === 0) return [];
  return getRecipesByIds(ids, options);
}
