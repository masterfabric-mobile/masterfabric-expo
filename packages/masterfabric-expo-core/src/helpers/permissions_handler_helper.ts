/**
 * Permissions Handler Helper
 *
 * Unified permission API following existing helper patterns (e.g. string_helper, toast_helper).
 * Uses Expo permission modules where available; falls back to React Native PermissionsAndroid
 * on Android. For permissions not covered by Expo (e.g. Bluetooth, SMS), you can integrate
 * `react-native-permissions` and extend the handler to delegate to it.
 *
 * **Strategy / Dependencies**
 * - expo-camera (camera; fallback expo-image-picker), expo-location (location), expo-image-picker (photo library fallback),
 *   expo-media-library (media library; fallback expo-image-picker), expo-notifications (notifications), expo-contacts (contacts),
 *   expo-calendar (calendar), expo-av (microphone iOS), expo-local-authentication (biometrics).
 * - Android: PermissionsAndroid for camera, storage, location, notifications, contacts, calendar, phone.
 * - For permissions outside Expo scope, the app can use react-native-permissions (fallback).
 *
 * **Edge cases**
 * - Missing permission / not on platform: returns `status: 'unavailable'` with a message.
 * - Platform-specific: e.g. phone is Android-only; background location may require foreground first.
 * - Blocked (user chose "Don't ask again"): `canAskAgain === false`, `status === 'blocked'`;
 *   use `showPermissionSettingsAlert` or `openAppSettings()` to guide the user.
 * - iOS limited photo library (iOS 14+): `status === 'limited'`, `ios.scope === 'limited'`; handle in UI.
 * - iOS background location: request foreground/always first, then locationBackground; see requestLocation( { background: true } ).
 * - iOS tracking (14.5+): requires App Tracking Transparency and NSUserTrackingUsageDescription; some permissions need Xcode capabilities (e.g. Push Notifications, Background Modes).
 *
 * **Integration with other helpers**
 * - logger_helper: Logs permission check/request and errors when `setLoggerService()` is set.
 * - toast_helper: Shows permission status messages (granted/denied/blocked) when `setToastService()` is set (e.g. after legacy requestPermission).
 * - snackbar_helper: Shows permission alerts and "Open Settings" actionable warnings (e.g. when blocked or in showPermissionSettingsAlert).
 *
 * **TypeScript**: All types (PermissionType, PermissionStatus, options) are in `./permissions/types`.
 * **Exports**: Use `import { permissionsHandler, checkPermission, requestPermission } from 'masterfabric-expo-core'`
 * or from `./permissions` index.
 *
 * @example
 * // Check before use
 * const status = await permissionsHandler.check('camera');
 * if (status.granted) startCamera();
 * else if (status.canAskAgain) await permissionsHandler.request('camera', { rationale: '...' });
 * else showPermissionSettingsAlert('camera');
 *
 * @example
 * // Request with options
 * const result = await permissionsHandler.requestCamera({ includePhotoLibrary: true });
 * const loc = await permissionsHandler.requestLocation({ accuracy: 'high', background: true });
 *
 * @example
 * // Legacy API (snake_case permission names)
 * const legacy = await requestPermission('photo_library', { message: 'Select photos', showSettingsAlert: true });
 */
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import type {
  AndroidManifestEntry,
  BiometricPermissionOptions,
  BiometricType,
  CameraPermissionOptions,
  LegacyPermissionStatus,
  LegacyPermissionType,
  LocationPermissionOptions,
  NotificationPermissionOptions,
  PermissionOptions,
  PermissionRequest,
  PermissionStatus,
  PermissionType,
  PhotoLibraryOptions,
  SettingsAlertOptions,
  StatusCallback,
  StoragePermissionOptions,
} from './permissions/types';
import type { IOSInfoPlistEntry } from './permissions/types';
import { getCanonicalPermission, isImplemented, LEGACY_TO_HANDLER } from './permissions/constants';
import { getIOSInfoPlistEntries as getIOSInfoPlistEntriesFromConfig } from './permissions/ios-config';
import { getAndroidManifestEntries as getAndroidManifestEntriesFromConfig } from './permissions/android-config';
import { getLoggerService } from './logger_helper';
import { getToastService } from './toast_helper';
import { snackbarHelper } from './snackbar_helper';

