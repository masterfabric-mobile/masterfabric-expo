import { navigationUtils } from '@/src/navigation/utils';
import { getOneSignalAppId } from '@/src/shared/constants';
import { t } from '@/src/shared/i18n';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { onesignalHelper } from 'masterfabric-expo-core';
import { useEffect, useState } from 'react';
import { useSplashStore } from '../store/splash-store';
import { createSplashSteps, getProgressPercentage } from '../utils';
import { shouldShowOnboarding } from 'masterfabric-expo-core';

/** Permissions (notifications, location, etc.) are requested only when the user taps Request in the Permissions Helper screen, not on app launch. */

export function useSplashViewModel() {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const {
    isLoading,
    setLoading,
    setProgress: setSplashProgress,
    setLoadingMessage,
    setCurrentStep,
    addCompletedStep,
  } = useSplashStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLoading(true);

    const steps = createSplashSteps();
    const completed: string[] = [];

    for (const step of steps) {
      const taskMessage = t(`splash.loading.${step.id}`);
      setCurrentTask(taskMessage);
      setLoadingMessage(taskMessage);
      setCurrentStep(step.id);

      await new Promise(resolve => setTimeout(resolve, step.duration));

      completed.push(step.id);
      setCompletedSteps([...completed]);
      addCompletedStep(step.id);

      const completedStepObjects = steps.filter(s => completed.includes(s.id));
      const currentProgress = getProgressPercentage(
        completedStepObjects,
        steps
      );

      setProgress(currentProgress);
      setSplashProgress(currentProgress);
    }

    // Navigation logic based on app state
    setTimeout(() => {
      setLoading(false);
      navigateToNextScreen();
    }, 500);
  };

  const navigateToNextScreen = async () => {
    console.log('🧿 Splash screen completed, checking onboarding status');

    try {
      if (await shouldShowOnboarding()) {
        console.log('First time user - navigating to onboarding');
        router.push('/onboarding');
      } else {
        console.log('User has completed onboarding - navigating to home tabs');
        navigationUtils.replace('(tabs)');
      }
    } catch (error) {
      console.error('Navigation error from splash screen:', error);
      try {
        navigationUtils.replace('(tabs)');
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
        navigationUtils.replace('(tabs)');
      }
    }

    // OneSignal uses native code and is not supported in Expo Go. Only init in development/standalone builds.
    const isExpoGo = Constants.appOwnership === 'expo';
    if (!isExpoGo) {
      const delayMs = 1500;
      setTimeout(() => {
        const oneSignalAppId = getOneSignalAppId();
        if (oneSignalAppId?.trim() && !onesignalHelper.isInitialized) {
          onesignalHelper
            .init(oneSignalAppId.trim(), {
              promptForPush: true,
              verbose: __DEV__,
            })
            .catch(e => {
              if (__DEV__)
                console.warn('[Splash] OneSignal init after splash:', e);
            });
        }
      }, delayMs);
    }
  };

  return {
    isLoading,
    progress,
    currentTask,
    completedSteps,
  };
}
