/**
 * Android configuration for File Download Helper
 * Issue #31: https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 *
 * App-specific directories (scoped storage) do not require storage permission (API 29+).
 * For shared storage (e.g. public Downloads), manifest permissions below may be needed.
 */

/** AndroidManifest.xml permissions snippet for file downloads. */
export const ANDROID_MANIFEST_PERMISSIONS = `<!-- Internet (required for downloads) -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Storage (Android 13+ / API 33+) -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

<!-- Storage (Legacy) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />

<!-- Optional -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />`;

/** For app-specific directories (expo-file-system default), no permission is required. */
export const ANDROID_APP_DIRECTORY_PERMISSION_NEEDED = false;
