import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useDietaryPreferencesViewModel } from '../hooks/use-dietary-preferences-view-model';
import { createDietaryPreferencesStyles } from '../styles/dietary-preferences.styles';
import type { DietSlug, AllergySlug } from '../models/dietary-preferences-models';

const DIET_LABEL_KEYS: Record<DietSlug, string> = {
  vegan: 'dietaryPreferences.vegan',
  vegetarian: 'dietaryPreferences.vegetarian',
  keto: 'dietaryPreferences.keto',
  paleo: 'dietaryPreferences.paleo',
  low_carb: 'dietaryPreferences.lowCarb',
  gluten_free: 'dietaryPreferences.glutenFree',
};

const ALLERGY_LABEL_KEYS: Record<AllergySlug, string> = {
  dairy: 'dietaryPreferences.dairy',
  nuts: 'dietaryPreferences.nuts',
  shellfish: 'dietaryPreferences.shellfish',
  soy: 'dietaryPreferences.soy',
  wheat: 'dietaryPreferences.wheat',
  eggs: 'dietaryPreferences.eggs',
};

export function DietaryPreferencesScreen() {
  const { t } = useI18n();
  const colors = useRecipioColors();
  const dietaryPreferencesStyles = useMemo(() => createDietaryPreferencesStyles(colors), [colors]);
  const {
    prefs,
    loading,
    saving,
    dietSlugs,
    allergySlugs,
    toggleDiet,
    toggleAllergy,
    addCustomAllergy,
    removeCustomAllergy,
    handleBack,
    save,
  } = useDietaryPreferencesViewModel();

  const [customInput, setCustomInput] = useState('');

  const onAddCustom = () => {
    addCustomAllergy(customInput);
    setCustomInput('');
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[dietaryPreferencesStyles.container, { justifyContent: 'center', alignItems: 'center' }]}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <ActivityIndicator size="large" color={colors.primaryAccent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dietaryPreferencesStyles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={dietaryPreferencesStyles.header}>
        <View style={dietaryPreferencesStyles.headerSide}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={dietaryPreferencesStyles.headerTitle}>
          {t('dietaryPreferences.title')}
        </Text>
        <View style={dietaryPreferencesStyles.headerSide} />
      </View>

      <ScrollView
        style={dietaryPreferencesStyles.scroll}
        contentContainerStyle={dietaryPreferencesStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={dietaryPreferencesStyles.section}>
          <View style={dietaryPreferencesStyles.sectionHeader}>
            <Ionicons name="restaurant-outline" size={20} color={colors.text} />
            <Text style={dietaryPreferencesStyles.sectionTitle}>
              {t('dietaryPreferences.diets')}
            </Text>
          </View>
          <View style={dietaryPreferencesStyles.pillsRow}>
            {dietSlugs.map((slug) => {
              const selected = prefs.dietSlugs.includes(slug);
              return (
                <TouchableOpacity
                  key={slug}
                  style={[
                    dietaryPreferencesStyles.pill,
                    selected && dietaryPreferencesStyles.pillSelected,
                  ]}
                  onPress={() => toggleDiet(slug)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      dietaryPreferencesStyles.pillText,
                      selected && dietaryPreferencesStyles.pillTextSelected,
                    ]}
                  >
                    {t(DIET_LABEL_KEYS[slug as DietSlug])}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={dietaryPreferencesStyles.section}>
          <View style={dietaryPreferencesStyles.sectionHeader}>
            <Ionicons name="warning-outline" size={20} color={colors.text} />
            <Text style={dietaryPreferencesStyles.sectionTitle}>
              {t('dietaryPreferences.allergies')}
            </Text>
          </View>
          <View style={dietaryPreferencesStyles.addRow}>
            <TextInput
              style={dietaryPreferencesStyles.input}
              placeholder={t('dietaryPreferences.addOtherAllergy')}
              placeholderTextColor={colors.textSecondary}
              value={customInput}
              onChangeText={setCustomInput}
              returnKeyType="done"
              onSubmitEditing={onAddCustom}
            />
            <TouchableOpacity
              style={dietaryPreferencesStyles.addButton}
              onPress={onAddCustom}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={dietaryPreferencesStyles.pillsRow}>
            {allergySlugs.map((slug) => {
              const selected = prefs.allergySlugs.includes(slug);
              return (
                <TouchableOpacity
                  key={slug}
                  style={[
                    dietaryPreferencesStyles.pill,
                    selected && dietaryPreferencesStyles.pillSelected,
                  ]}
                  onPress={() => toggleAllergy(slug)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      dietaryPreferencesStyles.pillText,
                      selected && dietaryPreferencesStyles.pillTextSelected,
                    ]}
                  >
                    {t(ALLERGY_LABEL_KEYS[slug as AllergySlug])}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {prefs.customAllergies.map((label) => (
              <TouchableOpacity
                key={label}
                style={dietaryPreferencesStyles.pillSelected}
                onPress={() => removeCustomAllergy(label)}
                activeOpacity={0.8}
              >
                <Text style={dietaryPreferencesStyles.pillTextSelected}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={dietaryPreferencesStyles.infoBox}>
          <Text style={dietaryPreferencesStyles.infoText}>
            {t('dietaryPreferences.infoText')}
          </Text>
        </View>

        <TouchableOpacity
          style={dietaryPreferencesStyles.saveButton}
          onPress={save}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={dietaryPreferencesStyles.saveButtonText}>
              {t('dietaryPreferences.save')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
