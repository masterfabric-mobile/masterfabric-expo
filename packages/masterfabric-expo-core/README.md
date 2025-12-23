# MasterFabric Expo Core

A comprehensive view architecture and utilities package for building scalable React Native/Expo applications with MasterView pattern.

## 🚀 Quick Start

### Create a new MasterFabric App

```bash
npx create-masterfabric-app MyAwesomeApp
cd MyAwesomeApp
npm start
```

### Manual Installation

```bash
npm install masterfabric-expo-core
```

## ✨ Effortless Setup

### Zero-Config Initialization

The easiest way to use MasterFabric Expo Core is with zero configuration:

```typescript
import { useAutoInitMasterView } from 'masterfabric-expo-core';

export default function RootLayout() {
  // That's it! Auto-initializes with sensible defaults
  useAutoInitMasterView();
  
  return <YourApp />;
}
```

MasterView will automatically:
- ✅ Detect app name and version from Expo Constants
- ✅ Detect environment (development/production)
- ✅ Detect available integrations from environment variables
- ✅ Use sensible defaults for all configuration
- ✅ Handle errors gracefully

### Three Levels of Usage

#### 1. Zero Config (Recommended)
Just use the hook - everything is auto-detected:

```typescript
import { useAutoInitMasterView } from 'masterfabric-expo-core';

useAutoInitMasterView();
```

#### 2. Minimal Config
Customize app name or version:

```typescript
useAutoInitMasterView({
  appName: 'My Custom App',
  appVersion: '2.0.0'
});
```

#### 3. Full Config
Advanced customization:

```typescript
useAutoInitMasterView({
  appName: 'My App',
  config: {
    enableSentry: true,
    sentryConfig: { dsn: 'your-dsn' },
    enableFirebase: true,
    // ... other config
  }
});
```

## 📖 Usage

### Manual Initialization (Advanced)

```typescript
import { initMasterView } from 'masterfabric-expo-core';

// Initialize in your app's root (e.g., _layout.tsx)
await initMasterView({
  appName: 'My App',
  appVersion: '1.0.0',
  environment: __DEV__ ? 'development' : 'production',
  config: {
    enableActivityTracking: true,
    enableErrorBoundary: true,
    enableThemeSupport: true,
    enableLocalization: true,
    enableLoadingStates: true,
    enableNavigationTracking: true,
    maxActivityItems: 100,
    enableDebugMode: __DEV__,
    enableLogging: __DEV__,
    logLevel: __DEV__ ? 'debug' : 'error',
    enablePlatformFeatures: true,
    enableAccessibility: true,
    enablePermissions: true,
    // Sentry Integration (optional)
        enableSentry: true,
    // Firebase Integration (optional)
    enableFirebase: true,
    enableFirebaseAuth: true,
    enableFirebaseAnalytics: false, // web-only via Firebase Web SDK
    // firebaseConfig can be omitted if using .env (Expo public) variables:
    // EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_PROJECT_ID, EXPO_PUBLIC_FIREBASE_APP_ID, ...
    // firebaseConfig: {
    //   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
    //   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string,
    //   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string,
    // },
        sentryConfig: {
          dsn: 'YOUR_SENTRY_DSN_HERE', // Replace with your Sentry DSN
          environment: __DEV__ ? 'development' : 'production',
          debug: __DEV__,
          enableAutoSessionTracking: true,
          enableNativeCrashHandling: true,
          enableAutoPerformanceTracking: true,
          tracesSampleRate: __DEV__ ? 1.0 : 0.1,
          maxBreadcrumbs: 100,
          customOptions: {
            tags: {
              app_name: 'My App',
              version: '1.0.0',
            },
          },
        },
        
        customSettings: {
          apiUrl: 'https://api.myapp.com',
          features: {
            darkMode: true,
            notifications: true,
            analytics: true,
          },
        },
  },
  onError: (error) => {
    console.error('MasterView Error:', error);
  },
  onActivityTracked: (activity) => {
    console.log('Activity Tracked:', activity);
  },
  onThemeChanged: (theme) => {
    console.log('Theme Changed:', theme);
  },
  onLocaleChanged: (locale) => {
    console.log('Locale Changed:', locale);
  },
  onSentryError: (error) => {
    console.error('Sentry Error:', error);
  },
});
```
### Firebase: Auth example

