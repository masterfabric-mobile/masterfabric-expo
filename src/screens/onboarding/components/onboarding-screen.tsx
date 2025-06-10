import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { t } from '@/src/shared/i18n';
import { useOnboardingViewModel } from '../hooks/use-onboarding-view-model';
import { onboardingScreenStyles } from '../styles/onboarding-screen.styles';
import { StepContent } from './step-content';
import { StepControls } from './step-controls';

export function OnboardingScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
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
        { backgroundColor: colors.onboardingBackground }
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
                  { color: colors.onboardingSkipText }
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
