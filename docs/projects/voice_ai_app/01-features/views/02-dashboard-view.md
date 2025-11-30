# 1. Dashboard View

The Dashboard is the main screen users see after logging in. Its primary purpose is to provide immediate access to the core recording functionality and display a summary of recent activity.

### Mockup

```
+-----------------------------------------------------+
| [Avatar] Welcome back, [User Name]!         [Bell]  |
+-----------------------------------------------------+
|                                                     |
|  +-----------------------------------------------+  |
|  | Your Subscription: [Diamond] 💎               |  |
|  | Recordings this month: 7 / Unlimited          |  |
|  +-----------------------------------------------+  |
|                                                     |
|  Recent Recordings                                  |
|  +-----------------------------------------------+  |
|  | Meeting Summary - Nov 28    >                 |  |
|  +-----------------------------------------------+  |
|  | Brainstorming Session - Nov 27  >             |  |
|  +-----------------------------------------------+  |
|  | ... see all                                   |  |
|                                                     |
|                                                     |
|                                                     |
|                  (    +    )                       |
|               Start New Recording                   |
|                                                     |
+-----------------------------------------------------+
| [Home]   [History]   [Tasks]   [Settings]           |
+-----------------------------------------------------+
```

### Core Logic & Functionality

- The view greets the user and displays their name and subscription status.
- It shows a list of the 3-5 most recent recordings. Tapping a recording navigates to the **Summary View**.
- The main call-to-action is the large "Start New Recording" button, which navigates to the **Recording View**.
- The bell icon navigates to a potential **Notifications** screen.
- The bottom navigation bar provides access to all major sections of the app.

### Architecture & Components

This view will be located at `src/screens/main/DashboardScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Card`, `Text`, `Icon`, `Button`, `Avatar`.
  - **Contexts**: `useAuth()` to get user data, `useSubscription()` to get plan details.
  - **Hooks**: A custom `useRecentRecordings()` hook could be created to fetch data.
  - **Helpers**: `TimeHelper` to format dates.
- **`zustand`**: For managing the global state of recordings.

#### View-Specific Components
- **`DashboardHeader.tsx`**: A component containing the `Avatar`, greeting message, and notification bell.
- **`SubscriptionStatusCard.tsx`**: The card displaying the user's current subscription tier and usage stats.
- **`RecentRecordingsList.tsx`**: A `FlatList` component that renders `RecordingListItem` components.
- **`StartRecordingButton.tsx`**: The main floating action button.

### State Management
- **User Data**: Sourced from `useAuth()` context.
- **Subscription Data**: Sourced from `useSubscription()` context.
- **Recent Recordings**: Fetched from the backend and potentially stored in a global `Zustand` store (`recordingStore`). The `useRecentRecordings` hook would select from this store. `isLoading` and `error` states will be managed locally within the hook.

### Integrations
- **Supabase**: To fetch the list of recent recordings from the database.
- **OneSignal**: The notification bell icon could show a badge if there are unread notifications.
- **Stripe/Iyzico**: Subscription status is read, but not modified here.
