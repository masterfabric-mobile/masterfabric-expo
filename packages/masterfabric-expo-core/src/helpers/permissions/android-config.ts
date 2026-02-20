/**
 * Android Manifest permission configuration.
 * Issue #28.
 * Matches common app requirements; legacy permissions use maxSdkVersion where applicable.
 */

import type { AndroidManifestEntry, PermissionType } from './types';

export function getAndroidManifestEntries(permissions: PermissionType[]): AndroidManifestEntry[] {
  const entries: AndroidManifestEntry[] = [];
  const add = (entry: Omit<AndroidManifestEntry, 'description'> & { description: string }) => {
    if (!entries.some((e) => e.permission === entry.permission)) entries.push(entry);
  };

  // Camera
  if (permissions.includes('camera')) {
    add({ permission: 'android.permission.CAMERA', description: 'Camera' });
  }
  // Microphone
  if (permissions.includes('microphone')) {
    add({ permission: 'android.permission.RECORD_AUDIO', description: 'Microphone' });
  }
  // Storage (Legacy)
  if (permissions.includes('storage') || permissions.includes('photoLibrary') || permissions.includes('mediaLibrary')) {
    add({ permission: 'android.permission.READ_EXTERNAL_STORAGE', maxSdkVersion: 32, description: 'Read storage (legacy)' });
    add({ permission: 'android.permission.WRITE_EXTERNAL_STORAGE', maxSdkVersion: 29, description: 'Write storage (legacy)' });
  }
  // Storage (Android 13+)
  if (permissions.includes('storage') || permissions.includes('storageRead') || permissions.includes('photoLibrary') || permissions.includes('mediaLibrary')) {
    add({ permission: 'android.permission.READ_MEDIA_IMAGES', description: 'Read media images (Android 13+)' });
    add({ permission: 'android.permission.READ_MEDIA_VIDEO', description: 'Read media video (Android 13+)' });
    add({ permission: 'android.permission.READ_MEDIA_AUDIO', description: 'Read media audio (Android 13+)' });
  }
  // Location
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
  // Contacts
  if (permissions.includes('contacts')) {
    add({ permission: 'android.permission.READ_CONTACTS', description: 'Contacts' });
    add({ permission: 'android.permission.WRITE_CONTACTS', description: 'Contacts' });
  }
  // Calendar
  if (permissions.includes('calendar')) {
    add({ permission: 'android.permission.READ_CALENDAR', description: 'Calendar' });
    add({ permission: 'android.permission.WRITE_CALENDAR', description: 'Calendar' });
  }
  // Notifications (Android 13+)
  if (permissions.includes('notifications')) {
    add({ permission: 'android.permission.POST_NOTIFICATIONS', description: 'Notifications (Android 13+)' });
  }
  // Bluetooth
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
  // Phone
  if (permissions.includes('phone') || permissions.includes('readPhoneState')) {
    add({ permission: 'android.permission.READ_PHONE_STATE', description: 'Phone' });
  }
  if (permissions.includes('callPhone')) {
    add({ permission: 'android.permission.CALL_PHONE', description: 'Call phone' });
  }
  // SMS
  if (permissions.includes('sms') || permissions.includes('sendSms')) {
    add({ permission: 'android.permission.SEND_SMS', description: 'SMS' });
  }
  if (permissions.includes('receiveSms')) {
    add({ permission: 'android.permission.RECEIVE_SMS', description: 'SMS' });
  }
  if (permissions.includes('readSms')) {
    add({ permission: 'android.permission.READ_SMS', description: 'SMS' });
  }
  // Body Sensors (Android 12+), e.g. for motion/fitness
  if (permissions.includes('motionFitness') || permissions.includes('health')) {
    add({ permission: 'android.permission.BODY_SENSORS', description: 'Body sensors (Android 12+)' });
    add({ permission: 'android.permission.BODY_SENSORS_BACKGROUND', description: 'Body sensors background (Android 14+)' });
  }

  return entries;
}
