import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { StepControlsProps } from '../store/onboarding-store';
import { stepControlsStyles } from '../styles/step-controls.styles';

export function StepControls({ 
  currentIndex, 
  totalSteps, 
  onNext, 
  onBack, 
  isFirstStep,
  isLastStep 
}: StepControlsProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={stepControlsStyles.container}>
      {/* Progress Dots */}
      <View style={stepControlsStyles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              stepControlsStyles.progressDot,
              {
                backgroundColor: index <= currentIndex 
                  ? colors.onboardingProgressActive
                  : colors.onboardingProgressInactive
              }
            ]}
          />
        ))}
      </View>

      {/* Button Container */}
      <View style={stepControlsStyles.buttonContainer}>
        {/* Back Button - Left aligned */}
        <View style={stepControlsStyles.leftButtonContainer}>
          {!isFirstStep && (
            <Pressable
              onPress={onBack}
              style={stepControlsStyles.backButton}
            >
              <ThemedText 
                style={[
                  stepControlsStyles.backButtonText,
                  { color: colors.text }
                ]}
              >
                {t('onboarding.back')}
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Next Button - Right aligned */}
        <View style={stepControlsStyles.rightButtonContainer}>
          <Pressable
            onPress={onNext}
            style={[
              stepControlsStyles.nextButton,
              { backgroundColor: colors.activeButton }
            ]}
          >
            <ThemedText 
              style={[
                stepControlsStyles.nextButtonText,
                { color: colors.background } // Use background color (white/black) instead of hardcoded white
              ]}
            >
              {isLastStep ? t('onboarding.getStarted') : t('onboarding.next')}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
