import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { useI18n } from '@/shared/i18n';
import { useRecipeResultsViewModel } from '../hooks/use-recipe-results-view-model';
import { recipeResultsStyles } from '../styles/recipe-results.styles';
import type { RecipeSortType } from '../utils/recipe-results-utils';
import { RecipeResultsRow } from './recipe-results-row';

const SORT_OPTIONS: RecipeSortType[] = [
  'relevance',
  'time',
  'difficulty',
  'category',
];

function getSortLabelKey(sortType: RecipeSortType): string {
  return `recipeResults.sortBy${sortType.charAt(0).toUpperCase()}${sortType.slice(1)}` as const;
}

export function RecipeResultsScreen() {
  const {
    recipes,
    loading,
    ingredientList,
    sortType,
    setSortType,
    handleBack,
    handleRecipePress,
  } = useRecipeResultsViewModel();
  const { t } = useI18n();
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const openSortModal = useCallback(() => setSortModalVisible(true), []);
  const closeSortModal = useCallback(() => setSortModalVisible(false), []);

  const handleSortSelect = useCallback(
    (option: RecipeSortType) => {
      setSortType(option);
      closeSortModal();
    },
    [setSortType, closeSortModal]
  );

  if (loading) {
    return (
      <View
        style={[
          recipeResultsStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={RecipioColors.primaryAccent}
        />
      </View>
    );
  }

  return (
    <View style={recipeResultsStyles.container}>
      <View style={recipeResultsStyles.header}>
        <TouchableOpacity
          style={recipeResultsStyles.backBtn}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={RecipioColors.text} />
        </TouchableOpacity>
        <Text style={recipeResultsStyles.title}>
          {ingredientList.length > 0
            ? t('recipeResults.titleWithIngredients', { count: recipes.length })
            : t('recipeResults.title')}
        </Text>
      </View>
      <View style={recipeResultsStyles.resultsBarWrapper}>
        <View style={recipeResultsStyles.resultsBar}>
          <Text style={recipeResultsStyles.resultsText}>
            {t('recipeResults.showingResults', { count: recipes.length })}
          </Text>
          <TouchableOpacity
            style={recipeResultsStyles.sortButton}
            onPress={openSortModal}
            activeOpacity={0.7}
          >
            <Text style={recipeResultsStyles.sortText}>
              {t('recipeResults.sortBy')}: {t(getSortLabelKey(sortType))}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={RecipioColors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {sortModalVisible && (
          <View style={recipeResultsStyles.sortDropdown}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  recipeResultsStyles.sortOption,
                  option === sortType && recipeResultsStyles.sortOptionSelected,
                ]}
                onPress={() => handleSortSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={recipeResultsStyles.sortOptionText}>
                  {t(getSortLabelKey(option))}
                </Text>
                {option === sortType && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={RecipioColors.primaryAccent}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {sortModalVisible && (
        <TouchableWithoutFeedback onPress={closeSortModal}>
          <View style={recipeResultsStyles.sortDropdownBackdrop} />
        </TouchableWithoutFeedback>
      )}
      <FlatList
        data={recipes}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={recipeResultsStyles.list}
        ListEmptyComponent={
          <View style={recipeResultsStyles.empty}>
            <Text style={recipeResultsStyles.emptyText}>
              {t('recipeResults.noRecipes')}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeResultsRow
            recipe={item}
            onPress={() => handleRecipePress(item.id)}
          />
        )}
      />
    </View>
  );
}
