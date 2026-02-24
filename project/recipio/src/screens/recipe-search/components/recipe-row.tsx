import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import type { RecipeCard } from '@/shared/services/recipe-service';
import { recipeSearchStyles } from '../styles/recipe-search.styles';

interface RecipeRowProps {
  recipe: RecipeCard;
  onPress: () => void;
}

export function RecipeRow({ recipe, onPress }: RecipeRowProps) {
  return (
    <TouchableOpacity
      style={recipeSearchStyles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {recipe.imageUrl ? (
        <Image
          source={{ uri: recipe.imageUrl }}
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
          {recipe.title}
        </Text>
        <View style={recipeSearchStyles.cardMeta}>
          <Text style={recipeSearchStyles.cardMetaText}>{recipe.time}</Text>
          <Text style={recipeSearchStyles.cardMetaText}>•</Text>
          <Text style={recipeSearchStyles.cardMetaText}>{recipe.difficulty}</Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={RecipioColors.textSecondary}
      />
    </TouchableOpacity>
  );
}
