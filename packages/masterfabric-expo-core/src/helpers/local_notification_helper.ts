/**
 * Local Notification Helper (Core)
 *
 * Utilities for scheduling, managing, and handling local notifications.
 * Uses expo-notifications and integrates with the permissions helper for
 * notification permission. Supports iOS and Android; not intended for web.
 *
 * @example
 * ```typescript
 * import { localNotificationHelper, permissions } from 'masterfabric-expo-core';
 *
 * const status = await localNotificationHelper.requestPermission();
 * if (status.granted) {
 *   const id = await localNotificationHelper.schedule({
 *     title: 'Hello',
 *     body: 'This is a test',
 *     trigger: { seconds: 5 },
 *   });
 * }
 * ```
 */

import { Platform, Linking } from 'react-native';
import type { PermissionStatus } from './permissions';
import {
  checkPermission as permissionsCheck,
  requestPermission as permissionsRequest,
  showPermissionSettingsAlert,
  openAppSettings,
} from './permissions';
import { DEFAULT_CHANNEL_ID, DEFAULT_CHANNELS } from './notifications/constants';
import type {
  NotificationOptions,
  RecurringNotificationOptions,
  NotificationTrigger,
  TimeIntervalTrigger,
  DateTrigger,
  CalendarTrigger,
  RecurringTrigger,
  CategoryOptions,
  ChannelOptions,
  NotificationContent,
  ScheduledNotification,
  Notification,
  NotificationResponse,
  NotificationSettings,
  Subscription,
  NotificationValidationResult,
  ReceivedListener,
  TappedListener,
  DismissedListener,
  ActionHandler,
  NotificationPermissionOptions,
  Attachment,
} from './notifications/types';

// Lazy-load expo-notifications so projects without it can still load the helper (e.g. web).
let NotificationsModule: typeof import('expo-notifications') | null = null;

async function getNotifications(): Promise<typeof import('expo-notifications')> {
  if (NotificationsModule) return NotificationsModule;
  try {
    NotificationsModule = await import('expo-notifications');
    return NotificationsModule;
  } catch {
    throw new Error(
      'expo-notifications is required for local notifications. Install it with: npx expo install expo-notifications'
    );
  }
}

function mapExpoStatusToPermissionStatus(
  status: 'granted' | 'denied' | 'undetermined'
): PermissionStatus {
  const granted = status === 'granted';
  return {
    granted,
    canAskAgain: status === 'undetermined' || (status === 'denied' && Platform.OS === 'android'),
    status:
      status === 'granted'
        ? 'granted'
        : status === 'denied'
          ? 'denied'
          : 'unknown',
    message: granted ? undefined : 'Notification permission not granted',
  };
}

function buildContentFromOptions(options: NotificationOptions): Record<string, unknown> {
  const content: Record<string, unknown> = {
    title: options.title,
    body: options.body,
    data: options.data ?? {},
  };
  if (options.subtitle != null) content.subtitle = options.subtitle;
  if (options.sound !== undefined) {
    content.sound = options.sound === true ? 'default' : options.sound === false ? undefined : options.sound;
  }
  if (options.badge != null) content.badge = options.badge;
  if (options.categoryId) content.categoryIdentifier = options.categoryId;
  if (options.threadIdentifier) content.threadIdentifier = options.threadIdentifier;
  if (options.summaryArgument) content.summaryArgument = options.summaryArgument;
  if (options.attachments?.length) content.attachments = options.attachments;
  if (options.launchImageName) content.launchImageName = options.launchImageName;
  if (Platform.OS === 'android' && options.color) content.color = options.color;
  return content;
}

function isTimeIntervalTrigger(t: NotificationTrigger): t is TimeIntervalTrigger {
  return 'seconds' in t && typeof (t as TimeIntervalTrigger).seconds === 'number';
}

function isDateTrigger(t: NotificationTrigger): t is DateTrigger {
  return 'date' in t && t instanceof Object && (t as DateTrigger).date instanceof Date;
}

function isCalendarTrigger(t: NotificationTrigger): t is CalendarTrigger {
  return (
    typeof t === 'object' &&
    t !== null &&
    !('seconds' in t) &&
    !('date' in t) &&
    !('latitude' in t)
  );
}

