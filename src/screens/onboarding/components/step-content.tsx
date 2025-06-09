import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { OnboardingStep } from '../models/onboarding-models';
import { stepContentStyles } from '../styles/step-content.styles';
import { getDescriptionAsParagraph } from '../utils';

interface StepContentProps {
  step: OnboardingStep;
}

export function StepContent({ step }: StepContentProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView 
      contentContainerStyle={stepContentStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={stepContentStyles.container}>
        {/* Icon */}
        <View style={[
          stepContentStyles.iconContainer,
          { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
        ]}>
          <Ionicons 
            name={step.icon as any} 
            size={48} 
            color={isDark ? '#007AFF' : '#0066CC'} 
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
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderLeftColor: isDark ? '#007AFF' : '#0066CC'
                }
              ]}>
                <ThemedText style={[
                  stepContentStyles.paragraphText,
                  { color: isDark ? '#FFFFFF' : '#000000' }
                ]}>
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
