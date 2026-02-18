import { HelperItem } from '../models/helpers-models';

// Helpers utilities
export const getHelperIcon = (helperId: string): string => {
  switch (helperId) {
    case 'capitalize':
      return 'text-outline';
    case 'truncate':
      return 'cut-outline';
    case 'email-validation':
      return 'mail-outline';
    case 'url-validation':
      return 'link-outline';
    case 'case-conversion':
      return 'swap-horizontal-outline';
    case 'html-escaping':
      return 'code-outline';
    case 'date-formatting':
      return 'calendar-outline';
    case 'time-calculations':
      return 'time-outline';
    case 'timezone-handling':
      return 'globe-outline';
    case 'date-parsing':
      return 'reader-outline';
    case 'currency-formatting':
      return 'card-outline';
    case 'number-validation':
      return 'checkmark-circle-outline';
    case 'mathematical-operations':
      return 'calculator-outline';
    case 'percentage-calculations':
      return 'percent-outline';
    case 'snackbar-helper':
      return 'notifications-outline';
    case 'firebase-helper':
      return 'flame-outline';
    case 'time-helper':
      return 'time-outline';
    case 'battery-helper':
      return 'battery-charging-outline';
    case 'rich-text-helper':
      return 'document-text-outline';
    case 'typography-helper':
      return 'text-outline';
    case 'onboarding-helper':
      return 'school-outline';
    case 'validator-helper':
      return 'checkmark-circle-outline';
    case 'url-launcher-helper':
      return 'open-outline';
    case 'ui-size-helper':
      return 'resize-outline';
    case 'app-icon-helper':
      return 'apps-outline';
    case 'video-player-helper':
      return 'play-circle-outline';
    case 'haptic-helper':
      return 'phone-portrait-outline';
    case 'double-extension-helper':
      return 'calculator-outline';
    case 'web-viewer-helper':
      return 'globe-outline';
    case 'local-notification-helper':
      return 'notifications-outline';
    case 'onesignal-helper':
      return 'notifications-outline';
    default:
      return 'help-outline';
  }
};

export const getHelperColor = (helperId: string): string => {
  switch (helperId) {
    case 'capitalize':
    case 'truncate':
    case 'email-validation':
    case 'url-validation':
    case 'case-conversion':
    case 'html-escaping':
      return '#34C759'; // Green for string helpers
    case 'date-formatting':
    case 'time-calculations':
    case 'timezone-handling':
    case 'date-parsing':
      return '#FF9500'; // Orange for date helpers
    case 'currency-formatting':
    case 'number-validation':
    case 'mathematical-operations':
    case 'percentage-calculations':
      return '#5856D6'; // Purple for number helpers
    case 'snackbar-helper':
      return '#007AFF'; // Blue for UI feedback helpers
    case 'firebase-helper':
      return '#F5820D'; // Firebase brand-like orange
    case 'time-helper':
      return '#FF9500'; // Orange for time helpers
    case 'battery-helper':
      return '#34C759'; // Green for battery/device helpers
    case 'rich-text-helper':
      return '#AF52DE'; // Purple for rich text helpers
    case 'typography-helper':
      return '#007AFF'; // Blue for typography helpers
    case 'validator-helper':
      return '#FF3B30'; // Red for validation helpers
    case 'url-launcher-helper':
      return '#007AFF'; // Blue for URL/launcher helpers
    case 'ui-size-helper':
      return '#5856D6'; // Purple for UI sizing helpers
    case 'app-icon-helper':
      return '#007AFF'; // Blue for app icon helpers
    case 'video-player-helper':
      return '#FF2D55'; // Pink for video player helpers
    case 'haptic-helper':
      return '#FF6B9D'; // Light pink for haptic helpers
    case 'double-extension-helper':
      return '#5856D6'; // Purple for number/double helpers
    case 'web-viewer-helper':
      return '#007AFF'; // Blue for web viewer helpers
    case 'local-notification-helper':
      return '#FF9500'; // Orange for notification helpers
    case 'onesignal-helper':
      return '#1E88E5'; // Blue for OneSignal/remote push
    default:
      return '#8E8E93';
  }
};

