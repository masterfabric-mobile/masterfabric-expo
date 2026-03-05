import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, InteractionManager, Platform } from 'react-native';
import type { PermissionStatus } from '../helpers/permissions/types';
import { localNotificationHelper } from '../helpers/local_notification_helper';
import type { ScheduledNotification } from '../helpers/notifications/types';

export interface LocalNotificationHelperOptions {
  onTaskCompleted?: () => void;
  onTaskSnoozed?: () => void;
  getNotificationContent?: (type: 'test' | 'scheduled' | 'daily' | 'dailyAndroid' | 'task', params?: { seconds?: number }) => { title: string; body: string };
}

export interface LocalNotificationHelperState {
  permission: PermissionStatus | null;
  badgeCount: number;
  scheduled: ScheduledNotification[];
  channels: Array<{ id: string; name: string; description: string | null }>;
  categories: Array<{ identifier: string; actions?: Array<{ identifier: string; buttonTitle: string }> }>;
  lastReceived: string | null;
  lastTapped: string | null;
  lastActionId: string | null;
  isEnabled: boolean;
  error: string | null;
  loading: boolean;
}

const initialPermission: PermissionStatus = {
  granted: false,
  canAskAgain: true,
  status: 'unknown',
};

const defaultContent = {
  test: (seconds: number) => ({ title: 'Test Notification', body: `Scheduled to show in ${seconds} seconds` }),
  scheduled: () => ({ title: 'Scheduled Notification', body: 'Triggered at specific time' }),
  daily: () => ({ title: 'Daily Reminder', body: 'This is a daily recurring notification' }),
  dailyAndroid: () => ({ title: 'Daily Reminder', body: 'This is a daily recurring notification (using time interval on Android)' }),
  task: () => ({ title: 'Task Reminder', body: 'Tap Complete or Snooze' }),
};

