import { navigationUtils } from '@/src/navigation/utils';
import { t } from '@/src/shared/i18n';
import { router } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { useSplashStore } from '../store/splash-store';
import { createSplashSteps, getProgressPercentage } from '../utils';
import { shouldShowOnboarding, networkHelper } from 'masterfabric-expo-core';
import { useNetworkHelperStore } from '@/src/screens/network-helper/store/network-helper-store';

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

  // Network Helper store actions
  const {
    setNetworkInfo,
    setLastCheckTime,
    setIsMonitoring,
  } = useNetworkHelperStore();

  const networkUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Start network helper immediately when splash screen loads
    // This will monitor network status, VPN, and connectivity throughout the app lifecycle
    console.log('[Splash] Starting network helper monitoring...');
    
    // Subscribe to network changes and save to store
    networkUnsubscribeRef.current = networkHelper.onChange((isOnline, info) => {
      console.log('[Splash] Network status changed:', isOnline, 'Info:', info);
      setNetworkInfo(info);
      setLastCheckTime(new Date());
    });
    
    // Start monitoring
    networkHelper.start(30000); // Check every 30 seconds
    setIsMonitoring(true);
    
    // Initial network check and save to store immediately
    networkHelper.checkNow()
      .then(() => {
        // Get initial network info and save to store
        const initialInfo = networkHelper.getNetworkInfo();
        console.log('[Splash] Initial network info:', initialInfo);
        setNetworkInfo(initialInfo);
        setLastCheckTime(new Date());
      })
      .catch((error) => {
        console.warn('[Splash] Initial network check failed:', error);
        // Still try to get whatever info is available
        const info = networkHelper.getNetworkInfo();
        if (info) {
          setNetworkInfo(info);
          setLastCheckTime(new Date());
        }
      });
    
    initializeApp();
    
    // Cleanup on unmount (should not happen in normal flow, but just in case)
    return () => {
      // Don't stop network helper here - it should run throughout app lifecycle
      // But cleanup the listener if component unmounts
      if (networkUnsubscribeRef.current) {
        networkUnsubscribeRef.current();
        networkUnsubscribeRef.current = null;
      }
    };
  }, [setNetworkInfo, setLastCheckTime, setIsMonitoring]);

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