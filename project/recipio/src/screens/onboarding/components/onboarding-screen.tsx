import { ThemedView } from '@masterfabric-expo/core';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useOnboardingViewModel } from '../hooks/use-onboarding-view-model';
import { createOnboardingScreenStyles } from '../styles/onboarding-screen.styles';
import { StepContent } from './step-content';
import { StepControls } from './step-controls';
import { StepIndicator } from './step-indicator';

export function OnboardingScreen() {
  const colors = useRecipioColors();
  const onboardingScreenStyles = useMemo(
    () => createOnboardingScreenStyles(colors),
    [colors]
  );
  const {
    currentStep,
    steps,
    handleNext,
    handleBack,
    handleSkip,
    handleComplete,
  } = useOnboardingViewModel();

  return (
    <SafeAreaView style={onboardingScreenStyles.container}>
      <ThemedView style={onboardingScreenStyles.content}>
        <ThemedView style={onboardingScreenStyles.indicatorRow}>
          <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        </ThemedView>
        <ThemedView style={onboardingScreenStyles.stepContainer}>
          <StepContent step={steps[currentStep]} />
        </ThemedView>
        <StepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onComplete={handleComplete}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
