import { Alert, Linking } from 'react-native';

/**
 * Permission utilities for MasterView
 */

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
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
  | 'biometrics';

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
    // This is a simplified implementation
    // In a real app, you would use expo-permissions or react-native-permissions
    
    // For now, return a mock response
    const mockStatus: PermissionStatus = {
      granted: false,
      canAskAgain: true,
      status: 'denied',
      message: 'Permission not implemented in this version',
    };

    // If permission is denied and we can show settings alert
    if (!mockStatus.granted && !mockStatus.canAskAgain && showSettingsAlert) {
      showPermissionSettingsAlert(permission);
    }

    return mockStatus;
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
 * Check if permission is granted
 */
export async function checkPermission(permission: PermissionType): Promise<PermissionStatus> {
  try {
    // This is a simplified implementation
    // In a real app, you would use expo-permissions or react-native-permissions
    
    const mockStatus: PermissionStatus = {
      granted: false,
      canAskAgain: true,
      status: 'unknown',
    };

    return mockStatus;
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
 * Show alert to guide user to settings
 */
export function showPermissionSettingsAlert(permission: PermissionType) {
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
  };

  return rationales[permission] || 'This app needs this permission to function properly.';
}

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