/** Log permission action only when logger service is set (no throw). */
function logPermission(
  level: 'info' | 'debug' | 'warning' | 'error',
  message: string,
  meta?: Record<string, unknown>
): void {
  try {
    const logger = getLoggerService();
    if (logger) logger[level](message, meta ?? {});
  } catch {
    // ignore
  }
}

/** Show permission status toast when toast service is set (no throw). */
function toastPermissionStatus(permission: string, status: PermissionStatus['status'], displayName?: string): void {
  try {
    const toast = getToastService();
    if (!toast) return;
    const name = displayName ?? permission;
    if (status === 'granted') toast.show({ message: `${name}: Granted`, type: 'success', duration: 3000 });
    else if (status === 'denied') toast.show({ message: `${name}: Denied`, type: 'warning', duration: 3500 });
    else if (status === 'blocked') toast.show({ message: `${name}: Blocked — open Settings`, type: 'error', duration: 4000 });
    else if (status === 'unavailable') toast.show({ message: `${name}: Unavailable`, type: 'info', duration: 3000 });
    else if (status === 'limited') toast.show({ message: `${name}: Limited access`, type: 'info', duration: 3000 });
  } catch {
    // ignore
  }
}

/** Show snackbar for permission alert/warning; use for actionable messages (e.g. Open Settings). */
function snackbarPermissionAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'warning', action?: { label: string; onPress: () => void }): void {
  try {
    snackbarHelper.show({ message, type, duration: action ? 5000 : 4000, action: action ? { label: action.label, onPress: action.onPress } : undefined });
  } catch {
    // ignore
  }
}

/** Android 13+ media permission constants; fallback strings for older React Native where PERMISSIONS may not define them. */
const ANDROID_READ_MEDIA_IMAGES = (PermissionsAndroid.PERMISSIONS as Record<string, string>).READ_MEDIA_IMAGES ?? 'android.permission.READ_MEDIA_IMAGES';
const ANDROID_READ_MEDIA_VIDEO = (PermissionsAndroid.PERMISSIONS as Record<string, string>).READ_MEDIA_VIDEO ?? 'android.permission.READ_MEDIA_VIDEO';

/** Return actual photo library permission status on Android (PermissionsAndroid.check). Use after request to avoid showing "granted" when system says denied. */
async function getAndroidPhotoLibraryStatus(): Promise<PermissionStatus> {
  const apiLevel = typeof Platform.Version === 'string' ? parseInt(String(Platform.Version), 10) : (Platform.Version as number);
  if (apiLevel >= 33) {
    try {
      const [images, video] = await Promise.all([
        PermissionsAndroid.check(ANDROID_READ_MEDIA_IMAGES as never),
        PermissionsAndroid.check(ANDROID_READ_MEDIA_VIDEO as never),
      ]);
      const granted = images || video;
      return {
        granted,
        canAskAgain: true,
        status: granted ? 'granted' : 'denied',
        blocked: false,
      };
    } catch {
      return mockStatus(false, true);
    }
  }
  try {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE as never);
    return {
      granted,
      canAskAgain: true,
      status: granted ? 'granted' : 'denied',
      blocked: false,
    };
  } catch {
    return mockStatus(false, true);
  }
}

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

/**
 * Map expo-image-picker MediaLibraryPermissionResponse.
 * Only treat as granted when accessPrivileges is explicitly 'all' or 'limited'.
 * When accessPrivileges is 'none' or undefined (e.g. Android 13+ or bad response), treat as denied
 * so Settings "Don't allow" is never shown as granted.
 */
