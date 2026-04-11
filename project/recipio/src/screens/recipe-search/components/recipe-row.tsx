import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import type { RecipeCard } from '@/shared/services/recipe-service';
import { formatRecipeDifficulty, formatRecipeTime } from '@/shared/utils/recipe-display';
import { createRecipeSearchStyles } from '../styles/recipe-search.styles';

interface RecipeRowProps {
  recipe: RecipeCard;
  onPress: () => void;
  /** Theme-aware card styles (from createRecipeSearchStyles). */
  cardStyles: ReturnType<typeof createRecipeSearchStyles>;
  /** Theme-aware colors. */
  colors: RecipioColorsPalette;
  /** When provided, shows a heart button to remove from favorites (e.g. on Favorites screen). */
  onRemoveFromFavorites?: (recipe: RecipeCard) => void;
}

export function RecipeRow({ recipe, onPress, cardStyles, colors, onRemoveFromFavorites }: RecipeRowProps) {
  const { t } = useI18n();
  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {recipe.imageUrl ? (
        <Image
          source={{ uri: recipe.imageUrl }}
          style={cardStyles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            cardStyles.cardImage,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text style={{ fontSize: 28 }}>🍳</Text>
        </View>
      )}
      <View style={cardStyles.cardBody}>
        <Text style={cardStyles.cardTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={cardStyles.cardMeta}>
          <Text style={cardStyles.cardMetaText}>{formatRecipeTime(t, recipe.time)}</Text>
          <Text style={cardStyles.cardMetaText}>•</Text>
          <Text style={cardStyles.cardMetaText}>{formatRecipeDifficulty(t, recipe.difficulty)}</Text>
        </View>
      </View>
      {onRemoveFromFavorites != null ? (
        <TouchableOpacity
          onPress={() => onRemoveFromFavorites(recipe)}
          style={{ padding: 8, marginRight: 4 }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={t('favorites.removeConfirmTitle')}
        >
          <Ionicons
            name="heart"
            size={22}
            color={colors.error}
          />
        </TouchableOpacity>
      ) : null}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
}
