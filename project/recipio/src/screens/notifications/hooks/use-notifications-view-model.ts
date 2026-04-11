import { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '@/shared/i18n';
import type { NotificationItem } from '../models/notification-models';
import { useNotificationsStore } from '../store/notifications-store';
import { fetchNotificationsList } from '../utils/fetch-notifications';

export function useNotificationsViewModel() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    items,
    isLoading,
    setItems,
    setLoading,
    markAsRead,
    markAllAsRead,
    removeItem,
    clearAll,
  } = useNotificationsStore();

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchNotificationsList();
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading]);

  useEffect(() => {
    if (useNotificationsStore.getState().items.length > 0) return;
    loadNotifications();
  }, [loadNotifications]);

  const handleNotificationPress = useCallback(
    (item: NotificationItem) => {
      markAsRead(item.id);
      if (item.recipeId == null) return;
      if (item.type === 'cooking_reminder') {
        router.push(`/cooking-guide/${item.recipeId}` as const);
        return;
      }
      router.push(`/recipe-detail/${item.recipeId}` as const);
    },
    [markAsRead, router]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleRemoveItem = useCallback(
    (id: string) => {
      removeItem(id);
    },
    [removeItem]
  );

  const runClearAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const handleClearAll = useCallback(() => {
    if (items.length === 0) return;
    if (Platform.OS === 'web') {
      const ok =
        typeof window !== 'undefined' &&
        window.confirm(t('notifications.clearAllConfirmMessage'));
      if (ok) runClearAll();
      return;
    }
    Alert.alert(
      t('notifications.clearAllConfirmTitle'),
      t('notifications.clearAllConfirmMessage'),
      [
        { text: t('profile.cancel'), style: 'cancel' },
        { text: t('notifications.clearAll'), style: 'destructive', onPress: runClearAll },
      ]
    );
  }, [items.length, runClearAll, t]);

  const unreadCount = items.filter((i) => !i.read).length;

  return {
    items,
    isLoading,
    unreadCount,
    refetch: loadNotifications,
    handleNotificationPress,
    handleMarkAllRead,
    handleRemoveItem,
    handleClearAll,
  };
}
