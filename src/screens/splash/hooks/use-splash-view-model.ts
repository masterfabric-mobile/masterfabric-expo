import { navigationUtils } from '@/src/navigation/utils';
import { t } from '@/src/shared/i18n';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSplashStore } from '../store/splash-store';
import { createSplashSteps, getProgressPercentage } from '../utils';
import { permissionsHandler, shouldShowOnboarding } from 'masterfabric-expo-core';

/** Triggers Android/iOS native runtime permission dialogs on app launch. */
function requestCriticalPermissionsOnLaunch() {
  if (Platform.OS === 'web') return;
  const delayMs = 600;
  setTimeout(async () => {
    try {
      await permissionsHandler.request('notifications');
      // Location: only requested when user taps Request in Permissions Helper
    } catch {
      // Ignore – OS handles permission flow
    }
  }, delayMs);
}

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
    addCompletedStep 
  } = useSplashStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    requestCriticalPermissionsOnLaunch();
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
      const currentProgress = getProgressPercentage(completedStepObjects, steps);
      
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
      // Fallback to tabs
      try {
        navigationUtils.replace('(tabs)');
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
        navigationUtils.replace('(tabs)');
      }
    }
  };

  return {
    isLoading,
    progress,
    currentTask,
    completedSteps,
  };
}