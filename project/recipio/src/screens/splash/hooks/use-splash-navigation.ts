import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { DEFAULT_SPLASH_CONFIG } from '../utils';
import { NavigationConfig } from '../models/splash-models';

interface UseSplashNavigationOptions {
  delay?: number;
  targetRoute?: string;
  shouldReplace?: boolean;
}

export function useSplashNavigation(options: UseSplashNavigationOptions = {}) {
  const router = useRouter();
  const {
    delay: navigationDelay = DEFAULT_SPLASH_CONFIG.navigationDelay,
    targetRoute = '/(tabs)',
    shouldReplace = true,
  } = options;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldReplace) {
        router.replace(targetRoute as any);
      } else {
        router.push(targetRoute as any);
      }
    }, navigationDelay);

    return () => clearTimeout(timer);
  }, [router, navigationDelay, targetRoute, shouldReplace]);
}

