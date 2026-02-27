import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { formatRecipeDifficulty, formatRecipeTime } from '@/shared/utils/recipe-display';
import { dashboardStyles } from '../styles/dashboard.styles';
import type { RecipeCard } from '../models/home-models';

interface CookTonightSectionProps {
  recipes: RecipeCard[];
  onRecipePress?: (recipeId: number) => void;
}

export function CookTonightSection({ recipes, onRecipePress }: CookTonightSectionProps) {
  const { t } = useI18n();
  return (
    <View style={dashboardStyles.cookTonightSection}>
      <View style={dashboardStyles.sectionHeader}>
        <Text style={dashboardStyles.sectionTitle}>Cook Tonight</Text>
      </View>

      {recipes.length === 0 ? (
        <View style={dashboardStyles.emptyRecipesContainer}>
          <Text style={dashboardStyles.emptyRecipesText}>
            No recipes available. Add some ingredients to find recipes!
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={dashboardStyles.recipeScroll}
        >
          {recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={dashboardStyles.recipeCard}
              activeOpacity={0.8}
              onPress={() => onRecipePress?.(recipe.id)}
            >
              {recipe.imageUrl ? (
                <Image
                  source={{ uri: recipe.imageUrl }}
                  style={dashboardStyles.recipeImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    dashboardStyles.recipeImage,
                    { justifyContent: 'center', alignItems: 'center' },
                  ]}
                >
                  <Text style={{ fontSize: 32 }}>🍳</Text>
                </View>
              )}
              <Text style={dashboardStyles.recipeTitle} numberOfLines={2}>
                {recipe.title}
              </Text>
              <View style={dashboardStyles.recipeMeta}>
                <Text style={dashboardStyles.recipeMetaText}>{formatRecipeTime(t, recipe.time)}</Text>
                <Text style={dashboardStyles.recipeMetaText}>•</Text>
                <Text style={dashboardStyles.recipeMetaText}>
                  {formatRecipeDifficulty(t, recipe.difficulty)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
