/**
 * OneSignal Helper – public types.
 * These types mirror the react-native-onesignal SDK surface so the core
 * package does not require the SDK as a direct dependency for typing.
 */

export interface OneSignalInitOptions {
  /** Prompt for push permission immediately after init. Default: false. */
  promptForPush?: boolean;
  /** Enable verbose logging. Default: false. */
  verbose?: boolean;
}

export interface OneSignalPermissionStatus {
  granted: boolean;
  canAskAgain?: boolean;
}

export interface OneSignalNotificationClickEvent {
  notification: {
    notificationId?: string;
    body?: string;
    title?: string;
    additionalData?: Record<string, unknown>;
  };
  result?: {
    actionId?: string;
    url?: string;
  };
}

export type OneSignalForegroundWillShowHandler = (
  event: { notification: OneSignalNotificationClickEvent['notification'] }
) => void | { notification: OneSignalNotificationClickEvent['notification'] } | Promise<void | { notification: OneSignalNotificationClickEvent['notification'] }>;

export type OneSignalNotificationClickHandler = (event: OneSignalNotificationClickEvent) => void;

export interface OneSignalSubscriptionState {
  id?: string;
  token?: string;
  optedIn?: boolean;
}

export type OneSignalLogLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
