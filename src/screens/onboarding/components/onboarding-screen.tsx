import React from 'react';
import { useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOnboardingViewModel } from '../hooks/use-onboarding-view-model';
import { onboardingScreenStyles } from '../styles/onboarding-screen.styles';
import { StepContent } from './step-content';
import { StepControls } from './step-controls';

export function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    handleNext,
    handleBack,
    handleSkip,
  } = useOnboardingViewModel();

  if (!currentStep) return null;

  return (
    <SafeAreaView 
      style={[
        onboardingScreenStyles.container,
        { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }
      ]}
    >
      <View style={onboardingScreenStyles.contentContainer}>
        {/* Step Content */}
        <View style={onboardingScreenStyles.stepContainer}>
          <StepContent step={currentStep} />
        </View>

        {/* Controls */}
        <View style={onboardingScreenStyles.controlsContainer}>
          <StepControls
            currentIndex={currentStepIndex}
            totalSteps={totalSteps}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
