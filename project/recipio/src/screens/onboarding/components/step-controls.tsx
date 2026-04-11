import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StepControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export function StepControls({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onComplete,
}: StepControlsProps) {
  const { t } = useI18n();
  const colors = useRecipioColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingTop: 28,
          paddingBottom: 16,
          gap: 16,
        },
        sideButton: {
          paddingVertical: 12,
          paddingHorizontal: 16,
          minWidth: 56,
        },
        sidePlaceholder: {
          width: 56,
        },
        sideLabel: {
          color: colors.textSecondary,
          fontSize: 16,
        },
        primaryButton: {
          backgroundColor: colors.primaryAccent,
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 12,
          minWidth: 140,
          alignItems: 'center',
        },
        primaryLabel: {
          color: '#FFFFFF',
          fontWeight: '600',
          fontSize: 16,
        },
      }),
    [colors]
  );

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.container}>
      {currentStep > 0 ? (
        <TouchableOpacity onPress={onBack} style={styles.sideButton}>
          <Text style={styles.sideLabel}>{t('onboarding.back')}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}

      <TouchableOpacity
        onPress={isLastStep ? onComplete : onNext}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryLabel}>
          {isLastStep ? t('onboarding.getStarted') : t('onboarding.next')}
        </Text>
      </TouchableOpacity>

      {!isLastStep ? (
        <TouchableOpacity onPress={onSkip} style={styles.sideButton}>
          <Text style={styles.sideLabel}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}
    </View>
  );
}
