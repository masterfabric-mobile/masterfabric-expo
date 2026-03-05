import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useI18n } from '@/shared/i18n';
import { useOnboardingStore } from '../store/onboarding-store';
import type { OnboardingStep } from '../models/onboarding-models';

function buildSteps(t: (key: string) => string): OnboardingStep[] {
  return [
    {
      title: t('onboarding.step1Title'),
      description: [t('onboarding.step1Line1'), t('onboarding.step1Line2')],
      icon: 'chef-hat',
    },
    {
      title: t('onboarding.step2Title'),
      description: [t('onboarding.step2Line1')],
      icon: 'fridge-outline',
    },
    {
      title: t('onboarding.step3Title'),
      description: [t('onboarding.step3Line1'), t('onboarding.step3Line2')],
      icon: 'lightbulb-on-outline',
    },
    {
      title: t('onboarding.step4Title'),
      description: [t('onboarding.step4Line1')],
      icon: 'book-open-page-variant',
    },
  ];
}

export function useOnboardingViewModel() {
  const { t } = useI18n();
  const steps = useMemo(() => buildSteps(t), [t]);
  const { currentStep, setCurrentStep, setCompleted } = useOnboardingStore();
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    steps,
    handleNext,
    handleBack,
    handleSkip,
    handleComplete,
  };
}
