import React from 'react';
import { Pressable, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { stepControlsStyles } from '../styles/step-controls.styles';

interface StepControlsProps {
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function StepControls({ 
  currentIndex, 
  totalSteps, 
  onNext, 
  onBack, 
  onSkip,
  isFirstStep,
  isLastStep 
}: StepControlsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
                  ? (isDark ? '#007AFF' : '#0066CC')
                  : (isDark ? '#333333' : '#E5E5E5')
              }
            ]}
          />
        ))}
      </View>

      {/* Button Container */}
      <View style={stepControlsStyles.buttonContainer}>
        {/* Back Button */}
        <Pressable
          onPress={onBack}
          style={stepControlsStyles.backButton}
          disabled={isFirstStep}
        >
          <ThemedText 
            style={[
              stepControlsStyles.backButtonText,
              { 
                opacity: isFirstStep ? 0.3 : 1,
                color: isDark ? '#FFFFFF' : '#000000'
              }
            ]}
          >
            {t('onboarding.back')}
          </ThemedText>
        </Pressable>

        {/* Next/Get Started Button */}
        <Pressable
          onPress={onNext}
          style={[
            stepControlsStyles.nextButton,
            { backgroundColor: isDark ? '#007AFF' : '#0066CC' }
          ]}
        >
          <ThemedText style={stepControlsStyles.nextButtonText}>
            {isLastStep ? t('onboarding.getStarted') : t('onboarding.next')}
          </ThemedText>
        </Pressable>

        {/* Skip Button */}
        {!isLastStep && (
          <Pressable
            onPress={onSkip}
            style={stepControlsStyles.skipButton}
          >
            <ThemedText 
              style={[
                stepControlsStyles.skipButtonText,
                { color: isDark ? '#FFFFFF' : '#000000' }
              ]}
            >
              {t('onboarding.skip')}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}
