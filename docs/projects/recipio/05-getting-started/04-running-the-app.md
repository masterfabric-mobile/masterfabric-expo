# Running the App

How to run and test the Recipio app.

## Quick Start

### Windows

```bash
cd project/recipio
run.bat
```

### Linux/macOS

```bash
cd project/recipio
chmod +x run.sh
./run.sh
```

## Manual Start

### Start Development Server

```bash
cd project/recipio
npm start
```

or

```bash
npx expo start
```

### Platform Options

After the development server starts:

- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`
- **Web Browser**: Press `w`
- **QR Code**: Scan with the Expo Go app

## Running on a Specific Platform

### iOS

```bash
npm run ios
```

or

```bash
npx expo start --ios
```

### Android

```bash
npm run android
```

or

```bash
npx expo start --android
```

### Web

```bash
npm run web
```

or

```bash
npx expo start --web
```

## Using Expo Go

1. Install the **Expo Go** app on your device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code:
   - iOS: With the Camera app
   - Android: From within the Expo Go app

## Troubleshooting

### Port Already in Use

If the port is already in use:

```bash
npx expo start --port 8082
```

### Clear Cache

```bash
npx expo start --clear
```

### Reset Metro Bundler

```bash
npx expo start --reset-cache
```

### Network Issues

Make sure you are on the same Wi‑Fi network. Or use tunnel mode:

```bash
npx expo start --tunnel
```

### Supabase Connection Issues

If you get Supabase connection errors:

1. Check Supabase credentials in `app.json`
2. Check console output for:
   ```
   ✅ Supabase client initialized
   ```
3. Ensure the project is active in the Supabase Dashboard

## Development Tips

- **Hot Reload**: Enabled by default. Code changes are reflected automatically.
- **Fast Refresh**: Quick refresh for React components.
- **Debugging**: Use Chrome DevTools or React Native Debugger.
- **Console logs**: All `console.log` output appears in the terminal.

## Building for Production

### iOS

```bash
npx expo build:ios
```

### Android

```bash
npx expo build:android
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

## Running Checklist

- [ ] Development server started (`npm start`)
- [ ] Platform selected (iOS/Android/Web)
- [ ] Supabase connection successful (see console)
- [ ] Splash screen appears
- [ ] Onboarding/Home screen transition works

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
