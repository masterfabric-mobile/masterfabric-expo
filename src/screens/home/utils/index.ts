import { t } from '@/src/shared/i18n';
import { User } from '../models/home-models';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface DeveloperTools {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const validateHomeAction = (action: QuickAction): boolean => {
  if (!action) return false;
  if (!action.id || typeof action.id !== 'string') return false;
  if (!action.title || typeof action.title !== 'string') return false;
  if (!action.description || typeof action.description !== 'string') return false;
  if (!action.icon || typeof action.icon !== 'string') return false;
  if (!action.color || typeof action.color !== 'string') return false;
  return true;
};

export const formatGreeting = (user: User | null): string => {
  const hour = new Date().getHours();
  const timeKey = 
    hour < 12 ? 'greetings.goodMorning' :
    hour < 18 ? 'greetings.goodAfternoon' :
    'greetings.goodEvening';
  
  const timeGreeting = t(timeKey);
  return user ? `${timeGreeting}, ${user.name}!` : timeGreeting;
};

export const createDefaultQuickActions = (): QuickAction[] => [
  {
    id: 'new-project',
    title: t('home.actions.newProject.title'),
    description: t('home.actions.newProject.description'),
    icon: 'rocket',
    color: '#007AFF',
  },
  {
    id: 'templates',
    title: t('home.actions.templates.title'),
    description: t('home.actions.templates.description'),
    icon: 'clipboard',
    color: '#34C759',
  },
  {
    id: 'documentation',
    title: t('home.actions.documentation.title'),
    description: t('home.actions.documentation.description'),
    icon: 'book',
    color: '#FF9500',
  },
  {
    id: 'settings',
    title: t('home.actions.settings.title'),
    description: t('home.actions.settings.description'),
    icon: 'settings',
    color: '#8E8E93',
  },
];

export const createDeveloperActions = (): DeveloperTools[] => [
  {
    id: 'dev-onboarding',
    title: t('home.developer.onboarding.title'),
    description: t('home.developer.onboarding.description'),
    icon: 'build',
    color: '#FF9500',
  },
  {
    id: 'dev-device-info',
    title: t('home.developer.deviceInfo.title'),
    description: t('home.developer.deviceInfo.description'),
    icon: 'phone-portrait',
    color: '#007AFF',
  },
];
