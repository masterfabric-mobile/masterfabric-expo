import { useLocale } from '@/src/shared/hooks/use-locale';
import { useAppStore } from '@/src/shared/store';
import { useMemo } from 'react';
import { useHomeStore } from '../store/home-store';
import { createDefaultQuickActions, formatGreeting } from '../utils';

export function useHomeViewModel() {
  const { user } = useAppStore();
  const { quickActions } = useHomeStore();
  const { locale } = useLocale(); // This will trigger re-render on locale change

  const greeting = useMemo(() => {
    return formatGreeting(user);
  }, [user, locale]); // Re-compute when user or locale changes

  const defaultQuickActions = useMemo(() => {
    return createDefaultQuickActions();
  }, [locale]); // Re-compute when locale changes

  return {
    user,
    greeting,
    quickActions: quickActions.length > 0 ? quickActions : defaultQuickActions,
  };
}
