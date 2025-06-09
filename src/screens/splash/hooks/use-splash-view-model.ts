import { navigationUtils } from '@/src/navigation/utils';
import { t } from '@/src/shared/i18n';
import { useEffect, useState } from 'react';
import { useOnboardingStore } from '../../onboarding/store/onboarding-store';
import { useSplashStore } from '../store/splash-store';
import { createSplashSteps, getProgressPercentage } from '../utils';

export function useSplashViewModel() {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { isLoading, setLoading, setProgress: setSplashProgress, setLoadingMessage } = useSplashStore();
  const { hasSeenOnboarding, isCompleted, loadOnboardingStatus } = useOnboardingStore();

  useEffect(() => {
    initializeApp();
  }, []);

  // Listen for onboarding completion
  useEffect(() => {
    if (isCompleted && !isLoading) {
      console.log('🎉 Onboarding completed, navigating to home tabs');
      navigationUtils.replace('(tabs)');
    }
  }, [isCompleted, isLoading]);

  const initializeApp = async () => {
    setLoading(true);
    
    // Load onboarding status first
    await loadOnboardingStatus();
    
    const steps = createSplashSteps();
    const completed: string[] = [];

    for (const step of steps) {
      const taskMessage = t(`splash.loading.${step.id}`);
      setCurrentTask(taskMessage);
      setLoadingMessage(taskMessage);
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
      
      completed.push(step.id);
      setCompletedSteps([...completed]);
      
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

  const navigateToNextScreen = () => {
    console.log('🧿 Splash screen completed, checking onboarding status');
    console.log('hasSeenOnboarding:', hasSeenOnboarding);
    console.log('isCompleted:', isCompleted);
    
    try {
      // If onboarding is completed or user has seen it, go to home
      if (hasSeenOnboarding || isCompleted) {
        console.log('User has completed onboarding - navigating to home tabs');
        navigationUtils.replace('(tabs)');
      } else {
        console.log('First time user - navigating to onboarding');
        navigationUtils.replace('onboarding');
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