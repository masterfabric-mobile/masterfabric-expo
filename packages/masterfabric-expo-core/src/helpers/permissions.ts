import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

/**
 * Permissions Handler Helper
 *
 * Comprehensive utilities for managing device permissions across iOS and Android.
 * Provides unified API for permission requests, status checking, and configuration management.
 * Aligns with [GitHub Issue #28](https://github.com/masterfabric-mobile/masterfabric-expo/issues/28).
 *
 * Uses Expo modules where available (expo-image-picker, expo-location, expo-notifications);
 * other permissions return unavailable until corresponding Expo packages are added.
 *
 * @example
 * ```typescript
 * import { permissionsHandler } from 'masterfabric-expo-core';
 *
 * const status = await permissionsHandler.requestCamera({
 *   rationale: 'We need camera access to take photos',
 *   showSettingsAlert: true
 * });
 * if (status.granted) { /* proceed *\/ }
 * else if (status.status === 'blocked') {
 *   permissionsHandler.showSettingsAlert({ permission: 'camera', openSettings: true });
 * }
 *
 * const locationStatus = await permissionsHandler.check('location');
 * const permissions = await permissionsHandler.requestMultiple([
 *   { type: 'camera', rationale: 'For photos' },
 *   { type: 'microphone', rationale: 'For audio' }
 * ]);
 * ```
 */

/** Legacy permission status (uses never_ask_again). */
export interface LegacyPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'limited' | 'never_ask_again' | 'unknown';
  message?: string;
}

/** Legacy permission types (snake_case). */
export type LegacyPermissionType =
  | 'camera'
  | 'microphone'
  | 'photo_library'
  | 'location'
  | 'contacts'
  | 'calendar'
  | 'reminders'
  | 'notifications'
  | 'bluetooth'
  | 'speech_recognition'
  | 'face_id'
  | 'touch_id'
  | 'biometrics';

/** Permission status (Issue #28). */
export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'blocked' | 'limited' | 'unavailable' | 'unknown';
  /** True when status === 'blocked' (permanently denied). Convenience for Issue #28 examples. */
  blocked?: boolean;
  limited?: boolean;
  message?: string;
  ios?: { scope?: 'full' | 'limited' };
  android?: { rationaleRequired?: boolean };
}

/** Permission types supported by permissionsHandler (Issue #28). */
export type PermissionType =
  | 'camera'
  | 'microphone'
  | 'photoLibrary'
  | 'mediaLibrary'
  | 'musicLibrary'
  | 'location'
  | 'locationAlways'
  | 'locationWhenInUse'
  | 'locationBackground'
  | 'contacts'
  | 'calendar'
  | 'reminders'
  | 'notifications'
  | 'bluetooth'
  | 'bluetoothScan'
  | 'bluetoothConnect'
  | 'bluetoothAdvertise'
  | 'faceId'
  | 'touchId'
  | 'biometrics'
  | 'motionFitness'
  | 'health'
  | 'speechRecognition'
  | 'siri'
  | 'tracking'
  | 'nearbyInteractions'
  | 'storage'
  | 'storageRead'
  | 'storageWrite'
  | 'phone'
  | 'sms'
  | 'callPhone'
  | 'readPhoneState'
  | 'readSms'
  | 'sendSms'
  | 'receiveSms';

/** Permission options (Issue #28). */
export interface PermissionOptions {
  rationale?: string;
  title?: string;
  message?: string;
  showSettingsAlert?: boolean;
  onDenied?: (status: PermissionStatus) => void;
  onBlocked?: (status: PermissionStatus) => void;
}

/** Camera permission options (Issue #28). */
export interface CameraPermissionOptions extends PermissionOptions {
  includePhotoLibrary?: boolean;
}

/** Photo library options (Issue #28). */
export interface PhotoLibraryOptions extends PermissionOptions {
  accessLevel?: 'readOnly' | 'readWrite' | 'addOnly';
}

/** Location permission options (Issue #28). */
export interface LocationPermissionOptions extends PermissionOptions {
  accuracy?: 'high' | 'low';
  background?: boolean;
  always?: boolean;
}

/** Notification permission options (Issue #28). */
export interface NotificationPermissionOptions extends PermissionOptions {
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
  carPlay?: boolean;
  criticalAlert?: boolean;
  provisional?: boolean;
  providesAppNotificationSettings?: boolean;
}

/** Single permission request (Issue #28). */
export interface PermissionRequest {
  type: PermissionType;
  rationale?: string;
  options?: PermissionOptions;
}

