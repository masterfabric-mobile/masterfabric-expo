# 0. Splash View

The Splash screen is the very first screen the user sees when opening the app. Its main purpose is to provide a smooth entry point while the application initializes in the background.

### Mockup

```
+-----------------------------------------------------+
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                  [App Logo]                         |
|                                                     |
|                  Voice AI                           |
|                                                     |
|                                                     |
|                                                     |
|              (Spinner: Initializing...)             |
|                                                     |
+-----------------------------------------------------+
|                                                     |
+-----------------------------------------------------+
```

### Core Logic & Functionality
- The screen displays the application's logo and name.
- It shows a loading indicator to give feedback that work is being done.
- In the background, the app performs critical initialization tasks:
  - Loading fonts and static assets.
  - Checking the user's authentication status.
  - Initializing third-party services like Supabase and OneSignal.
- Once initialization is complete, the app navigates the user to the appropriate next screen:
  - **Onboarding/Login Screen**: If the user is not authenticated.
  - **Dashboard View**: If the user is already logged in.

### Architecture & Components

This view will be located at `src/screens/splash/SplashScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Image`, `Text`, `Spinner`.
- **`@react-native-async-storage/async-storage`**: To check for a persisted session token.

#### View-Specific Components
- This screen is typically simple enough not to require view-specific components. The layout can be handled directly within `SplashScreen.tsx`.

### State Management
- A local `isLoading` state might be used, but the primary logic is centered around a single `useEffect` hook that runs on mount.
- An `initialization` function is called inside the `useEffect`. This function determines the user's auth status and which screen to navigate to next.

### Integrations
- **Supabase**: The `supabase.auth.getSession()` method is called to check for an active user session. This is the most critical integration for this screen.
- **Expo Application Splash Screen**: This view works in tandem with Expo's native splash screen configuration (`app.json`) to ensure a seamless transition from the native launch screen to the first React Native screen.
