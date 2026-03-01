/**
 * Permission constants and canonical/legacy mapping.
 * Issue #28.
 */

import type { LegacyPermissionType, PermissionType } from './types';

/** Map alias permission types to canonical type for check/request. */
export const CANONICAL_PERMISSION: Partial<Record<PermissionType, PermissionType>> = {
  mediaLibrary: 'photoLibrary',
  musicLibrary: 'photoLibrary', // Music library uses same flow as photoLibrary
  locationWhenInUse: 'location',
  locationAlways: 'location',
  readPhoneState: 'phone',
  callPhone: 'phone',
  storageRead: 'storage',
  storageWrite: 'storage',
  readSms: 'sms',
  sendSms: 'sms',
  receiveSms: 'sms',
  bluetoothScan: 'bluetooth',
  bluetoothConnect: 'bluetooth',
  bluetoothAdvertise: 'bluetooth',
};

export function getCanonicalPermission(p: PermissionType): PermissionType {
  return CANONICAL_PERMISSION[p] ?? p;
}

/** Permission types that have native implementation; others return unavailable with a message. */
export const IMPLEMENTED_PERMISSIONS: PermissionType[] = [
  'camera',
  'microphone',
  'photoLibrary',
  'location',
  'locationBackground',
  'notifications',
  'calendar',
  'contacts',
  'phone',
  'storage',
  'faceId',
  'touchId',
  'biometrics',
  'sms',
  'bluetooth',
];

export function isImplemented(p: PermissionType): boolean {
  return IMPLEMENTED_PERMISSIONS.includes(getCanonicalPermission(p));
}

export const LEGACY_TO_HANDLER: Record<LegacyPermissionType, PermissionType> = {
  camera: 'camera',
  microphone: 'microphone',
  photo_library: 'photoLibrary',
  location: 'location',
  contacts: 'contacts',
  calendar: 'calendar',
  reminders: 'reminders',
  notifications: 'notifications',
  bluetooth: 'bluetooth',
  speech_recognition: 'speechRecognition',
  face_id: 'faceId',
  touch_id: 'touchId',
  biometrics: 'biometrics',
};
