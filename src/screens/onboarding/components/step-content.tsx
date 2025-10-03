import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { OnboardingStep } from '../models/onboarding-models';
import { stepContentStyles } from '../styles/step-content.styles';
import { getDescriptionAsParagraph } from '../utils';

interface StepContentProps {
  step: OnboardingStep;
}

export function StepContent({ step }: StepContentProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ScrollView 
      contentContainerStyle={stepContentStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={stepContentStyles.container}>
        {/* Icon */}
        <View style={[
          stepContentStyles.iconContainer,
          { backgroundColor: colors.cardBackground }
        ]}>
          <Ionicons 
            name={step.icon as any} 
            size={48} 
            color={colors.onboardingIcon} 
          />
        </View>

        {/* Text Content with Description */}
        <View style={stepContentStyles.textContainer}>
          <ThemedText type="title" style={stepContentStyles.title}>
            {step.title}
          </ThemedText>
          
          <ThemedText type="subtitle" style={stepContentStyles.subtitle}>
            {step.subtitle}
          </ThemedText>

          {/* Description under title section */}
          {Array.isArray(step.description) && step.description.length > 0 && (
            <View style={stepContentStyles.descriptionContainer}>
              <View style={[
                stepContentStyles.paragraphContainer,
                { 
                  backgroundColor: colors.onboardingDescriptionBg,
                  borderLeftColor: colors.onboardingDescriptionBorder
                }
              ]}>
                <ThemedText style={stepContentStyles.paragraphText}>
                  {getDescriptionAsParagraph(step)}
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
