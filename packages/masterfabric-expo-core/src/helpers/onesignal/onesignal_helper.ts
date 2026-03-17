/**
 * OneSignal Helper (Core)
 *
 * Wrapper around react-native-onesignal for remote push notifications.
 * Uses lazy-loading so projects without OneSignal can still load the core package.
 * Supports iOS and Android; not intended for web.
 *
 * @example
 * ```typescript
 * import { onesignalHelper } from 'masterfabric-expo-core';
 *
 * // In app entry (e.g. _layout.tsx)
 * onesignalHelper.init('YOUR_APP_ID', { promptForPush: true });
 *
 * // Request permission later
 * const granted = await onesignalHelper.requestPermission();
 *
 * // User identification (SDK v5)
 * onesignalHelper.login('user-123');
 * onesignalHelper.logout();
 *
 * // Disable/enable push
 * await onesignalHelper.setPushDisabled(true);
 *
 * // Listen to notification click
 * onesignalHelper.addNotificationClickListener((event) => { ... });
 * ```
 */

import { Platform } from 'react-native';
import type {
  OneSignalForegroundWillShowHandler,
  OneSignalInitOptions,
  OneSignalLogLevel,
  OneSignalNotificationClickEvent,
  OneSignalNotificationClickHandler,
  OneSignalPermissionStatus,
  OneSignalSubscriptionState,
} from './types';

type OneSignalModuleType = typeof import('react-native-onesignal');
type OneSignalAPI = {
  initialize: (appId: string) => void;
  Notifications: {
    requestPermission: (fallbackToSettings?: boolean) => Promise<boolean | [boolean, unknown]>;
    getPermissionAsync: () => Promise<boolean>;
    canRequestPermission?: () => Promise<boolean>;
    addEventListener?: (event: string, cb: (...args: any[]) => void) => () => void;
  };
  User?: {
    pushSubscription?: {
      optedIn?: boolean;
      optIn?: () => Promise<void>;
      optOut?: () => Promise<void>;
      id?: unknown;
      token?: unknown;
    };
  };
  Debug?: { setLogLevel?: (level: number) => void };
  LogLevel?: { Verbose?: number };
  login?: (externalUserId: string) => Promise<void> | void;
  logout?: () => Promise<void> | void;
};

let OneSignalModule: OneSignalModuleType | null = null;

async function getOneSignalModule(): Promise<OneSignalModuleType> {
  if (OneSignalModule) return OneSignalModule;
  try {
    OneSignalModule = await import('react-native-onesignal');
    return OneSignalModule;
  } catch {
    throw new Error(
      'react-native-onesignal is required for the OneSignal helper. Install it with: npm install react-native-onesignal'
    );
  }
}

/** Resolve the OneSignal API from the package (named export "OneSignal" or default). */
async function getOneSignal(): Promise<OneSignalAPI> {
  const mod = await getOneSignalModule();
  const api = (mod as { OneSignal?: OneSignalAPI }).OneSignal ?? (mod as { default?: OneSignalAPI }).default;
  if (!api || typeof api.initialize !== 'function') {
    throw new Error(
      'OneSignal native module not loaded. For Expo, add onesignal-expo-plugin to app.config.js and run a new native build (npx expo run:ios).'
    );
  }
  return api;
}

/**
 * OneSignal Helper – remote push notifications via OneSignal SDK.
 */
class OneSignalHelper {
  private _initialized = false;

  /**
   * Whether the SDK has been initialized (init() called with app ID).
   */
  get isInitialized(): boolean {
    return this._initialized;
  }

  /**
   * Initialize OneSignal with your App ID. Call once at app startup (e.g. in root _layout).
   * @param appId – OneSignal App ID from dashboard Settings > Keys & IDs
   * @param options – optional prompt for push and verbose logging
   */
  async init(appId: string, options?: OneSignalInitOptions): Promise<void> {
    if (this._initialized) return;
    const OneSignal = await getOneSignal();
    OneSignal.initialize(appId);
    this._initialized = true;
    if (options?.verbose && OneSignal.Debug?.setLogLevel != null) {
      const { LogLevel } = OneSignal;
      if (typeof LogLevel !== 'undefined') {
        (OneSignal.Debug as { setLogLevel: (level: number) => void }).setLogLevel(
          (LogLevel as { Verbose?: number }).Verbose ?? 6
        );
      }
    }
    if (options?.promptForPush === true && (Platform.OS === 'ios' || Platform.OS === 'android')) {
      try {
        // iOS needs a short delay after initialize before the permission prompt can be shown
        await new Promise((r) => setTimeout(r, Platform.OS === 'ios' ? 800 : 300));
        const result = await OneSignal.Notifications.requestPermission(false);
        const granted = Array.isArray(result) ? result[0] : result;
        if (__DEV__ && granted !== undefined) {
          console.log('[OneSignal] Permission requested, granted:', granted);
        }
      } catch (e) {
        if (__DEV__) console.warn('[OneSignal] requestPermission:', e);
      }
    }
  }

