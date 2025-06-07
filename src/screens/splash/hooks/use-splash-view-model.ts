import { navigationUtils } from '@/src/navigation/utils';
import { t } from '@/src/shared/i18n';
import { useEffect, useState } from 'react';
import { useSplashStore } from '../store/splash-store';

export function useSplashViewModel() {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const { isLoading, setLoading, setProgress: setSplashProgress, setLoadingMessage } = useSplashStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    
    // Simulate initialization tasks
    const tasks = [
      { name: 'Loading fonts', duration: 300, key: 'fonts' },
      { name: 'Initializing services', duration: 500, key: 'services' },
      { name: 'Checking authentication', duration: 400, key: 'auth' },
      { name: 'Loading user preferences', duration: 300, key: 'preferences' },
      { name: 'Finalizing setup', duration: 200, key: 'finalizing' },
    ];

    let currentProgress = 0;
    const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);

    for (const task of tasks) {
      const taskMessage = t(`splash.loading.${task.key}`);
      setCurrentTask(taskMessage);
      setLoadingMessage(taskMessage);
      
      await new Promise(resolve => setTimeout(resolve, task.duration));
      currentProgress += (task.duration / totalDuration) * 100;
      setProgress(Math.round(currentProgress));
      setSplashProgress(Math.round(currentProgress));
    }

    // Navigation logic based on app state
    setTimeout(() => {
      setLoading(false);
      navigateToNextScreen();
    }, 500);
  };

  const navigateToNextScreen = () => {
    try {
      // Navigate directly to home tabs - no onboarding
      console.log('Navigating to home - splash completed');
      navigationUtils.replace('(tabs)');
    } catch (error) {
      console.error('Navigation error from splash screen:', error);
      // Fallback to tabs
      try {
        navigationUtils.replace('(tabs)');
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
        // Final fallback to tabs
        navigationUtils.replace('(tabs)');
      }
    }
  };

  return {
    isLoading,
    progress,
    currentTask,
  };
}