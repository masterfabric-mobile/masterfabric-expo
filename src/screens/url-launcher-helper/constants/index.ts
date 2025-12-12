// URL Launcher Helper constants

export const URL_LAUNCHER_SCHEMES = [
  'http',
  'https',
  'tel',
  'mailto',
  'sms',
  'geo',
  'maps',
  'market',
  'app-settings',
] as const;

export const MAX_HISTORY_ITEMS = 50;

// Default test values - these are fallback values
// Actual values will be set from i18n in view-model based on current language
export const DEFAULT_TEST_VALUES = {
  url: 'https://example.com',
  email: 'support@example.com',
  phone: '+1-800-123-4567',
  smsRecipients: '+1234567890',
  mapAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
  mapLatitude: 37.4220,
  mapLongitude: -122.0841,
  emailSubject: 'Support Request',
  emailBody: 'Hello, I need help with...',
  smsBody: 'Hello!',
  mapLabel: 'Google Headquarters',
  deepLinkUrl: 'myapp://screen/123',
  fallbackUrl: 'https://example.com',
  appStoreId: '123456789',
} as const;