```ts
import { firebaseIntegration } from 'masterfabric-expo-core';

// Sign in with email/password
await firebaseIntegration.signInWithEmail('user@example.com', 'password');

// Subscribe to auth state
const unsubscribe = firebaseIntegration.onAuthStateChanged((user) => {
  console.log('Auth user:', user?.uid);
});

// Later
unsubscribe();
await firebaseIntegration.signOut();
```

### Firebase: Analytics (web only)

```ts
import { firebaseIntegration } from 'masterfabric-expo-core';

firebaseIntegration.logEvent('purchase', { value: 9.99, currency: 'USD' });
firebaseIntegration.setUserId('user-123');
firebaseIntegration.setUserProperties({ plan: 'pro' });
```

Note: Firebase Web Analytics is not supported on React Native (iOS/Android) without a native bridge. Consider `@react-native-firebase/analytics` if you need native analytics.

### Using MasterView Components

```typescript
import React from 'react';
import { 
  ThemeProvider, 
  useThemeColors,
  useMasterView,
  ScreenHeader 
} from 'masterfabric-expo-core';

function MyScreen() {
  const colors = useThemeColors();
  const { trackActivity } = useMasterView();

  React.useEffect(() => {
    trackActivity('screen_opened');
  }, [trackActivity]);

  return (
    <ThemeProvider>
      <ScreenHeader title="My Screen" />
      {/* Your content */}
    </ThemeProvider>
  );
}
```

## 🏗️ Architecture

### Core Features

- **🎯 MasterView Pattern** - Consistent view architecture across your app
- **🎨 Theme System** - Built-in light/dark theme support
- **📊 Activity Tracking** - Automatic user activity and navigation tracking
- **🛡️ Error Handling** - Built-in error boundaries and error management
- **🌍 Internationalization** - Multi-language support
- **📱 Platform Detection** - Cross-platform utilities and constants
- **♿ Accessibility** - Built-in accessibility features
- **🔐 Permissions** - User-friendly permission management
- **💾 Persistence** - Automatic state persistence with AsyncStorage

### Components

- **ThemedView** - Theme-aware View component
- **ThemedText** - Theme-aware Text component
- **ScreenHeader** - Standardized screen header
- **ThemeProvider** - Context-based theme management

### Hooks

- **useMasterView** - Core MasterView functionality
- **useTheme** - Theme management
- **useAccessibility** - Accessibility utilities
- **usePermissions** - Permission management

### Helpers

- **Device Info** - Comprehensive device information and compatibility
- **Platform** - Platform detection and utilities
- **Permissions** - Permission management
- **Accessibility** - Accessibility utilities
- **String Helper** - Text manipulation and validation utilities
- **Logger Helper** - Development and production logging utilities
- **Snackbar Helper** - Snackbar notification utilities with action buttons and positioning
- **Toast Helper** - UI feedback and notification utilities
- **Time Helper** - Date and time manipulation utilities
- **Battery Helper** - Battery level, charging status, low power mode, and device information
- **Rich Text Helper** - HTML, Markdown, and text formatting utilities
- **Typography Helper** - Typography utilities, font scaling, and text styling
- **Validator Helper** - Form validation utilities
- **URL Launcher Helper** - Open URLs, emails, phone numbers, and external apps
- **UI Size Helper** - Responsive sizing utilities, spacing, padding, margins, and layout helpers
- **Onboarding Helper** - Onboarding flow management utilities
- **Network** - Network monitoring, speed testing, DNS, VPN detection, and connectivity management

## ⚙️ Configuration

### MasterViewConfig Options

```typescript
interface MasterViewConfig {
  // Core Features
  enableActivityTracking: boolean;
  enableErrorBoundary: boolean;
  enableThemeSupport: boolean;
  enableLocalization: boolean;
  enableLoadingStates: boolean;
  enableNavigationTracking: boolean;
  
  // Performance Settings
  maxActivityItems: number;
  errorRetryAttempts: number;
  loadingTimeout: number;
  
  // Storage Settings
  enablePersistence: boolean;
  storagePrefix: string;
  
  // Debug Settings
  enableDebugMode: boolean;
  enableLogging: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  
  // Platform Specific
  enablePlatformFeatures: boolean;
  enableAccessibility: boolean;
  enablePermissions: boolean;
  
  // Custom Settings
  customSettings?: Record<string, any>;
}
```

