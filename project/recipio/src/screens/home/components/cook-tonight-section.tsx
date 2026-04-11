import { useI18n } from '@/shared/i18n';
import {
    formatRecipeDifficulty,
    formatRecipeTime,
    parseMinutesFromTimeString,
} from '@/shared/utils/recipe-display';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { RecipeCard } from '../models/home-models';
import { createHomeStyles } from '../styles/home.styles';

type TimeTier = 'quick' | 'medium' | 'long';
type DifficultyKey = 'easy' | 'medium' | 'hard';

function getTimeTier(time: string): TimeTier {
  const mins = parseMinutesFromTimeString(time);
  if (mins == null) return 'medium';
  if (mins <= 20) return 'quick';
  if (mins <= 45) return 'medium';
  return 'long';
}

function getDifficultyKey(difficulty: string): DifficultyKey {
  const key = difficulty?.trim().toLowerCase();
  if (key === 'easy') return 'easy';
  if (key === 'hard') return 'hard';
  return 'medium';
}

interface CookTonightSectionProps {
  homeStyles: ReturnType<typeof createHomeStyles>;
  recipes: RecipeCard[];
  onRecipePress?: (recipeId: number) => void;
  onViewAll?: () => void;
}

export function CookTonightSection({
  homeStyles,
  recipes,
  onRecipePress,
  onViewAll,
}: CookTonightSectionProps) {
  const { t } = useI18n();
  return (
    <View style={homeStyles.cookTonightSection}>
      <View style={homeStyles.sectionHeader}>
        <Text style={homeStyles.sectionTitle}>{t('home.cookTonight')}</Text>
        {recipes.length > 0 && onViewAll ? (
          <TouchableOpacity
            onPress={onViewAll}
            style={homeStyles.viewAllButton}
            activeOpacity={0.85}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="compass-outline" size={16} color="#FFFFFF" />
            <Text style={homeStyles.viewAllButtonText}>
              {t('home.viewAllFindNextMeal')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {recipes.length === 0 ? (
        <View style={homeStyles.emptyRecipesContainer}>
          <Text style={homeStyles.emptyRecipesText}>
            {t('home.noRecipesAddIngredients')}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={homeStyles.recipeScroll}
        >
          {recipes.map(recipe => {
            const timeTier = getTimeTier(recipe.time);
            const difficultyKey = getDifficultyKey(recipe.difficulty);
            const timeBadgeStyle =
              timeTier === 'quick'
                ? [
                    homeStyles.recipeBadgeTimeQuick,
                    homeStyles.recipeBadgeTimeQuickText,
                  ]
                : timeTier === 'long'
                  ? [
                      homeStyles.recipeBadgeTimeLong,
                      homeStyles.recipeBadgeTimeLongText,
                    ]
                  : [
                      homeStyles.recipeBadgeTimeMedium,
                      homeStyles.recipeBadgeTimeMediumText,
                    ];
            const difficultyBadgeStyle =
              difficultyKey === 'easy'
                ? [
                    homeStyles.recipeBadgeDifficultyEasy,
                    homeStyles.recipeBadgeDifficultyEasyText,
                  ]
                : difficultyKey === 'hard'
                  ? [
                      homeStyles.recipeBadgeDifficultyHard,
                      homeStyles.recipeBadgeDifficultyHardText,
                    ]
                  : [
                      homeStyles.recipeBadgeDifficultyMedium,
                      homeStyles.recipeBadgeDifficultyMediumText,
                    ];
            const timeIcon =
              timeTier === 'quick'
                ? 'flash-outline'
                : timeTier === 'long'
                  ? 'time-outline'
                  : 'time-outline';
            const timeIconColor =
              timeTier === 'quick'
                ? '#2E7D32'
                : timeTier === 'long'
                  ? '#C62828'
                  : '#E65100';
            const difficultyIcon =
              difficultyKey === 'easy'
                ? 'leaf-outline'
                : difficultyKey === 'hard'
                  ? 'flame'
                  : 'flame-outline';
            const difficultyIconColor =
              difficultyKey === 'easy'
                ? '#2E7D32'
                : difficultyKey === 'hard'
                  ? '#C62828'
                  : '#E65100';

            return (
              <TouchableOpacity
                key={recipe.id}
                style={homeStyles.recipeCard}
                activeOpacity={0.8}
                onPress={() => onRecipePress?.(recipe.id)}
              >
                <View style={homeStyles.recipeImageWrap}>
                  {recipe.imageUrl ? (
                    <Image
                      source={{ uri: recipe.imageUrl }}
                      style={homeStyles.recipeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        homeStyles.recipeImage,
                        { justifyContent: 'center', alignItems: 'center' },
                      ]}
                    >
                      <Text style={{ fontSize: 36 }}>🍳</Text>
                    </View>
                  )}
                  <LinearGradient
                    colors={[
                      'transparent',
                      'rgba(0,0,0,0.25)',
                      'rgba(0,0,0,0.7)',
                    ]}
                    style={homeStyles.recipeCardGradient}
                  />
                  <View style={homeStyles.recipeBadgesOverlay}>
                    <View style={[homeStyles.recipeBadge, timeBadgeStyle[0]]}>
                      <Ionicons
                        name={timeIcon as any}
                        size={12}
                        color="#FFFFFF"
                      />
                      <Text
                        style={[homeStyles.recipeBadgeText, timeBadgeStyle[1]]}
                      >
                        {formatRecipeTime(t, recipe.time)}
                      </Text>
                    </View>
                    <View
                      style={[homeStyles.recipeBadge, difficultyBadgeStyle[0]]}
                    >
                      <Ionicons
                        name={difficultyIcon as any}
                        size={12}
                        color="#FFFFFF"
                      />
                      <Text
                        style={[
                          homeStyles.recipeBadgeText,
                          difficultyBadgeStyle[1],
                        ]}
                      >
                        {formatRecipeDifficulty(t, recipe.difficulty)}
                      </Text>
                    </View>
                  </View>
                  <View style={homeStyles.recipeTitleOverlay}>
                    <Text
                      style={homeStyles.recipeTitleOnGradient}
                      numberOfLines={2}
                    >
                      {recipe.title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
