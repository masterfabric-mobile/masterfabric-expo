# Analytics with Google Analytics

- **Service**: **Google Analytics (via Firebase)**
- **Description**: This integration is used to track user behavior, screen views, and custom events to gather insights on app usage and drive product decisions. The service wrapper is implemented in `src/services/analytics/google_analytics.ts`.
- **Configuration**: `src/config/analytics.ts`
- **Required Packages**:
  ```bash
  npm install @react-native-firebase/app
  npm install @react-native-firebase/analytics
  ```
- **Setup**:
  1. A Firebase project must be created and connected to your application.
  2. The Android setup requires placing the `google-services.json` file in the `android/app` directory.
  3. The iOS setup requires adding the `GoogleService-Info.plist` file to the Xcode project.