function fromMediaLibraryResponse(
  r: { granted: boolean; status?: string; canAskAgain?: boolean; accessPrivileges?: 'all' | 'limited' | 'none' }
): PermissionStatus {
  const accessPrivileges = r.accessPrivileges;
  const limited = accessPrivileges === 'limited';
  const granted = accessPrivileges === 'all' || accessPrivileges === 'limited';
  const canAskAgain = r.canAskAgain ?? true;
  const status = (r.status ?? '').toLowerCase();
  let ourStatus: PermissionStatus['status'] = 'denied';
  if (granted) ourStatus = limited ? 'limited' : 'granted';
  else if (status === 'denied' || status === 'undetermined' || accessPrivileges === 'none' || accessPrivileges == null)
    ourStatus = canAskAgain ? 'denied' : 'blocked';
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

/** Load expo-camera for camera permissions (optional peer dependency). Prefer over expo-image-picker when available. */
function getCamera(): { getCameraPermissionsAsync: () => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean }>; requestCameraPermissionsAsync: () => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean }> } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module
    const cam = require('expo-camera');
    const Camera = cam.Camera ?? cam.default ?? cam;
    if (Camera?.getCameraPermissionsAsync && Camera?.requestCameraPermissionsAsync) return Camera;
    return null;
  } catch {
    return null;
  }
}

/** Load expo-image-picker for camera/photo library when expo-camera or expo-media-library not used (optional peer dependency). */
function getImagePicker(): ReturnType<typeof require> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module
    return require('expo-image-picker');
  } catch {
    return null;
  }
}

/** Load expo-media-library for media/photo library permissions (optional peer dependency). Prefer over expo-image-picker when available. */
function getMediaLibrary(): { getPermissionsAsync: (writeOnly?: boolean) => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean; accessPrivileges?: string }>; requestPermissionsAsync: (writeOnly?: boolean) => Promise<{ status: string; granted?: boolean; canAskAgain?: boolean; accessPrivileges?: string }> } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module
    const lib = require('expo-media-library');
    const MediaLibrary = lib.MediaLibrary ?? lib.default ?? lib;
    if (MediaLibrary?.getPermissionsAsync && MediaLibrary?.requestPermissionsAsync) return MediaLibrary;
    return null;
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
  photoLibrary: 'Photos and Videos',
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
 * Unified permission API. Use Expo modules where available; Android uses PermissionsAndroid.
 * Implemented: camera, photoLibrary, location, locationBackground, notifications, microphone,
 * contacts, calendar, phone (Android). Others return `status: 'unavailable'` until implemented
 * or until you delegate to e.g. react-native-permissions.
 *
 * @example
 * const status = await permissionsHandler.check('location');
 * switch (status.status) {
 *   case 'granted': useLocation(); break;
 *   case 'denied': await permissionsHandler.request('location', { rationale: '...' }); break;
 *   case 'blocked': showPermissionSettingsAlert('location'); break;
 *   case 'unavailable': showUnsupportedMessage(); break;
 * }
 */
