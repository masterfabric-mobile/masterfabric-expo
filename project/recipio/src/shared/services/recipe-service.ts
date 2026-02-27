/**
 * Recipe service - fetches recipes from Supabase
 * Uses v_public_recipe_cards view when available
 */

import type { SupabaseClient } from '@supabase/supabase-js';
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

/** Recipe card with compatibility match for ingredient-based search */
export interface RecipeCardWithMatch extends RecipeCard {
  matchPercent: number;
  missingCount: number;
  missingIngredients: string[];
  hasAllIngredients: boolean;
}

export interface RecipeFilters {
  limit?: number;
  isFree?: boolean;
  /** Locale for time/difficulty from recipe_translations (e.g. 'en', 'tr') */
  locale?: string;
}

const DEFAULT_TIME = '25 Mins';
const DEFAULT_DIFFICULTY = 'Easy';

/**
 * Fetch prep_time_minutes and difficulty from recipe_translations for given recipe ids and locale.
 * Requires migration 0010_add_recipe_prep_time_difficulty.sql.
 * On 400 (e.g. columns missing or schema cache stale), retries with recipe_id only and uses defaults.
 */
async function getRecipeTimeDifficultyMap(
  supabase: SupabaseClient,
  recipeIds: number[],
  locale: string = 'en'
): Promise<Map<number, { time: string; difficulty: string }>> {
  const map = new Map<number, { time: string; difficulty: string }>();
  if (recipeIds.length === 0) return map;
  try {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select('recipe_id, prep_time_minutes, difficulty')
      .in('recipe_id', recipeIds)
      .eq('locale', locale);

    if (error) {
      // 400 often means prep_time_minutes/difficulty columns don't exist (migration 0010 not run)
      // or PostgREST schema cache is stale. Retry with recipe_id only so request succeeds.
      const fallback = await supabase
        .from('recipe_translations')
        .select('recipe_id')
        .in('recipe_id', recipeIds)
        .eq('locale', locale);
      if (!fallback.error && fallback.data?.length) {
        for (const row of fallback.data as { recipe_id: number }[]) {
          map.set(row.recipe_id, { time: DEFAULT_TIME, difficulty: DEFAULT_DIFFICULTY });
        }
      }
      return map;
    }

    for (const row of (data ?? []) as {
      recipe_id: number;
      prep_time_minutes: number | null;
      difficulty: string | null;
    }[]) {
      const mins = row.prep_time_minutes ?? 25;
      const timeStr = mins > 0 ? `${mins} Mins` : DEFAULT_TIME;
      const difficultyStr = (row.difficulty?.trim() || DEFAULT_DIFFICULTY);
      map.set(row.recipe_id, { time: timeStr, difficulty: difficultyStr });
    }
  } catch (err) {
    console.warn('getRecipeTimeDifficultyMap error:', err);
  }
  return map;
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
      .select('recipe_id, title, description, cover_image_url, category_slug')
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

    const rows = data || [];
    const recipeIds = rows.map((r) => r.recipe_id);
    const locale = filters?.locale ?? 'en';
    const timeDifficultyMap = await getRecipeTimeDifficultyMap(supabase, recipeIds, locale);

    return rows.map((r) => {
      const meta = timeDifficultyMap.get(r.recipe_id);
      return {
        id: r.recipe_id,
        title: r.title || `Recipe #${r.recipe_id}`,
        description: r.description || '',
        imageUrl: r.cover_image_url || '',
        time: meta?.time ?? DEFAULT_TIME,
        difficulty: meta?.difficulty ?? DEFAULT_DIFFICULTY,
        categorySlug: (r as { category_slug?: string }).category_slug,
      };
    });
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

/**
 * Get ingredient names per recipe (first variant).
 * Fetches both 'en' and 'tr' from ingredient_translations so user input in either
 * language (e.g. "yumurta" or "egg") matches the same recipe ingredient.
 * Returns Map<recipeId, { displayName, matchSet }[]> — one item per ingredient with its name variants.
 */
async function getRecipeIngredientNamesMap(
  recipeIds: number[]
): Promise<Map<number, { displayName: string; matchSet: Set<string> }[]>> {
  const supabase = getSupabaseClient();
  const map = new Map<number, { displayName: string; matchSet: Set<string> }[]>();
  if (!supabase || recipeIds.length === 0) return map;

  try {
    const { data: variants } = await supabase
      .from('recipe_variants')
      .select('id, recipe_id')
      .in('recipe_id', recipeIds);

    if (!variants?.length) return map;

    const variantIds = variants.map((v) => v.id);

    const { data: rvi } = await supabase
      .from('recipe_variant_ingredients')
      .select('variant_id, ingredient_id')
      .in('variant_id', variantIds);

    if (!rvi?.length) return map;

    const ingredientIds = [...new Set(rvi.map((r) => r.ingredient_id))];
    const variantToRecipe = Object.fromEntries(
      variants.map((v) => [v.id, v.recipe_id])
    );

    const { data: names } = await supabase
      .from('ingredient_translations')
      .select('ingredient_id, name, locale')
      .in('ingredient_id', ingredientIds)
      .in('locale', ['en', 'tr']);

    if (!names?.length) return map;

    const idToDisplay = new Map<number, string>();
    const idToAllNames = new Map<number, string[]>();
    for (const row of names as { ingredient_id: number; name: string; locale: string }[]) {
      const name = (row.name ?? '').trim();
      if (!name) continue;
      if (row.locale === 'en') idToDisplay.set(row.ingredient_id, name);
      const list = idToAllNames.get(row.ingredient_id) ?? [];
      if (!list.includes(name)) list.push(name);
      idToAllNames.set(row.ingredient_id, list);
    }
    for (const row of names as { ingredient_id: number; name: string; locale: string }[]) {
      const id = row.ingredient_id;
      if (!idToDisplay.has(id)) idToDisplay.set(id, (row.name ?? '').trim());
    }

    const seen = new Set<string>();
    for (const row of rvi) {
      const recipeId = variantToRecipe[row.variant_id];
      const displayName = idToDisplay.get(row.ingredient_id);
      const allNames = idToAllNames.get(row.ingredient_id) ?? [];
      if (!recipeId || !displayName) continue;

      const key = `${recipeId}-${row.ingredient_id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const entry = map.get(recipeId) ?? [];
      const matchSet = new Set<string>();
      for (const n of allNames) matchSet.add(normalizeForMatch(n));
      entry.push({ displayName, matchSet });
      map.set(recipeId, entry);
    }
  } catch (err) {
    console.warn('getRecipeIngredientNamesMap error:', err);
  }
  return map;
}

function normalizeForMatch(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Compute match between user ingredients and recipe ingredients.
 * Each item has displayName and matchSet (en+tr normalized names). User matches if any of their
 * ingredients (normalized) matches any name in that item's matchSet (or partial contains).
 */
function computeMatch(
  userIngredients: string[],
  items: { displayName: string; matchSet: Set<string> }[]
): {
  matchPercent: number;
  missingCount: number;
  missingIngredients: string[];
  hasAllIngredients: boolean;
} {
  const userSet = new Set(userIngredients.map(normalizeForMatch).filter(Boolean));
  if (items.length === 0) {
    return { matchPercent: 0, missingCount: 0, missingIngredients: [], hasAllIngredients: false };
  }
  let matched = 0;
  const missing: string[] = [];
  for (const item of items) {
    const found = [...userSet].some(
      (u) =>
        item.matchSet.has(u) ||
        [...item.matchSet].some((n) => n.includes(u) || u.includes(n))
    );
    if (found) matched++;
    else missing.push(item.displayName);
  }
  const matchPercent = Math.round((matched / items.length) * 100);
  return {
    matchPercent,
    missingCount: missing.length,
    missingIngredients: missing,
    hasAllIngredients: missing.length === 0,
  };
}

/**
 * Fetch recipes and return them sorted by compatibility (match %) with user ingredients.
 * Highest match first. Uses existing cards + ingredient names from DB when available.
 */
export async function getRecipesByIngredients(
  userIngredients: string[],
  options?: { limit?: number; locale?: string }
): Promise<RecipeCardWithMatch[]> {
  const limit = options?.limit ?? 20;
  const normalizedUser = userIngredients.map((i) => i.trim()).filter(Boolean);
  const locale = options?.locale ?? 'en';
  if (normalizedUser.length === 0) {
    const list = await getCookTonightRecipes({ limit, locale });
    return list.map((r) => ({
      ...r,
      matchPercent: 0,
      missingCount: 0,
      missingIngredients: [],
      hasAllIngredients: false,
    }));
  }

  const cards = await getCookTonightRecipes({ limit, locale });
  if (cards.length === 0) return [];

  const recipeIds = cards.map((c) => c.id);
  const ingredientMap = await getRecipeIngredientNamesMap(recipeIds);

  const withMatch: RecipeCardWithMatch[] = cards.map((card) => {
    const items = ingredientMap.get(card.id) ?? [];
    const { matchPercent, missingCount, missingIngredients, hasAllIngredients } =
      items.length > 0
        ? computeMatch(normalizedUser, items)
        : { matchPercent: 0, missingCount: 0, missingIngredients: [], hasAllIngredients: false };
    return {
      ...card,
      matchPercent,
      missingCount,
      missingIngredients,
      hasAllIngredients,
    };
  });

  withMatch.sort((a, b) => b.matchPercent - a.matchPercent);
  return withMatch;
}

/** Search recipes by title (for Recipe Search screen) */
export async function searchRecipes(
  query: string,
  options?: { locale?: string }
): Promise<RecipeCard[]> {
  const locale = options?.locale ?? 'en';
  if (!query.trim()) return getCookTonightRecipes({ limit: 10, locale });
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data: cards } = await supabase
      .from('v_public_recipe_cards')
      .select('recipe_id, title, description, cover_image_url, category_slug')
      .eq('is_free', true)
      .ilike('title', `%${query.trim()}%`)
      .limit(20);

    if (cards?.length) {
      const recipeIds = cards.map((r) => r.recipe_id);
      const timeDifficultyMap = await getRecipeTimeDifficultyMap(supabase, recipeIds, locale);
      return cards.map((r) => {
        const meta = timeDifficultyMap.get(r.recipe_id);
        return {
          id: r.recipe_id,
          title: r.title || `Recipe #${r.recipe_id}`,
          description: r.description || '',
          imageUrl: r.cover_image_url || '',
          time: meta?.time ?? DEFAULT_TIME,
          difficulty: meta?.difficulty ?? DEFAULT_DIFFICULTY,
          categorySlug: (r as { category_slug?: string }).category_slug,
        };
      });
    }

    const { data: recipes } = await supabase
      .from('recipes')
      .select('id, cover_image_url')
      .eq('status', 'published')
      .eq('is_free', true)
      .limit(20);

    if (!recipes?.length) return [];

    const withTranslations = await Promise.all(
      recipes.map(async (r) => {
        const { data: tr } = await supabase
          .from('recipe_translations')
          .select('title, description')
          .eq('recipe_id', r.id)
          .eq('locale', 'en')
          .or(`title.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%`)
          .single();

        if (!tr) return null;
        return {
          id: r.id,
          title: tr.title || `Recipe #${r.id}`,
          description: tr.description || '',
          imageUrl: r.cover_image_url || '',
          time: DEFAULT_TIME,
          difficulty: DEFAULT_DIFFICULTY,
        };
      })
    );

    return withTranslations.filter(Boolean) as RecipeCard[];
  } catch (err) {
    console.error('searchRecipes error:', err);
    return [];
  }
}