export function useLocalNotificationHelper(options: LocalNotificationHelperOptions = {}) {
  const { onTaskCompleted, onTaskSnoozed, getNotificationContent } = options;
  const [permission, setPermission] = useState<PermissionStatus | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const [scheduled, setScheduled] = useState<ScheduledNotification[]>([]);
  const [channels, setChannels] = useState<Array<{ id: string; name: string; description: string | null }>>([]);
  const [categories, setCategories] = useState<Array<{ identifier: string; actions?: Array<{ identifier: string; buttonTitle: string }> }>>([]);
  const [lastReceived, setLastReceived] = useState<string | null>(null);
  const [lastTapped, setLastTapped] = useState<string | null>(null);
  const [lastActionId, setLastActionId] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const receivedSubRef = useRef<{ remove: () => void } | null>(null);
  const tappedSubRef = useRef<{ remove: () => void } | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshPermission = useCallback(async () => {
    try {
      setError(null);
      const status = await localNotificationHelper.checkPermission();
      setPermission(status);
      setIsEnabled(status.granted);
    } catch (e) {
      setPermission(initialPermission);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshBadge = useCallback(async () => {
    try {
      setError(null);
      const count = await localNotificationHelper.getBadgeCount();
      setBadgeCount(count);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshScheduled = useCallback(async () => {
    try {
      setError(null);
      const list = await localNotificationHelper.getAllScheduled();
      setScheduled(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshChannels = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    try {
      setError(null);
      const list = await localNotificationHelper.getChannels();
      setChannels(list.map((c) => ({ id: c.id, name: c.name, description: c.description ?? null })));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      setError(null);
      const list = await localNotificationHelper.getCategories();
      setCategories(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      await Promise.all([
        refreshPermission(),
        refreshBadge(),
        refreshScheduled(),
        refreshChannels(),
        refreshCategories(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [refreshPermission, refreshBadge, refreshScheduled, refreshChannels, refreshCategories]);

  const requestPermission = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await localNotificationHelper.requestPermission();
      setPermission(status);
      setIsEnabled(status.granted);
      return status;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setPermission(initialPermission);
      return initialPermission;
    } finally {
      setLoading(false);
    }
  }, []);

  const scheduleInSeconds = useCallback(async (seconds: number) => {
    setError(null);
    try {
      const content = getNotificationContent?.('test', { seconds }) ?? defaultContent.test(seconds);
      const id = await localNotificationHelper.schedule({
        title: content.title,
        body: content.body,
        data: { source: 'LocalNotificationHelperView', seconds },
        trigger: { seconds },
      });
      await refreshScheduled();
      setError(null); // Clear any previous errors
      return id;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(`Failed to schedule: ${errorMsg}`);
      return null;
    }
  }, [refreshScheduled, getNotificationContent]);

  const scheduleAtDate = useCallback(async (date: Date) => {
    setError(null);
    try {
      const content = getNotificationContent?.('scheduled') ?? defaultContent.scheduled();
      const id = await localNotificationHelper.schedule({
        title: content.title,
        body: content.body,
        data: { source: 'LocalNotificationHelperView' },
        trigger: { date },
      });
      await refreshScheduled();
      return id;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    }
  }, [refreshScheduled, getNotificationContent]);

  const scheduleRecurringDaily = useCallback(async () => {
    setError(null);
    try {
      if (Platform.OS === 'android') {
        const content = getNotificationContent?.('dailyAndroid') ?? defaultContent.dailyAndroid();
        const id = await localNotificationHelper.schedule({
          title: content.title,
          body: content.body,
          data: { source: 'LocalNotificationHelperView', type: 'daily' },
          trigger: { seconds: 86400, repeats: true }, // 24 hours
        });
        await refreshScheduled();
        setError(null);
        return id;
      } else {
        const content = getNotificationContent?.('daily') ?? defaultContent.daily();
        const id = await localNotificationHelper.scheduleRecurring({
          title: content.title,
          body: content.body,
          trigger: { hour: 9, minute: 0 },
          repeatInterval: 'day',
        });
        await refreshScheduled();
        setError(null);
        return id;
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(`Failed to schedule recurring: ${errorMsg}`);
      return null;
    }
  }, [refreshScheduled, getNotificationContent]);

  const cancelLastScheduled = useCallback(async () => {
    if (scheduled.length === 0) return;
    setError(null);
    try {
      const last = scheduled[scheduled.length - 1];
      await localNotificationHelper.cancel(last.identifier);
      await refreshScheduled();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [scheduled, refreshScheduled]);

  const cancelAllScheduled = useCallback(async () => {
    setError(null);
    try {
      await localNotificationHelper.cancelAll();
      await refreshScheduled();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [refreshScheduled]);

  const setBadge = useCallback(async (count: number) => {
    setError(null);
    try {
      await localNotificationHelper.setBadgeCount(count);
      await refreshBadge();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [refreshBadge]);

  const clearBadge = useCallback(async () => {
    setError(null);
    try {
      await localNotificationHelper.clearBadge();
      await refreshBadge();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [refreshBadge]);

  const ensureDefaultChannels = useCallback(async () => {
    setError(null);
    try {
      await localNotificationHelper.ensureDefaultChannels();
      await refreshChannels();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    }
  }, [refreshChannels]);

  const createTestChannel = useCallback(async () => {
    setError(null);
    try {
      await localNotificationHelper.createChannel({
        id: 'test_channel',
        name: 'Test Channel',
        description: 'Created from Local Notification Helper View',
        importance: 'default',
      });
      await refreshChannels();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      throw e;
    }
  }, [refreshChannels]);

  const setTestCategory = useCallback(async () => {
    setError(null);
    try {
      await localNotificationHelper.setCategory({
        identifier: 'TASK_REMINDER',
        actions: [
          {
            identifier: 'COMPLETE',
            buttonTitle: 'Complete',
            options: { opensAppToForeground: false },
          },
          {
            identifier: 'SNOOZE',
            buttonTitle: 'Snooze 10 min',
            options: { opensAppToForeground: false },
          },
        ],
      });
      await refreshCategories();
      setError(null);
      return true;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(`Failed to set category: ${errorMsg}`);
      return false;
    }
  }, [refreshCategories]);

  const scheduleWithCategory = useCallback(async () => {
    setError(null);
    try {
      const content = getNotificationContent?.('task') ?? defaultContent.task();
      const id = await localNotificationHelper.schedule({
        title: content.title,
        body: content.body,
        categoryId: 'TASK_REMINDER',
        data: { source: 'category_test' },
        trigger: { seconds: 10 },
      });
      await refreshScheduled();
      return id;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    }
  }, [refreshScheduled, getNotificationContent]);

  const openSettings = useCallback(async () => {
    try {
      await localNotificationHelper.openSettings();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const showPermissionAlert = useCallback(() => {
    localNotificationHelper.showPermissionSettingsAlert();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    
    // Set up notification handler for Expo Go (required for notifications to show)
    const setupNotificationHandler = async () => {
      try {
        const Notifications = await import('expo-notifications');
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
        
        // Ensure default channel exists on Android (required for notifications to work)
        if (Platform.OS === 'android') {
          try {
            await localNotificationHelper.ensureDefaultChannels();
          } catch (e) {
            console.warn('Failed to ensure default channels:', e);
          }
        }
      } catch (e) {
        console.warn('Failed to set notification handler:', e);
      }
    };
    
    setupNotificationHandler();
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    receivedSubRef.current = localNotificationHelper.addReceivedListener((notification) => {
      const title = notification.request.content.title ?? '';
      const body = notification.request.content.body ?? '';
      setLastReceived(`${title}: ${body}`);
    });
    tappedSubRef.current = localNotificationHelper.addTappedListener((response) => {
      setLastTapped(
        response.notification.request.content.title ?? response.notification.request.identifier
      );
      setLastActionId(response.actionIdentifier);
    });
    localNotificationHelper.addActionHandler('COMPLETE', async (notification) => {
      setLastActionId('COMPLETE');
      try {
        const Notifications = await import('expo-notifications');
        await Notifications.dismissNotificationAsync(notification.request.identifier);
      } catch (e) {
        console.warn('Failed to dismiss notification:', e);
      }
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (AppState.currentState === 'active') {
            if (onTaskCompleted) onTaskCompleted();
            else Alert.alert('Task completed', 'The task was marked as complete.');
          }
        }, 300);
      });
    });
    localNotificationHelper.addActionHandler('SNOOZE', async (notification) => {
      setLastActionId('SNOOZE');
      try {
        const Notifications = await import('expo-notifications');
        await Notifications.dismissNotificationAsync(notification.request.identifier);
      } catch (e) {
        console.warn('Failed to dismiss notification:', e);
      }
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (AppState.currentState === 'active') {
            if (onTaskSnoozed) onTaskSnoozed();
            else Alert.alert('Task snoozed', 'Reminder snoozed for 10 minutes.');
          }
        }, 300);
      });
    });
    return () => {
      receivedSubRef.current?.remove();
      tappedSubRef.current?.remove();
      localNotificationHelper.removeActionHandler('COMPLETE');
      localNotificationHelper.removeActionHandler('SNOOZE');
    };
  }, [onTaskCompleted, onTaskSnoozed]);

  return {
    state: {
      permission,
      badgeCount,
      scheduled,
      channels,
      categories,
      lastReceived,
      lastTapped,
      lastActionId,
      isEnabled,
      error,
      loading,
    },
    refreshPermission,
    refreshBadge,
    refreshScheduled,
    refreshChannels,
    refreshCategories,
    refreshAll,
    requestPermission,
    scheduleInSeconds,
    scheduleAtDate,
    scheduleRecurringDaily,
    cancelLastScheduled,
    cancelAllScheduled,
    setBadge,
    clearBadge,
    ensureDefaultChannels,
    createTestChannel,
    setTestCategory,
    scheduleWithCategory,
    openSettings,
    showPermissionAlert,
    clearError,
  };
}
