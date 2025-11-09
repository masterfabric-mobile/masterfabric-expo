import { navigationUtils } from '@/src/navigation/utils';
import { t } from '@/src/shared/i18n';
import { useMemo } from 'react';
import { useOnboardingStore } from '../store/onboarding-store';
import { getTranslatedOnboardingSteps, isFirstStep, isLastStep } from '../utils';

export function useOnboardingViewModel() {
  const {
    currentStepIndex,
    setCurrentStepIndex,
    nextStep,
    previousStep,
    completeOnboarding,
  } = useOnboardingStore();

  const steps = useMemo(() => getTranslatedOnboardingSteps(t), []);
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  const handleNext = async () => {
    if (isLastStep(currentStepIndex, totalSteps)) {
      await completeOnboarding();
      navigationUtils.replace('(tabs)');
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (!isFirstStep(currentStepIndex)) {
      previousStep();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigationUtils.replace('(tabs)');
  };

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep: isFirstStep(currentStepIndex),
    isLastStep: isLastStep(currentStepIndex, totalSteps),
    handleNext,
    handleBack,
    handleSkip,
  };
}
