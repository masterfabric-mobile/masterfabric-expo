import React from 'react';
import { Pressable, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
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
        {/* Skip button at top within safe area */}
        {!isLastStep && (
          <View style={onboardingScreenStyles.skipContainer}>
            <Pressable
              onPress={handleSkip}
              style={onboardingScreenStyles.skipButton}
            >
              <ThemedText 
                style={[
                  onboardingScreenStyles.skipButtonText,
                  { color: isDark ? '#FFFFFF' : '#000000' }
                ]}
              >
                {t('onboarding.skip')}
              </ThemedText>
            </Pressable>
          </View>
        )}

        {/* Step Content */}
        <View style={onboardingScreenStyles.stepContainer}>
          <StepContent step={currentStep} />
        </View>

        {/* Controls - Fixed at bottom */}
        <View style={onboardingScreenStyles.controlsContainer}>
          <StepControls
            currentIndex={currentStepIndex}
            totalSteps={totalSteps}
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
