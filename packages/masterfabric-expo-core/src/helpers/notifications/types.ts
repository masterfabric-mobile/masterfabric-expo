/**
 * Local Notification Helper – Type definitions
 * Used by local_notification_helper for scheduling, content, and events.
 */

// ---------------------------------------------------------------------------
// Triggers
// ---------------------------------------------------------------------------

export interface TimeIntervalTrigger {
  seconds: number;
  repeats?: boolean;
}

export interface DateTrigger {
  date: Date;
  timezone?: string;
}

export interface CalendarTrigger {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  weekday?: number; // 1–7 (Sunday = 1)
  weekdayOrdinal?: number;
  weekOfMonth?: number;
  weekOfYear?: number;
  timezone?: string;
  repeats?: boolean;
}

export interface LocationTrigger {
  latitude: number;
  longitude: number;
  radius: number;
  notifyOnEntry?: boolean;
  notifyOnExit?: boolean;
}

export type NotificationTrigger =
  | TimeIntervalTrigger
  | DateTrigger
  | CalendarTrigger
  | LocationTrigger;

export interface RecurringTrigger {
  hour?: number;
  minute?: number;
  second?: number;
  weekday?: number;
  day?: number;
}

// ---------------------------------------------------------------------------
// Content & options
// ---------------------------------------------------------------------------

export interface Attachment {
  identifier: string;
  url: string;
  type: string;
  thumbnailTime?: number;
  thumbnailClippingRect?: { x: number; y: number; width: number; height: number };
}

/** Android notification style (big text, big picture, etc.). */
export interface NotificationStyle {
  type: 'default' | 'bigText' | 'bigPicture' | 'inbox' | 'messaging';
  bigText?: string;
  bigPicture?: string;
  summaryText?: string;
  messages?: Array<{ text: string; person?: string; timestamp?: number }>;
}

export interface NotificationOptions {
  identifier?: string;
  title: string;
  body: string;
  subtitle?: string;
  data?: Record<string, unknown>;
  sound?: string | boolean;
  badge?: number;
  categoryId?: string;
  channelId?: string;
  threadIdentifier?: string;
  summaryArgument?: string;
  attachments?: Attachment[];
  launchImageName?: string;
  trigger: NotificationTrigger;
  /** Android */
  priority?: 'min' | 'low' | 'default' | 'high' | 'max';
  sticky?: boolean;
  autoCancel?: boolean;
  ongoing?: boolean;
  color?: string;
  smallIcon?: string;
  largeIcon?: string;
  style?: NotificationStyle;
  visibility?: 'public' | 'private' | 'secret';
  importance?: 'min' | 'low' | 'default' | 'high' | 'max';
  /** iOS 15+ */
  interruptionLevel?: 'passive' | 'active' | 'timeSensitive' | 'critical';
  relevanceScore?: number;
}

export interface RecurringNotificationOptions extends Omit<NotificationOptions, 'trigger'> {
  trigger: RecurringTrigger;
  repeatInterval: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  endDate?: Date;
}

// ---------------------------------------------------------------------------
// Categories & channels
// ---------------------------------------------------------------------------

export interface ActionOption {
  opensAppToForeground?: boolean;
  isDestructive?: boolean;
  isAuthenticationRequired?: boolean;
}

export interface Action {
  identifier: string;
  buttonTitle: string;
  textInput?: {
    placeholder: string;
    submitButtonTitle?: string;
  };
  options?: ActionOption;
}

export type CategoryOption = 'customDismissAction' | 'allowInCarPlay';

export interface CategoryOptions {
  identifier: string;
  actions?: Action[];
  intentIdentifiers?: string[];
  hiddenPreviewsBodyPlaceholder?: string;
  categorySummaryFormat?: string;
  options?: CategoryOption[];
}

export interface ChannelOptions {
  id: string;
  name: string;
  description?: string;
  importance: 'min' | 'low' | 'default' | 'high' | 'max';
  sound?: string;
  vibration?: boolean;
  vibrationPattern?: number[];
  lightColor?: string;
  enableLights?: boolean;
  enableVibration?: boolean;
  showBadge?: boolean;
  bypassDnd?: boolean;
  lockscreenVisibility?: 'public' | 'private' | 'secret';
}

// ---------------------------------------------------------------------------
// Notification content (internal / scheduled)
// ---------------------------------------------------------------------------

export interface NotificationContent {
  title: string;
  body: string;
  subtitle?: string;
  data?: Record<string, unknown>;
  sound?: string;
  badge?: number;
  categoryId?: string;
  threadIdentifier?: string;
  attachments?: Attachment[];
}

export interface ScheduledNotification {
  identifier: string;
  content: NotificationContent;
  trigger: NotificationTrigger;
  nextTriggerDate?: Date;
}

// ---------------------------------------------------------------------------
// Events & responses
// ---------------------------------------------------------------------------

export interface Notification {
  request: {
    identifier: string;
    content: NotificationContent;
    trigger: NotificationTrigger;
  };
  date: Date;
}

export interface ActionResponse {
  identifier: string;
  userText?: string;
}

export interface NotificationResponse {
  notification: Notification;
  actionIdentifier: string;
  userText?: string;
}

export type ReceivedListener = (notification: Notification) => void;
export type TappedListener = (response: NotificationResponse) => void;
export type DismissedListener = (notification: Notification) => void;
export type ActionHandler = (notification: Notification, action: ActionResponse) => void | Promise<void>;

// ---------------------------------------------------------------------------
// Permission & settings
// ---------------------------------------------------------------------------

export interface NotificationPermissionOptions {
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
  carPlay?: boolean;
  criticalAlert?: boolean;
  provisional?: boolean;
  providesAppNotificationSettings?: boolean;
}

export interface NotificationSettings {
  permissions: {
    alert: boolean;
    badge: boolean;
    sound: boolean;
    carPlay?: boolean;
    criticalAlert?: boolean;
    provisional?: boolean;
    providesAppNotificationSettings?: boolean;
  };
  status: 'granted' | 'denied' | 'blocked' | 'unknown';
}

// PermissionStatus is provided by permissions.ts when using the helper.

// ---------------------------------------------------------------------------
// Subscription & validation
// ---------------------------------------------------------------------------

export interface Subscription {
  remove: () => void;
}

/** Validation result for notification options (avoids conflict with validator_helper.ValidationResult). */
export interface NotificationValidationResult {
  valid: boolean;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Channel/Category (returned from get)
// ---------------------------------------------------------------------------

export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  importance?: number;
  sound?: string | null;
  enableVibration?: boolean;
  vibrationPattern?: number[] | null;
  enableLights?: boolean;
  lightColor?: string | null;
  lockscreenVisibility?: number;
  bypassDnd?: boolean;
  showBadge?: boolean;
}

export interface Category {
  identifier: string;
  actions?: Array<{ identifier: string; buttonTitle: string }>;
}
