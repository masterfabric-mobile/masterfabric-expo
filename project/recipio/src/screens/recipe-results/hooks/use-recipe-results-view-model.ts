import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import {
  getCookTonightRecipes,
  getRecipesByIngredients,
  type RecipeCardWithMatch,
} from '@/shared/services/recipe-service';
import { useI18n } from '@/shared/i18n';
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
  const params = useLocalSearchParams<{ ingredients?: string }>();
  const { recipes, loading, sortType, setRecipes, setLoading, setSortType } =
    useRecipeResultsStore();

  const sortedRecipes = useMemo(
    () => sortRecipes(recipes, sortType),
    [recipes, sortType]
  );

  const ingredientList = parseIngredientsParam(params.ingredients);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (ingredientList.length > 0) {
        const list = await getRecipesByIngredients(ingredientList, { limit: 20, locale });
        // Show only recipes with at least one matching ingredient (exclude 0% match)
        setRecipes(list.filter((r) => r.matchPercent > 0));
      } else {
        const list = await getCookTonightRecipes({ limit: 20, locale });
        setRecipes(list.map(toCardWithMatch));
      }
    } finally {
      setLoading(false);
    }
  }, [params.ingredients, locale, setRecipes, setLoading]);

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
    ingredientList.length > 0
      ? `Recipe Suggestions (${recipes.length})`
      : 'Recipe results';

  return {
    recipes: sortedRecipes,
    loading,
    ingredientList,
    title,
    sortType,
    setSortType,
    handleBack,
    handleRecipePress,
  };
}
