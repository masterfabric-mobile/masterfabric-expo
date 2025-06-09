import { t } from '@/src/shared/i18n';
import { useEffect, useState } from 'react';
import { useSplashStore } from '../store/splash-store';
import { createSplashSteps, getProgressPercentage } from '../utils';

export function useSplashViewModel() {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { isLoading, setLoading, setProgress: setSplashProgress, setLoadingMessage } = useSplashStore();

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
    // try {
    //   // Navigate directly to home tabs - no onboarding
    //   console.log('Navigating to home - splash completed');
    //   navigationUtils.replace('(tabs)');
    // } catch (error) {
    //   console.error('Navigation error from splash screen:', error);
    //   // Fallback to tabs
    //   try {
    //     navigationUtils.replace('(tabs)');
    //   } catch (fallbackError) {
    //     console.error('Fallback navigation also failed:', fallbackError);
    //     // Final fallback to tabs
    //     navigationUtils.replace('(tabs)');
    //   }
    // }
  };

  return {
    isLoading,
    progress,
    currentTask,
    completedSteps,
  };
}