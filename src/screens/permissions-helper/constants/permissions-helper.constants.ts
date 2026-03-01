import type { PermissionType } from 'masterfabric-expo-core';

/** AsyncStorage key for which permissions the user has tapped "Request" at least once. */
export const STORAGE_KEY_REQUEST_ATTEMPTED = 'permissionsHelper.requestAttempted';

/** Timeout for permission request (ms); after this we fall back to check(). */
export const REQUEST_TIMEOUT_MS = 20000;

/** Shorter timeout for photo library (Expo Go can hang on iOS; we fall back to check() to show status). */
export const REQUEST_TIMEOUT_PHOTOLIBRARY_MS = 8000;

/** After requesting a permission, skip refresh check for this duration (ms). */
export const SKIP_CHECK_AFTER_REQUEST_MS = 5000;

/** Only these permissions are shown on the helper screen. */
export const PERMISSION_KEYS = [
  'camera',
  'microphone',
  'photoLibrary',
  'location',
  'notifications',
  'calendar',
  'contacts',
  'phone',
  'storage',
  'biometrics',
  'sms',
  'bluetooth',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  camera: 'Camera',
  microphone: 'Microphone',
  photoLibrary: 'Photos and Videos',
  location: 'Location',
  notifications: 'Notifications',
  calendar: 'Calendar',
  contacts: 'Contacts',
  phone: 'Phone',
  storage: 'Storage',
  biometrics: 'Face ID / Touch ID / Biometrics',
  sms: 'SMS',
  bluetooth: 'Bluetooth',
};

export const CONFIG_PREVIEW_PERMISSIONS: PermissionType[] = [
  'camera',
  'microphone',
  'photoLibrary',
  'location',
  'notifications',
  'calendar',
  'contacts',
  'phone',
  'storage',
  'biometrics',
  'sms',
  'bluetooth',
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

/**
 * Map core permission "unavailable" messages to i18n keys so we show different
 * explanations (Expo Go, Android only, iOS only, etc.) instead of a single "Unavailable".
 * Order matters: first match wins. Use lowercase for case-insensitive match.
 */
export const UNAVAILABLE_MESSAGE_TO_I18N: Array<{ pattern: string | RegExp; i18nKey: string }> = [
  { pattern: 'expo go', i18nKey: 'helpers.permissionsHelper.unavailableReasonExpoGo' },
  { pattern: 'not supported in expo go', i18nKey: 'helpers.permissionsHelper.unavailableReasonExpoGo' },
  { pattern: 'photos permission is not supported', i18nKey: 'helpers.permissionsHelper.unavailableReasonExpoGo' },
  { pattern: 'android only', i18nKey: 'helpers.permissionsHelper.unavailableReasonAndroidOnly' },
  { pattern: 'ios only', i18nKey: 'helpers.permissionsHelper.unavailableReasonIosOnly' },
  { pattern: 'android 12+', i18nKey: 'helpers.permissionsHelper.unavailableReasonBluetoothAndroid12' },
  { pattern: 'requires android 12', i18nKey: 'helpers.permissionsHelper.unavailableReasonBluetoothAndroid12' },
  { pattern: 'expo-', i18nKey: 'helpers.permissionsHelper.unavailableReasonExpoModuleRunOnDevice' },
  { pattern: 'run on device', i18nKey: 'helpers.permissionsHelper.unavailableReasonExpoModuleRunOnDevice' },
  { pattern: 'no face id / touch id hardware', i18nKey: 'helpers.permissionsHelper.unavailableReasonNoHardwareOrNotEnrolled' },
  { pattern: 'no face or fingerprint enrolled', i18nKey: 'helpers.permissionsHelper.unavailableReasonNoHardwareOrNotEnrolled' },
  { pattern: 'not enrolled', i18nKey: 'helpers.permissionsHelper.unavailableReasonNoHardwareOrNotEnrolled' },
];

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
  location: 'helpers.permissionsHelper.permissionLocation',
  notifications: 'helpers.permissionsHelper.permissionNotifications',
  calendar: 'helpers.permissionsHelper.permissionCalendar',
  contacts: 'helpers.permissionsHelper.permissionContacts',
  phone: 'helpers.permissionsHelper.permissionPhone',
  storage: 'helpers.permissionsHelper.permissionStorage',
  biometrics: 'helpers.permissionsHelper.permissionBiometrics',
  sms: 'helpers.permissionsHelper.permissionSms',
  bluetooth: 'helpers.permissionsHelper.permissionBluetooth',
};

