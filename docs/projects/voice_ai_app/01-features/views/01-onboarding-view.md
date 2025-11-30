# 6. Onboarding View

The Onboarding screen is shown to new, unauthenticated users after the Splash screen. Its purpose is to showcase the app's value and guide the user to either sign up or log in. It may also include slides that highlight key features.

### Mockup

```
+-----------------------------------------------------+
|                                                     |
|                  [App Feature Graphic]              |
|                                                     |
|          Record, Transcribe, and Summarize          |
|        Turn your voice notes into actionable tasks  |
|        effortlessly with the power of AI.           |
|                                                     |
|                                                     |
|                                                     |
|                    ● ● ○                            |
|                                                     |
|       +---------------------------------------+     |
|       |         Sign Up with Google           |     |
|       +---------------------------------------+     |
|       +---------------------------------------+     |
|       |          Sign In with Email           |     |
|       +---------------------------------------+     |
|                                                     |
+-----------------------------------------------------+
|                                                     |
+-----------------------------------------------------+
```

### Core Logic & Functionality
- The screen often uses a `Swiper` or `Carousel` to present a few slides explaining the app's benefits.
- It provides clear, primary calls-to-action for signing up or logging in. Social login options (e.g., Google, Apple) are prioritized for a better user experience.
- After a successful sign-up or sign-in, the user is navigated to the **Dashboard View**.

### Architecture & Components

This view will be located at `src/screens/auth/OnboardingScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Text`, `Button`, `Icon`.
- **`react-native-swiper`** or a similar carousel library can be used for the feature slides.

#### View-Specific Components
- **`FeatureSlide.tsx`**: A reusable component for a single slide in the onboarding carousel, containing an image and text.
- **`AuthButtons.tsx`**: A component that groups the various sign-up and sign-in buttons (Google, Apple, Email).

### State Management
- Most of the state is related to the UI, such as the current slide index of the carousel, which is managed locally with `useState`.
- `isLoading` and `error` states for the authentication process are also managed locally. When an authentication action is initiated (e.g., user clicks "Sign Up with Google"), an `isLoading` flag is set to true to show a spinner on the button and prevent double-clicks.

### Integrations
- **Supabase**: This is the primary integration. The buttons will call the respective Supabase auth methods:
  - `supabase.auth.signInWithOAuth({ provider: 'google' })`
  - `supabase.auth.signInWithPassword(...)`
- The authentication logic itself would be wrapped in the `useAuth()` context/hook to be reusable across the app. The buttons on this screen would call functions provided by that hook (e.g., `signInWithGoogle()`).
