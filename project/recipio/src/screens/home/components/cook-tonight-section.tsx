import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { dashboardStyles } from '../styles/dashboard.styles';
import type { RecipeCard } from '../models/home-models';

interface CookTonightSectionProps {
  recipes: RecipeCard[];
  onRecipePress?: (recipeId: number) => void;
}

export function CookTonightSection({ recipes, onRecipePress }: CookTonightSectionProps) {
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
                <Text style={dashboardStyles.recipeMetaText}>{recipe.time}</Text>
                <Text style={dashboardStyles.recipeMetaText}>•</Text>
                <Text style={dashboardStyles.recipeMetaText}>
                  {recipe.difficulty}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
