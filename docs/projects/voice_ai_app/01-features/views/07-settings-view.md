# 7. Settings View

The Settings screen provides users with access to account management, subscription details, app preferences, and support resources.

### Mockup

```
+-----------------------------------------------------+
|  Settings                                           |
+-----------------------------------------------------+
|  ▼ Account                                          |
|  +-----------------------------------------------+  |
|  | [Avatar] [User Name]                          |  |
|  |          [user.email@example.com]             |  |
|  +-----------------------------------------------+  |
|                                                     |
|  ▼ Subscription                                     |
|  +-----------------------------------------------+  |
|  | Your Plan: Diamond 💎    [Manage Subscription] > |  |
|  +-----------------------------------------------+  |
|                                                     |
|  ▼ Preferences                                      |
|  +-----------------------------------------------+  |
|  | Notifications                  [Toggle Switch]  |  |
|  +-----------------------------------------------+  |
|  | Default Language: English    >                 |  |
|  +-----------------------------------------------+  |
|                                                     |
|  ▼ Support                                          |
|  +-----------------------------------------------+  |
|  | Help Center                  >                 |  |
|  +-----------------------------------------------+  |
|  | Privacy Policy               >                 |  |
|  +-----------------------------------------------+  |
|                                                     |
|  +-----------------------------------------------+  |
|  |                    Sign Out                     |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
| [Home]   [History]   [Tasks]   [Settings]           |
+-----------------------------------------------------+
```

### Core Logic & Functionality
- **Account Info**: Displays the current user's name and email.
- **Subscription Management**: Shows the user's current plan and provides a link to manage it (e.g., upgrade, downgrade, cancel).
- **App Preferences**: Allows users to toggle settings like push notifications or change the app's language.
- **Support Links**: Provides navigation to help-desk articles, privacy policy, and terms of service.
- **Sign Out**: The most critical function, allowing the user to log out of the application.

### Architecture & Components

This view will be located at `src/screens/settings/SettingsScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Text`, `Card`, `Icon`, `Avatar`, `ListItem`.
  - **Contexts**: `useAuth()` for user data and the sign-out function, `useSubscription()` for plan details.
- **`expo-web-browser`**: To open links like "Privacy Policy" or the Stripe customer portal in an in-app browser.

#### View-Specific Components
- **`SettingsSection.tsx`**: A reusable component to create the titled sections (e.g., "Account", "Preferences").
- **`SettingsListItem.tsx`**: A configurable list item component for the various settings rows.

### State Management
- Most of the data displayed is sourced directly from contexts (`useAuth`, `useSubscription`) and does not require local state.
- The state for UI controls like the "Notifications" toggle switch would be managed locally with `useState`, and the corresponding update action would be dispatched (e.g., calling a function to enable/disable notifications via OneSignal).

### Integrations
- **Supabase**: The "Sign Out" button will call the `supabase.auth.signOut()` method, wrapped inside the `useAuth()` hook.
- **Stripe/Iyzico**: The "Manage Subscription" button would ideally open a Stripe Customer Portal session. This typically requires a backend call to generate a secure portal link, which is then opened in a `WebView` or with `expo-web-browser`.
- **OneSignal**: Toggling the notifications preference would call OneSignal's SDK to either enable or disable push notifications for the device (`OneSignal.disablePush(true/false)`).