  /**
   * Request push notification permission from the user.
   * @param fallback – on iOS, whether to show a fallback alert if permission was previously denied (default false)
   * @returns permission granted
   */
  async requestPermission(fallback = false): Promise<boolean> {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return false;
    }
    const OneSignal = await getOneSignal();
    const result = await OneSignal.Notifications.requestPermission(fallback);
    const granted = Array.isArray(result) ? result[0] : result;
    return granted === true;
  }

  /**
   * Get current push permission status.
   */
  async getPermissionAsync(): Promise<OneSignalPermissionStatus> {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return { granted: false };
    }
    const OneSignal = await getOneSignal();
    const granted = await OneSignal.Notifications.getPermissionAsync();
    const canAskAgain =
      typeof OneSignal.Notifications.canRequestPermission === 'function'
        ? await OneSignal.Notifications.canRequestPermission()
        : undefined;
    return { granted: granted === true, canAskAgain };
  }

  /**
   * Identify the current user (SDK v5). Use after login.
   */
  async login(externalUserId: string): Promise<void> {
    const OneSignal = await getOneSignal();
    if (typeof OneSignal.login === 'function') {
      await OneSignal.login(externalUserId);
    }
  }

  /**
   * Clear user identification (SDK v5). Use on logout.
   */
  async logout(): Promise<void> {
    const OneSignal = await getOneSignal();
    if (typeof OneSignal.logout === 'function') {
      await OneSignal.logout();
    }
  }

  /**
   * Enable or disable push for the current device/user.
   */
  async setPushDisabled(disabled: boolean): Promise<void> {
    const OneSignal = await getOneSignal();
    if (typeof OneSignal.Notifications.requestPermission !== 'function') return;
    try {
      const OS = OneSignal as unknown as { disablePush?: (disable: boolean) => void };
      if (disabled) {
        if (typeof OS.disablePush === 'function') {
          OS.disablePush(true);
        } else if (OneSignal.User?.pushSubscription?.optOut != null) {
          await OneSignal.User.pushSubscription.optOut();
        }
      } else {
        if (typeof OS.disablePush === 'function') {
          OS.disablePush(false);
        } else if (OneSignal.User?.pushSubscription?.optIn != null) {
          await OneSignal.User.pushSubscription.optIn();
        }
      }
    } catch {
      // SDK API may vary
    }
  }

  /**
   * Check if push is currently disabled for this subscription.
   */
  async isPushDisabled(): Promise<boolean> {
    const OneSignal = await getOneSignal();
    try {
      if (OneSignal.User?.pushSubscription?.optedIn != null) {
        return !OneSignal.User.pushSubscription.optedIn;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Set handler for when a notification is about to be shown while app is in foreground.
   * Return an object with modified notification to display, or void to show as-is / suppress.
   */
  addForegroundWillShowHandler(handler: OneSignalForegroundWillShowHandler): () => void {
    let remove: (() => void) | undefined;
    getOneSignal().then((OneSignal) => {
      const addEventListener =
        (OneSignal.Notifications as { addEventListener?: (event: string, cb: (e: unknown) => void) => () => void })
          ?.addEventListener;
      if (typeof addEventListener !== 'function') return;
      remove = addEventListener('foregroundWillDisplay', (event: unknown) => {
        const e = event as { notification: OneSignalNotificationClickEvent['notification']; getNotification?: () => unknown; preventDefault?: () => void };
        const notif = e?.notification ?? (typeof e?.getNotification === 'function' ? e.getNotification() : undefined);
        if (!notif) return;
        Promise.resolve(handler({ notification: notif })).then((result) => {
          if (result != null && typeof e.preventDefault === 'function') {
            e.preventDefault();
          }
        });
      });
    });
    return () => {
      if (typeof remove === 'function') remove();
    };
  }

  /**
   * Add listener for notification click (user tapped notification).
   */
  addNotificationClickListener(handler: OneSignalNotificationClickHandler): () => void {
    let remove: (() => void) | undefined;
    getOneSignal().then((OneSignal) => {
      const addEventListener =
        (OneSignal.Notifications as { addEventListener?: (event: string, cb: (e: OneSignalNotificationClickEvent) => void) => () => void })
          ?.addEventListener;
      if (typeof addEventListener === 'function') {
        remove = addEventListener('click', handler);
      }
    });
    return () => {
      if (typeof remove === 'function') remove();
    };
  }

  /**
   * Add listener for permission changes.
   */
  addPermissionChangeListener(handler: (granted: boolean) => void): () => void {
    let remove: (() => void) | undefined;
    getOneSignal().then((OneSignal) => {
      const addEventListener =
        (OneSignal.Notifications as { addEventListener?: (event: string, cb: (granted: boolean) => void) => () => void })
          ?.addEventListener;
      if (typeof addEventListener === 'function') {
        remove = addEventListener('permissionChange', handler);
      }
    });
    return () => {
      if (typeof remove === 'function') remove();
    };
  }

  /**
   * Get current subscription/device state (e.g. push token, opted-in).
   */
  async getSubscriptionState(): Promise<OneSignalSubscriptionState> {
    const OneSignal = await getOneSignal();
    try {
      const pushSubscription = OneSignal.User?.pushSubscription;
      if (pushSubscription) {
        const id = typeof pushSubscription.id === 'function' ? await pushSubscription.id() : pushSubscription.id;
        const token = typeof pushSubscription.token === 'function' ? await pushSubscription.token() : pushSubscription.token;
        const optedIn = pushSubscription.optedIn;
        return { id, token, optedIn };
      }
      return {};
    } catch {
      return {};
    }
  }

  /**
   * Set debug log level (0–6). Use before init for verbose logs.
   */
  async setLogLevel(level: OneSignalLogLevel): Promise<void> {
    const OneSignal = await getOneSignal();
    if (OneSignal.Debug?.setLogLevel != null) {
      (OneSignal.Debug as { setLogLevel: (l: number) => void }).setLogLevel(level);
    }
  }
}

export const onesignalHelper = new OneSignalHelper();
export type { OneSignalHelper };
