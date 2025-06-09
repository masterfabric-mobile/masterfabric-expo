import { OnboardingStep } from '../models/onboarding-models';

// Static onboarding steps with translation keys
export const createOnboardingSteps = (): OnboardingStep[] => [
  {
    id: 'welcome',
    icon: 'rocket-outline',
    title: 'onboarding.steps.welcome.title',
    subtitle: 'onboarding.steps.welcome.subtitle',
    description: [
      'onboarding.steps.welcome.description.0',
      'onboarding.steps.welcome.description.1',
      'onboarding.steps.welcome.description.2'
    ]
  },
  {
    id: 'features',
    icon: 'color-palette-outline',
    title: 'onboarding.steps.features.title',
    subtitle: 'onboarding.steps.features.subtitle',
    description: [
      'onboarding.steps.features.description.0',
      'onboarding.steps.features.description.1',
      'onboarding.steps.features.description.2'
    ]
  },
  {
    id: 'collaboration',
    icon: 'people-outline',
    title: 'onboarding.steps.collaboration.title',
    subtitle: 'onboarding.steps.collaboration.subtitle',
    description: [
      'onboarding.steps.collaboration.description.0',
      'onboarding.steps.collaboration.description.1',
      'onboarding.steps.collaboration.description.2'
    ]
  },
  {
    id: 'ready',
    icon: 'checkmark-circle-outline',
    title: 'onboarding.steps.ready.title',
    subtitle: 'onboarding.steps.ready.subtitle',
    description: [
      'onboarding.steps.ready.description.0',
      'onboarding.steps.ready.description.1',
      'onboarding.steps.ready.description.2'
    ]
  }
];

// Helper function to get translated onboarding steps
export const getTranslatedOnboardingSteps = (t: (key: string) => any): OnboardingStep[] => {
  const steps = createOnboardingSteps();
  return steps.map(step => ({
    ...step,
    title: t(step.title),
    subtitle: t(step.subtitle),
    description: step.description.map(desc => t(desc))
  }));
};

export const getStepProgress = (currentIndex: number, totalSteps: number): number => {
  return Math.round(((currentIndex + 1) / totalSteps) * 100);
};

export const isLastStep = (currentIndex: number, totalSteps: number): boolean => {
  return currentIndex === totalSteps - 1;
};

export const isFirstStep = (currentIndex: number): boolean => {
  return currentIndex === 0;
};
