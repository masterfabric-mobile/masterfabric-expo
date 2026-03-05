const fs = require('fs');
const path = require('path');

// Load .env and .env.development so EXPO_PUBLIC_* are available in extra (Expo may only load .env by default)
function loadEnvFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
      }
    }
  });
}
loadEnvFile('.env');
loadEnvFile('.env.development');
loadEnvFile('.env.local');

const appJson = require('./app.json');

// OneSignal plugin must be first so native module is linked in development builds (expo run:ios/android).
const isProduction = process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' || process.env.NODE_ENV === 'production';
const oneSignalPlugin = ['onesignal-expo-plugin', { mode: isProduction ? 'production' : 'development' }];
const plugins = [
  oneSignalPlugin,
  '@react-native-firebase/app',
  '@react-native-firebase/messaging',
  ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
  ...(appJson.expo.plugins || []),
];

module.exports = {
  expo: {
    ...appJson.expo,
    plugins,
    extra: {
      ...(appJson.expo.extra || {}),
      oneSignalAppId: process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID || '',
    },
  },
};