/** Settings alert options (Issue #28). */
export interface SettingsAlertOptions {
  permission: PermissionType;
  title?: string;
  message?: string;
  openSettings?: boolean;
}

/** Biometric type (Issue #28). */
export type BiometricType = 'faceId' | 'touchId' | 'fingerprint' | 'iris' | 'none';

/** Status callback (Issue #28). */
export type StatusCallback = (status: PermissionStatus) => void;

/** iOS Info.plist entry (Issue #28). */
export interface IOSInfoPlistEntry {
  key: string;
  value: string;
  description: string;
}

/** Android Manifest entry (Issue #28). */
export interface AndroidManifestEntry {
  permission: string;
  maxSdkVersion?: number;
  description: string;
}

/** Permission types that have real Expo implementation in this helper. */
const IMPLEMENTED_PERMISSIONS: PermissionType[] = [
  'camera',
  'microphone',
  'photoLibrary',
  'location',
  'locationBackground',
  'notifications',
  'calendar',
  'contacts',
  'phone',
];

function isImplemented(p: PermissionType): boolean {
  return IMPLEMENTED_PERMISSIONS.includes(p);
}

const LEGACY_TO_HANDLER: Record<LegacyPermissionType, PermissionType> = {
  camera: 'camera',
  microphone: 'microphone',
  photo_library: 'photoLibrary',
  location: 'location',
  contacts: 'contacts',
  calendar: 'calendar',
  reminders: 'camera',
  notifications: 'notifications',
  bluetooth: 'camera',
  speech_recognition: 'speechRecognition',
  face_id: 'faceId',
  touch_id: 'touchId',
  biometrics: 'biometrics',
};

function toLegacyStatus(s: PermissionStatus): LegacyPermissionStatus {
  const status: LegacyPermissionStatus['status'] =
    s.status === 'blocked' ? 'never_ask_again' : s.status === 'granted' || s.status === 'denied' || s.status === 'limited' || s.status === 'unknown' ? s.status : 'unknown';
  return { granted: s.granted, canAskAgain: s.canAskAgain, status, message: s.message };
}

/** Mock status when native module not available or error. */
function mockStatus(granted = false, canAskAgain = true, limited = false): PermissionStatus {
  const status: PermissionStatus['status'] = granted ? (limited ? 'limited' : 'granted') : canAskAgain ? 'denied' : 'blocked';
  return {
    granted,
    canAskAgain,
    limited,
    status,
    blocked: status === 'blocked',
  };
}

/** Unavailable permission (not implemented or not on platform). */
function unavailableStatus(message?: string): PermissionStatus {
  return {
    granted: false,
    canAskAgain: false,
    status: 'unavailable',
    blocked: false,
    message: message ?? 'Permission not available',
  };
}

/** Map Expo permission response to our PermissionStatus (Issue #28). */
function fromExpoResponse(
  r: { granted: boolean; status?: string; canAskAgain?: boolean; accessPrivileges?: string }
): PermissionStatus {
  const status = (r.status ?? '').toLowerCase();
  const limited = (r as { accessPrivileges?: string }).accessPrivileges === 'limited';
  const canAskAgain = r.canAskAgain ?? true;
  const granted = r.granted || status === 'granted';
  let ourStatus: PermissionStatus['status'] = 'denied';
  if (granted) ourStatus = limited ? 'limited' : 'granted';
  else if (status === 'denied' || status === 'undetermined') ourStatus = canAskAgain ? 'denied' : 'blocked';
  else ourStatus = canAskAgain ? 'denied' : 'blocked';
  return {
    granted,
    canAskAgain,
    limited: limited || ourStatus === 'limited',
    status: ourStatus,
    blocked: ourStatus === 'blocked',
    ...(limited && { ios: { scope: 'limited' } }),
  };
}

/** Load expo-image-picker only when needed (optional peer dependency). */
function getImagePicker(): ReturnType<typeof require> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module
    return require('expo-image-picker');
  } catch {
    return null;
  }
}

/** Load expo-location only when needed (optional peer dependency). */
function getLocation(): ReturnType<typeof require> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module
    return require('expo-location');
  } catch {
    return null;
  }
}

/** Load expo-notifications only when needed (optional peer dependency). */
function getNotifications(): ReturnType<typeof require> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module
    return require('expo-notifications');
  } catch {
    return null;
  }
}

