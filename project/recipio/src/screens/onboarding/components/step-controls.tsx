import { RecipioColors } from '@/shared/constants/recipio-colors';
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
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.container}>
      {currentStep > 0 ? (
        <TouchableOpacity onPress={onBack} style={styles.sideButton}>
          <Text style={styles.sideLabel}>Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}

      <TouchableOpacity
        onPress={isLastStep ? onComplete : onNext}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryLabel}>
          {isLastStep ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>

      {!isLastStep ? (
        <TouchableOpacity onPress={onSkip} style={styles.sideButton}>
          <Text style={styles.sideLabel}>Skip</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: RecipioColors.textSecondary,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: RecipioColors.primaryAccent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  primaryLabel: {
    color: RecipioColors.text,
    fontWeight: '600',
    fontSize: 16,
  },
});
