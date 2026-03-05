import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useFavoritesViewModel } from '../hooks/use-favorites-view-model';
import { RecipeRow } from '@/screens/recipe-search';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { useI18n } from '@/shared/i18n';
import { createFavoritesStyles } from '../styles/favorites.styles';
import { createRecipeSearchStyles } from '@/screens/recipe-search/styles/recipe-search.styles';

export function FavoritesScreen() {
  const { t } = useI18n();
  const colors = useRecipioColors();
  const favoritesStyles = useMemo(() => createFavoritesStyles(colors), [colors]);
  const recipeRowStyles = useMemo(() => createRecipeSearchStyles(colors), [colors]);
  const {
    isLoading,
    recipes,
    refetch,
    handleRecipePress,
    handleRemoveFromFavorites,
    removeConfirmRecipeId,
    closeRemoveConfirm,
    confirmRemoveFavorite,
  } = useFavoritesViewModel();

  if (isLoading && recipes.length === 0) {
    return (
      <View style={favoritesStyles.container}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.headerTitle}>{t('favorites.title')}</Text>
        </View>
        <View style={[favoritesStyles.empty, { flex: 1 }]}>
          <ActivityIndicator size="large" color={colors.primaryAccent} />
        </View>
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={favoritesStyles.container}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.headerTitle}>{t('favorites.title')}</Text>
          <Text style={favoritesStyles.headerSubtitle}>
            {t('favorites.subtitleEmpty')}
          </Text>
        </View>
        <View style={favoritesStyles.empty}>
          <Text style={favoritesStyles.emptyIcon}>❤️</Text>
          <Text style={favoritesStyles.text}>{t('favorites.emptyTitle')}</Text>
          <Text style={favoritesStyles.subtext}>{t('favorites.emptySubtext')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={favoritesStyles.container}>
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.headerTitle}>{t('favorites.title')}</Text>
        <Text style={favoritesStyles.headerSubtitle}>
          {t('favorites.subtitleCount', { count: recipes.length })}
        </Text>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={favoritesStyles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primaryAccent}
          />
        }
        ListHeaderComponent={
          <Text style={favoritesStyles.sectionLabel}>{t('favorites.sectionLabel')}</Text>
        }
        renderItem={({ item }) => (
          <RecipeRow
            recipe={item}
            cardStyles={recipeRowStyles}
            colors={colors}
            onPress={() => handleRecipePress(item)}
            onRemoveFromFavorites={handleRemoveFromFavorites}
          />
        )}
      />
      <ConfirmModal
        visible={removeConfirmRecipeId != null}
        title={t('favorites.removeConfirmTitle')}
        message={t('favorites.removeConfirmMessage')}
        cancelText={t('favorites.removeConfirmCancel')}
        confirmText={t('favorites.removeConfirmRemove')}
        onCancel={closeRemoveConfirm}
        onConfirm={() => confirmRemoveFavorite()}
        destructive
      />
    </View>
  );
}
