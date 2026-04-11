import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import type { RecipeCard } from '@/shared/services/recipe-service';
import { getFavoriteRecipes, removeFavorite } from '@/shared/services/favorites-service';
import { useI18n } from '@/shared/i18n';
import { useSnackbar } from '@/shared/hooks/use-snackbar';
import { useProfileStore } from '@/screens/profile/store/profile-store';
import { getProfileStatsFromSupabase } from '@/shared/services/profile-service';
import { useFavoritesStore } from '../store/favorites-store';

export function useFavoritesViewModel() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const snackbar = useSnackbar();
  const { user, setStats } = useProfileStore();
  const dietaryPreferences = useProfileStore((s) => s.settings.dietaryPreferences);
  const { isLoading, recipes, setLoading, setRecipes } = useFavoritesStore();
  const [removeConfirmRecipeId, setRemoveConfirmRecipeId] = useState<number | null>(null);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getFavoriteRecipes({
        locale,
        dietaryPreferences: dietaryPreferences ?? undefined,
      });
      setRecipes(list);
    } finally {
      setLoading(false);
    }
  }, [locale, dietaryPreferences, setLoading, setRecipes]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleRecipePress = useCallback(
    (recipe: RecipeCard) => {
      const id = recipe?.id;
      if (id == null) return;
      router.push(`/recipe-detail/${id}` as const);
    },
    [router]
  );

  const closeRemoveConfirm = useCallback(() => {
    setRemoveConfirmRecipeId(null);
  }, []);

  const confirmRemoveFavorite = useCallback(
    async (idOverride?: number) => {
      const id = idOverride ?? removeConfirmRecipeId;
      if (id == null) return;
      setRemoveConfirmRecipeId(null);
      const result = await removeFavorite(id);
      if (result.success) {
        if (user) {
          const stats = await getProfileStatsFromSupabase(user.id);
          setStats(stats);
        }
        snackbar.info(t('favorites.snackbarRemoved'));
        loadFavorites();
      } else {
        const message =
          result.reason === 'not_signed_in'
            ? t('favorites.snackbarErrorNotSignedIn')
            : t('favorites.snackbarErrorSave');
        snackbar.error(message);
      }
    },
    [removeConfirmRecipeId, user, setStats, snackbar, t, loadFavorites]
  );

  const handleRemoveFromFavorites = useCallback(
    (recipe: RecipeCard) => {
      const id = recipe?.id;
      if (id == null) return;
      if (Platform.OS === 'web') {
        setRemoveConfirmRecipeId(id);
        return;
      }
      Alert.alert(
        t('favorites.removeConfirmTitle'),
        t('favorites.removeConfirmMessage'),
        [
          { text: t('favorites.removeConfirmCancel'), style: 'cancel' },
          { text: t('favorites.removeConfirmRemove'), onPress: () => confirmRemoveFavorite(id) },
        ]
      );
    },
    [t, confirmRemoveFavorite]
  );

  return {
    isLoading,
    recipes,
    refetch: loadFavorites,
    handleRecipePress,
    handleRemoveFromFavorites,
    removeConfirmRecipeId,
    closeRemoveConfirm,
    confirmRemoveFavorite,
  };
}
