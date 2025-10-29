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

## 📖 Usage

### Initialize MasterView

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

## 📞 Support

For support and questions, please open an issue on our GitHub repository.