async function buildExpoTrigger(
  trigger: NotificationTrigger,
  channelId?: string
): Promise<unknown> {
  if (isTimeIntervalTrigger(trigger)) {
    const out: Record<string, unknown> = {
      seconds: Math.max(1, trigger.seconds),
      repeats: trigger.repeats ?? false,
    };
    if (channelId && Platform.OS === 'android') out.channelId = channelId;
    return out;
  }
  if (isDateTrigger(trigger)) {
    if (channelId && Platform.OS === 'android') {
      return { date: trigger.date, channelId };
    }
    return trigger.date;
  }
  if (isCalendarTrigger(trigger)) {
    const out: Record<string, unknown> = {
      hour: trigger.hour,
      minute: trigger.minute,
      second: trigger.second ?? 0,
      repeats: trigger.repeats ?? false,
    };
    if (trigger.year != null) out.year = trigger.year;
    if (trigger.month != null) out.month = trigger.month;
    if (trigger.day != null) out.day = trigger.day;
    if (trigger.weekday != null) out.weekday = trigger.weekday;
    if (trigger.weekdayOrdinal != null) out.weekdayOrdinal = trigger.weekdayOrdinal;
    if (trigger.weekOfMonth != null) out.weekOfMonth = trigger.weekOfMonth;
    if (trigger.weekOfYear != null) out.weekOfYear = trigger.weekOfYear;
    if (trigger.timezone) out.timezone = trigger.timezone;
    if (channelId && Platform.OS === 'android') out.channelId = channelId;
    return out;
  }
  // LocationTrigger: expo-notifications may not support; use 1s fallback
  const fallback: Record<string, unknown> = { seconds: 1, repeats: false };
  if (channelId && Platform.OS === 'android') fallback.channelId = channelId;
  return fallback;
}

const actionHandlers = new Map<string, ActionHandler>();

/**
 * Local Notification Helper – schedule, cancel, and handle local notifications.
 */
class LocalNotificationHelper {
  // -------------------------------------------------------------------------
  // Permission (aligned with permissions helper)
  // -------------------------------------------------------------------------

