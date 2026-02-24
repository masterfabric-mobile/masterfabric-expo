import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../store/onboarding-store';
import type { OnboardingStep } from '../models/onboarding-models';

const STEPS: OnboardingStep[] = [
  {
    title: 'Welcome!',
    description: [
      'Get smart recipe suggestions',
      'based on the ingredients you have',
    ],
    icon: 'chef-hat',
  },
  {
    title: 'Ingredient Input',
    description: ['Enter your ingredients and quantities'],
    icon: 'fridge-outline',
  },
  {
    title: 'Smart Suggestions',
    description: ['Find the best matching', 'recipes by match score'],
    icon: 'lightbulb-on-outline',
  },
  {
    title: 'Step-by-Step Guide',
    description: ['Follow the cooking process easily'],
    icon: 'book-open-page-variant',
  },
];

export function useOnboardingViewModel() {
  const { currentStep, setCurrentStep, setCompleted } = useOnboardingStore();
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await setCompleted(true);
    router.replace('/(tabs)');
  };

  const handleComplete = async () => {
    await setCompleted(true);
    router.replace('/(tabs)');
  };

  return {
    currentStep,
    steps: STEPS,
    handleNext,
    handleBack,
    handleSkip,
    handleComplete,
  };
}
