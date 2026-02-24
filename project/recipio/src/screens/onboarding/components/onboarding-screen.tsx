import { ThemedView } from '@masterfabric-expo/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboardingViewModel } from '../hooks/use-onboarding-view-model';
import { StepContent } from './step-content';
import { StepControls } from './step-controls';
import { StepIndicator } from './step-indicator';
import { onboardingScreenStyles } from '../styles/onboarding-screen.styles';

export function OnboardingScreen() {
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
