import { RecipioColors } from '@/shared/constants/recipio-colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import type { OnboardingStep } from '../models/onboarding-models';
import { onboardingScreenStyles } from '../styles/onboarding-screen.styles';

const STEP_ICON_SIZE = 52;

interface StepContentProps {
  step: OnboardingStep;
}

export function StepContent({ step }: StepContentProps) {
  const iconName = (step.icon ?? 'chef-hat') as ComponentProps<
    typeof MaterialCommunityIcons
  >['name'];

  return (
    <View style={onboardingScreenStyles.stepContent}>
      <View style={onboardingScreenStyles.stepIconWrapper}>
        <MaterialCommunityIcons
          name={iconName}
          size={STEP_ICON_SIZE}
          color={RecipioColors.text}
        />
      </View>
      <Text style={onboardingScreenStyles.stepTitle}>{step.title}</Text>
      {step.description.map((line, i) => (
        <Text key={i} style={onboardingScreenStyles.stepDescription}>
          {line}
        </Text>
      ))}
    </View>
  );
}