/** Load expo-av for microphone on iOS (optional peer dependency). */
function getAudioRecording(): { getPermissionsAsync: () => Promise<{ granted: boolean; status: string; canAskAgain?: boolean }>; requestPermissionsAsync: () => Promise<{ granted: boolean; status: string; canAskAgain?: boolean }> } | null {
  if (Platform.OS !== 'ios') return null;
  try {
    const av = require('expo-av');
    const Audio = av.Audio ?? av;
    if (Audio?.getPermissionsAsync && Audio?.requestPermissionsAsync) return Audio;
    return null;
  } catch {
    return null;
  }
}

/** Load expo-calendar for calendar on iOS (optional peer dependency). */
function getCalendar(): { getCalendarPermissionsAsync: () => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean }>; requestCalendarPermissionsAsync: () => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean }> } | null {
  if (Platform.OS !== 'ios') return null;
  try {
    return require('expo-calendar');
  } catch {
    return null;
  }
}

/** Load expo-contacts for contacts permission (optional peer dependency). */
function getContacts(): { getPermissionsAsync: () => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean }>; requestPermissionsAsync: () => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean }> } | null {
  try {
    return require('expo-contacts');
  } catch {
    return null;
  }
}

/** Status listeners (Issue #28). */
const statusListeners = new Map<PermissionType, Set<StatusCallback>>();

/** Display names for settings alert. */
const PERMISSION_DISPLAY_NAMES: Record<string, string> = {
  camera: 'Camera',
  microphone: 'Microphone',
  photoLibrary: 'Photo Library',
  location: 'Location',
  locationBackground: 'Location (Background)',
  notifications: 'Notifications',
  contacts: 'Contacts',
  calendar: 'Calendar',
  phone: 'Phone',
  reminders: 'Reminders',
  bluetooth: 'Bluetooth',
  faceId: 'Face ID',
  touchId: 'Touch ID',
  biometrics: 'Biometrics',
};

/**
 * permissionsHandler – unified permission API (Issue #28).
 * Real implementation for camera, photoLibrary, location, locationBackground, notifications, microphone;
 * other types return unavailable until corresponding Expo packages are used.
 */
