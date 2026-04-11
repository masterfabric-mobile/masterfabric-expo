import { Alert, Linking } from 'react-native';

/**
 * Permission utilities for MasterView
 */

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  blocked?: boolean; // Alias for !canAskAgain (for compatibility with mockup examples)
  status: 'granted' | 'denied' | 'limited' | 'never_ask_again' | 'unknown';
  message?: string;
}

/**
 * Common permission types
 */
export type PermissionType = 
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
  | 'biometrics'
  | 'storage';

/**
 * Options for storage permission (used by file download helper).
 */
export interface StoragePermissionOptions {
  read?: boolean;
  write?: boolean;
  rationale?: string;
}

/**
 * Request permission with user-friendly messaging
 */
export async function requestPermission(
  permission: PermissionType,
  options?: {
    title?: string;
    message?: string;
    showSettingsAlert?: boolean;
  }
): Promise<PermissionStatus> {
  const {
    title = 'Permission Required',
    message = 'This app needs permission to access this feature.',
    showSettingsAlert = true,
  } = options || {};

  try {
    // Storage: app document/cache directories don't require runtime permission on iOS/Android (Expo Go).
    // Return granted so file download helper works; optional native modules can override later.
    if (permission === 'storage') {
      const storageStatus: PermissionStatus = {
        granted: true,
        canAskAgain: true,
        blocked: false,
        status: 'granted',
        message: undefined,
      };
      return storageStatus;
    }

    // Other permissions: simplified implementation (use expo-permissions or react-native-permissions in production)
    const mockStatus: PermissionStatus = {
      granted: false,
      canAskAgain: true,
      blocked: false,
      status: 'denied',
      message: 'Permission not implemented in this version',
    };

    if (!mockStatus.granted && !mockStatus.canAskAgain && showSettingsAlert) {
      showPermissionSettingsAlert(permission);
    }

    return mockStatus;
  } catch (error) {
    return {
      granted: false,
      canAskAgain: false,
      blocked: true,
      status: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Request storage permission (read/write). Uses requestPermission('storage') with optional rationale.
 */
export async function requestStorage(options?: StoragePermissionOptions): Promise<PermissionStatus> {
  return requestPermission('storage', {
    message: options?.rationale ?? 'This app needs storage access to save downloaded files.',
  });
}

/**
 * Check storage permission status.
 */
export async function checkStorage(): Promise<PermissionStatus> {
  return checkPermission('storage');
}

/**
 * Check if permission is granted
 */
export async function checkPermission(permission: PermissionType): Promise<PermissionStatus> {
  try {
    // Storage: app directories don't need runtime permission (Expo Go / scoped storage).
    if (permission === 'storage') {
      return {
        granted: true,
        canAskAgain: true,
        blocked: false,
        status: 'granted',
      };
    }

    // Other permissions: simplified implementation
    const mockStatus: PermissionStatus = {
      granted: false,
      canAskAgain: true,
      blocked: false,
      status: 'unknown',
    };

    return mockStatus;
  } catch (error) {
    return {
      granted: false,
      canAskAgain: false,
      blocked: true,
      status: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Options for showSettingsAlert (issue #31 compatibility).
 * @see https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 */
export interface ShowSettingsAlertOptions {
  permission?: PermissionType;
  title?: string;
  message?: string;
  openSettings?: boolean;
}

/**
 * Show alert to guide user to settings.
 * Accepts optional object for issue #31 API: showSettingsAlert({ permission: 'storage', title?, message?, openSettings? }).
 */
export function showPermissionSettingsAlert(permissionOrOptions: PermissionType | ShowSettingsAlertOptions) {
  const permission: PermissionType =
    typeof permissionOrOptions === 'string'
      ? permissionOrOptions
      : (permissionOrOptions.permission ?? 'storage');
  const opts = typeof permissionOrOptions === 'object' ? permissionOrOptions : undefined;
  const permissionNames = {
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
    storage: 'Storage',
  };

  const permissionName = permissionNames[permission] || permission;
  const title = opts?.title ?? `${permissionName} Permission`;
  const message = opts?.message ?? `To use this feature, please enable ${permissionName} permission in your device settings.`;

  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      ...(opts?.openSettings !== false
        ? [
            {
              text: 'Open Settings',
              onPress: () => openAppSettings(),
            },
          ]
        : []),
    ]
  );
}

/**
 * Alias for showPermissionSettingsAlert with object options (issue #31).
 * permissionsHandler.showSettingsAlert({ permission: 'storage', title?, message?, openSettings: true })
 */
export function showSettingsAlert(options: ShowSettingsAlertOptions = {}): void {
  showPermissionSettingsAlert(options);
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
 * Check multiple permissions at once
 */
export async function checkMultiplePermissions(
  permissions: PermissionType[]
): Promise<Record<PermissionType, PermissionStatus>> {
  const results: Record<PermissionType, PermissionStatus> = {} as Record<PermissionType, PermissionStatus>;

  for (const permission of permissions) {
    results[permission] = await checkPermission(permission);
  }

  return results;
}

/**
 * Request multiple permissions at once
 */
export async function requestMultiplePermissions(
  permissions: PermissionType[],
  options?: {
    showSettingsAlert?: boolean;
  }
): Promise<Record<PermissionType, PermissionStatus>> {
  const results: Record<PermissionType, PermissionStatus> = {} as Record<PermissionType, PermissionStatus>;

  for (const permission of permissions) {
    results[permission] = await requestPermission(permission, options);
  }

  return results;
}

/**
 * Get permission rationale message
 */
export function getPermissionRationale(permission: PermissionType): string {
  const rationales = {
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
    storage: 'This app needs storage access to save downloaded files.',
  };

  return rationales[permission] || 'This app needs this permission to function properly.';
}

/**
 * Unified permissions handler object (issue #31 API).
 * Use: permissionsHandler.requestStorage(), permissionsHandler.showSettingsAlert({ permission: 'storage' })
 * @see https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 */
export const permissionsHandler = {
  requestStorage,
  checkStorage,
  checkPermission,
  requestPermission,
  showPermissionSettingsAlert,
  showSettingsAlert,
  openAppSettings,
  getPermissionRationale,
};

/**
 * Check if all permissions are granted
 */
export function areAllPermissionsGranted(permissions: Record<PermissionType, PermissionStatus>): boolean {
  return Object.values(permissions).every(permission => permission.granted);
}

/**
 * Get list of denied permissions
 */
export function getDeniedPermissions(permissions: Record<PermissionType, PermissionStatus>): PermissionType[] {
  return Object.entries(permissions)
    .filter(([_, status]) => !status.granted)
    .map(([permission, _]) => permission as PermissionType);
}

/**
 * Permission helper hook for React components
 */
export function usePermissions() {
  const requestPermissionHelper = async (
    permission: PermissionType,
    options?: Parameters<typeof requestPermission>[1]
  ) => {
    return await requestPermission(permission, options);
  };

  const checkPermissionHelper = async (permission: PermissionType) => {
    return await checkPermission(permission);
  };

  const checkMultiplePermissionsHelper = async (permissions: PermissionType[]) => {
    return await checkMultiplePermissions(permissions);
  };

  const requestMultiplePermissionsHelper = async (
    permissions: PermissionType[],
    options?: Parameters<typeof requestMultiplePermissions>[1]
  ) => {
    return await requestMultiplePermissions(permissions, options);
  };

  return {
    requestPermission: requestPermissionHelper,
    checkPermission: checkPermissionHelper,
    checkMultiplePermissions: checkMultiplePermissionsHelper,
    requestMultiplePermissions: requestMultiplePermissionsHelper,
    getPermissionRationale,
    showPermissionSettingsAlert,
    openAppSettings,
  };
}
