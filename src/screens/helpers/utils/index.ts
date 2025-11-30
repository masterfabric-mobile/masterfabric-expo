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
    case 'ui-size-helper':
      return 'resize-outline';
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
    case 'ui-size-helper':
      return '#007AFF'; // Blue for UI sizing helpers
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
    id: 'ui-size-helper',
    name: 'UI Size Helper',
    description: 'Sizing system, spacing, typography, and responsive design utilities',
    icon: 'resize-outline',
    color: '#007AFF',
    route: '/ui-size-helper',
    available: true,
    category: 'ui-helpers'
  }
];

