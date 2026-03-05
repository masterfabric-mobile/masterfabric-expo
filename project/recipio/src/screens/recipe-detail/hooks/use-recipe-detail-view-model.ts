import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { getRecipeDetail } from '@/shared/services/recipe-service';
import {
  isFavorite,
  addFavorite,
  removeFavorite,
} from '@/shared/services/favorites-service';
import { getProfileStatsFromSupabase } from '@/shared/services/profile-service';
import { useProfileStore } from '@/screens/profile/store/profile-store';
import { addOrUpdateHistoryEntry } from '@/screens/history/services/history-service';
import { useSnackbar } from '@/shared/hooks/use-snackbar';
import { useI18n } from '@/shared/i18n';
import { useRecipeDetailStore } from '../store/recipe-detail-store';
import { parseRecipeId } from '../utils/recipe-detail-utils';

export function useRecipeDetailViewModel() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, setStats } = useProfileStore();
  const snackbar = useSnackbar();
  const {
    recipe,
    loading,
    favorite,
    servings,
    setRecipe,
    setLoading,
    setServings,
    setFavorite,
    toggleFavorite,
  } = useRecipeDetailStore();

  const recipeId = parseRecipeId(id);
  const [removeFavoriteModalVisible, setRemoveFavoriteModalVisible] = useState(false);

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
        if (data) {
          const fav = await isFavorite(recipeId);
          setFavorite(fav);
          addOrUpdateHistoryEntry(recipeId, 'viewed').catch(() => {});
        }
      } catch {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    },
    [recipeId, servings, setRecipe, setLoading, setServings, setFavorite, locale]
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

  const handleStartCooking = useCallback(() => {
    if (!recipe) return;
    router.push(`/cooking-guide/${recipe.id}`);
  }, [router, recipe]);

  const performRemoveFavorite = useCallback(async () => {
    if (!recipe) return;
    const result = await removeFavorite(recipe.id);
    if (result.success) {
      toggleFavorite();
      if (user) {
        const stats = await getProfileStatsFromSupabase(user.id);
        setStats(stats);
      }
      snackbar.info(t('favorites.snackbarRemoved'));
    } else {
      const message =
        result.reason === 'not_signed_in'
          ? t('favorites.snackbarErrorNotSignedIn')
          : t('favorites.snackbarErrorSave');
      snackbar.error(message);
    }
  }, [recipe, toggleFavorite, user, setStats, snackbar, t]);

  const closeRemoveFavoriteModal = useCallback(() => {
    setRemoveFavoriteModalVisible(false);
  }, []);

  const confirmRemoveFavorite = useCallback(async () => {
    await performRemoveFavorite();
    setRemoveFavoriteModalVisible(false);
  }, [performRemoveFavorite]);

  const handleToggleFavorite = useCallback(() => {
    if (!recipe) return;
    if (favorite) {
      if (Platform.OS === 'web') {
        setRemoveFavoriteModalVisible(true);
        return;
      }
      Alert.alert(
        t('favorites.removeConfirmTitle'),
        t('favorites.removeConfirmMessage'),
        [
          { text: t('favorites.removeConfirmCancel'), style: 'cancel' },
          { text: t('favorites.removeConfirmRemove'), onPress: performRemoveFavorite },
        ]
      );
      return;
    }
    addFavorite(recipe.id).then((result) => {
      if (result.success) {
        toggleFavorite();
        if (user) {
          getProfileStatsFromSupabase(user.id).then(setStats);
        }
        snackbar.success(t('favorites.snackbarAdded'));
      } else {
        const message =
          result.reason === 'not_signed_in'
            ? t('favorites.snackbarErrorNotSignedIn')
            : t('favorites.snackbarErrorSave');
        snackbar.error(message);
      }
    });
  }, [recipe, favorite, toggleFavorite, user, setStats, snackbar, t, performRemoveFavorite]);

  return {
    recipe,
    loading,
    favorite,
    servings,
    toggleFavorite: handleToggleFavorite,
    onServingsChange,
    handleBack,
    handleStartCooking,
    removeFavoriteModalVisible,
    closeRemoveFavoriteModal,
    confirmRemoveFavorite,
  };
}
