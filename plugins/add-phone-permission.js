const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Adds READ_PHONE_STATE to Android manifest for Phone permission (Permissions Helper).
 */
function addPhonePermission(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const permissions = manifest['uses-permission'] || [];

    const hasReadPhoneState = permissions.some(
      (p) => p.$?.['android:name'] === 'android.permission.READ_PHONE_STATE'
    );
    if (!hasReadPhoneState) {
      permissions.push({ $: { 'android:name': 'android.permission.READ_PHONE_STATE' } });
      manifest['uses-permission'] = permissions;
    }

    return config;
  });
}

module.exports = addPhonePermission;