export const permissionsHandler = {
  /**
   * Check current permission status without prompting. Prefer this before requesting.
   * @param permission - Canonical or alias type (e.g. 'locationWhenInUse' → 'location')
   * @returns PermissionStatus (granted | denied | blocked | limited | unavailable | unknown)
   */
  async check(permission: PermissionType): Promise<PermissionStatus> {
    const effective = getCanonicalPermission(permission);
    logPermission('debug', 'Permission check', { permission: effective });
    if (effective === 'camera') {
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
      const camera = getCamera();
      if (camera?.getCameraPermissionsAsync) {
        try {
          const r = await camera.getCameraPermissionsAsync();
          return fromExpoResponse({ granted: r.status === 'granted', status: r.status, canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain });
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
      return unavailableStatus('expo-camera or expo-image-picker required; run on device');
    }
    if (effective === 'photoLibrary') {
      if (Platform.OS === 'android') {
        try {
          if ((Platform.Version as number) >= 33) {
            const [images, video] = await Promise.all([
              PermissionsAndroid.check(ANDROID_READ_MEDIA_IMAGES as never),
              PermissionsAndroid.check(ANDROID_READ_MEDIA_VIDEO as never),
            ]);
            const granted = images || video;
            return {
              granted,
              canAskAgain: true,
              status: granted ? 'granted' : 'denied',
              blocked: false,
            };
          }
          const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE as never
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
      const mediaLib = getMediaLibrary();
      if (mediaLib?.getPermissionsAsync) {
        try {
          const r = await mediaLib.getPermissionsAsync();
          const granted = (r as { granted?: boolean }).granted ?? r.status === 'granted';
          const accessPrivileges = (r as { accessPrivileges?: string }).accessPrivileges;
          const limited = accessPrivileges === 'limited';
          return fromMediaLibraryResponse({ granted: granted || limited, status: r.status, canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain ?? true, accessPrivileges: limited ? 'limited' : granted ? 'all' : 'none' });
        } catch {
          return mockStatus(false, true);
        }
      }
      const picker = getImagePicker();
      if (picker?.getMediaLibraryPermissionsAsync) {
        try {
          const r = await picker.getMediaLibraryPermissionsAsync(false);
          return fromMediaLibraryResponse(r as { granted: boolean; status?: string; canAskAgain?: boolean; accessPrivileges?: 'all' | 'limited' | 'none' });
        } catch {
          return mockStatus(false, true);
        }
      }
      return unavailableStatus('expo-media-library or expo-image-picker required; run on device');
    }
    if (effective === 'location') {
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
    if (effective === 'locationBackground') {
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
    if (effective === 'notifications') {
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
    if (effective === 'microphone') {
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
    if (effective === 'calendar') {
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
    if (effective === 'contacts') {
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
    if (effective === 'phone') {
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
    return unavailableStatus(`Permission ${permission} not implemented`);
  },

  /**
   * Request permission; may show system dialog. Use options.rationale (and on Android title/message)
   * for user-facing explanation. On blocked (canAskAgain === false), consider showing settings alert.
   * @param permission - Permission type (alias resolved to canonical)
   * @param _options - Optional rationale, title, message, showSettingsAlert, onDenied, onBlocked
   * @returns PermissionStatus after the request
   */
  async request(permission: PermissionType, _options?: PermissionOptions): Promise<PermissionStatus> {
    const effective = getCanonicalPermission(permission);
    logPermission('info', 'Permission request', { permission: effective });
    if (effective === 'camera') {
      if (Platform.OS === 'android') {
        try {
          const rationale = {
            title: _options?.title ?? 'Camera',
            message: _options?.rationale ?? 'This app needs camera access to take photos and videos.',
            buttonPositive: 'OK',
          };
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA as never,
            rationale
          );
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          return {
            granted,
            canAskAgain,
            status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
            blocked: !canAskAgain,
          };
        } catch (e) {
          logPermission('warning', 'Camera permission request failed', { error: e });
          return mockStatus(false, true);
        }
      }
      const camera = getCamera();
      if (camera?.requestCameraPermissionsAsync) {
        try {
          const r = await camera.requestCameraPermissionsAsync();
          return fromExpoResponse({ granted: r.status === 'granted', status: r.status, canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain });
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
      return unavailableStatus('expo-camera or expo-image-picker required; run on device');
    }
    if (effective === 'photoLibrary') {
      const mediaLib = getMediaLibrary();
      const picker = getImagePicker();
      if (Platform.OS === 'android' && (mediaLib?.requestPermissionsAsync ?? picker?.requestMediaLibraryPermissionsAsync)) {
        try {
          if (mediaLib?.requestPermissionsAsync) {
            await mediaLib.requestPermissionsAsync();
          } else if (picker?.requestMediaLibraryPermissionsAsync) {
            await picker.requestMediaLibraryPermissionsAsync(false);
          }
          return await getAndroidPhotoLibraryStatus();
        } catch (e) {
          logPermission('warning', 'Photo library (Expo) request failed, falling back to PermissionsAndroid', { error: e });
        }
      }
      if (Platform.OS === 'android') {
        try {
          const rationale = {
            title: _options?.title ?? 'Photos and Videos',
            message: _options?.rationale ?? 'This app needs access to your photos and videos to select or save media.',
            buttonPositive: 'OK',
          };
          const apiLevel = typeof Platform.Version === 'string' ? parseInt(String(Platform.Version), 10) : (Platform.Version as number);
          let canAskAgain = true;
          if (apiLevel >= 33) {
            const r1 = await PermissionsAndroid.request(ANDROID_READ_MEDIA_IMAGES as never, rationale);
            const r2 = await PermissionsAndroid.request(ANDROID_READ_MEDIA_VIDEO as never, rationale);
            canAskAgain =
              r1 !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN &&
              r2 !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          } else {
            const result = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE as never,
              rationale
            );
            canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          }
          const verified = await getAndroidPhotoLibraryStatus();
          return {
            ...verified,
            canAskAgain,
            blocked: !canAskAgain,
            status: verified.granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
          };
        } catch (e) {
          logPermission('warning', 'Photo library permission request failed', { error: e });
          throw e;
        }
      }
      if (mediaLib?.requestPermissionsAsync) {
        try {
          const r = await mediaLib.requestPermissionsAsync();
          const granted = (r as { granted?: boolean }).granted ?? r.status === 'granted';
          const accessPrivileges = (r as { accessPrivileges?: string }).accessPrivileges;
          const limited = accessPrivileges === 'limited';
          return fromMediaLibraryResponse({ granted: granted || limited, status: r.status, canAskAgain: (r as { canAskAgain?: boolean }).canAskAgain ?? true, accessPrivileges: limited ? 'limited' : granted ? 'all' : 'none' });
        } catch (e) {
          throw e;
        }
      }
      if (picker?.requestMediaLibraryPermissionsAsync) {
        try {
          const r = await picker.requestMediaLibraryPermissionsAsync(false);
          return fromMediaLibraryResponse(r as { granted: boolean; status?: string; canAskAgain?: boolean; accessPrivileges?: 'all' | 'limited' | 'none' });
        } catch (e) {
          throw e;
        }
      }
      return unavailableStatus('expo-media-library or expo-image-picker required; run on device');
    }
    if (effective === 'location') {
      if (Platform.OS === 'android') {
        try {
          const rationale =
            _options?.rationale != null
              ? {
                  title: _options.title ?? 'Location',
                  message: _options.rationale,
                  buttonPositive: 'OK',
                }
              : undefined;
          const fineResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as never,
            rationale
          );
          const granted = fineResult === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = fineResult !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          if (granted) {
            PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]).catch(() => {});
          }
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
    if (effective === 'locationBackground') {
      if (Platform.OS === 'android') {
        try {
          let hasForeground = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as never
          );
          if (!hasForeground) {
            const rationale =
              _options?.rationale != null
                ? {
                    title: _options.title ?? 'Location',
                    message: _options.rationale,
                    buttonPositive: 'OK',
                  }
                : undefined;
            const fineResult = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION as never,
              rationale
            );
            hasForeground = fineResult === PermissionsAndroid.RESULTS.GRANTED;
            if (!hasForeground) {
              return {
                granted: false,
                canAskAgain: fineResult !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
                status: 'denied',
                blocked: fineResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
              };
            }
            PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ]).catch(() => {});
          }
          const bgRationale =
            _options?.rationale != null
              ? {
                  title: _options.title ?? 'Background location',
                  message: _options.rationale,
                  buttonPositive: 'OK',
                }
              : undefined;
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            bgRationale
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
    if (effective === 'notifications') {
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
          const opts = _options as NotificationPermissionOptions | undefined;
          const r = await notif.requestPermissionsAsync({
            ios: {
              allowAlert: opts?.alert ?? true,
              allowBadge: opts?.badge ?? true,
              allowSound: opts?.sound ?? true,
            },
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
    if (effective === 'microphone') {
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
    if (effective === 'calendar') {
      if (Platform.OS === 'android') {
        try {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
            PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
          ]);
          const readKey = PermissionsAndroid.PERMISSIONS.READ_CALENDAR;
          const read = result[readKey];
          let granted = read === PermissionsAndroid.RESULTS.GRANTED;
          const canAskAgain = read !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          if (!granted) {
            const actual = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.READ_CALENDAR as never
            );
            if (actual) granted = true;
          }
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
    if (effective === 'contacts') {
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
    if (effective === 'phone') {
      if (Platform.OS !== 'android') {
        return unavailableStatus('Phone permission is Android only');
      }
      try {
        const rationale = {
          title: _options?.title ?? 'Phone',
          message: _options?.rationale ?? 'This app needs phone access to identify your device.',
          buttonPositive: 'OK',
        };
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE as never,
          rationale
        );
        const granted = result === PermissionsAndroid.RESULTS.GRANTED;
        const canAskAgain = result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
        return {
          granted,
          canAskAgain,
          status: granted ? 'granted' : (canAskAgain ? 'denied' : 'blocked'),
          blocked: !canAskAgain,
        };
      } catch (e) {
        logPermission('warning', 'Phone permission request failed', { error: e });
        return mockStatus(false, true);
      }
    }
    return unavailableStatus(`Permission ${permission} not implemented`);
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

  /**
   * Request camera permission. Use includePhotoLibrary: true when the feature also needs
   * photo library access (e.g. pick or save photos).
   * @example permissionsHandler.requestCamera({ includePhotoLibrary: true, rationale: '...' })
   */
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

  /**
   * Request photo library (media library) access. Use accessLevel for read-only, read-write, or add-only (iOS 14+).
   * On iOS 14+, user may grant "limited" access (selected photos only); check status.limited.
   * @example
   * const photoStatus = await permissionsHandler.requestPhotoLibrary({
   *   accessLevel: 'readWrite',
   *   rationale: 'We need access to your photos to save images'
   * });
   * if (photoStatus.limited) {
   *   // User granted limited access (selected photos only)
   * }
   */
  async requestPhotoLibrary(options?: PhotoLibraryOptions): Promise<PermissionStatus> {
    return this.request('photoLibrary', options);
  },

  /**
   * Request location permission (foreground). Use accuracy and background when building
   * location-based apps that need high accuracy and/or background tracking.
   * iOS: Background requires "Always" first; with background: true we request location then locationBackground.
   * @example permissionsHandler.requestLocation({ accuracy: 'high', background: true, rationale: '...' })
   */
  async requestLocation(options?: LocationPermissionOptions): Promise<PermissionStatus> {
    const status = await this.request('location', options);
    if (status.granted && options?.background) return this.request('locationBackground', options);
    return status;
  },

  /**
   * Request background location. iOS: Foreground/always must be granted first; otherwise the system will not grant background.
   */
  async requestLocationBackground(options?: PermissionOptions): Promise<PermissionStatus> {
    return this.request('locationBackground', options);
  },

  /**
   * Request notification permission (for push/instant notifications). Handles iOS vs Android:
   * Android uses POST_NOTIFICATIONS (API 33+); iOS uses expo-notifications with alert/badge/sound.
   * @example permissionsHandler.requestNotifications({ alert: true, badge: true, sound: true })
   */
  async requestNotifications(options?: NotificationPermissionOptions): Promise<PermissionStatus> {
    return this.request('notifications', options);
  },

  /**
   * Request contacts permission (e.g. for sharing). Use a clear rationale; handle denial
   * gracefully (e.g. showSettingsAlert when blocked, avoid blocking the user).
   * @example permissionsHandler.requestContacts({ rationale: 'We need access to help you share with friends' })
   */
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
  /**
   * Request biometric (Face ID / Touch ID) availability / permission. Manages biometric accessibility;
   * use fallbackTitle for the passcode fallback label (e.g. 'Use Passcode'). Requires expo-local-authentication
   * and NSFaceIDUsageDescription on iOS.
   * @example permissionsHandler.requestBiometrics({ fallbackTitle: 'Use Passcode' })
   */
  async requestBiometrics(options?: BiometricPermissionOptions): Promise<PermissionStatus> {
    try {
      const LocalAuthentication = require('expo-local-authentication') as {
        hasHardwareAsync: () => Promise<boolean>;
        isEnrolledAsync: () => Promise<boolean>;
      };
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      if (!hasHardware) return unavailableStatus('Biometric hardware not available');
      if (!isEnrolled) return unavailableStatus('No biometrics enrolled');
      return { granted: true, canAskAgain: true, status: 'granted' };
    } catch {
      return unavailableStatus('Install expo-local-authentication for biometrics');
    }
  },
  /**
   * Request motion & fitness permission (e.g. for fitness tracking apps).
   * Requires platform implementation (e.g. expo-sensors / Health Connect).
   * @example permissionsHandler.requestMotionFitness({ rationale: 'We need motion data to track your activity' })
   */
  async requestMotionFitness(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Motion & fitness not implemented');
  },
  /**
   * Request health permission (e.g. for fitness/health apps).
   * Requires platform implementation (e.g. HealthKit / Health Connect).
   * @example permissionsHandler.requestHealth({ rationale: 'We need health data to show your progress' })
   */
  async requestHealth(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Health not implemented');
  },
  /**
   * Request media library (photo/video) permission. For media players use accessLevel to request
   * read-only or read-write. Delegates to photoLibrary.
   * @example permissionsHandler.requestMediaLibrary({ accessLevel: 'readWrite', rationale: '...' })
   */
  async requestMediaLibrary(options?: PhotoLibraryOptions): Promise<PermissionStatus> {
    return this.requestPhotoLibrary(options);
  },
  async requestTracking(_options?: PermissionOptions): Promise<PermissionStatus> {
    return unavailableStatus('Tracking not implemented');
  },
  /**
   * Request storage permission. Android (API 33+) may use read/write; iOS typically uses photo library.
   * Use Platform.OS to handle platform-specific logic.
   * @example
   * if (Platform.OS === 'android') {
   *   return await permissionsHandler.requestStorage({ read: true, write: true, rationale: '...' });
   * }
   * return { granted: true, status: 'granted' }; // iOS
   */
  async requestStorage(options?: StoragePermissionOptions): Promise<PermissionStatus> {
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
    return getIOSInfoPlistEntriesFromConfig(permissions);
  },

  getAndroidManifestEntries(permissions: PermissionType[]): AndroidManifestEntry[] {
    return getAndroidManifestEntriesFromConfig(permissions);
  },
};

/**
 * Request permission with user-friendly messaging (legacy API, snake_case permission names).
 * When permission is blocked (never ask again), shows settings alert if showSettingsAlert is true.
 *
 * @param permission - Legacy type: camera, microphone, photo_library, location, contacts, calendar, reminders, notifications, bluetooth, speech_recognition, face_id, touch_id, biometrics
 * @param options - title, message, showSettingsAlert (default true)
 * @returns LegacyPermissionStatus (granted, canAskAgain, status: never_ask_again | granted | denied | unknown)
 * @example
 * const result = await requestPermission('photo_library', { message: 'To choose photos', showSettingsAlert: true });
 * if (!result.granted && !result.canAskAgain) { // settings alert was shown }
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
    logPermission('info', 'Permission request result', { permission: handlerType, status: result.status });
    toastPermissionStatus(handlerType, result.status, PERMISSION_DISPLAY_NAMES[handlerType]);
    if (result.status === 'blocked') {
      snackbarPermissionAlert('Open Settings to enable this permission.', 'warning', {
        label: 'Open Settings',
        onPress: openAppSettings,
      });
    }
    if (!legacy.granted && !legacy.canAskAgain && showSettingsAlert) {
      showPermissionSettingsAlert(permission);
    }
    return legacy;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logPermission('error', 'Permission request failed', { permission, error: message });
    return {
      granted: false,
      canAskAgain: false,
      status: 'unknown',
      message,
    };
  }
}

/**
 * Check if permission is granted without prompting (legacy API).
 *
 * @param permission - Legacy permission type (snake_case)
 * @returns LegacyPermissionStatus
 * @example
 * const status = await checkPermission('camera');
 * if (status.granted) launchCamera();
 */
export async function checkPermission(permission: LegacyPermissionType): Promise<LegacyPermissionStatus> {
  try {
    const handlerType = LEGACY_TO_HANDLER[permission];
    const result = await permissionsHandler.check(handlerType);
    return toLegacyStatus(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logPermission('error', 'Permission check failed', { permission, error: message });
    return {
      granted: false,
      canAskAgain: false,
      status: 'unknown',
      message,
    };
  }
}

/**
 * Show native alert guiding user to app settings (e.g. when permission is blocked / "Don't ask again").
 *
 * @param permission - Legacy permission type (used for display name)
 * @example
 * if (status.status === 'blocked') showPermissionSettingsAlert('photo_library');
 */
export function showPermissionSettingsAlert(permission: LegacyPermissionType) {
  const permissionNames: Record<LegacyPermissionType, string> = {
    camera: 'Camera',
    microphone: 'Microphone',
    photo_library: 'Photos and Videos',
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

  snackbarPermissionAlert(`Enable ${permissionName} in Settings to use this feature.`, 'warning', {
    label: 'Open Settings',
    onPress: openAppSettings,
  });
}

/**
 * Open the app's system settings screen. Use when user must enable permission manually (e.g. blocked).
 *
 * @example
 * await openAppSettings();
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
 *
 * @param permissions - Array of legacy permission types
 * @returns Record of permission -> LegacyPermissionStatus
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
 * Request multiple permissions sequentially (legacy API). Each may show a system dialog.
 *
 * @param permissions - Array of legacy permission types
 * @param options - showSettingsAlert (for blocked state)
 * @returns Record of permission -> LegacyPermissionStatus
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
 * Get default rationale message for a permission (for dialogs / Android rationale).
 *
 * @param permission - Legacy permission type
 * @returns Localized rationale string
 */
export function getPermissionRationale(permission: LegacyPermissionType): string {
  const rationales: Record<LegacyPermissionType, string> = {
    camera: 'This app needs camera access to take photos and videos.',
    microphone: 'This app needs microphone access to record audio.',
    photo_library: 'This app needs photos and videos access to select and save media.',
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
 * Check if all entries in a permission result record are granted (legacy API).
 *
 * @param permissions - Result from checkMultiplePermissions or requestMultiplePermissions
 * @returns true if every permission is granted
 */
export function areAllPermissionsGranted(permissions: Record<LegacyPermissionType, LegacyPermissionStatus>): boolean {
  return Object.values(permissions).every((p) => p.granted);
}

/**
 * Get list of permission types that are not granted (legacy API).
 *
 * @param permissions - Result from checkMultiplePermissions or requestMultiplePermissions
 * @returns Array of denied legacy permission types
 */
export function getDeniedPermissions(permissions: Record<LegacyPermissionType, LegacyPermissionStatus>): LegacyPermissionType[] {
  return Object.entries(permissions)
    .filter(([, status]) => !status.granted)
    .map(([permission]) => permission as LegacyPermissionType);
}

/**
 * Hook that exposes legacy permission helpers for React components (requestPermission, checkPermission,
 * checkMultiplePermissions, requestMultiplePermissions, getPermissionRationale, showPermissionSettingsAlert, openAppSettings).
 *
 * @example
 * const { requestPermission, checkPermission, showPermissionSettingsAlert } = usePermissions();
 * const handleRequest = () => requestPermission('camera', { showSettingsAlert: true });
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
