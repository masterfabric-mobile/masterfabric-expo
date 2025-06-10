import { QUICK_ACTION_COLORS } from '@/src/shared/constants/Colors';
import { t, translateLanguage, translateTheme } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../models/home-models';
import { ActivityItem } from '../store/home-store';

// Import the formatActivityDescription helper from i18n

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route?: string; // Add optional route property
}

export interface DeveloperTools {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route?: string; // Add optional route property
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
    id: 'projects',
    title: t('home.actions.projects.title'),
    description: t('home.actions.projects.description'),
    icon: 'rocket',
    color: QUICK_ACTION_COLORS['projects'],
    route: '/projects',
  },
  {
    id: 'templates',
    title: t('home.actions.templates.title'),
    description: t('home.actions.templates.description'),
    icon: 'clipboard',
    color: QUICK_ACTION_COLORS['templates'],
    route: 'https://github.com/masterfabric-mobile',
  },
  {
    id: 'documentation',
    title: t('home.actions.documentation.title'),
    description: t('home.actions.documentation.description'),
    icon: 'book',
    color: QUICK_ACTION_COLORS['documentation'],
  },
  {
    id: 'settings',
    title: t('home.actions.settings.title'),
    description: t('home.actions.settings.description'),
    icon: 'settings',
    color: QUICK_ACTION_COLORS['settings'],
    route: '/settings',
  },
];

// Helper function to translate a key or return the value if it's not a translation key
export const translateKeyOrValue = (keyOrValue: string, translateFn: (key: string) => string): string => {
  // Check if it looks like a translation key
  const isTranslationKey = keyOrValue.includes('.') && (
    keyOrValue.startsWith('home.') || 
    keyOrValue.startsWith('settings.') || 
    keyOrValue.startsWith('deviceInfo.')
  );
  
  if (isTranslationKey) {
    try {
      return translateFn(keyOrValue);
    } catch (e) {
      // If translation fails, return the original value
      return keyOrValue;
    }
  }
  
  return keyOrValue;
};

// Helper function to safely format translations with variables
export const formatTranslation = (translateFn: (key: string, params?: any) => string, key: string, params?: Record<string, any>): string => {
  try {
    if (params) {
      // Create a version that handles both ways to call translate functions
      const translatedText = key.includes('{{') ? 
        translateFn(key.replace(/{{(\w+)}}/g, (_, p) => params[p] || '')) :
        key;
      
      // Replace any {{param}} in the translated text with values from params
      return Object.entries(params).reduce(
        (text, [paramKey, paramValue]) => 
          text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
        translatedText
      );
    }
    return translateFn(key);
  } catch (e) {
    console.warn(`Translation error for key: ${key}`, e);
    return key;
  }
};

// Developer section utilities
export const getDeveloperActions = (): DeveloperTools[] => [
  {
    id: 'dev-onboarding',
    title: 'home.developer.onboarding.title',
    description: 'home.developer.onboarding.description',
    icon: 'build',
    color: QUICK_ACTION_COLORS['dev-onboarding'],
  },
  {
    id: 'dev-device-info',
    title: 'home.developer.deviceInfo.title',
    description: 'home.developer.deviceInfo.description',
    icon: 'phone-portrait',
    color: QUICK_ACTION_COLORS['dev-device-info'],
  },
];

export const getDeveloperIconName = (actionId: string): string => {
  switch (actionId) {
    case 'dev-onboarding':
      return 'build';
    case 'dev-device-info':
      return 'phone-portrait';
    default:
      return 'apps';
  }
};

// Activity section utilities
export const formatActivityTime = (timestamp: Date, locale = 'en'): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Localized time strings
  const timeStrings: Record<string, { minute: string; hour: string; day: string; }> = {
    'en': { minute: 'm ago', hour: 'h ago', day: 'd ago' },
    'tr': { minute: 'dk önce', hour: 'sa önce', day: 'gün önce' },
  };
  
  // Use the specified locale or fallback to English
  const timeFormat = timeStrings[locale] || timeStrings.en;

  if (minutes < 60) return `${minutes}${timeFormat.minute}`;
  if (hours < 24) return `${hours}${timeFormat.hour}`;
  return `${days}${timeFormat.day}`;
};

/**
 * Format an activity description based on its type and details
 */
