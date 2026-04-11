import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useI18n } from '@/shared/i18n';
import { formatRecipeDifficulty, formatRecipeTime } from '@/shared/utils/recipe-display';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { useRecipeDetailViewModel } from '../hooks/use-recipe-detail-view-model';
import { createRecipeDetailStyles } from '../styles/recipe-detail.styles';
import { SERVINGS_OPTIONS } from '../models/recipe-detail-models';

export function RecipeDetailScreen() {
  const containerRef = useRef<View>(null);
  const colors = useRecipioColors();
  const recipeDetailStyles = useMemo(() => createRecipeDetailStyles(colors), [colors]);
  const {
    recipe,
    loading,
    favorite,
    servings,
    toggleFavorite,
    onServingsChange,
    handleBack,
    handleStartCooking,
    removeFavoriteModalVisible,
    closeRemoveFavoriteModal,
    confirmRemoveFavorite,
  } = useRecipeDetailViewModel();
  const { t } = useI18n();

  useEffect(() => {
    if (Platform.OS !== 'web' || loading || !recipe) return;
    const node = containerRef.current as unknown as HTMLElement | undefined;
    if (node?.focus) node.focus();
  }, [loading, recipe]);

  if (loading) {
    return (
      <View
        style={[
          recipeDetailStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primaryAccent}
        />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={recipeDetailStyles.container}>
        <View
          style={[
            recipeDetailStyles.header,
            {
              position: 'relative',
              paddingTop: Platform.OS === 'web' ? 12 : 44,
              backgroundColor: colors.background,
            },
          ]}
        >
          <TouchableOpacity
            style={recipeDetailStyles.headerBtn}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={t('common.goBack')}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={recipeDetailStyles.error}>
          <Text style={recipeDetailStyles.errorText}>{t('recipeDetail.recipeNotFound')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      ref={containerRef}
      style={recipeDetailStyles.container}
      {...(Platform.OS === 'web' && { tabIndex: -1 })}
    >
      <View style={recipeDetailStyles.hero}>
        {recipe.imageUrl ? (
          <Image
            source={{ uri: recipe.imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <Text style={{ fontSize: 64 }}>🍳</Text>
          </View>
        )}
      </View>
      <View style={[recipeDetailStyles.header, { backgroundColor: 'transparent' }]} pointerEvents="box-none">
        <TouchableOpacity
          style={recipeDetailStyles.headerBtn}
          onPress={handleBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={t('common.goBack')}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={recipeDetailStyles.headerBtn}
          onPress={toggleFavorite}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={24}
            color={favorite ? colors.error : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={recipeDetailStyles.scroll}
        contentContainerStyle={recipeDetailStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={recipeDetailStyles.title}>{recipe.title}</Text>

        <View style={recipeDetailStyles.metaRow}>
          {recipe.rating != null && (
            <View style={recipeDetailStyles.metaItem}>
              <Ionicons
                name="star"
                size={16}
                color={colors.primaryAccent}
              />
              <Text style={recipeDetailStyles.metaText}>
                {recipe.rating} ({recipe.reviewCount ?? 0})
              </Text>
            </View>
          )}
          <View style={recipeDetailStyles.metaItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={recipeDetailStyles.metaText}>{formatRecipeTime(t, recipe.time)}</Text>
          </View>
          <View style={recipeDetailStyles.metaItem}>
            <Ionicons
              name="restaurant-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={recipeDetailStyles.metaText}>{formatRecipeDifficulty(t, recipe.difficulty)}</Text>
          </View>
        </View>

        <View style={recipeDetailStyles.servingsRow}>
          <Text style={recipeDetailStyles.servingsLabel}>{t('recipeDetail.servings')}</Text>
          <View style={recipeDetailStyles.servingsPills}>
            {SERVINGS_OPTIONS.map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  recipeDetailStyles.pill,
                  servings === n && recipeDetailStyles.pillSelected,
                ]}
                onPress={() => onServingsChange(n)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    recipeDetailStyles.pillText,
                    servings === n && recipeDetailStyles.pillTextSelected,
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[recipeDetailStyles.metaText, { marginTop: 6 }]}>
            {t('recipeDetail.servingsFor', { count: servings })}
          </Text>
        </View>

        {recipe.description ? (
          <Text style={recipeDetailStyles.description}>{recipe.description}</Text>
        ) : null}

        {recipe.nutrition && (
          <View style={recipeDetailStyles.nutritionRow}>
            <View
              style={[
                recipeDetailStyles.nutritionCard,
                recipeDetailStyles.nutritionCardKcal,
              ]}
            >
              <Text
                style={[
                  recipeDetailStyles.nutritionValue,
                  recipeDetailStyles.nutritionValueKcal,
                ]}
              >
                {recipe.nutrition.kcal}
              </Text>
              <Text
                style={[
                  recipeDetailStyles.nutritionLabel,
                  recipeDetailStyles.nutritionLabelKcal,
                ]}
              >
                {t('recipeDetail.nutritionKcal')}
              </Text>
            </View>
            <View style={recipeDetailStyles.nutritionCard}>
              <Text style={recipeDetailStyles.nutritionValue}>
                {recipe.nutrition.protein}g
              </Text>
              <Text style={recipeDetailStyles.nutritionLabel}>{t('recipeDetail.nutritionProt')}</Text>
            </View>
            <View style={recipeDetailStyles.nutritionCard}>
              <Text style={recipeDetailStyles.nutritionValue}>
                {recipe.nutrition.carbs}g
              </Text>
              <Text style={recipeDetailStyles.nutritionLabel}>{t('recipeDetail.nutritionCarb')}</Text>
            </View>
            <View style={recipeDetailStyles.nutritionCard}>
              <Text style={recipeDetailStyles.nutritionValue}>
                {recipe.nutrition.fat}g
              </Text>
              <Text style={recipeDetailStyles.nutritionLabel}>{t('recipeDetail.nutritionFat')}</Text>
            </View>
          </View>
        )}

        <View style={recipeDetailStyles.ingredientsHeader}>
          <Text style={recipeDetailStyles.ingredientsTitle}>{t('recipeDetail.ingredients')}</Text>
          <Text style={recipeDetailStyles.ingredientsCount}>
            {recipe.ingredients.length} {t('recipeDetail.items')}
          </Text>
        </View>
        {recipe.ingredients.map((name, i) => (
          <View
            key={`${name}-${i}`}
            style={recipeDetailStyles.ingredientRow}
          >
            <Text style={recipeDetailStyles.ingredientName}>{name}</Text>
          </View>
        ))}

        {recipe.steps && recipe.steps.length > 0 && (
          <>
            <Text style={recipeDetailStyles.stepsSectionTitle}>
              {t('recipeDetail.preparation')}
            </Text>
            {recipe.steps.map((step, i) => (
              <View key={`step-${i}`} style={recipeDetailStyles.stepRow}>
                <View style={recipeDetailStyles.stepNumber}>
                  <Text style={recipeDetailStyles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={recipeDetailStyles.stepText}>{step}</Text>
              </View>
            ))}
          </>
        )}

        {recipe.chefTip && (
          <View style={recipeDetailStyles.chefTip}>
            <Ionicons
              name="bulb"
              size={22}
              color={colors.primaryAccent}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  recipeDetailStyles.sectionTitle,
                  { marginBottom: 6, color: colors.text },
                ]}
              >
                {t('recipeDetail.chefTip')}
              </Text>
              <Text style={recipeDetailStyles.chefTipText}>{recipe.chefTip}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={recipeDetailStyles.cta}
          onPress={handleStartCooking}
          activeOpacity={0.8}
        >
          <Ionicons name="flame" size={22} color="#FFFFFF" />
          <Text style={recipeDetailStyles.ctaText}>{t('recipeDetail.startCooking')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <ConfirmModal
        visible={removeFavoriteModalVisible}
        title={t('favorites.removeConfirmTitle')}
        message={t('favorites.removeConfirmMessage')}
        cancelText={t('favorites.removeConfirmCancel')}
        confirmText={t('favorites.removeConfirmRemove')}
        onCancel={closeRemoveFavoriteModal}
        onConfirm={confirmRemoveFavorite}
        destructive
      />
    </View>
  );
}
