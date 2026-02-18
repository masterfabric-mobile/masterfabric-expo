import type { PermissionType } from 'masterfabric-expo-core';

export const PERMISSION_KEYS = [
  'camera',
  'microphone',
  'photoLibrary',
  'location',
  'notifications',
  'calendar',
  'contacts',
  'phone',
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  camera: 'Camera',
  microphone: 'Microphone',
  photoLibrary: 'Photo Library',
  location: 'Location',
  notifications: 'Notifications',
  calendar: 'Calendar',
  contacts: 'Contacts',
  phone: 'Phone',
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
];