export const createDefaultHelperItems = (): HelperItem[] => [
  {
    id: 'string-helper',
    name: 'String Helper',
    description: 'Text manipulation and validation utilities',
    icon: 'text-outline',
    color: '#34C759',
    route: '/string-helper',
    available: true,
    category: 'string-helpers'
  },
  {
    id: 'logger-helper',
    name: 'Logger Helper',
    description: 'Development and production logging utilities',
    icon: 'document-text-outline',
    color: '#5856D6',
    route: '/logger-helper',
    available: true,
    category: 'dev-helpers'
  },
  {
    id: 'snackbar-helper',
    name: 'Snackbar Helper',
    description: 'Snackbar notification utilities with action buttons and positioning',
    icon: 'notifications-outline',
    color: '#007AFF',
    route: '/snackbar-helper',
    available: true,
    category: 'ui-helpers'
  },
  {
    id: 'firebase-helper',
    name: 'Firebase Helper',
    description: 'Auth, Analytics (web), and Firestore utilities',
    icon: 'flame-outline',
    color: '#F5820D',
    route: '/firebase-helper',
    available: true,
    category: 'integrations'
  },
  {
    id: 'toast-helper',
    name: 'Toast Helper',
    description: 'UI feedback and notification utilities',
    icon: 'notifications-outline',
    color: '#FF3B30',
    route: '/toast-helper',
    available: true,
    category: 'ui-helpers'
  },
  {
    id: 'time-helper',
    name: 'Time Helper',
    description: 'Date and time manipulation utilities',
    icon: 'time-outline',
    color: '#FF9500',
    route: '/time-helper',
    available: true,
    category: 'time-helpers'
  },
  {
    id: 'battery-helper',
    name: 'Battery Helper',
    description: 'Battery level, charging status, low power mode, and device information',
    icon: 'battery-charging-outline',
    color: '#34C759',
    route: '/battery-helper',
    available: true,
    category: 'device-helpers'
  },
  {
    id: 'permissions-helper',
    name: 'Permissions Helper',
    description: 'Test device permissions: camera, photo library, location, notifications',
    icon: 'shield-checkmark-outline',
    color: '#34C759',
    route: '/permissions-helper',
    available: true,
    category: 'device-helpers'
  },
  {
    id: 'rich-text-helper',
    name: 'Rich Text Helper',
    description: 'HTML, Markdown, and text formatting utilities',
    icon: 'document-text-outline',
    color: '#AF52DE',
    route: '/rich-text-helper',
    available: true,
    category: 'text-helpers'
  },
  {
    id: 'typography-helper',
    name: 'Typography Helper',
    description: 'Typography utilities, font scaling, and text styling with Flutter-style copyWith pattern',
    icon: 'text-outline',
    color: '#007AFF',
    route: '/typography-helper',
    available: true,
    category: 'text-helpers'
  },
  {
    id: 'validator-helper',
    name: 'Validator Helper',
    description: 'Form validation utilities',
    icon: 'checkmark-circle-outline',
    color: '#FF3B30',
    route: '/validator-helper',
    available: true,
    category: 'validation-helpers'
  },
  {
    id: 'url-launcher-helper',
    name: 'URL Launcher Helper',
    description: 'Open URLs, emails, phone numbers, and external apps',
    icon: 'open-outline',
    color: '#007AFF',
    route: '/url-launcher-helper',
    available: true,
    category: 'device-helpers'
  },
  {
    id: 'ui-size-helper',
    name: 'UI Size Helper',
    description: 'Responsive sizing utilities, spacing, padding, margins, and layout helpers',
    icon: 'resize-outline',
    color: '#5856D6',
    route: '/ui-size-helper',
    available: true,
    category: 'ui-helpers'
  },
  {
    id: 'app-icon-helper',
    name: 'App Icon Helper',
    description: 'Change your app icon dynamically on iOS devices',
    icon: 'apps-outline',
    color: '#007AFF',
    route: '/app-icon-helper',
    available: true,
    category: 'device-helpers'
  },
  {
    id: 'video-player-helper',
    name: 'Video Player Helper',
    description: 'Video playback controls and functionality',
    icon: 'play-circle-outline',
    color: '#FF2D55',
    route: '/video-player-helper',
    available: true,
    category: 'ui-helpers'
  },
  {
    id: 'haptic-helper',
    name: 'Haptic Helper',
    description: 'Haptic feedback testing and controls (iOS/Android only)',
    icon: 'phone-portrait-outline',
    color: '#FF6B9D',
    route: '/haptic-helper',
    available: true,
    category: 'device-helpers'
  },
  {
    id: 'double-extension-helper',
    name: 'Double Extension Helper',
    description: 'Precision, formatting, and safe math for numbers (currency, percentage, compact, clamp)',
    icon: 'calculator-outline',
    color: '#5856D6',
    route: '/double-extension-helper',
    available: true,
    category: 'number-helpers'
  },
  {
    id: 'web-viewer-helper',
    name: 'Web Viewer Helper',
    description: 'Display HTML content and web URLs within the app using WebView',
    icon: 'globe-outline',
    color: '#007AFF',
    route: '/web-viewer-helper',
    available: true,
    category: 'ui-helpers'
  },
  {
    id: 'local-notification-helper',
    name: 'Local Notification Helper',
    description: 'Schedule, manage, and handle local notifications with permissions, badges, channels, and categories',
    icon: 'notifications-outline',
    color: '#FF9500',
    route: '/local-notification-helper',
    available: true,
    category: 'device-helpers'
  },
  {
    id: 'onesignal-helper',
    name: 'OneSignal Helper',
    description: 'Remote push notifications via OneSignal; init, permission, user ID, and subscription (App ID from .env)',
    icon: 'notifications-outline',
    color: '#1E88E5',
    route: '/onesignal-helper',
    available: true,
    category: 'device-helpers'
  }
];