## 📚 Examples

### Basic Screen

```typescript
import React from 'react';
import { View } from 'react-native';
import { 
  ThemeProvider, 
  useThemeColors,
  useMasterView,
  ScreenHeader 
} from 'masterfabric-expo-core';

function HomeScreen() {
  const colors = useThemeColors();
  const { trackActivity } = useMasterView();

  React.useEffect(() => {
    trackActivity('home_opened');
  }, [trackActivity]);

  return (
    <View style={{ backgroundColor: colors.background }}>
      <ScreenHeader title="Home" />
      {/* Your content */}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
```

### Device Information

```typescript
import { getDeviceInfo, checkDeviceCompatibility } from 'masterfabric-expo-core';

// Get comprehensive device info
const deviceInfo = await getDeviceInfo();

// Check compatibility
const compatibility = await checkDeviceCompatibility();

if (!compatibility.isCompatible) {
  console.log('Compatibility issues:', compatibility.issues);
}
```

### Platform Detection

```typescript
import { getPlatform, selectPlatform, getSafeAreaValues } from 'masterfabric-expo-core';

const platform = getPlatform(); // 'ios' | 'android' | 'web'
const headerHeight = selectPlatform(44, 56, 50); // iOS, Android, Web
const safeArea = getSafeAreaValues();
```

### Permissions

```typescript
import { usePermissions } from 'masterfabric-expo-core';

function MyComponent() {
  const { requestPermission, checkPermission } = usePermissions();
  
  const handleCameraPermission = async () => {
    const status = await requestPermission('camera');
    if (status.granted) {
      // Use camera
    }
  };
}
```

### Accessibility

```typescript
import { useAccessibility } from 'masterfabric-expo-core';

function MyComponent() {
  const { isScreenReaderEnabled, getAnimationDuration, announce } = useAccessibility();
  
  const animationDuration = getAnimationDuration(300); // Respects reduce motion
  const announceMessage = () => announce('Button pressed');
}
```

### Network Helper

```typescript
import { networkHelper } from 'masterfabric-expo-core';
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Start monitoring with 30 second intervals
    networkHelper.start(30000);
    
    // Listen to network changes
    const unsubscribe = networkHelper.onChange((isOnline, networkInfo) => {
      console.log('Network status:', isOnline);
      console.log('IP:', networkInfo.ip);
      console.log('Location:', networkInfo.location);
      console.log('Speed:', networkInfo.speedTest?.downloadSpeed, 'Mbps');
      console.log('VPN:', networkInfo.vpn);
    });
    
    // Manual check
    const checkNetwork = async () => {
      const isOnline = await networkHelper.checkNow();
      const info = networkHelper.getNetworkInfo();
      console.log('Network info:', info);
    };
    
    checkNetwork();
    
    return () => {
      unsubscribe();
      networkHelper.stop();
    };
  }, []);
}
```

### Sentry Integration

```typescript
import { useMasterView, MasterView } from 'masterfabric-expo-core';

function MyComponent() {
  const { captureException, captureMessage, addBreadcrumb, setSentryUser } = useMasterView();

  // Capture exceptions
  const handleError = () => {
    try {
      throw new Error('Something went wrong');
    } catch (error) {
      captureException(error as Error, {
        tags: { component: 'MyComponent' },
        extra: { userId: '123' }
      });
    }
  };

  // Send custom messages
  const sendMessage = () => {
    captureMessage('User performed action', 'info', {
      tags: { action: 'button_click' }
    });
  };

  // Add breadcrumbs
  const trackUserAction = () => {
    addBreadcrumb({
      message: 'User clicked button',
      category: 'user_action',
      level: 'info',
      data: { buttonId: 'submit' }
    });
  };

  // Set user context
  const loginUser = (user) => {
    setSentryUser({
      id: user.id,
      username: user.username,
      email: user.email
    });
  };
}

// Direct access to Sentry integration
const masterView = MasterView.getInstance();
masterView.captureException(new Error('Global error'));
masterView.captureMessage('Global message', 'info');
```

## 🔍 Available Helpers

