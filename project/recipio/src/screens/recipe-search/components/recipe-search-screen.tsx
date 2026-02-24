import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { useRecipeSearchViewModel } from '../hooks/use-recipe-search-view-model';
import { recipeSearchStyles } from '../styles/recipe-search.styles';
import { RecipeRow } from './recipe-row';

export function RecipeSearchScreen() {
  const {
    query,
    recent,
    results,
    loading,
    searched,
    handleQueryChange,
    handleSearch,
    clearRecent,
    handleRecentSelect,
    handleRemoveRecent,
    handleBack,
    handleRecipePress,
  } = useRecipeSearchViewModel();

  return (
    <View style={recipeSearchStyles.container}>
      <View style={recipeSearchStyles.header}>
        <TouchableOpacity
          style={recipeSearchStyles.backBtn}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={RecipioColors.text} />
        </TouchableOpacity>
        <View style={recipeSearchStyles.searchWrap}>
          <Ionicons
            name="search"
            size={20}
            color={RecipioColors.textSecondary}
          />
          <TextInput
            style={recipeSearchStyles.searchInput}
            placeholder="Search by recipe name..."
            placeholderTextColor={RecipioColors.textSecondary}
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {!query.trim() ? (
        <View style={recipeSearchStyles.section}>
          <View style={recipeSearchStyles.sectionRow}>
            <Text style={recipeSearchStyles.sectionTitle}>RECENT SEARCHES</Text>
            {recent.length > 0 ? (
              <TouchableOpacity
                style={recipeSearchStyles.clearRecent}
                onPress={clearRecent}
              >
                <Text style={recipeSearchStyles.clearRecentText}>Clear All</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {recent.length > 0 ? (
            <View style={recipeSearchStyles.chipWrap}>
              {recent.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={recipeSearchStyles.chip}
                  onPress={() => handleRecentSelect(q)}
                >
                  <Text style={recipeSearchStyles.chipText}>{q}</Text>
                  <TouchableOpacity
                    onPress={async (e) => {
                      e.stopPropagation();
                      await handleRemoveRecent(q);
                    }}
                  >
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={RecipioColors.textSecondary}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {query.trim().length > 0 ? (
        <View style={recipeSearchStyles.section}>
          <Text style={recipeSearchStyles.sectionTitle}>SUGGESTIONS</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={recipeSearchStyles.empty}>
          <ActivityIndicator size="large" color={RecipioColors.primaryAccent} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(r) => String(r.id)}
          contentContainerStyle={recipeSearchStyles.list}
          ListEmptyComponent={
            searched ? (
              <View style={recipeSearchStyles.empty}>
                <Text style={recipeSearchStyles.emptyText}>
                  {query.trim()
                    ? 'No recipes found. Try another search.'
                    : 'Type a recipe name above to search.'}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <RecipeRow
              recipe={item}
              onPress={() => handleRecipePress(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}
