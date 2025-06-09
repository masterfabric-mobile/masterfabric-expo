import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { OnboardingStep } from '../models/onboarding-models';
import { stepContentStyles } from '../styles/step-content.styles';

interface StepContentProps {
  step: OnboardingStep;
}

export function StepContent({ step }: StepContentProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
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

      {/* Text Content */}
      <View style={stepContentStyles.textContainer}>
        <ThemedText type="title" style={stepContentStyles.title}>
          {step.title}
        </ThemedText>
        
        <ThemedText type="subtitle" style={stepContentStyles.subtitle}>
          {step.subtitle}
        </ThemedText>
      </View>

      {/* Description Points */}
      <View style={stepContentStyles.descriptionContainer}>
        {step.description.map((item, index) => (
          <View key={index} style={stepContentStyles.descriptionItem}>
            <View style={[
              stepContentStyles.bullet,
              { backgroundColor: isDark ? '#007AFF' : '#0066CC' }
            ]} />
            <ThemedText style={stepContentStyles.descriptionText}>
              {item}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}
