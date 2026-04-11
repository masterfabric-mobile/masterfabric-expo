import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import type { RecipeCard } from '@/shared/services/recipe-service';
import { RecipeRow } from '@/screens/recipe-search';
import type { HistoryItemDisplay } from '../../models/history-models';
import { createHistoryStyles } from '../../styles/history.styles';
import type { createRecipeSearchStyles } from '@/screens/recipe-search/styles/recipe-search.styles';

interface HistoryListProps {
  historyStyles: ReturnType<typeof createHistoryStyles>;
  recipeRowStyles: ReturnType<typeof createRecipeSearchStyles>;
  colors: RecipioColorsPalette;
  items: HistoryItemDisplay[];
  isLoading: boolean;
  onRefresh?: () => void;
  onRecipePress: (recipeId: number) => void;
}

function keyExtractor(item: HistoryItemDisplay) {
  return `${item.recipeId}-${item.entry.lastUpdatedAt}`;
}

function toRecipeCard(item: HistoryItemDisplay): RecipeCard {
  return {
    id: item.recipeId,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    time: item.time,
    difficulty: item.difficulty,
  };
}

export function HistoryList({
  historyStyles,
  recipeRowStyles,
  colors,
  items,
  isLoading,
  onRefresh,
  onRecipePress,
}: HistoryListProps) {
  const { t } = useI18n();

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      contentContainerStyle={historyStyles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primaryAccent}
          />
        ) : undefined
      }
      ListHeaderComponent={
        <Text style={historyStyles.sectionLabel}>{t('history.sectionLabel')}</Text>
      }
      renderItem={({ item }) => (
        <RecipeRow
          recipe={toRecipeCard(item)}
          cardStyles={recipeRowStyles}
          colors={colors}
          onPress={() => onRecipePress(item.recipeId)}
        />
      )}
    />
  );
}