export const formatActivityDescription = (activity: ActivityItem, translateFn: (key: string, options?: any) => string): string => {
  if (!activity.details) {
    return activity.description || '';
  }

  switch (activity.details.action) {
    case 'theme_change': {
      const fromTheme = activity.details.from || 'system';
      const toTheme = activity.details.to || 'system';
      
      // Get properly translated theme names
      const fromDisplay = translateTheme(fromTheme);
      const toDisplay = translateTheme(toTheme);
      
      // Build a formatted description string directly
      return `${translateFn('settings.theme.title')}: ${fromDisplay} → ${toDisplay}`;
    }
    case 'language_change': {
      const fromLang = activity.details.from || 'en';
      const toLang = activity.details.to || 'en';
      
      // Format with language names
      const fromDisplay = translateLanguage(fromLang);
      const toDisplay = translateLanguage(toLang);
      
      // Build a formatted description string directly
      return `${translateFn('settings.language')}: ${fromDisplay} → ${toDisplay}`;
    }
    case 'device_info':
      return translateFn('home.activity.deviceInfoRetrieved');
    case 'notification_settings':
      return translateFn('home.activity.notificationsChanged');
    case 'general_settings':
      return translateFn('home.activity.settingsChanged');
    case 'settings':
      return translateFn('home.activity.settingsOpened');
    case 'dev_tool':
      // For developer tools, try to get a specific description
      if (activity.details.tool === 'dev-device-info') {
        return translateFn('home.activity.deviceInfoViewed');
      } else if (activity.details.tool === 'dev-onboarding') {
        return translateFn('home.activity.onboardingStarted');
      }
      return translateFn('home.activity.devToolUsed');
    case 'new_project':
      return translateFn('home.activity.allProjects');
    case 'templates':
      return translateFn('home.activity.templatesViewed');
    case 'documentation':
      return translateFn('home.activity.documentationOpened');
    default:
      return activity.description || '';
  }
};

/**
 * Get proper display name for theme values
 */
const getThemeDisplayName = (theme: string, translateFn: (key: string) => string): string => {
  const key = `settings.theme.${theme.toLowerCase()}`;
  const translated = translateFn(key);
  
  // If translation failed, capitalize the theme name as fallback
  if (translated === key) {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
  
  return translated;
};

// Helper to get language display codes
const getLanguageDisplayCode = (locale: string): string => {
  switch (locale.toLowerCase()) {
    case 'en':
      return 'EN';
    case 'tr':
      return 'TR';
    default:
      return locale.toUpperCase();
  }
};

type IconName = keyof typeof Ionicons.glyphMap;

export const getActivityIcon = (activity: ActivityItem): { icon: IconName, color: string } => {
  if (activity.details) {
    switch (activity.details.action) {
      case 'theme_change':
        return { 
          icon: (activity.details.to === 'dark' ? 'moon-outline' : 'sunny-outline') as IconName, 
          color: '#FF9500' 
        };
      case 'language_change':
        return { icon: 'language-outline' as IconName, color: '#5856D6' };
      case 'device_info':
        return { icon: 'phone-portrait-outline' as IconName, color: '#007AFF' };
      case 'notification_settings':
        return { icon: 'notifications-outline' as IconName, color: '#FF3B30' };
      case 'general_settings':
        return { icon: 'settings-outline' as IconName, color: '#8E8E93' };
      case 'dev_tool':
        return { icon: 'code-outline' as IconName, color: '#34C759' };
    }
  }

  // Default icons based on type
  switch (activity.type) {
    case 'project':
      return { icon: 'rocket-outline' as IconName, color: QUICK_ACTION_COLORS['new-project'] };
    case 'template':
      return { icon: 'clipboard-outline' as IconName, color: QUICK_ACTION_COLORS['templates'] };
    case 'documentation':
      return { icon: 'book-outline' as IconName, color: QUICK_ACTION_COLORS['documentation'] };
    case 'settings':
      return { icon: 'settings-outline' as IconName, color: QUICK_ACTION_COLORS['settings'] };
    case 'device_info':
      return { icon: 'phone-portrait-outline' as IconName, color: '#007AFF' };
    case 'dev_tool':
      return { icon: 'hammer-outline' as IconName, color: '#FF9500' };
    default:
      return { icon: 'alert-circle-outline' as IconName, color: '#8E8E93' };
  }
};

// Header utilities
export const getHeaderIntensity = (isDark: boolean): number => {
  return isDark ? 80 : 100;
};

export const getHeaderTint = (isDark: boolean): 'light' | 'dark' => {
  return isDark ? 'dark' : 'light';
};

// Icon utilities
export const getActionIconName = (actionId: string): string => {
  switch (actionId) {
    case 'projects':
      return 'rocket';
    case 'templates':
      return 'clipboard';
    case 'documentation':
      return 'book';
    case 'settings':
      return 'settings';
    default:
      return 'apps';
  }
};

export const getHeaderIconName = (iconType: 'notification' | 'settings' | 'profile'): string => {
  switch (iconType) {
    case 'notification':
      return 'notifications-outline';
    case 'settings':
      return 'settings-outline';
    case 'profile':
      return 'person-circle-outline';
    default:
      return 'apps';
  }
};
