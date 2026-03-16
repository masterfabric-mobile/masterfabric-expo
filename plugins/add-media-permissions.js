/**
 * Expo config plugin: ensures Android and iOS manifest have media (gallery/videos), storage, SMS, and Bluetooth permissions.
 * - Android: media/storage (READ_MEDIA_*, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE), SMS (SEND_SMS, RECEIVE_SMS, READ_SMS), Bluetooth (BLUETOOTH_SCAN with neverForLocation, BLUETOOTH_CONNECT, BLUETOOTH_ADVERTISE).
 * - iOS: NSPhotoLibraryUsageDescription, NSPhotoLibraryAddUsageDescription (gallery/videos), NSBluetoothAlwaysUsageDescription (Bluetooth). SMS has no plist key; storage is covered by photo library.
 * Used by app.json plugins array. Safe to run; avoids duplicate permissions/keys.
 */
const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

const ANDROID_MEDIA_AND_STORAGE_PERMISSIONS = [
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.READ_MEDIA_AUDIO',
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
];

const ANDROID_SMS_PERMISSIONS = [
  'android.permission.SEND_SMS',
  'android.permission.RECEIVE_SMS',
  'android.permission.READ_SMS',
];

/** Bluetooth: simple permission entries. BLUETOOTH_SCAN is added separately with usesPermissionFlags. */
const ANDROID_BLUETOOTH_SIMPLE = [
  'android.permission.BLUETOOTH_CONNECT',
  'android.permission.BLUETOOTH_ADVERTISE',
];

const IOS_PHOTO_LIBRARY_USAGE = 'The app needs gallery access to select photos and videos.';
const IOS_PHOTO_LIBRARY_ADD_USAGE = 'The app needs permission to save photos and videos to your library.';
const IOS_BLUETOOTH_USAGE = 'The app needs Bluetooth to connect to nearby devices.';

function withAndroidMediaStorageSmsBluetooth(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    let permissions = manifest['uses-permission'] ?? [];
    if (!Array.isArray(permissions)) permissions = [permissions];
    const existing = new Set(
      permissions.map((p) => p?.$?.['android:name']).filter(Boolean)
    );

    const simpleLists = [
      ANDROID_MEDIA_AND_STORAGE_PERMISSIONS,
      ANDROID_SMS_PERMISSIONS,
      ANDROID_BLUETOOTH_SIMPLE,
    ];
    for (const list of simpleLists) {
      for (const name of list) {
        if (!existing.has(name)) {
          permissions.push({ $: { 'android:name': name } });
          existing.add(name);
        }
      }
    }

    if (!existing.has('android.permission.BLUETOOTH_SCAN')) {
      permissions.push({
        $: {
          'android:name': 'android.permission.BLUETOOTH_SCAN',
          'android:usesPermissionFlags': 'neverForLocation',
        },
      });
      existing.add('android.permission.BLUETOOTH_SCAN');
    }

    manifest['uses-permission'] = permissions;
    return config;
  });
}

function withIOSGalleryVideosAndBluetooth(config) {
  return withInfoPlist(config, (config) => {
    const plist = config.modResults;
    if (!plist.NSPhotoLibraryUsageDescription) {
      plist.NSPhotoLibraryUsageDescription = IOS_PHOTO_LIBRARY_USAGE;
    }
    if (!plist.NSPhotoLibraryAddUsageDescription) {
      plist.NSPhotoLibraryAddUsageDescription = IOS_PHOTO_LIBRARY_ADD_USAGE;
    }
    if (!plist.NSBluetoothAlwaysUsageDescription) {
      plist.NSBluetoothAlwaysUsageDescription = IOS_BLUETOOTH_USAGE;
    }
    return config;
  });
}

function addMediaPermissions(config) {
  config = withAndroidMediaStorageSmsBluetooth(config);
  config = withIOSGalleryVideosAndBluetooth(config);
  return config;
}

module.exports = addMediaPermissions;