/** iOS Info.plist key -> i18n key for config preview (all helpers) */
export const IOS_KEY_TO_I18N: Record<string, string> = {
  NSCameraUsageDescription: 'helpers.permissionsHelper.config.ios.camera',
  NSMicrophoneUsageDescription: 'helpers.permissionsHelper.config.ios.microphone',
  NSPhotoLibraryUsageDescription: 'helpers.permissionsHelper.config.ios.photoLibrary',
  NSPhotoLibraryAddUsageDescription: 'helpers.permissionsHelper.config.ios.photoLibraryAdd',
  NSLocationWhenInUseUsageDescription: 'helpers.permissionsHelper.config.ios.locationWhenInUse',
  NSLocationAlwaysAndWhenInUseUsageDescription: 'helpers.permissionsHelper.config.ios.locationAlways',
  NSLocationAlwaysUsageDescription: 'helpers.permissionsHelper.config.ios.locationBackground',
  NSCalendarsUsageDescription: 'helpers.permissionsHelper.config.ios.calendar',
  NSContactsUsageDescription: 'helpers.permissionsHelper.config.ios.contacts',
  NSFaceIDUsageDescription: 'helpers.permissionsHelper.config.ios.faceId',
  NSBluetoothAlwaysUsageDescription: 'helpers.permissionsHelper.config.ios.bluetooth',
};

/** Android permission suffix -> i18n key for config preview (all helpers) */
export const ANDROID_PERMISSION_TO_I18N: Record<string, string> = {
  CAMERA: 'helpers.permissionsHelper.config.android.CAMERA',
  RECORD_AUDIO: 'helpers.permissionsHelper.config.android.RECORD_AUDIO',
  READ_EXTERNAL_STORAGE: 'helpers.permissionsHelper.config.android.READ_EXTERNAL_STORAGE',
  WRITE_EXTERNAL_STORAGE: 'helpers.permissionsHelper.config.android.WRITE_EXTERNAL_STORAGE',
  READ_MEDIA_IMAGES: 'helpers.permissionsHelper.config.android.READ_MEDIA_IMAGES',
  READ_MEDIA_VIDEO: 'helpers.permissionsHelper.config.android.READ_MEDIA_VIDEO',
  READ_MEDIA_AUDIO: 'helpers.permissionsHelper.config.android.READ_MEDIA_AUDIO',
  READ_MEDIA_VISUAL_USER_SELECTED: 'helpers.permissionsHelper.config.android.READ_MEDIA_VISUAL_USER_SELECTED',
  ACCESS_FINE_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_FINE_LOCATION',
  ACCESS_COARSE_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_COARSE_LOCATION',
  ACCESS_BACKGROUND_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_BACKGROUND_LOCATION',
  POST_NOTIFICATIONS: 'helpers.permissionsHelper.config.android.POST_NOTIFICATIONS',
  READ_CALENDAR: 'helpers.permissionsHelper.config.android.READ_CALENDAR',
  WRITE_CALENDAR: 'helpers.permissionsHelper.config.android.WRITE_CALENDAR',
  READ_CONTACTS: 'helpers.permissionsHelper.config.android.READ_CONTACTS',
  WRITE_CONTACTS: 'helpers.permissionsHelper.config.android.WRITE_CONTACTS',
  READ_PHONE_STATE: 'helpers.permissionsHelper.config.android.READ_PHONE_STATE',
  USE_BIOMETRIC: 'helpers.permissionsHelper.config.android.USE_BIOMETRIC',
  SEND_SMS: 'helpers.permissionsHelper.config.android.SEND_SMS',
  RECEIVE_SMS: 'helpers.permissionsHelper.config.android.RECEIVE_SMS',
  READ_SMS: 'helpers.permissionsHelper.config.android.READ_SMS',
  BLUETOOTH: 'helpers.permissionsHelper.config.android.BLUETOOTH',
  BLUETOOTH_SCAN: 'helpers.permissionsHelper.config.android.BLUETOOTH_SCAN',
  BLUETOOTH_CONNECT: 'helpers.permissionsHelper.config.android.BLUETOOTH_CONNECT',
  BLUETOOTH_ADVERTISE: 'helpers.permissionsHelper.config.android.BLUETOOTH_ADVERTISE',
};
