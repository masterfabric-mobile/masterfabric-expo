import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { getRecipeDetail } from '@/shared/services/recipe-service';
import { useI18n } from '@/shared/i18n';
import { useRecipeDetailStore } from '../store/recipe-detail-store';
import { parseRecipeId } from '../utils/recipe-detail-utils';

export function useRecipeDetailViewModel() {
  const router = useRouter();
  const { locale } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    recipe,
    loading,
    favorite,
    servings,
    setRecipe,
    setLoading,
    setServings,
    toggleFavorite,
  } = useRecipeDetailStore();

  const recipeId = parseRecipeId(id);

  const load = useCallback(
    async (servingsOverride?: number) => {
      if (recipeId == null) {
        setRecipe(null);
        setLoading(false);
        return;
      }
      const isServingsOnly = servingsOverride != null;
      if (!isServingsOnly) {
        setLoading(true);
      }
      try {
        const data = await getRecipeDetail(recipeId, {
          locale,
          servings: servingsOverride ?? servings,
        });
        setRecipe(data);
        if (
          data &&
          servingsOverride == null &&
          data.servings >= 1 &&
          data.servings <= 4
        ) {
          setServings(data.servings);
        }
      } catch {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    },
    [recipeId, servings, setRecipe, setLoading, setServings, locale]
  );

  useEffect(() => {
    if (recipeId == null) {
      setRecipe(null);
      setLoading(false);
      return;
    }
    const alreadyHaveRecipe = recipe?.id === recipeId;
    if (!alreadyHaveRecipe) {
      setRecipe(null);
      setLoading(true);
    }
    load();
  }, [recipeId, locale]);

  const onServingsChange = useCallback(
    (newServings: number) => {
      setServings(newServings);
      load(newServings);
    },
    [load, setServings]
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [router]);

  return {
    recipe,
    loading,
    favorite,
    servings,
    toggleFavorite,
    onServingsChange,
    handleBack,
  };
}
