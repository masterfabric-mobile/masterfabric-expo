import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { useRecipeResultsViewModel } from '../hooks/use-recipe-results-view-model';
import { recipeResultsStyles } from '../styles/recipe-results.styles';
import { RecipeResultsRow } from './recipe-results-row';

export function RecipeResultsScreen() {
  const {
    recipes,
    loading,
    ingredientList,
    title,
    handleBack,
    handleRecipePress,
  } = useRecipeResultsViewModel();

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
        <Text style={recipeResultsStyles.title}>{title}</Text>
      </View>
      {ingredientList.length > 0 && (
        <View style={recipeResultsStyles.resultsBar}>
          <Text style={recipeResultsStyles.resultsText}>
            Showing {recipes.length} results
          </Text>
          <Text style={recipeResultsStyles.sortText}>Sort by Relevance</Text>
        </View>
      )}
      <FlatList
        data={recipes}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={recipeResultsStyles.list}
        ListEmptyComponent={
          <View style={recipeResultsStyles.empty}>
            <Text style={recipeResultsStyles.emptyText}>
              No recipes found. Try adding different ingredients.
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
