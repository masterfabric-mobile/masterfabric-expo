/**
 * Expo config plugin: ensures Android media-related permissions are present.
 * Used by app.json plugins array. Safe to run; avoids duplicate permissions.
 */
const { withAndroidManifest } = require('@expo/config-plugins');

const MEDIA_PERMISSIONS = [
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
];

function addMediaPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    let permissions = manifest['uses-permission'] ?? [];
    if (!Array.isArray(permissions)) permissions = [permissions];
    const existing = new Set(
      permissions.map((p) => p?.$?.['android:name']).filter(Boolean)
    );
    for (const name of MEDIA_PERMISSIONS) {
      if (!existing.has(name)) {
        permissions.push({ $: { 'android:name': name } });
        existing.add(name);
      }
    }
    manifest['uses-permission'] = permissions;
    return config;
  });
}

module.exports = addMediaPermissions;
