import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import { useI18n } from '@/shared/i18n';
import type { RecipeCardWithMatch } from '@/shared/services/recipe-service';
import { formatRecipeDifficulty, formatRecipeTime } from '@/shared/utils/recipe-display';
import {
  getMatchBadgeStyle,
  type RecipeResultsStyles,
} from '../styles/recipe-results.styles';

interface RecipeResultsRowProps {
  recipe: RecipeCardWithMatch;
  styles: RecipeResultsStyles;
  colors: RecipioColorsPalette;
  onPress: () => void;
}

export function RecipeResultsRow({ recipe, styles: recipeResultsStyles, colors, onPress }: RecipeResultsRowProps) {
  const { t } = useI18n();
  const matchStyle = getMatchBadgeStyle(recipeResultsStyles, recipe.matchPercent);
  const statusText = recipe.hasAllIngredients
    ? t('recipeResults.youHaveAll')
    : recipe.missingCount === 1 && recipe.missingIngredients[0]
      ? t('recipeResults.missingOne', { name: recipe.missingIngredients[0] })
      : t('recipeResults.missingCount', { count: recipe.missingCount });
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
            {t('recipeResults.match', { percent: recipe.matchPercent })}
          </Text>
        </View>
      </View>
      <View style={recipeResultsStyles.cardBody}>
        <Text style={recipeResultsStyles.cardTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={recipeResultsStyles.cardMeta}>
          <Text style={recipeResultsStyles.cardMetaText}>{formatRecipeTime(t, recipe.time)}</Text>
          <Text style={recipeResultsStyles.cardMetaText}>•</Text>
          <Text style={recipeResultsStyles.cardMetaText}>{formatRecipeDifficulty(t, recipe.difficulty)}</Text>
        </View>
        <View style={recipeResultsStyles.cardStatusRow}>
          <View style={recipeResultsStyles.cardStatus}>
            {recipe.hasAllIngredients ? (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.success}
              />
            ) : recipe.missingCount === 1 ? (
              <Ionicons
                name="cart-outline"
                size={14}
                color={colors.error}
              />
            ) : (
              <Ionicons name="warning" size={14} color={colors.orange} />
            )}
            <Text style={[recipeResultsStyles.cardStatusText, statusColor]}>
              {statusText}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
