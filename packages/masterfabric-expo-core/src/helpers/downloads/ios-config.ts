/**
 * iOS configuration for File Download Helper
 * Issue #31: https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 *
 * iOS uses app-specific directories (Documents, Caches) – no storage permission needed.
 * For background downloads, add the following to Info.plist.
 */

/** Info.plist snippet for background download support (optional). */
export const IOS_BACKGROUND_MODES_PLIST = `<!-- Add to Info.plist for background downloads -->
<key>UIBackgroundModes</key>
<array>
  <string>fetch</string>
  <string>processing</string>
</array>`;

/** Xcode capability: enable "Background fetch" and "Background processing" for background downloads. */
export const IOS_CAPABILITIES = [
  'Background Modes – "Background fetch" and "Background processing" (optional, for background downloads)',
] as const;

/** iOS does not require storage permission for app-specific directories. */
export const IOS_STORAGE_PERMISSION_NEEDED = false;
