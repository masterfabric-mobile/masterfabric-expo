import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import type { RecipeCardWithMatch } from '@/shared/services/recipe-service';
import {
  getMatchBadgeStyle,
  recipeResultsStyles,
} from '../styles/recipe-results.styles';

interface RecipeResultsRowProps {
  recipe: RecipeCardWithMatch;
  onPress: () => void;
}

export function RecipeResultsRow({ recipe, onPress }: RecipeResultsRowProps) {
  const matchStyle = getMatchBadgeStyle(recipe.matchPercent);
  const statusText = recipe.hasAllIngredients
    ? 'You have all items'
    : recipe.missingCount === 1 && recipe.missingIngredients[0]
      ? `Missing: ${recipe.missingIngredients[0]}`
      : `Missing ${recipe.missingCount} ingredients`;
  const statusColor = recipe.hasAllIngredients
    ? recipeResultsStyles.cardStatusAll
    : undefined;

  return (
    <TouchableOpacity
      style={recipeResultsStyles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={recipeResultsStyles.cardImageWrap}>
        {recipe.imageUrl ? (
          <Image
            source={{ uri: recipe.imageUrl }}
            style={recipeResultsStyles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <Text style={{ fontSize: 48 }}>🍳</Text>
          </View>
        )}
        <View style={[recipeResultsStyles.matchBadge, matchStyle]}>
          <Text style={recipeResultsStyles.matchBadgeText}>
            {recipe.matchPercent}% Match
          </Text>
        </View>
      </View>
      <View style={recipeResultsStyles.cardBody}>
        <Text style={recipeResultsStyles.cardTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={recipeResultsStyles.cardMeta}>
          <Text style={recipeResultsStyles.cardMetaText}>{recipe.time}</Text>
          <Text style={recipeResultsStyles.cardMetaText}>•</Text>
          <Text style={recipeResultsStyles.cardMetaText}>{recipe.difficulty}</Text>
        </View>
        <View style={recipeResultsStyles.cardStatusRow}>
          <View style={recipeResultsStyles.cardStatus}>
            {recipe.hasAllIngredients ? (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={RecipioColors.success}
              />
            ) : recipe.missingCount === 1 ? (
              <Ionicons
                name="cart-outline"
                size={14}
                color={RecipioColors.error}
              />
            ) : (
              <Ionicons name="warning" size={14} color={RecipioColors.orange} />
            )}
            <Text style={[recipeResultsStyles.cardStatusText, statusColor]}>
              {statusText}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={RecipioColors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
