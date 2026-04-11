import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getRecipioColors } from '@/shared/constants/recipio-colors';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useI18n } from '@/shared/i18n';
import { useCookingGuideViewModel } from '../hooks/use-cooking-guide-view-model';
import { StepImage } from './step-image';
import { StepContent } from '@/screens/cooking-guide/components/sections/step-content';
import { StepNavigation } from '@/screens/cooking-guide/components/sections/step-navigation';
import { ProgressIndicator } from '@/screens/cooking-guide/components/sections/progress-indicator';
import { createCookingGuideStyles } from '../styles/cooking-guide.styles';

export function CookingGuideScreen() {
  const { t } = useI18n();
  const themeColors = useRecipioColors();
  const colors = themeColors ?? getRecipioColors(false);
  const cookingGuideStyles = useMemo(
    () => createCookingGuideStyles(colors),
    [colors]
  );

  if (!cookingGuideStyles?.container) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primaryAccent} />
      </View>
    );
  }
  const {
    recipe,
    loading,
    currentStep,
    totalSteps,
    stepNotes,
    showCompletion,
    isLastStep,
    setStepNote,
    handleBack,
    handleNext,
    handlePrevious,
    handleCompleteAndBack,
  } = useCookingGuideViewModel();

  if (loading) {
    return (
      <View
        style={[
          cookingGuideStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primaryAccent} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={cookingGuideStyles.container}>
        <View style={cookingGuideStyles.header}>
          <TouchableOpacity
            style={cookingGuideStyles.headerBtn}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={cookingGuideStyles.error}>
          <Text style={cookingGuideStyles.errorText}>
            {t('recipeDetail.recipeNotFound')}
          </Text>
        </View>
      </View>
    );
  }

  if (showCompletion) {
    return (
      <View style={cookingGuideStyles.container}>
        <View style={cookingGuideStyles.header}>
          <TouchableOpacity
            style={cookingGuideStyles.headerBtn}
            onPress={handleCompleteAndBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={cookingGuideStyles.headerTitle}>
            {t('cookingGuide.title')}
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={cookingGuideStyles.completeWrap}>
          <View style={cookingGuideStyles.completeIconRing}>
            <View style={cookingGuideStyles.completeIconInner}>
              <Ionicons
                name="checkmark"
                size={44}
                color={colors.primaryAccent}
              />
            </View>
          </View>
          <Text style={cookingGuideStyles.completeHeadline}>
            {t('cookingGuide.completeHeadline')}
          </Text>
          <Text style={cookingGuideStyles.completeRecipeName} numberOfLines={2}>
            {recipe.title}
          </Text>
          <Text style={cookingGuideStyles.completeSubline}>
            {t('cookingGuide.completeSubline')}
          </Text>
          <TouchableOpacity
            style={cookingGuideStyles.completeButton}
            onPress={handleCompleteAndBack}
            activeOpacity={0.8}
          >
            <Text style={cookingGuideStyles.completeButtonText}>
              {t('cookingGuide.done')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const steps = recipe.steps ?? [];
  if (steps.length === 0) {
    return (
      <View style={cookingGuideStyles.container}>
        <View style={cookingGuideStyles.header}>
          <TouchableOpacity
            style={cookingGuideStyles.headerBtn}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={cookingGuideStyles.headerTitle}>
            {t('cookingGuide.title')}
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={cookingGuideStyles.error}>
          <Text style={cookingGuideStyles.errorText}>
            {t('cookingGuide.noSteps')}
          </Text>
        </View>
      </View>
    );
  }

  const stepIndex = currentStep - 1;
  const stepText = steps[stepIndex] ?? '';
  const note = stepNotes[stepIndex] ?? '';

  return (
    <View style={cookingGuideStyles.container}>
      <View style={cookingGuideStyles.header}>
        <TouchableOpacity
          style={cookingGuideStyles.headerBtn}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={cookingGuideStyles.headerTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={cookingGuideStyles.scroll}
        contentContainerStyle={cookingGuideStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          styles={cookingGuideStyles}
        />
        <StepImage
          imageUrl={recipe.imageUrl}
          stepNumber={currentStep}
          styles={cookingGuideStyles}
        />
        <StepContent
          stepNumber={currentStep}
          totalSteps={totalSteps}
          text={stepText}
          note={note}
          chefTip={recipe.chefTip}
          onNoteChange={(text) => setStepNote(stepIndex, text)}
          styles={cookingGuideStyles}
          colors={colors}
        />
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          isLastStep={isLastStep}
          onPrevious={handlePrevious}
          onNext={handleNext}
          styles={cookingGuideStyles}
          colors={colors}
        />
      </ScrollView>
    </View>
  );
}
