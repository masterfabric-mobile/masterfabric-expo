import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { useAppStore } from '@/src/shared/store';
import { useMemo } from 'react';
import { useHomeStore } from '../store/home-store';

export function useHomeViewModel() {
  const { user } = useAppStore();
  const { quickActions } = useHomeStore();
  const { locale } = useLocale(); // This will trigger re-render on locale change

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetings.goodMorning');
    if (hour < 18) return t('greetings.goodAfternoon');
    return t('greetings.goodEvening');
  }, [locale]); // Re-compute when locale changes

  const defaultQuickActions = useMemo(() => [
    {
      id: 'new-project',
      title: t('home.actions.newProject.title'),
      description: t('home.actions.newProject.description'),
      icon: '🚀',
      color: '#007AFF',
    },
    {
      id: 'templates',
      title: t('home.actions.templates.title'),
      description: t('home.actions.templates.description'),
      icon: '📋',
      color: '#34C759',
    },
    {
      id: 'documentation',
      title: t('home.actions.documentation.title'),
      description: t('home.actions.documentation.description'),
      icon: '📚',
      color: '#FF9500',
    },
    {
      id: 'settings',
      title: t('home.actions.settings.title'),
      description: t('home.actions.settings.description'),
      icon: '⚙️',
      color: '#8E8E93',
    },
  ], [locale]); // Re-compute when locale changes

  return {
    user,
    greeting,
    quickActions: quickActions.length > 0 ? quickActions : defaultQuickActions,
  };
}
