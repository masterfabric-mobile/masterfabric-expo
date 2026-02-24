import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import {
  getCookTonightRecipes,
  getRecipesByIngredients,
  type RecipeCardWithMatch,
} from '@/shared/services/recipe-service';
import { useRecipeResultsStore } from '../store/recipe-results-store';
import { parseIngredientsParam } from '../utils/recipe-results-utils';

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
  const params = useLocalSearchParams<{ ingredients?: string }>();
  const { recipes, loading, setRecipes, setLoading } = useRecipeResultsStore();

  const ingredientList = parseIngredientsParam(params.ingredients);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (ingredientList.length > 0) {
        const list = await getRecipesByIngredients(ingredientList, { limit: 20 });
        setRecipes(list);
      } else {
        const list = await getCookTonightRecipes({ limit: 20 });
        setRecipes(list.map(toCardWithMatch));
      }
    } finally {
      setLoading(false);
    }
  }, [params.ingredients, setRecipes, setLoading]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleRecipePress = useCallback(
    (recipeId: number) => router.push(`/recipe-detail/${recipeId}`),
    [router]
  );

  const title =
    ingredientList.length > 0
      ? `Recipe Suggestions (${recipes.length})`
      : 'Recipe results';

  return {
    recipes,
    loading,
    ingredientList,
    title,
    handleBack,
    handleRecipePress,
  };
}
