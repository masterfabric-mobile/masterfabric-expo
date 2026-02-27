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
import { useI18n } from '@/shared/i18n';
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
  const { t } = useI18n();

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
            placeholder={t('recipeSearch.placeholder')}
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
            <Text style={recipeSearchStyles.sectionTitle}>{t('recipeSearch.recentSearches')}</Text>
            {recent.length > 0 ? (
              <TouchableOpacity
                style={recipeSearchStyles.clearRecent}
                onPress={clearRecent}
              >
                <Text style={recipeSearchStyles.clearRecentText}>{t('recipeSearch.clearAll')}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {recent.length > 0 ? (
            <View style={recipeSearchStyles.chipWrap}>
              {recent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={recipeSearchStyles.chip}
                  onPress={() => handleRecentSelect(item.id)}
                >
                  <Text style={recipeSearchStyles.chipText}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={async (e) => {
                      e.stopPropagation();
                      await handleRemoveRecent(item.id);
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
          <Text style={recipeSearchStyles.sectionTitle}>{t('recipeSearch.suggestions')}</Text>
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
                      ? t('recipeSearch.noResults')
                      : t('recipeSearch.typeToSearch')}
                  </Text>
                </View>
              ) : null
            }
          renderItem={({ item }) => (
            <RecipeRow
              recipe={item}
              onPress={() => handleRecipePress(item)}
            />
          )}
        />
      )}
    </View>
  );
}
