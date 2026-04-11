import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { storage } from '@/shared/utils/storage';
import { SplashScreen } from './splash-screen';

const SPLASH_DELAY_MS = 1500;

/**
 * Route wrapper: shows splash then redirects to (tabs) or onboarding.
 * Used by app/index.tsx as the only route content.
 */
export function SplashRoute() {
  const router = useRouter();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const init = async () => {
      await new Promise((r) => setTimeout(r, SPLASH_DELAY_MS));
      const completed = await storage.getOnboardingCompleted();
      setIsOnboardingCompleted(completed);
    };
    init();
  }, []);

  useEffect(() => {
    if (isOnboardingCompleted === null) return;

    if (isOnboardingCompleted) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [isOnboardingCompleted, router]);

  return <SplashScreen />;
}
