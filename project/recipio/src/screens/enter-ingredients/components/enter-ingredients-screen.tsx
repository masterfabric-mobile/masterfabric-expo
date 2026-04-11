import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useEnterIngredientsViewModel } from '../hooks/use-enter-ingredients-view-model';
import { createEnterIngredientsStyles } from '../styles/enter-ingredients.styles';

const SUGGESTED_INGREDIENT_KEYS = [
  'ingredient.egg',
  'ingredient.milk',
  'ingredient.flour',
  'ingredient.chicken',
  'ingredient.tomato',
  'ingredient.onion',
  'ingredient.garlic',
  'ingredient.oliveOil',
  'ingredient.salt',
  'ingredient.pepper',
  'ingredient.cheese',
  'ingredient.yogurt',
] as const;

export function EnterIngredientsScreen() {
  const { t } = useI18n();
  const colors = useRecipioColors();
  const enterIngredientsStyles = useMemo(
    () => createEnterIngredientsStyles(colors),
    [colors]
  );
  const {
    inputValue,
    ingredients,
    setInputValue,
    handleAddIngredient,
    removeIngredient,
    clearAll,
    handleFindRecipes,
    handleBack,
    canSubmit,
    handleAddSuggestion,
  } = useEnterIngredientsViewModel();

  const suggestedFoods = SUGGESTED_INGREDIENT_KEYS.map((key) => t(key));

  return (
    <SafeAreaView style={enterIngredientsStyles.container} edges={['top', 'left', 'right']}>
      <View style={enterIngredientsStyles.header}>
        <TouchableOpacity style={enterIngredientsStyles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={enterIngredientsStyles.title}>{t('enterIngredients.title')}</Text>
        <TouchableOpacity
          style={enterIngredientsStyles.clearBtn}
          onPress={clearAll}
          disabled={!canSubmit}
        >
          <Text
            style={[
              enterIngredientsStyles.clearBtnText,
              !canSubmit && { opacity: 0.5 },
            ]}
          >
            {t('enterIngredients.clearAll')}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={enterIngredientsStyles.scroll}
          contentContainerStyle={enterIngredientsStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={enterIngredientsStyles.sectionLabel}>{t('enterIngredients.sectionLabel')}</Text>
          <Text style={enterIngredientsStyles.hint}>
            {t('enterIngredients.hint')}
          </Text>

          <View style={enterIngredientsStyles.inputRow}>
            <TextInput
              style={enterIngredientsStyles.input}
              placeholder={t('enterIngredients.placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleAddIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={enterIngredientsStyles.addBtn}
              onPress={handleAddIngredient}
              activeOpacity={0.8}
            >
              <Text style={enterIngredientsStyles.addBtnText}>{t('enterIngredients.add')}</Text>
            </TouchableOpacity>
          </View>

          <View style={enterIngredientsStyles.ingredientsHeader}>
            <Text style={enterIngredientsStyles.ingredientsTitle}>
              {t('enterIngredients.yourIngredients')} ({ingredients.length})
            </Text>
          </View>

          {ingredients.length === 0 ? (
            <Text style={enterIngredientsStyles.emptyListHint}>
              {t('enterIngredients.emptyListHint')}
            </Text>
          ) : (
            <View style={enterIngredientsStyles.tagList}>
              {ingredients.map((item) => (
                <View key={item} style={enterIngredientsStyles.tag}>
                  <Text style={enterIngredientsStyles.tagText}>{item}</Text>
                  <TouchableOpacity
                    style={enterIngredientsStyles.tagRemove}
                    onPress={() => removeIngredient(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={enterIngredientsStyles.suggestionSection}>
            <Text style={enterIngredientsStyles.suggestionLabel}>
              {t('enterIngredients.suggested')}
            </Text>
            <View style={enterIngredientsStyles.suggestionChipsRow}>
              {suggestedFoods.map((food) => {
                const isAdded = ingredients.includes(food);
                return (
                  <TouchableOpacity
                    key={food}
                    style={[
                      enterIngredientsStyles.suggestionChip,
                      isAdded && { opacity: 0.6, borderColor: colors.primaryAccent },
                    ]}
                    onPress={() => handleAddSuggestion(food)}
                    activeOpacity={0.7}
                  >
                    <Text style={enterIngredientsStyles.suggestionChipText}>
                      {isAdded ? '✓ ' : '+ '}{food}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[enterIngredientsStyles.cta, !canSubmit && { opacity: 0.6 }]}
            onPress={handleFindRecipes}
            disabled={!canSubmit}
            activeOpacity={0.8}
          >
            <Text style={enterIngredientsStyles.ctaText}>
              {t('enterIngredients.findRecipes')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