The package includes a comprehensive set of helper utilities:

### Core Helpers
- **connectivity** - Network connectivity detection
- **platform** - Platform detection and utilities
- **permissions** - Permission management
- **accessibility** - Accessibility utilities
- **device-info** - Device information and compatibility checks

### Utility Helpers
- **string_helper** - String manipulation, validation, and formatting
- **logger_helper** - Logging utilities for development and production
- **time_helper** - Date/time formatting, parsing, and manipulation
- **validator_helper** - Form and data validation utilities
- **typography_helper** - Typography and text styling utilities
- **ui_size_helper** - Responsive sizing and layout utilities

### UI Helpers
- **snackbar_helper** - Snackbar notifications with actions
- **toast_helper** - Toast notification utilities
- **rich_text_helper** - HTML/Markdown parsing and formatting

### Integration Helpers
- **batteryHelper** - Battery status and device power information
- **url_launcher_helper** - Open URLs, emails, phone numbers, and apps
- **onboarding_helper** - Onboarding flow management

### Usage Example

```typescript
import { 
  formatDate, 
  fromNow,
  urlLauncherHelper,
  formatBatteryPercentage 
} from 'masterfabric-expo-core';

// Time helper
const formatted = formatDate(new Date(), 'long', 'en-US');
const relative = fromNow(new Date(Date.now() - 3600000)); // "1 hour ago"

// URL launcher helper
await urlLauncherHelper.openUrl('https://example.com');
await urlLauncherHelper.openEmail('user@example.com', { subject: 'Hello' });

// Battery helper
const percentage = formatBatteryPercentage(0.75); // "75%"
```

## 🐛 Troubleshooting

### Missing Exports Errors

If you encounter errors like "Cannot find module" or "export not found":

1. **Rebuild the package**: Ensure the package is built with latest exports
   ```bash
   cd packages/masterfabric-expo-core
   npm run build
   ```

2. **Check import paths**: Verify you're importing from the main package:
   ```typescript
   import { time_helper, urlLauncherHelper } from 'masterfabric-expo-core';
   ```

3. **Verify package version**: Ensure you're using the latest version that includes all helpers

### Peer Dependency Warnings

If you see peer dependency warnings:

1. **Install missing dependencies**: The package requires several peer dependencies:
   ```bash
   npm install @react-native-async-storage/async-storage expo-constants expo-device react-native-safe-area-context react-native-screens zustand @expo/vector-icons react-native-get-random-values
   ```

2. **Check versions**: Ensure peer dependencies meet minimum version requirements listed in `package.json`

### Initialization Errors

If `initMasterView` fails:

1. **Check configuration**: Verify all required config values are provided
2. **Environment variables**: Ensure `.env` file is set up correctly for Firebase/Supabase if using those integrations
3. **Async initialization**: Make sure `initMasterView` is awaited:
   ```typescript
   useEffect(() => {
     initMasterView({ /* config */ }).catch(console.error);
   }, []);
   ```

### Build Issues

If TypeScript compilation fails:

1. **Clean and rebuild**: 
   ```bash
   npm run clean
   npm run build
   ```

2. **Check TypeScript version**: Ensure TypeScript >= 5.0.0
3. **Verify exports**: Check that `dist/index.d.ts` contains all expected exports

## 🔧 Development

### Building the Package

```bash
cd packages/masterfabric-expo-core
npm run build
```

### Creating a New App

```bash
# Using the CLI
npx create-masterfabric-app MyApp

# Or using npm script
npm run create-app MyApp
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## 🔄 Migration from Manual Setup

If you're currently using `initMasterView()` manually, you can easily migrate to the effortless setup:

### Before (Manual)
```typescript
useEffect(() => {
  initMasterView({
    appName: 'My App',
    appVersion: '1.0.0',
    environment: __DEV__ ? 'development' : 'production',
    config: { /* complex config */ }
  }).catch(console.error);
}, []);
```

### After (Effortless)
```typescript
useAutoInitMasterView();
```

That's it! The hook automatically detects everything. You can still provide custom options if needed:

```typescript
useAutoInitMasterView({
  appName: 'My App', // Optional override
  config: { /* your custom config */ }
});
```

## 📞 Support

For support and questions, please open an issue on our GitHub repository.
