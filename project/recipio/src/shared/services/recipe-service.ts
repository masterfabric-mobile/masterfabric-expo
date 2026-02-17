/**
 * Recipe service - fetches recipes from Supabase
 * Uses v_public_recipe_cards view when available
 */

import { getSupabaseClient } from './supabase-service';

export interface RecipeCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  difficulty: string;
  categorySlug?: string;
}

export interface RecipeFilters {
  limit?: number;
  isFree?: boolean;
}

export async function getCookTonightRecipes(
  filters?: RecipeFilters
): Promise<RecipeCard[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const limit = filters?.limit ?? 5;

    const { data, error } = await supabase
      .from('v_public_recipe_cards')
      .select('recipe_id, title, description, cover_image_url')
      .eq('is_free', true)
      .limit(limit);

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn(
          '⚠️ Recipio schema not found. Run migrations from docs/projects/recipio/supabase/migration/ (init.sql → add-category.sql → views.sql)'
        );
        return [];
      }
      return await fetchRecipesFromTable(limit);
    }

    return (data || []).map((r) => ({
      id: r.recipe_id,
      title: r.title || `Recipe #${r.recipe_id}`,
      description: r.description || '',
      imageUrl: r.cover_image_url || '',
      time: '30m',
      difficulty: 'Medium',
      categorySlug: (r as { category_slug?: string }).category_slug,
    }));
  } catch (err) {
    console.error('getCookTonightRecipes error:', err);
    return [];
  }
}

async function fetchRecipesFromTable(limit: number): Promise<RecipeCard[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('recipes')
    .select('id, cover_image_url')
    .eq('status', 'published')
    .eq('is_free', true)
    .limit(limit);

  if (error) {
    if (error.code === 'PGRST205') {
      console.warn(
        '⚠️ Recipio schema not found. Run migrations from docs/projects/recipio/supabase/migration/ (init.sql → add-category.sql → views.sql)'
      );
      return [];
    } else {
      console.warn('Recipes fetch failed:', error);
    }
    return [];
  }

  const recipes = data || [];
  const withTranslations = await Promise.all(
    recipes.map(async (r) => {
      const { data: tr } = await supabase
        .from('recipe_translations')
        .select('title, description')
        .eq('recipe_id', r.id)
        .eq('locale', 'en')
        .single();

      return {
        id: r.id,
        title: tr?.title || `Recipe #${r.id}`,
        description: tr?.description || '',
        imageUrl: r.cover_image_url || '',
        time: '30m',
        difficulty: 'Medium',
      };
    })
  );

  return withTranslations;
}
