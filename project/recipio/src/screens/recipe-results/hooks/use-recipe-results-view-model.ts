import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import {
  getCookTonightRecipes,
  getRecipesByCategory,
  getRecipesByIngredients,
  type RecipeCardWithMatch,
} from '@/shared/services/recipe-service';
import { useI18n } from '@/shared/i18n';
import { useProfileStore } from '@/screens/profile/store/profile-store';
import { useRecipeResultsStore } from '../store/recipe-results-store';
import {
  parseIngredientsParam,
  sortRecipes,
  type RecipeSortType,
} from '../utils/recipe-results-utils';

function toCardWithMatch(
  r: Awaited<ReturnType<typeof getCookTonightRecipes>>[number]
): RecipeCardWithMatch {
  return {
    ...r,
    matchPercent: 0,
    missingCount: 0,
    missingIngredients: [],
    hasAllIngredients: false,
  };
}

export function useRecipeResultsViewModel() {
  const router = useRouter();
  const { locale } = useI18n();
  const params = useLocalSearchParams<{ ingredients?: string; category?: string }>();
  const dietaryPreferences = useProfileStore((s) => s.settings.dietaryPreferences);
  const { recipes, loading, sortType, setRecipes, setLoading, setSortType } =
    useRecipeResultsStore();

  const sortedRecipes = useMemo(
    () => sortRecipes(recipes, sortType),
    [recipes, sortType]
  );

  const ingredientList = parseIngredientsParam(params.ingredients);
  const categorySlug = typeof params.category === 'string' ? params.category.trim() : '';
  /** Match % and pantry status only when results come from ingredient search (not category or default list) */
  const showIngredientMatch = ingredientList.length > 0 && !categorySlug;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dietaryPrefs = dietaryPreferences ?? undefined;
      if (categorySlug) {
        const list = await getRecipesByCategory(categorySlug, {
          limit: 30,
          locale,
          dietaryPreferences: dietaryPrefs,
        });
        setRecipes(list.map(toCardWithMatch));
      } else if (ingredientList.length > 0) {
        const list = await getRecipesByIngredients(ingredientList, {
          limit: 20,
          locale,
          dietaryPreferences: dietaryPrefs,
        });
        setRecipes(list.filter((r) => r.matchPercent > 0));
      } else {
        const list = await getCookTonightRecipes({
          limit: 20,
          locale,
          dietaryPreferences: dietaryPrefs,
        });
        setRecipes(list.map(toCardWithMatch));
      }
    } finally {
      setLoading(false);
    }
  }, [params.ingredients, params.category, categorySlug, locale, dietaryPreferences, setRecipes, setLoading]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [router]);

  const handleRecipePress = useCallback(
    (recipeId: number) => router.push(`/recipe-detail/${recipeId}`),
    [router]
  );

  const title =
    categorySlug
      ? `Recipe results`
      : ingredientList.length > 0
        ? `Recipe Suggestions (${recipes.length})`
        : 'Recipe results';

  return {
    recipes: sortedRecipes,
    loading,
    ingredientList,
    categorySlug,
    showIngredientMatch,
    title,
    sortType,
    setSortType,
    handleBack,
    handleRecipePress,
  };
}
