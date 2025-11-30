# Push Notifications with OneSignal

- **Service**: **OneSignal**
- **Description**: A comprehensive service for managing push notifications. The implementation handles device registration, requesting user permissions, and processing incoming notification events. The logic is encapsulated in `src/services/push_notifications/onesignal_service.ts`.
- **Configuration**: `src/config/notifications.ts`
- **Required Packages**:
  ```bash
  npm install react-native-onesignal
  ```
- **Setup**: OneSignal requires its own setup process, including adding the App ID to your project configuration and potentially adding service extensions for iOS. Refer to the official `react-native-onesignal` documentation for the most up-to-date instructions.
