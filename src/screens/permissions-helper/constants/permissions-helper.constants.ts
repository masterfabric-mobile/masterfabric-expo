import type { PermissionType } from 'masterfabric-expo-core';

/** AsyncStorage key for which permissions the user has tapped "Request" at least once. */
export const STORAGE_KEY_REQUEST_ATTEMPTED = 'permissionsHelper.requestAttempted';

/** Only these permissions are shown on the helper screen. */
export const PERMISSION_KEYS = [
  'camera',
  'microphone',
  'photoLibrary',
  'notifications',
  'contacts',
  'sms',
  'calendar',
  'location',
  'bluetooth',
  'phone',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  camera: 'Camera',
  microphone: 'Microphone',
  photoLibrary: 'Photos and Videos',
  notifications: 'Notifications',
  contacts: 'Contacts',
  sms: 'SMS',
  calendar: 'Calendar',
  location: 'Location',
  bluetooth: 'Bluetooth',
  phone: 'Phone',
};

export const CONFIG_PREVIEW_PERMISSIONS: PermissionType[] = [
  'camera',
  'microphone',
  'photoLibrary',
  'notifications',
  'contacts',
  'sms',
  'calendar',
  'location',
  'bluetooth',
  'phone',
];

/** i18n keys for permission status labels */
export const STATUS_I18N: Record<string, string> = {
  granted: 'helpers.permissionsHelper.statusGranted',
  denied: 'helpers.permissionsHelper.statusDenied',
  blocked: 'helpers.permissionsHelper.statusBlocked',
  unavailable: 'helpers.permissionsHelper.statusUnavailable',
  limited: 'helpers.permissionsHelper.statusLimited',
  unknown: 'helpers.permissionsHelper.statusUnknown',
};

/** Theme color keys for status badges (use with getThemeColors(isDark)[key]) */
export const STATUS_BADGE_THEME_KEYS: Record<string, keyof import('masterfabric-expo-core').ThemeColors> = {
  granted: 'successColor',
  denied: 'warningColor',
  blocked: 'errorColor',
  unavailable: 'inactiveText',
  limited: 'warningColor',
  unknown: 'inactiveText',
};

/** i18n keys for permission row labels */
export const PERMISSION_LABEL_KEYS: Record<string, string> = {
  camera: 'helpers.permissionsHelper.permissionCamera',
  microphone: 'helpers.permissionsHelper.permissionMicrophone',
  photoLibrary: 'helpers.permissionsHelper.permissionPhotoLibrary',
  notifications: 'helpers.permissionsHelper.permissionNotifications',
  contacts: 'helpers.permissionsHelper.permissionContacts',
  sms: 'helpers.permissionsHelper.permissionSms',
  calendar: 'helpers.permissionsHelper.permissionCalendar',
  location: 'helpers.permissionsHelper.permissionLocation',
  bluetooth: 'helpers.permissionsHelper.permissionBluetooth',
  phone: 'helpers.permissionsHelper.permissionPhone',
};

/** iOS Info.plist key -> i18n key for config preview */
export const IOS_KEY_TO_I18N: Record<string, string> = {
  NSCameraUsageDescription: 'helpers.permissionsHelper.config.ios.camera',
  NSMicrophoneUsageDescription: 'helpers.permissionsHelper.config.ios.microphone',
  NSPhotoLibraryUsageDescription: 'helpers.permissionsHelper.config.ios.photoLibrary',
  NSPhotoLibraryAddUsageDescription: 'helpers.permissionsHelper.config.ios.photoLibraryAdd',
  NSLocationWhenInUseUsageDescription: 'helpers.permissionsHelper.config.ios.locationWhenInUse',
  NSLocationAlwaysAndWhenInUseUsageDescription: 'helpers.permissionsHelper.config.ios.locationAlways',
  NSLocationAlwaysUsageDescription: 'helpers.permissionsHelper.config.ios.locationBackground',
  NSContactsUsageDescription: 'helpers.permissionsHelper.config.ios.contacts',
};

/** Android permission suffix -> i18n key for config preview */
export const ANDROID_PERMISSION_TO_I18N: Record<string, string> = {
  CAMERA: 'helpers.permissionsHelper.config.android.CAMERA',
  RECORD_AUDIO: 'helpers.permissionsHelper.config.android.RECORD_AUDIO',
  READ_EXTERNAL_STORAGE: 'helpers.permissionsHelper.config.android.READ_EXTERNAL_STORAGE',
  WRITE_EXTERNAL_STORAGE: 'helpers.permissionsHelper.config.android.WRITE_EXTERNAL_STORAGE',
  READ_MEDIA_IMAGES: 'helpers.permissionsHelper.config.android.READ_MEDIA_IMAGES',
  READ_MEDIA_VIDEO: 'helpers.permissionsHelper.config.android.READ_MEDIA_VIDEO',
  ACCESS_FINE_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_FINE_LOCATION',
  ACCESS_COARSE_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_COARSE_LOCATION',
  ACCESS_BACKGROUND_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_BACKGROUND_LOCATION',
  POST_NOTIFICATIONS: 'helpers.permissionsHelper.config.android.POST_NOTIFICATIONS',
  READ_CALENDAR: 'helpers.permissionsHelper.config.android.READ_CALENDAR',
  WRITE_CALENDAR: 'helpers.permissionsHelper.config.android.WRITE_CALENDAR',
  READ_CONTACTS: 'helpers.permissionsHelper.config.android.READ_CONTACTS',
  WRITE_CONTACTS: 'helpers.permissionsHelper.config.android.WRITE_CONTACTS',
  READ_PHONE_STATE: 'helpers.permissionsHelper.config.android.READ_PHONE_STATE',
};
