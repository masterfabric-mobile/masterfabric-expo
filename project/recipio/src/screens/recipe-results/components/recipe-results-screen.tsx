import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { useI18n } from '@/shared/i18n';
import { RECIPE_CATEGORIES } from '@/shared/services/recipe-service';
import { useRecipeResultsViewModel } from '../hooks/use-recipe-results-view-model';
import { recipeResultsStyles } from '../styles/recipe-results.styles';
import { RecipeResultsRow } from './recipe-results-row';

export function RecipeResultsScreen() {
  const {
    recipes,
    loading,
    ingredientList,
    categorySlug,
    handleBack,
    handleRecipePress,
  } = useRecipeResultsViewModel();
  const { t } = useI18n();

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
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={t('common.goBack')}
        >
          <Ionicons name="arrow-back" size={24} color={RecipioColors.text} />
        </TouchableOpacity>
        <Text style={recipeResultsStyles.title}>
          {categorySlug
            ? (() => {
                const cat = RECIPE_CATEGORIES.find((c) => c.slug === categorySlug);
                return cat
                  ? t('recipeResults.titleCategory', { category: t(cat.labelKey) })
                  : t('recipeResults.title');
              })()
            : ingredientList.length > 0
              ? t('recipeResults.titleWithIngredients', { count: recipes.length })
              : t('recipeResults.title')}
        </Text>
      </View>
      <View style={recipeResultsStyles.resultsBarWrapper}>
        <View style={recipeResultsStyles.resultsBar}>
          <Text style={recipeResultsStyles.resultsText}>
            {t('recipeResults.showingResults', { count: recipes.length })}
          </Text>
        </View>
      </View>
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
