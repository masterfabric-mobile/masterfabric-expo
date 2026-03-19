/**
 * Android Manifest permission configuration.
 * Covers all permissions shown on the permissions helper screen.
 * Helper list: camera, microphone, photoLibrary, location, locationBackground, notifications,
 * calendar, contacts, phone, storage, biometrics, sms, bluetooth.
 * Legacy permissions use maxSdkVersion where applicable.
 */

import type { AndroidManifestEntry, PermissionType } from './types';

export function getAndroidManifestEntries(permissions: PermissionType[]): AndroidManifestEntry[] {
  const entries: AndroidManifestEntry[] = [];
  const add = (entry: Omit<AndroidManifestEntry, 'description'> & { description: string }) => {
    if (!entries.some((e) => e.permission === entry.permission)) entries.push(entry);
  };

  // Camera (helper)
  if (permissions.includes('camera')) {
    add({ permission: 'android.permission.CAMERA', description: 'Camera' });
  }
  // Microphone (helper)
  if (permissions.includes('microphone')) {
    add({ permission: 'android.permission.RECORD_AUDIO', description: 'Microphone' });
  }
  // Photo Library / Gallery (helper) + Storage (helper): legacy
  if (permissions.includes('storage') || permissions.includes('photoLibrary') || permissions.includes('mediaLibrary')) {
    add({ permission: 'android.permission.READ_EXTERNAL_STORAGE', maxSdkVersion: 32, description: 'Read storage / gallery (legacy)' });
    add({ permission: 'android.permission.WRITE_EXTERNAL_STORAGE', maxSdkVersion: 29, description: 'Write storage (legacy)' });
  }
  // Photo Library / Gallery + Storage (Android 13+): READ_MEDIA_* for system permission dialog
  if (permissions.includes('storage') || permissions.includes('storageRead') || permissions.includes('photoLibrary') || permissions.includes('mediaLibrary')) {
    add({ permission: 'android.permission.READ_MEDIA_IMAGES', description: 'Gallery – read images (Android 13+)' });
    add({ permission: 'android.permission.READ_MEDIA_VIDEO', description: 'Gallery – read video (Android 13+)' });
    add({ permission: 'android.permission.READ_MEDIA_AUDIO', description: 'Read media audio (Android 13+)' });
    add({ permission: 'android.permission.READ_MEDIA_VISUAL_USER_SELECTED', description: 'Gallery – partial access (Android 14+)' });
  }
  // Location (helper) + Location background (helper)
  if (
    permissions.includes('location') ||
    permissions.includes('locationWhenInUse') ||
    permissions.includes('locationAlways') ||
    permissions.includes('locationBackground')
  ) {
    add({ permission: 'android.permission.ACCESS_FINE_LOCATION', description: 'Fine location' });
    add({ permission: 'android.permission.ACCESS_COARSE_LOCATION', description: 'Coarse location' });
    add({ permission: 'android.permission.ACCESS_BACKGROUND_LOCATION', description: 'Background location' });
  }
  // Notifications (helper, Android 13+)
  if (permissions.includes('notifications')) {
    add({ permission: 'android.permission.POST_NOTIFICATIONS', description: 'Notifications (Android 13+)' });
  }
  // Calendar (helper)
  if (permissions.includes('calendar')) {
    add({ permission: 'android.permission.READ_CALENDAR', description: 'Calendar' });
    add({ permission: 'android.permission.WRITE_CALENDAR', description: 'Calendar' });
  }
  // Contacts (helper)
  if (permissions.includes('contacts')) {
    add({ permission: 'android.permission.READ_CONTACTS', description: 'Contacts' });
    add({ permission: 'android.permission.WRITE_CONTACTS', description: 'Contacts' });
  }
  // Phone (helper)
  if (permissions.includes('phone') || permissions.includes('readPhoneState')) {
    add({ permission: 'android.permission.READ_PHONE_STATE', description: 'Phone' });
  }
  if (permissions.includes('callPhone')) {
    add({ permission: 'android.permission.CALL_PHONE', description: 'Call phone' });
  }
  // Storage (helper): covered above with photoLibrary/gallery and READ_MEDIA_* / READ_EXTERNAL_STORAGE
  // Biometrics / Face ID (helper): BiometricPrompt; USE_BIOMETRIC for Android 9+
  if (permissions.includes('biometrics') || permissions.includes('faceId') || permissions.includes('touchId')) {
    add({ permission: 'android.permission.USE_BIOMETRIC', description: 'Biometrics (fingerprint / face)' });
  }
  // SMS (helper)
  if (permissions.includes('sms') || permissions.includes('sendSms')) {
    add({ permission: 'android.permission.SEND_SMS', description: 'SMS' });
  }
  if (permissions.includes('receiveSms')) {
    add({ permission: 'android.permission.RECEIVE_SMS', description: 'SMS' });
  }
  if (permissions.includes('readSms')) {
    add({ permission: 'android.permission.READ_SMS', description: 'SMS' });
  }
  // Bluetooth (helper)
  if (
    permissions.includes('bluetooth') ||
    permissions.includes('bluetoothScan') ||
    permissions.includes('bluetoothConnect') ||
    permissions.includes('bluetoothAdvertise')
  ) {
    add({ permission: 'android.permission.BLUETOOTH', maxSdkVersion: 30, description: 'Bluetooth (legacy)' });
    add({ permission: 'android.permission.BLUETOOTH_ADMIN', maxSdkVersion: 30, description: 'Bluetooth admin (legacy)' });
    add({
      permission: 'android.permission.BLUETOOTH_SCAN',
      usesPermissionFlags: 'neverForLocation',
      description: 'Bluetooth scan (Android 12+)',
    });
    add({ permission: 'android.permission.BLUETOOTH_CONNECT', description: 'Bluetooth connect (Android 12+)' });
    add({ permission: 'android.permission.BLUETOOTH_ADVERTISE', description: 'Bluetooth advertise (Android 12+)' });
  }
  // Body Sensors (motion/fitness, health – not on helper screen)
  if (permissions.includes('motionFitness') || permissions.includes('health')) {
    add({ permission: 'android.permission.BODY_SENSORS', description: 'Body sensors (Android 12+)' });
    add({ permission: 'android.permission.BODY_SENSORS_BACKGROUND', description: 'Body sensors background (Android 14+)' });
  }

  return entries;
}