/** Recipe detail for Recipe Detail screen — ingredients and steps are recipe's own (no available/missing) */
export interface RecipeDetail {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  difficulty: string;
  rating?: number;
  reviewCount?: number;
  servings: number;
  /** Recipe's ingredient list (name + optional quantity); no available/missing */
  ingredients: string[];
  /** Preparation steps in order */
  steps: string[];
  nutrition?: { kcal: number; protein: number; carbs: number; fat: number };
  chefTip?: string;
}

/** Format amount + unit for display (e.g. "75 g", "0.5 pcs") */
function formatAmount(amount: number, unitCode: string): string {
  const a = Number(amount);
  if (Number.isNaN(a)) return '';
  const rounded = a === Math.floor(a) ? String(Math.floor(a)) : a.toFixed(2).replace(/\.?0+$/, '');
  return unitCode ? `${rounded} ${unitCode}` : String(rounded);
}

export async function getRecipeDetail(
  id: number,
  options?: { locale?: string; servings?: number }
): Promise<RecipeDetail | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const locale = options?.locale ?? 'en';
    const wantedServings = options?.servings ?? 2;

    const [cardRes, trRes, stepsRes, variantsRes, statsRes] = await Promise.all([
      supabase.from('v_public_recipe_cards').select('recipe_id, title, description, cover_image_url').eq('recipe_id', id).maybeSingle(),
      supabase.from('recipe_translations').select('title, description, tips, prep_time_minutes, difficulty').eq('recipe_id', id).eq('locale', locale).maybeSingle(),
      supabase.from('recipe_steps').select('step_number, text').eq('recipe_id', id).eq('locale', locale).order('step_number', { ascending: true }),
      supabase.from('recipe_variants').select('id, servings').eq('recipe_id', id).order('servings', { ascending: true }),
      supabase.from('recipe_stats').select('comment_count').eq('recipe_id', id).maybeSingle(),
    ]);

    const card = cardRes.data;
    const tr = trRes.data as (typeof trRes.data) & { prep_time_minutes?: number; difficulty?: string } | null;
    const stats = statsRes.data as { comment_count?: number } | null;
    const stepsRows = stepsRes.data ?? [];
    const variants = (variantsRes.data ?? []) as { id: number; servings: number }[];

    if (!card && !tr) return null;

    const title = tr?.title ?? (card as { title?: string })?.title ?? `Recipe #${id}`;
    const description = tr?.description ?? (card as { description?: string })?.description ?? '';
    const imageUrl = (card as { cover_image_url?: string })?.cover_image_url ?? '';
    const chefTip = tr?.tips ?? undefined;

    const steps =
      stepsRows.length > 0
        ? (stepsRows as { step_number: number; text: string }[])
            .sort((a, b) => a.step_number - b.step_number)
            .map((s) => s.text)
        : [];

    const variant =
      variants.find((v) => v.servings === wantedServings) ??
      variants.find((v) => v.servings === 2) ??
      variants[0];
    const variantServings = variant?.servings ?? 2;
    const scaleFactor =
      variantServings > 0 ? wantedServings / variantServings : 1;

    let ingredients: string[] = [];
    if (variant) {
      const rviRes = await supabase
        .from('recipe_variant_ingredients')
        .select('ingredient_id, amount, unit_id')
        .eq('variant_id', variant.id);
      const rviRows = (rviRes.data ?? []) as { ingredient_id: number; amount: number; unit_id: number }[];

      if (rviRows.length > 0) {
        const ingredientIds = [...new Set(rviRows.map((r) => r.ingredient_id))];
        const unitIds = [...new Set(rviRows.map((r) => r.unit_id))];

        const [namesRes, unitsRes] = await Promise.all([
          supabase.from('ingredient_translations').select('ingredient_id, name').eq('locale', locale).in('ingredient_id', ingredientIds),
          supabase.from('units').select('id, code').in('id', unitIds),
        ]);

        const nameByIng = new Map<number, string>();
        (namesRes.data ?? []).forEach((r: { ingredient_id: number; name: string }) => nameByIng.set(r.ingredient_id, r.name ?? ''));
        const codeByUnit = new Map<number, string>();
        (unitsRes.data ?? []).forEach((r: { id: number; code: string }) => codeByUnit.set(r.id, r.code ?? ''));

        ingredients = rviRows.map((r) => {
          const name = nameByIng.get(r.ingredient_id) ?? '';
          const code = codeByUnit.get(r.unit_id) ?? '';
          const scaledAmount = r.amount * scaleFactor;
          const amountStr = formatAmount(scaledAmount, code);
          return amountStr ? `${amountStr} ${name}`.trim() : name;
        });
      }
    }

    const baseNutrition = { kcal: 450, protein: 32, carbs: 12, fat: 18 };
    const nutrition = {
      kcal: Math.round(baseNutrition.kcal * scaleFactor),
      protein: Math.round(baseNutrition.protein * scaleFactor),
      carbs: Math.round(baseNutrition.carbs * scaleFactor),
      fat: Math.round(baseNutrition.fat * scaleFactor),
    };

    const prepMins = tr?.prep_time_minutes ?? 25;
    const timeStr = prepMins > 0 ? `${prepMins} Mins` : DEFAULT_TIME;
    const difficultyStr = tr?.difficulty?.trim() || DEFAULT_DIFFICULTY;
    const reviewCount = stats?.comment_count ?? 0;

    return {
      id,
      title,
      description,
      imageUrl,
      time: timeStr,
      difficulty: difficultyStr,
      rating: undefined,
      reviewCount,
      servings: wantedServings,
      ingredients,
      steps,
      nutrition,
      chefTip,
    };
  } catch (err) {
    console.error('getRecipeDetail error:', err);
    return null;
  }
}
