# Technology Stack

Technologies, frameworks, and libraries used in the Recipio app.

## Core Framework

- **Expo SDK 54.0.31**: Cross-platform development framework based on React Native
- **React Native 0.81.5**: Mobile app library
- **React 19.1.0**: UI library
- **TypeScript 5.9.2**: Typed JavaScript superset

## UI & Styling

- **React Native StyleSheet**: Native style management
- **@masterfabric-expo/core**: MasterFabric core components and styles
  - `ThemedView`: Theme-aware View component
  - `ThemedText`: Theme-aware Text component
  - `Colors`: Color palette constants
  - `ThemeProvider`: Theme context provider
- **@expo/vector-icons**: Icon library (MaterialIcons)

## State Management

- **Zustand 4.4.0**: Lightweight state management
- **@react-native-async-storage/async-storage 2.2.0**: Persistent storage
  - Used for onboarding status
  - Integrated with Zustand persist middleware

## Navigation

- **Expo Router 6.0.17**: File-based routing
  - Route definitions in `app/` folder
  - Type-safe navigation
  - Deep linking support
- **react-native-screens 4.16.0**: Native screen management
- **react-native-safe-area-context 5.6.0**: Safe area handling

## Backend & Database

- **Supabase**: Backend-as-a-Service
  - PostgreSQL database
  - Authentication (optional, later phase)
  - Real-time subscriptions (optional)
  - Storage (optional)
- **@supabase/supabase-js 2.39.0**: Supabase JavaScript client

## Development Tools

- **Metro Bundler**: JavaScript bundler for React Native
  - Custom resolver (stubs, path aliases)
  - Local package resolution
  - Watch folders configuration
- **TypeScript**: Type checking and developer experience
- **@babel/core 7.25.2**: JavaScript compiler

## Utilities

- **expo-splash-screen 31.0.12**: Native splash screen
- **expo-constants 18.0.13**: App constants (e.g. Supabase config)
- **expo-device 8.0.10**: Device info
- **expo-status-bar 3.0.9**: Status bar
- **react-native-gesture-handler 2.28.0**: Gesture handling

## Platform Support

- **iOS**: iOS 13.0+
- **Android**: Android 6.0+ (API level 23+)
- **Web**: Modern browsers (optional)

## Package Versions

### Core Dependencies

```json
{
  "dependencies": {
    "expo": "~54.0.31",
    "expo-router": "~6.0.17",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "@masterfabric-expo/core": "file:../../packages/masterfabric-expo-core",
    "@supabase/supabase-js": "^2.39.0",
    "@react-native-async-storage/async-storage": "2.2.0",
    "zustand": "^4.4.0",
    "@expo/vector-icons": "^15.0.2"
  }
}
```

### Overrides

```json
{
  "overrides": {
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

## Optional Dependencies (Stubbed)

These packages are not used and are stubbed in Metro config:

- **Firebase**: Stubbed (not used)
- **Sentry**: Stubbed (not used)
- **@react-native-community/slider**: Stubbed
- **expo-haptics**: Stubbed
- **expo-battery**: Stubbed
- **expo-av**: Stubbed
- **expo-web-browser**: Stubbed

## Build Tools

- **npm**: Package manager
- **Metro Bundler**: JavaScript bundler
- **TypeScript Compiler**: Type checking

## Development Workflow

1. **Development server**: `npm start` or `npx expo start`
2. **Hot reload**: Enabled by default
3. **Type checking**: TypeScript compiler
4. **Metro Bundler**: Bundling and transformation

## Related Documentation

- [Implementation Analysis](../00-implementation-analysis.md) — Implementation details
- [Architecture Overview](../02-architecture/overview.md) — Architecture
- [Supabase Integration](../04-integrations/supabase.md) — Backend integration

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
