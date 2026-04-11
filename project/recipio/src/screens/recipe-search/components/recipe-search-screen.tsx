import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useRecipeSearchViewModel } from '../hooks/use-recipe-search-view-model';
import { createRecipeSearchStyles } from '../styles/recipe-search.styles';
import { RecipeRow } from './recipe-row';

export function RecipeSearchScreen() {
  const colors = useRecipioColors();
  const recipeSearchStyles = useMemo(() => createRecipeSearchStyles(colors), [colors]);
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
    <SafeAreaView style={recipeSearchStyles.container} edges={['top', 'left', 'right']}>
      <View style={recipeSearchStyles.header}>
        <TouchableOpacity
          style={recipeSearchStyles.backBtn}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={recipeSearchStyles.searchWrap}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={recipeSearchStyles.searchInput}
            placeholder={t('recipeSearch.placeholder')}
            placeholderTextColor={colors.textSecondary}
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
            <View style={recipeSearchStyles.recentList}>
              {recent.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={recipeSearchStyles.card}
                  onPress={() => handleRecentSelect(item.id)}
                  activeOpacity={0.8}
                >
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={recipeSearchStyles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        recipeSearchStyles.cardImage,
                        { justifyContent: 'center', alignItems: 'center' },
                      ]}
                    >
                      <Text style={{ fontSize: 28 }}>🍳</Text>
                    </View>
                  )}
                  <View style={recipeSearchStyles.cardBody}>
                    <Text style={recipeSearchStyles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={recipeSearchStyles.recentRowRemove}
                    onPress={async (e) => {
                      e.stopPropagation();
                      await handleRemoveRecent(item.id);
                    }}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
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
          <ActivityIndicator size="large" color={colors.primaryAccent} />
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
              cardStyles={recipeSearchStyles}
              colors={colors}
              onPress={() => handleRecipePress(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
