import { useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import type { NotificationItem } from '../models/notification-models';
import { useNotificationsStore } from '../store/notifications-store';
import { MOCK_NOTIFICATIONS } from '../utils/mock-notifications';

export function useNotificationsViewModel() {
  const router = useRouter();
  const {
    items,
    isLoading,
    setItems,
    setLoading,
    markAsRead,
    markAllAsRead,
  } = useNotificationsStore();

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 400));
      setItems([...MOCK_NOTIFICATIONS]);
    } finally {
      setLoading(false);
    }
  }, [setItems, setLoading]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleNotificationPress = useCallback(
    (item: NotificationItem) => {
      markAsRead(item.id);
      if (item.recipeId != null) {
        router.push(`/recipe-detail/${item.recipeId}` as const);
      }
    },
    [markAsRead, router]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const unreadCount = items.filter((i) => !i.read).length;

  return {
    items,
    isLoading,
    unreadCount,
    refetch: loadNotifications,
    handleNotificationPress,
    handleMarkAllRead,
  };
}
