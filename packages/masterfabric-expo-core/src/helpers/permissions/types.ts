/**
 * Permission types and interfaces for the permissions handler.
 * TypeScript type safety for all permission APIs; export via index for easy imports.
 * Issue #28.
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

/**
 * Permission status (Issue #28).
 * Use check(type) to get status without requesting; then handle status.status.
 */
export interface PermissionStatus {
  granted: boolean;
  status: 'granted' | 'denied' | 'blocked' | 'limited' | 'unavailable' | 'unknown';
  canAskAgain: boolean;
  /** True when status === 'blocked' (permanently denied). */
  blocked?: boolean;
  /** iOS 14+ for photo library limited access. */
  limited?: boolean;
  message?: string;
  ios?: {
    /** Photo library scope. */
    scope?: 'full' | 'limited';
  };
  android?: {
    rationaleRequired?: boolean;
  };
}

/** Permission types supported by permissionsHandler (Issue #28). */
export type PermissionType =
  // Media
  | 'camera'
  | 'microphone'
  | 'photoLibrary'
  | 'mediaLibrary'
  | 'musicLibrary'
  // Location
  | 'location'
  | 'locationAlways'
  | 'locationWhenInUse'
  | 'locationBackground'
  // Contacts & Calendar
  | 'contacts'
  | 'calendar'
  | 'reminders'
  // Notifications
  | 'notifications'
  // Bluetooth
  | 'bluetooth'
  | 'bluetoothScan' // Android 12+
  | 'bluetoothConnect' // Android 12+
  | 'bluetoothAdvertise' // Android 12+
  // Biometrics
  | 'faceId'
  | 'touchId'
  | 'biometrics'
  // Health & Fitness
  | 'motionFitness'
  | 'health'
  // Other
  | 'speechRecognition'
  | 'siri'
  | 'tracking' // iOS 14.5+
  | 'nearbyInteractions' // iOS 16+
  // Android Specific
  | 'storage'
  | 'storageRead' // Android 13+
  | 'storageWrite' // Android 13+
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

/** Photo library options (Issue #28). iOS 14+ accessLevel. */
export interface PhotoLibraryOptions extends PermissionOptions {
  accessLevel?: 'readOnly' | 'readWrite' | 'addOnly';
}

/** Location permission options (Issue #28). */
export interface LocationPermissionOptions extends PermissionOptions {
  accuracy?: 'high' | 'low';
  background?: boolean;
  always?: boolean;
}

/** Storage permission options (Android; iOS typically uses photo library). */
export interface StoragePermissionOptions extends PermissionOptions {
  read?: boolean;
  write?: boolean;
}

/** Notification permission options (Issue #28). */
export interface NotificationPermissionOptions extends PermissionOptions {
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
  carPlay?: boolean;
  criticalAlert?: boolean;
  provisional?: boolean; // iOS 12+
  providesAppNotificationSettings?: boolean;
}

/** Bluetooth permission options (Android 12+). */
export interface BluetoothPermissionOptions extends PermissionOptions {
  scan?: boolean;
  connect?: boolean;
  advertise?: boolean;
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

/** Biometric auth options (reason required for native prompts). */
export interface BiometricOptions {
  reason: string;
  fallbackTitle?: string;
  cancelTitle?: string;
  disableDeviceFallback?: boolean;
}

/** Biometric permission / auth options (reason optional for handler). */
export interface BiometricPermissionOptions {
  reason?: string;
  /** iOS/Android: prompt message shown in the system dialog (e.g. "Authenticate to continue"). */
  promptMessage?: string;
  fallbackTitle?: string;
  cancelTitle?: string;
  disableDeviceFallback?: boolean;
}

/** Health permission options (read/write health data types). */
export interface HealthPermissionOptions extends PermissionOptions {
  read?: string[];
  write?: string[];
}

/** Media library options. */
export interface MediaLibraryOptions extends PermissionOptions {
  accessLevel?: 'readOnly' | 'readWrite' | 'addOnly';
}

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
  /** e.g. "neverForLocation" for BLUETOOTH_SCAN (Android 12+). */
  usesPermissionFlags?: string;
  description: string;
}

/** Permission descriptions for UI / rationale (title, description, platform-specific). */
export interface PermissionDescriptions {
  [permission: string]: {
    title: string;
    description: string;
    ios?: string;
    android?: string;
  };
}