export const permissionsHandler = {
  async check(permission: PermissionType): Promise<PermissionStatus> {
    if (!isImplemented(permission)) return unavailableStatus(`Permission ${permission} not implemented`);
    if (permission === 'camera') {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.CAMERA as never
          );
          return {
            granted,
            canAskAgain: true,
            status: granted ? 'granted' : 'denied',
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const picker = getImagePicker();
      if (picker?.getCameraPermissionsAsync) {
        try {
          const r = await picker.getCameraPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-image-picker required; run on device');
    }
    if (permission === 'photoLibrary') {
      if (Platform.OS === 'android') {
        try {
          const perm =
            (Platform.Version as number) >= 33
              ? (PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES as string)
              : (PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE as string);
          const granted = await PermissionsAndroid.check(perm);
          return {
            granted,
            canAskAgain: true,
            status: granted ? 'granted' : 'denied',
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const picker = getImagePicker();
      if (picker?.getMediaLibraryPermissionsAsync) {
        try {
          const r = await picker.getMediaLibraryPermissionsAsync(false);
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-image-picker required; run on device');
    }
    if (permission === 'location') {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as never
          );
          return {
            granted,
            canAskAgain: true,
            status: granted ? 'granted' : 'denied',
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const loc = getLocation();
      if (loc?.getForegroundPermissionsAsync) {
        try {
          const r = await loc.getForegroundPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-location required; run on device');
    }
    if (permission === 'locationBackground') {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION as never
          );
          return {
            granted,
            canAskAgain: true,
            status: granted ? 'granted' : 'denied',
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const loc = getLocation();
      if (loc?.getBackgroundPermissionsAsync) {
        try {
          const r = await loc.getBackgroundPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-location required; run on device');
    }
    if (permission === 'notifications') {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS as never
          );
          return {
            granted,
            canAskAgain: true,
            status: granted ? 'granted' : 'denied',
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const notif = getNotifications();
      if (notif?.getPermissionsAsync) {
        try {
          const r = await notif.getPermissionsAsync();
          return fromExpoResponse({
            granted: r.status === 'granted',
            canAskAgain: r.canAskAgain ?? true,
            status: r.status,
          });
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-notifications required; run on device');
    }
    if (permission === 'microphone') {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO as never
          );
          return { granted, canAskAgain: true, status: granted ? 'granted' : 'denied' };
        } catch {
          return mockStatus(false, true);
        }
      }
      const audio = getAudioRecording();
      if (audio?.getPermissionsAsync) {
        try {
          const r = await audio.getPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-av required for microphone on iOS');
    }
    if (permission === 'calendar') {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_CALENDAR as never
          );
          return { granted, canAskAgain: true, status: granted ? 'granted' : 'denied' };
        } catch {
          return mockStatus(false, true);
        }
      }
      const cal = getCalendar();
      if (cal?.getCalendarPermissionsAsync) {
        try {
          const r = await cal.getCalendarPermissionsAsync();
          return fromExpoResponse({
            granted: r.status === 'granted' || (r as { granted?: boolean }).granted === true,
            canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain ?? true,
            status: r.status,
          });
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-calendar required for calendar on iOS');
    }
    if (permission === 'contacts') {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS as never
          );
          return { granted, canAskAgain: true, status: granted ? 'granted' : 'denied' };
        } catch {
          return mockStatus(false, true);
        }
      }
      const contacts = getContacts();
      if (contacts?.getPermissionsAsync) {
        try {
          const r = await contacts.getPermissionsAsync();
          return fromExpoResponse({
            granted: r.status === 'granted' || (r as { granted?: boolean }).granted === true,
            canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain ?? true,
            status: r.status,
          });
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-contacts required for contacts');
    }
    if (permission === 'phone') {
      if (Platform.OS !== 'android') {
        return unavailableStatus('Phone permission is Android only');
      }
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE as never
        );
        return {
          granted,
          canAskAgain: true,
          status: granted ? 'granted' : 'denied',
        };
      } catch {
        return mockStatus(false, true);
      }
    }
    return mockStatus(false, true);
  },

  async request(permission: PermissionType, _options?: PermissionOptions): Promise<PermissionStatus> {
    if (!isImplemented(permission)) return unavailableStatus(`Permission ${permission} not implemented`);
    if (permission === 'camera') {
      if (Platform.OS === 'android') {
        try {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA as never
          );
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const picker = getImagePicker();
      if (picker?.requestCameraPermissionsAsync) {
        try {
          const r = await picker.requestCameraPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-image-picker required; run on device');
    }
    if (permission === 'photoLibrary') {
      if (Platform.OS === 'android') {
        try {
          const perm =
            (Platform.Version as number) >= 33
              ? (PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES as string)
              : (PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE as string);
          const result = await PermissionsAndroid.request(perm);
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const picker = getImagePicker();
      if (picker?.requestMediaLibraryPermissionsAsync) {
        try {
          const r = await picker.requestMediaLibraryPermissionsAsync(false);
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-image-picker required; run on device');
    }
    if (permission === 'location') {
      if (Platform.OS === 'android') {
        try {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
          const fine = result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
          const granted = fine === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = fine !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const loc = getLocation();
      if (loc?.requestForegroundPermissionsAsync) {
        try {
          const r = await loc.requestForegroundPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-location required; run on device');
    }
    if (permission === 'locationBackground') {
      if (Platform.OS === 'android') {
        try {
          const hasForeground = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as never
          );
          if (!hasForeground) {
            const fgResult = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]);
            const fine = fgResult[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
            if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
              return {
                granted: false,
                canAskAgain: fine !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
                status: 'denied',
                blocked: fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
              };
            }
          }
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
          );
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const loc = getLocation();
      if (loc?.requestBackgroundPermissionsAsync) {
        try {
          const r = await loc.requestBackgroundPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-location required; run on device');
    }
    if (permission === 'notifications') {
      if (Platform.OS === 'android') {
        try {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const notif = getNotifications();
      if (notif?.requestPermissionsAsync) {
        try {
          const r = await notif.requestPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true },
          });
          return fromExpoResponse({
            granted: r.status === 'granted',
            canAskAgain: r.canAskAgain ?? true,
            status: r.status,
          });
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-notifications required; run on device');
    }
    if (permission === 'microphone') {
      if (Platform.OS === 'android') {
        try {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const audio = getAudioRecording();
      if (audio?.requestPermissionsAsync) {
        try {
          const r = await audio.requestPermissionsAsync();
          return fromExpoResponse(r);
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-av required for microphone on iOS');
    }
    if (permission === 'calendar') {
      if (Platform.OS === 'android') {
        try {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
            PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
          ]);
          const read = result[PermissionsAndroid.PERMISSIONS.READ_CALENDAR];
          const granted = read === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = read !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const cal = getCalendar();
      if (cal?.requestCalendarPermissionsAsync) {
        try {
          const r = await cal.requestCalendarPermissionsAsync();
          return fromExpoResponse({
            granted: r.status === 'granted' || (r as { granted?: boolean }).granted === true,
            canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain ?? true,
            status: r.status,
          });
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-calendar required for calendar on iOS');
    }
    if (permission === 'contacts') {
      if (Platform.OS === 'android') {
        try {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          ]);
          const read = result[PermissionsAndroid.PERMISSIONS.READ_CONTACTS];
          const granted = read === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = read !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch {
          return mockStatus(false, true);
        }
      }
      const contacts = getContacts();
      if (contacts?.requestPermissionsAsync) {
        try {
          const r = await contacts.requestPermissionsAsync();
          return fromExpoResponse({
            granted: r.status === 'granted' || (r as { granted?: boolean }).granted === true,
            canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain ?? true,
            status: r.status,
          });
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-contacts required for contacts');
    }
    if (permission === 'phone') {
      if (Platform.OS !== 'android') {
        return unavailableStatus('Phone permission is Android only');
      }
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE as never
        );
        const granted = result === PermissionsAndroid.RESULTS.GRANTED;
        const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
        return {
          granted,
          canAskAgain,
          status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
          blocked: !canAskAgain,
        };
      } catch {
        return mockStatus(false, true);
      }
    }
    return mockStatus(false, true);
  },

  async requestMultiple(requests: PermissionRequest[]): Promise<Record<string, PermissionStatus>> {
    const result: Record<string, PermissionStatus> = {};
    for (const { type, options } of requests) {
      result[type] = await this.request(type, options);
    }
    return result;
  },

  async checkMultiple(permissions: PermissionType[]): Promise<Record<string, PermissionStatus>> {
    const result: Record<string, PermissionStatus> = {};
    for (const p of permissions) {
      result[p] = await this.check(p);
    }
    return result;
  },

  areAllGranted(permissions: Record<string, PermissionStatus>): boolean {
    return Object.values(permissions).every((s) => s.granted);
  },

  getDenied(permissions: Record<string, PermissionStatus>): PermissionType[] {
    return Object.entries(permissions)
      .filter(([, s]) => !s.granted)
      .map(([p]) => p as PermissionType);
  },

  isAvailable(permission: PermissionType): boolean {
    if (Platform.OS === 'web') return false;
    return isImplemented(permission);
  },

  showSettingsAlert(options: SettingsAlertOptions | PermissionType): void {
    const opts = typeof options === 'string' ? { permission: options, openSettings: true } : options;
    const name = PERMISSION_DISPLAY_NAMES[opts.permission] ?? opts.permission;
    const title = opts.title ?? `${name} Permission`;
    const message = opts.message ?? `To use this feature, please enable ${name} in your device settings.`;
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => (opts.openSettings !== false ? openAppSettings() : undefined),
      },
    ]);
  },

  addStatusListener(permission: PermissionType, callback: StatusCallback): () => void {
    if (!statusListeners.has(permission)) statusListeners.set(permission, new Set());
    statusListeners.get(permission)!.add(callback);
    return () => statusListeners.get(permission)?.delete(callback);
  },

  removeStatusListener(permission: PermissionType, callback: StatusCallback): void {
    statusListeners.get(permission)?.delete(callback);
  },

  async requestCamera(options?: CameraPermissionOptions): Promise<PermissionStatus> {
    const status = await this.request('camera', options);
    if (status.granted && options?.includePhotoLibrary) {
      const lib = await this.request('photoLibrary', options);
      if (!lib.granted) return status;
    }
    return status;
  },

  async requestMicrophone(options?: PermissionOptions): Promise<PermissionStatus> {
    return this.request('microphone', options);
  },

  async requestPhotoLibrary(options?: PhotoLibraryOptions): Promise<PermissionStatus> {
    return this.request('photoLibrary', options);
  },

  async requestLocation(options?: LocationPermissionOptions): Promise<PermissionStatus> {
    const status = await this.request('location', options);
    if (status.granted && options?.background) return this.request('locationBackground', options);
    return status;
  },

  async requestLocationBackground(options?: PermissionOptions): Promise<PermissionStatus> {
    return this.request('locationBackground', options);
  },

  async requestNotifications(options?: NotificationPermissionOptions): Promise<PermissionStatus> {
    return this.request('notifications');
  },

  async requestContacts(options?: PermissionOptions): Promise<PermissionStatus> {
    return this.request('contacts', options);
  },
  async requestCalendar(options?: PermissionOptions): Promise<PermissionStatus> {
    return this.request('calendar', options);
  },
  async requestReminders(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Reminders not implemented');
  },
  async requestBluetooth(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Bluetooth not implemented');
  },
  async requestSpeechRecognition(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Speech recognition not implemented');
  },
  async requestBiometrics(_options?: { reason: string; fallbackTitle?: string }): Promise<PermissionStatus> {
    return unavailableStatus('Install expo-local-authentication for biometrics');
  },
  async requestMotionFitness(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Motion & fitness not implemented');
  },
  async requestHealth(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Health not implemented');
  },
  async requestMediaLibrary(options?: PermissionOptions): Promise<PermissionStatus> {
    return this.requestPhotoLibrary(options as PhotoLibraryOptions);
  },
  async requestTracking(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Tracking not implemented');
  },
  async requestStorage(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Storage: platform-specific implementation required');
  },
  async requestPhone(options?: PermissionOptions): Promise<PermissionStatus> {
    return this.request('phone', options);
  },
  async requestSMS(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('SMS permission not implemented');
  },

  async isBiometricsAvailable(): Promise<boolean> {
    return false;
  },

  async getBiometricType(): Promise<BiometricType> {
    return 'none';
  },

  openSettings(): Promise<void> {
    return openAppSettings();
  },

  /** Location permission details: foreground, background, precise (Android 12+). */
  async getLocationPermissionInfo(): Promise<{
    foreground: 'granted' | 'denied' | 'unavailable';
    background: 'granted' | 'denied' | 'unavailable';
    precise: boolean;
  }> {
    if (Platform.OS === 'android') {
      try {
        const fine = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as never
        );
        const coarse = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION as never
        );
        const bg = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION as never
        );
        const foregroundGranted = fine || coarse;
        return {
          foreground: foregroundGranted ? 'granted' : 'denied',
          background: bg ? 'granted' : 'denied',
          precise: fine,
        };
      } catch {
        return { foreground: 'unavailable', background: 'unavailable', precise: false };
      }
    }
    const loc = getLocation();
    if (loc?.getForegroundPermissionsAsync && loc?.getBackgroundPermissionsAsync) {
      try {
        const [fg, bg] = await Promise.all([
          loc.getForegroundPermissionsAsync(),
          loc.getBackgroundPermissionsAsync(),
        ]);
        const fgGranted = (fg as { status?: string }).status === 'granted';
        const bgGranted = (bg as { status?: string }).status === 'granted';
        return {
          foreground: fgGranted ? 'granted' : 'denied',
          background: bgGranted ? 'granted' : 'denied',
          precise: fgGranted,
        };
      } catch {
        return { foreground: 'unavailable', background: 'unavailable', precise: false };
      }
    }
    return { foreground: 'unavailable', background: 'unavailable', precise: false };
  },

  getIOSInfoPlistEntries(permissions: PermissionType[]): IOSInfoPlistEntry[] {
    const entries: IOSInfoPlistEntry[] = [];
    const add = (key: string, value: string, description: string) => {
      if (!entries.some((e) => e.key === key)) entries.push({ key, value, description });
    };
    if (permissions.includes('camera')) add('NSCameraUsageDescription', 'We need camera access to take photos and videos.', 'Camera');
    if (permissions.includes('microphone')) add('NSMicrophoneUsageDescription', 'We need microphone access to record audio.', 'Microphone');
    if (permissions.includes('photoLibrary') || permissions.includes('mediaLibrary')) {
      add('NSPhotoLibraryUsageDescription', 'We need photo library access to save and select images.', 'Photo Library');
      add('NSPhotoLibraryAddUsageDescription', 'We need permission to save photos to your library.', 'Photo Library Add');
    }
    if (permissions.includes('location') || permissions.includes('locationWhenInUse') || permissions.includes('locationBackground')) {
      add('NSLocationWhenInUseUsageDescription', 'We need your location to show nearby places.', 'Location When In Use');
      add('NSLocationAlwaysAndWhenInUseUsageDescription', 'We need your location to track your route.', 'Location Always');
      add('NSLocationAlwaysUsageDescription', 'We need background location to track your route.', 'Location Background');
    }
    if (permissions.includes('contacts')) add('NSContactsUsageDescription', 'We need contacts access to help you share content.', 'Contacts');
    if (permissions.includes('calendar')) add('NSCalendarsUsageDescription', 'We need calendar access to schedule events.', 'Calendar');
    if (permissions.includes('reminders')) add('NSRemindersUsageDescription', 'We need reminders access to create reminders.', 'Reminders');
    if (permissions.includes('motionFitness')) add('NSMotionUsageDescription', 'We need motion access to track your activity.', 'Motion & Fitness');
    if (permissions.includes('faceId') || permissions.includes('touchId') || permissions.includes('biometrics')) add('NSFaceIDUsageDescription', 'We need Face ID to authenticate securely.', 'Face ID');
    if (permissions.includes('speechRecognition')) add('NSSpeechRecognitionUsageDescription', 'We need speech recognition to convert speech to text.', 'Speech Recognition');
    if (permissions.includes('tracking')) add('NSUserTrackingUsageDescription', 'We use tracking to provide personalized content.', 'Tracking');
    return entries;
  },

  getAndroidManifestEntries(permissions: PermissionType[]): AndroidManifestEntry[] {
    const entries: AndroidManifestEntry[] = [];
    const add = (permission: string, description: string, maxSdkVersion?: number) => {
      if (!entries.some((e) => e.permission === permission)) entries.push({ permission, description, maxSdkVersion });
    };
    if (permissions.includes('camera')) add('android.permission.CAMERA', 'Camera');
    if (permissions.includes('microphone')) add('android.permission.RECORD_AUDIO', 'Microphone');
    if (permissions.includes('photoLibrary') || permissions.includes('storageRead')) {
      add('android.permission.READ_EXTERNAL_STORAGE', 'Read storage (legacy)', 32);
      add('android.permission.READ_MEDIA_IMAGES', 'Read media images');
    }
    if (permissions.includes('location') || permissions.includes('locationWhenInUse')) {
      add('android.permission.ACCESS_FINE_LOCATION', 'Fine location');
      add('android.permission.ACCESS_COARSE_LOCATION', 'Coarse location');
    }
    if (permissions.includes('locationBackground')) add('android.permission.ACCESS_BACKGROUND_LOCATION', 'Background location');
    if (permissions.includes('notifications')) add('android.permission.POST_NOTIFICATIONS', 'Notifications (API 33+)');
    if (permissions.includes('contacts')) {
      add('android.permission.READ_CONTACTS', 'Read contacts');
      add('android.permission.WRITE_CONTACTS', 'Write contacts');
    }
    if (permissions.includes('calendar')) {
      add('android.permission.READ_CALENDAR', 'Read calendar');
      add('android.permission.WRITE_CALENDAR', 'Write calendar');
    }
    if (permissions.includes('bluetooth') || permissions.includes('bluetoothScan')) add('android.permission.BLUETOOTH_SCAN', 'Bluetooth scan');
    if (permissions.includes('bluetooth') || permissions.includes('bluetoothConnect')) add('android.permission.BLUETOOTH_CONNECT', 'Bluetooth connect');
    if (permissions.includes('phone') || permissions.includes('readPhoneState')) add('android.permission.READ_PHONE_STATE', 'Read phone state');
    if (permissions.includes('callPhone')) add('android.permission.CALL_PHONE', 'Call phone');
    if (permissions.includes('sendSms')) add('android.permission.SEND_SMS', 'Send SMS');
    if (permissions.includes('receiveSms')) add('android.permission.RECEIVE_SMS', 'Receive SMS');
    if (permissions.includes('readSms')) add('android.permission.READ_SMS', 'Read SMS');
    return entries;
  },
};

/**
 * Request permission with user-friendly messaging (legacy API).
 */
export async function requestPermission(
  permission: LegacyPermissionType,
  options?: {
    title?: string;
    message?: string;
    showSettingsAlert?: boolean;
  }
): Promise<LegacyPermissionStatus> {
  const { showSettingsAlert = true } = options || {};
  try {
    const handlerType = LEGACY_TO_HANDLER[permission];
    const result = await permissionsHandler.request(handlerType, { ...options, showSettingsAlert });
    const legacy = toLegacyStatus(result);
    if (!legacy.granted && !legacy.canAskAgain && showSettingsAlert) {
      showPermissionSettingsAlert(permission);
    }
    return legacy;
  } catch (error) {
    return {
      granted: false,
      canAskAgain: false,
      status: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if permission is granted (legacy API).
 */
export async function checkPermission(permission: LegacyPermissionType): Promise<LegacyPermissionStatus> {
  try {
    const handlerType = LEGACY_TO_HANDLER[permission];
    const result = await permissionsHandler.check(handlerType);
    return toLegacyStatus(result);
  } catch (error) {
    return {
      granted: false,
      canAskAgain: false,
      status: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Show alert to guide user to settings (legacy API).
 */
export function showPermissionSettingsAlert(permission: LegacyPermissionType) {
  const permissionNames: Record<LegacyPermissionType, string> = {
    camera: 'Camera',
    microphone: 'Microphone',
    photo_library: 'Photo Library',
    location: 'Location',
    contacts: 'Contacts',
    calendar: 'Calendar',
    reminders: 'Reminders',
    notifications: 'Notifications',
    bluetooth: 'Bluetooth',
    speech_recognition: 'Speech Recognition',
    face_id: 'Face ID',
    touch_id: 'Touch ID',
    biometrics: 'Biometrics',
  };

  const permissionName = permissionNames[permission] || permission;

  Alert.alert(
    `${permissionName} Permission`,
    `To use this feature, please enable ${permissionName} permission in your device settings.`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => openAppSettings(),
      },
    ]
  );
}

/**
 * Open app settings
 */
export async function openAppSettings() {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('Failed to open settings:', error);
  }
}

/**
 * Check multiple permissions at once (legacy API).
 */
export async function checkMultiplePermissions(
  permissions: LegacyPermissionType[]
): Promise<Record<LegacyPermissionType, LegacyPermissionStatus>> {
  const results = {} as Record<LegacyPermissionType, LegacyPermissionStatus>;
  for (const permission of permissions) {
    results[permission] = await checkPermission(permission);
  }
  return results;
}

/**
 * Request multiple permissions at once (legacy API).
 */
export async function requestMultiplePermissions(
  permissions: LegacyPermissionType[],
  options?: { showSettingsAlert?: boolean }
): Promise<Record<LegacyPermissionType, LegacyPermissionStatus>> {
  const results = {} as Record<LegacyPermissionType, LegacyPermissionStatus>;
  for (const permission of permissions) {
    results[permission] = await requestPermission(permission, options);
  }
  return results;
}

/**
 * Get permission rationale message (legacy API).
 */
export function getPermissionRationale(permission: LegacyPermissionType): string {
  const rationales: Record<LegacyPermissionType, string> = {
    camera: 'This app needs camera access to take photos and videos.',
    microphone: 'This app needs microphone access to record audio.',
    photo_library: 'This app needs photo library access to select and save images.',
    location: 'This app needs location access to provide location-based features.',
    contacts: 'This app needs contacts access to help you share content with friends.',
    calendar: 'This app needs calendar access to schedule events and reminders.',
    reminders: 'This app needs reminders access to create and manage your reminders.',
    notifications: 'This app needs notification access to send you important updates.',
    bluetooth: 'This app needs bluetooth access to connect to nearby devices.',
    speech_recognition: 'This app needs speech recognition access to convert speech to text.',
    face_id: 'This app needs Face ID access to authenticate securely.',
    touch_id: 'This app needs Touch ID access to authenticate securely.',
    biometrics: 'This app needs biometric access to authenticate securely.',
  };
  return rationales[permission] || 'This app needs this permission to function properly.';
}

/**
 * Check if all permissions are granted (legacy API).
 */
export function areAllPermissionsGranted(permissions: Record<LegacyPermissionType, LegacyPermissionStatus>): boolean {
  return Object.values(permissions).every((p) => p.granted);
}

/**
 * Get list of denied permissions (legacy API).
 */
export function getDeniedPermissions(permissions: Record<LegacyPermissionType, LegacyPermissionStatus>): LegacyPermissionType[] {
  return Object.entries(permissions)
    .filter(([, status]) => !status.granted)
    .map(([permission]) => permission as LegacyPermissionType);
}

/**
 * Permission helper hook for React components (legacy API).
 */
export function usePermissions() {
  return {
    requestPermission: (permission: LegacyPermissionType, options?: Parameters<typeof requestPermission>[1]) =>
      requestPermission(permission, options),
    checkPermission: (permission: LegacyPermissionType) => checkPermission(permission),
    checkMultiplePermissions: (permissions: LegacyPermissionType[]) => checkMultiplePermissions(permissions),
    requestMultiplePermissions: (permissions: LegacyPermissionType[], options?: Parameters<typeof requestMultiplePermissions>[1]) =>
      requestMultiplePermissions(permissions, options),
    getPermissionRationale,
    showPermissionSettingsAlert,
    openAppSettings,
  };
}