  /**
   * Request notification permission. Uses expo-notifications on native;
   * falls back to permissions helper when expo-notifications is unavailable.
   */
  async requestPermission(
    _options?: NotificationPermissionOptions
  ): Promise<PermissionStatus> {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return permissionsCheck('notifications');
    }
    try {
      const N = await getNotifications();
      const { status } = await N.getPermissionsAsync();
      if (status === 'granted') return mapExpoStatusToPermissionStatus('granted');
      const { status: newStatus } = await N.requestPermissionsAsync();
      return mapExpoStatusToPermissionStatus(newStatus);
    } catch {
      return permissionsRequest('notifications');
    }
  }

  /**
   * Check current notification permission status.
   */
  async checkPermission(): Promise<PermissionStatus> {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return permissionsCheck('notifications');
    }
    try {
      const N = await getNotifications();
      const { status } = await N.getPermissionsAsync();
      return mapExpoStatusToPermissionStatus(status);
    } catch {
      return permissionsCheck('notifications');
    }
  }

  /**
   * Returns true if notification permission is granted.
   */
  async isPermissionGranted(): Promise<boolean> {
    const status = await this.checkPermission();
    return status.granted;
  }

  // -------------------------------------------------------------------------
  // Scheduling
  // -------------------------------------------------------------------------

  /**
   * Schedule a one-time or repeating notification.
   * Requests permission automatically if not granted (optional; caller can request first).
   */
  async schedule(options: NotificationOptions): Promise<string> {
    const result = this.validateNotification(options);
    if (!result.valid) throw new Error(`Invalid notification: ${result.errors.join(', ')}`);
    const permission = await this.checkPermission();
    if (!permission.granted) {
      throw new Error(
        'Notification permission not granted. Call requestPermission() first.'
      );
    }
    const N = await getNotifications();
    const channelId = options.channelId ?? DEFAULT_CHANNEL_ID;
    if (Platform.OS === 'android') {
      const channels = await N.getNotificationChannelsAsync();
      const hasChannel = channels?.some((c: { id: string }) => c.id === channelId);
      if (!hasChannel) {
        await this.createChannel({
          id: channelId,
          name: 'Notifications',
          description: 'Default notification channel',
          importance: 'default',
        });
      }
    }
    const content = buildContentFromOptions(options) as Parameters<
      typeof N.scheduleNotificationAsync
    >[0]['content'];
    const trigger = await buildExpoTrigger(options.trigger, channelId);
    const request: Parameters<typeof N.scheduleNotificationAsync>[0] = {
      content,
      trigger: trigger as Parameters<typeof N.scheduleNotificationAsync>[0]['trigger'],
    };
    if (options.identifier) request.identifier = options.identifier;
    const id = await N.scheduleNotificationAsync(request);
    return id;
  }

  /**
   * Schedule a recurring notification (daily, weekly, etc.).
   * On Android, calendar-style triggers are not supported; a time-interval fallback may be used.
   */
  async scheduleRecurring(options: RecurringNotificationOptions): Promise<string> {
    const { repeatInterval, trigger: recurringTrigger, endDate: _endDate, ...rest } = options;
    const calendarTrigger: CalendarTrigger = {
      hour: recurringTrigger.hour ?? 9,
      minute: recurringTrigger.minute ?? 0,
      second: recurringTrigger.second ?? 0,
      weekday: recurringTrigger.weekday,
      day: recurringTrigger.day,
      timezone: undefined,
      repeats: true,
    };
    if (repeatInterval === 'week' && recurringTrigger.weekday != null) {
      calendarTrigger.weekday = recurringTrigger.weekday;
    }
    if (repeatInterval === 'month' && recurringTrigger.day != null) {
      calendarTrigger.day = recurringTrigger.day;
    }
    return this.schedule({
      ...rest,
      trigger: calendarTrigger,
    });
  }

  /**
   * Schedule multiple notifications at once.
   */
  async scheduleMultiple(notifications: NotificationOptions[]): Promise<string[]> {
    const ids: string[] = [];
    for (const opts of notifications) {
      const id = await this.schedule(opts);
      ids.push(id);
    }
    return ids;
  }

  /**
   * Cancel a scheduled notification by identifier.
   */
  async cancel(notificationId: string): Promise<void> {
    const N = await getNotifications();
    await N.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications.
   */
  async cancelAll(): Promise<void> {
    const N = await getNotifications();
    await N.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications.
   */
  async getAllScheduled(): Promise<ScheduledNotification[]> {
    const N = await getNotifications();
    const list = await N.getAllScheduledNotificationsAsync();
    return list.map((item) => {
      const c = item.content;
      return {
        identifier: item.identifier,
        content: {
          title: c.title ?? '',
          body: c.body ?? '',
          subtitle: c.subtitle ?? undefined,
          data: c.data,
          sound: c.sound ?? undefined,
          badge: (c as { badge?: number }).badge,
          categoryId: (c as { categoryIdentifier?: string }).categoryIdentifier,
          threadIdentifier: (c as { threadIdentifier?: string }).threadIdentifier,
          attachments: (c as { attachments?: Attachment[] }).attachments,
        } as NotificationContent,
        trigger: item.trigger as NotificationTrigger,
        nextTriggerDate: undefined,
      };
    });
  }

  /**
   * Get a single scheduled notification by id, or null.
   */
  async getScheduled(notificationId: string): Promise<ScheduledNotification | null> {
    const all = await this.getAllScheduled();
    return all.find((n) => n.identifier === notificationId) ?? null;
  }

  // -------------------------------------------------------------------------
  // Content & badge
  // -------------------------------------------------------------------------

  /**
   * Set application badge count (iOS mainly).
   */
  async setBadgeCount(count: number): Promise<void> {
    const N = await getNotifications();
    await N.setBadgeCountAsync(count);
  }

  /**
   * Get current badge count.
   */
  async getBadgeCount(): Promise<number> {
    const N = await getNotifications();
    return await N.getBadgeCountAsync();
  }

  /**
   * Clear badge (set to 0).
   */
  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  // -------------------------------------------------------------------------
  // Categories (iOS) & Channels (Android)
  // -------------------------------------------------------------------------

  /**
   * Set a notification category (iOS) for actions.
   */
  async setCategory(options: CategoryOptions): Promise<void> {
    const N = await getNotifications();
    const actions = (options.actions ?? []).map((a) => ({
      identifier: a.identifier,
      buttonTitle: a.buttonTitle,
      options: a.options
        ? {
            isDestructive: a.options.isDestructive,
            isAuthenticationRequired: a.options.isAuthenticationRequired,
            opensAppToForeground: a.options.opensAppToForeground,
          }
        : undefined,
      textInput: a.textInput
        ? {
            placeholder: a.textInput.placeholder,
            submitButtonTitle: a.textInput.submitButtonTitle ?? 'Submit',
          }
        : undefined,
    }));
    await N.setNotificationCategoryAsync(options.identifier, actions, {
      customDismissAction: options.options?.includes('customDismissAction'),
      allowInCarPlay: options.options?.includes('allowInCarPlay'),
      showTitle: true,
      showSubtitle: true,
      allowAnnouncement: false,
      previewPlaceholder: options.hiddenPreviewsBodyPlaceholder,
      categorySummaryFormat: options.categorySummaryFormat,
      intentIdentifiers: options.intentIdentifiers ?? [],
    });
  }

  /**
   * Get all notification categories (iOS).
   */
  async getCategories(): Promise<Array<{ identifier: string; actions?: Array<{ identifier: string; buttonTitle: string }> }>> {
    const N = await getNotifications();
    const categories = await N.getNotificationCategoriesAsync();
    return (categories ?? []).map((c: { identifier: string; actions?: Array<{ identifier: string; buttonTitle: string }> }) => ({
      identifier: c.identifier,
      actions: c.actions,
    }));
  }

  /**
   * Delete a notification category (iOS).
   */
  async deleteCategory(identifier: string): Promise<void> {
    const N = await getNotifications();
    await N.deleteNotificationCategoryAsync(identifier);
  }

  /**
   * Create an Android notification channel.
   */
  async createChannel(options: ChannelOptions): Promise<void> {
    const N = await getNotifications();
    if (Platform.OS !== 'android') return;
    const importanceMap = {
      min: N.AndroidImportance.MIN,
      low: N.AndroidImportance.LOW,
      default: N.AndroidImportance.DEFAULT,
      high: N.AndroidImportance.HIGH,
      max: N.AndroidImportance.MAX,
    } as const;
    const visibilityMap = {
      public: N.AndroidNotificationVisibility?.PUBLIC ?? 1,
      private: N.AndroidNotificationVisibility?.PRIVATE ?? 2,
      secret: N.AndroidNotificationVisibility?.SECRET ?? 3,
    } as const;
    await N.setNotificationChannelAsync(options.id, {
      name: options.name,
      description: options.description,
      importance: importanceMap[options.importance],
      sound: options.sound ?? undefined,
      vibrationPattern: options.vibrationPattern,
      lightColor: options.lightColor,
      enableLights: options.enableLights,
      enableVibrate: options.enableVibration ?? true,
      showBadge: options.showBadge,
      bypassDnd: options.bypassDnd,
      ...(options.lockscreenVisibility
        ? { lockscreenVisibility: visibilityMap[options.lockscreenVisibility] }
        : {}),
    });
  }

  /**
   * Get all Android notification channels.
   */
  async getChannels(): Promise<Array<{ id: string; name: string; description?: string | null }>> {
    const N = await getNotifications();
    if (Platform.OS !== 'android') return [];
    const channels = await N.getNotificationChannelsAsync();
    return (channels ?? []).map((c) => ({
      id: c.id,
      name: c.name ?? '',
      description: c.description ?? null,
    }));
  }

  /**
   * Delete an Android notification channel.
   */
  async deleteChannel(channelId: string): Promise<void> {
    const N = await getNotifications();
    if (Platform.OS !== 'android') return;
    await N.deleteNotificationChannelAsync(channelId);
  }

  /**
   * Ensure default channels exist (Android). Call once at app start if desired.
   */
  async ensureDefaultChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;
    for (const ch of DEFAULT_CHANNELS) {
      await this.createChannel(ch);
    }
  }

  // -------------------------------------------------------------------------
  // Event listeners
  // -------------------------------------------------------------------------

  /**
   * Subscribe to notifications received (foreground).
   */
  addReceivedListener(callback: ReceivedListener): Subscription {
    const subRef: { current: { remove: () => void } | null } = { current: null };
    getNotifications().then((N) => {
      subRef.current = N.addNotificationReceivedListener((notification) => {
        const mapped: Notification = {
          request: {
            identifier: notification.request.identifier,
            content: notification.request.content as NotificationContent,
            trigger: notification.request.trigger as NotificationTrigger,
          },
          date: new Date(notification.date),
        };
        callback(mapped);
      });
    });
    return {
      remove: () => {
        if (subRef.current) subRef.current.remove();
      },
    };
  }

  /**
   * Subscribe to notification tap/response (including action buttons).
   */
  addTappedListener(callback: TappedListener): Subscription {
    const subRef: { current: { remove: () => void } | null } = { current: null };
    getNotifications().then((N) => {
      subRef.current = N.addNotificationResponseReceivedListener((response: { notification: { request: { identifier: string; content: unknown; trigger: unknown }; date: number }; actionIdentifier: string; userText?: string }) => {
        const notification: Notification = {
          request: {
            identifier: response.notification.request.identifier,
            content: response.notification.request.content as NotificationContent,
            trigger: response.notification.request.trigger as NotificationTrigger,
          },
          date: new Date(response.notification.date),
        };
        const mapped: NotificationResponse = {
          notification,
          actionIdentifier: response.actionIdentifier,
          userText: response.userText,
        };
        callback(mapped);
        const handler = actionHandlers.get(response.actionIdentifier);
        if (handler) {
          const result = handler(notification, {
            identifier: response.actionIdentifier,
            userText: response.userText,
          });
          if (result instanceof Promise) {
            result.catch((e) => console.error('Action handler error:', e));
          }
        }
      });
    });
    return {
      remove: () => {
        if (subRef.current) subRef.current.remove();
      },
    };
  }

  /**
   * Subscribe to notification dismissed.
   * Note: expo-notifications does not expose a native "dismissed" event; this returns a no-op subscription.
   * Use addTappedListener for user interaction.
   */
  addDismissedListener(_callback: DismissedListener): Subscription {
    return { remove: () => {} };
  }

  /**
   * Register a handler for a specific notification action identifier.
   */
  addActionHandler(actionId: string, callback: ActionHandler): void {
    actionHandlers.set(actionId, callback);
  }

  /**
   * Remove action handler.
   */
  removeActionHandler(actionId: string): void {
    actionHandlers.delete(actionId);
  }

  // -------------------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------------------

  /**
   * Check if notifications are enabled (permission granted).
   */
  async isEnabled(): Promise<boolean> {
    return this.isPermissionGranted();
  }

  /**
   * Get current notification settings (permissions).
   */
  async getSettings(): Promise<NotificationSettings> {
    const N = await getNotifications();
    const perm = await N.getPermissionsAsync();
    const granted = perm.status === 'granted';
    return {
      permissions: {
        alert: granted,
        badge: granted,
        sound: granted,
      },
      status: granted ? 'granted' : perm.status === 'denied' ? 'denied' : 'unknown',
    };
  }

  /**
   * Open the app's notification settings.
   */
  async openSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch {
      await openAppSettings();
    }
  }

  /**
   * Show an alert guiding the user to enable notifications in settings.
   */
  showPermissionSettingsAlert(): void {
    showPermissionSettingsAlert('notifications');
  }

  /**
   * Validate notification options before scheduling.
   */
  validateNotification(options: NotificationOptions): NotificationValidationResult {
    const errors: string[] = [];
    if (!options.title?.trim()) errors.push('title is required');
    if (!options.body?.trim()) errors.push('body is required');
    if (!options.trigger) errors.push('trigger is required');
    if (isTimeIntervalTrigger(options.trigger) && options.trigger.seconds < 0) {
      errors.push('trigger.seconds must be >= 0');
    }
    if (isDateTrigger(options.trigger) && Number.isNaN(options.trigger.date.getTime())) {
      errors.push('trigger.date must be a valid Date');
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const localNotificationHelper = new LocalNotificationHelper();
export { LocalNotificationHelper };
export type { NotificationOptions, RecurringNotificationOptions, NotificationTrigger };
export {
  DEFAULT_CHANNELS,
  DEFAULT_CHANNEL_ID,
} from './notifications/constants';
export type {
  NotificationContent,
  ScheduledNotification,
  Notification,
  NotificationResponse,
  NotificationSettings,
  Subscription,
  NotificationValidationResult,
  CategoryOptions,
  ChannelOptions,
  NotificationPermissionOptions,
  Attachment,
  RecurringTrigger,
  CalendarTrigger,
  DateTrigger,
  TimeIntervalTrigger,
} from './notifications/types';
