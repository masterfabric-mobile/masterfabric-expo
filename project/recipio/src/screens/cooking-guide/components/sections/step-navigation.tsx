import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import { useI18n } from '@/shared/i18n';
import type { CookingGuideStyles } from '../../styles/cooking-guide.styles';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  styles: CookingGuideStyles;
  colors: RecipioColorsPalette;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  isLastStep,
  onPrevious,
  onNext,
  styles: cookingGuideStyles,
  colors,
}: StepNavigationProps) {
  const { t } = useI18n();
  const canGoPrevious = currentStep > 1;
  const canGoNext = totalSteps > 0 && currentStep <= totalSteps;
  const primaryBtnIconColor = '#FFFFFF';

  return (
    <View style={cookingGuideStyles.navRow}>
      <TouchableOpacity
        style={cookingGuideStyles.navButton}
        onPress={onPrevious}
        disabled={!canGoPrevious}
        activeOpacity={0.8}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={canGoPrevious ? colors.text : colors.textSecondary}
        />
        <Text
          style={[
            cookingGuideStyles.navButtonText,
            !canGoPrevious && { color: colors.textSecondary },
          ]}
        >
          {t('cookingGuide.previous')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[cookingGuideStyles.navButton, cookingGuideStyles.navButtonPrimary, { flex: 1 }]}
        onPress={onNext}
        disabled={!canGoNext}
        activeOpacity={0.8}
      >
        <Text style={[cookingGuideStyles.navButtonText, cookingGuideStyles.navButtonTextPrimary]}>
          {isLastStep ? t('cookingGuide.complete') : t('cookingGuide.next')}
        </Text>
        {!isLastStep && (
          <Ionicons name="chevron-forward" size={22} color={primaryBtnIconColor} />
        )}
      </TouchableOpacity>
    </View>
  );
}
