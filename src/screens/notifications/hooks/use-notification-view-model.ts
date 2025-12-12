import { getCurrentLocale, t } from '@/src/shared/i18n';
import { getThemeColors, supabaseIntegration, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { NotificationItem, NotificationTab, TabItem } from '../models/notification-models';
import { notificationService } from '../services/notification-service';
import { useNotificationStore } from '../store/notification-store';

export function useNotificationViewModel(activeTab: NotificationTab = 'all') {
  const {
    notifications,
    unreadCount,
    isLoading,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    setLoading,
    updateLastUpdated,
  } = useNotificationStore();

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const isLoadingRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const loadNotifications = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    setLoading(true);
    
    try {
      // Get current user ID
      let userId: string | null = null;
      let authenticated = false;
      if (supabaseIntegration.isAvailable()) {
        try {
          const user = await supabaseIntegration.getCurrentUser();
          userId = user?.id || null;
          authenticated = !!userId;
        } catch (err) {
          // User not authenticated or error getting user
          userId = null;
          authenticated = false;
        }
      }
      setIsAuthenticated(authenticated);

      // Fetch notifications with read status from Supabase
      const allNotifications = await notificationService.fetchNotificationsWithReadStatus(userId);

      // Filter notifications by current language
      const currentLanguage = getCurrentLocale();
      const languageNotifications = allNotifications.filter(
        notification => !notification.language || notification.language === currentLanguage
      );

      setNotifications(languageNotifications);
      setLoading(false);
      setIsInitialLoad(false);
      updateLastUpdated();
      isLoadingRef.current = false;
    } catch (error: any) {
      console.error('[NotificationViewModel] Failed to load notifications:', error);
      // On error, set empty array but don't show error to user
      // The UI will show empty state
      setNotifications([]);
      setLoading(false);
      setIsInitialLoad(false);
      isLoadingRef.current = false;
      // Try to determine auth status even on error
      if (supabaseIntegration.isAvailable()) {
        try {
          const user = await supabaseIntegration.getCurrentUser();
          setIsAuthenticated(!!user?.id);
        } catch (err) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [setLoading, setNotifications, updateLastUpdated]);

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(notification => {
      if (activeTab === 'app') {
        return notification.category === 'app' || 
               notification.title?.toLowerCase().includes('app') ||
               notification.type === 'info' || 
               notification.type === 'success';
      }
      if (activeTab === 'system') {
        return notification.category === 'system' || 
               notification.title?.toLowerCase().includes('system') ||
               notification.type === 'warning' || 
               notification.type === 'error';
      }
      return true;
    });
  }, [notifications, activeTab]);

  // Handle mark as read with database sync
  const handleMarkAsRead = useCallback(async (id: string) => {
    // Optimistically update UI
    markAsRead(id);

    // Sync with database if user is authenticated
    try {
      if (supabaseIntegration.isAvailable()) {
        try {
          const user = await supabaseIntegration.getCurrentUser();
          if (user?.id) {
            await notificationService.markAsRead(parseInt(id, 10), user.id);
          }
        } catch (err) {
          // User not authenticated, skip database sync
        }
      }
    } catch (error: any) {
      console.error('[NotificationViewModel] Error marking notification as read:', error);
      // Revert optimistic update on error
      // Note: In a production app, you might want to queue this for retry
    }
  }, [markAsRead]);

  // Handle mark all as read with database sync
  const handleMarkAllAsRead = useCallback(async () => {
    // Optimistically update UI
    markAllAsRead();

    // Sync with database if user is authenticated
    try {
      if (supabaseIntegration.isAvailable()) {
        try {
          const user = await supabaseIntegration.getCurrentUser();
          if (user?.id) {
            await notificationService.markAllAsRead(user.id);
          }
        } catch (err) {
          // User not authenticated, skip database sync
        }
      }
    } catch (error: any) {
      console.error('[NotificationViewModel] Error marking all notifications as read:', error);
      // Revert optimistic update on error
      // Note: In a production app, you might want to queue this for retry
    }
  }, [markAllAsRead]);

  useEffect(() => {
    loadNotifications();

    // Set up real-time subscription for new notifications
    const setupRealtimeSubscription = async () => {
      if (!supabaseIntegration.isAvailable()) {
        return;
      }

      try {
        const user = await supabaseIntegration.getCurrentUser();
        const userId = user?.id || null;

        // Clean up existing subscription
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }

        // Subscribe to new notifications
        unsubscribeRef.current = notificationService.subscribeToNotifications(
          (newNotification) => {
            // Add new notification to the list
            addNotification(newNotification);
          },
          userId
        );
      } catch (error: any) {
        console.error('[NotificationViewModel] Error setting up real-time subscription:', error);
      }
    };

    setupRealtimeSubscription();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      notificationService.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const refreshNotifications = useCallback(async () => {
    // Prevent multiple simultaneous refreshes using ref instead of state
    if (isRefreshingRef.current) {
      return;
    }
    
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    
    try {
      // Create a dedicated refresh function that bypasses the loading check
      const performRefresh = async () => {
        setLoading(true);
        
        try {
          // Get current user ID
          let userId: string | null = null;
          let authenticated = false;
          if (supabaseIntegration.isAvailable()) {
            try {
              const user = await supabaseIntegration.getCurrentUser();
              userId = user?.id || null;
              authenticated = !!userId;
            } catch (err) {
              userId = null;
              authenticated = false;
            }
          }
          setIsAuthenticated(authenticated);

          // Fetch notifications with read status from Supabase
          const allNotifications = await notificationService.fetchNotificationsWithReadStatus(userId);

          // Filter notifications by current language
          const currentLanguage = getCurrentLocale();
          const languageNotifications = allNotifications.filter(
            notification => !notification.language || notification.language === currentLanguage
          );

          setNotifications(languageNotifications);
          updateLastUpdated();
        } catch (error: any) {
          console.error('[NotificationViewModel] Failed to refresh notifications:', error);
          // Don't clear notifications on refresh error, just keep existing ones
        } finally {
          setLoading(false);
        }
      };
      
      await performRefresh();
    } catch (error) {
      console.error('[NotificationViewModel] Error refreshing notifications:', error);
    } finally {
      // Always reset refreshing state
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, [setLoading, setNotifications, updateLastUpdated, setIsAuthenticated]);

  // Tabs configuration
  const tabs: TabItem[] = [
    { key: 'all', label: t('notifications.tabs.all') },
    { key: 'app', label: t('notifications.tabs.app') },
    { key: 'system', label: t('notifications.tabs.system') },
  ];

  return {
    notifications: filteredNotifications,
    unreadCount,
    isLoading,
    isRefreshing,
    isAuthenticated,
    isInitialLoad,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    removeNotification,
    clearAll,
    refreshNotifications,
    addNotification,
    tabs,
  };
}

// Hook for notification item theme and styling
export function useNotificationItemTheme() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const getIconColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return colors.successColor;
      case 'warning':
        return colors.warningColor;
      case 'error':
        return colors.errorColor;
      case 'info':
      default:
        return colors.tint;
    }
  };

  const getGradientColors = (type: NotificationItem['type']): [string, string] => {
    const iconColor = getIconColor(type);
    if (isDark) {
      return [`${iconColor}20`, `${iconColor}10`];
    }
    return [`${iconColor}15`, `${iconColor}08`];
  };

  return {
    isDark,
    colors,
    getIconColor,
    getGradientColors,
  };
}

// Hook for notification item time formatting
export function useNotificationItemTime() {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return { formatTime };
}

// Hook for notification item gesture handling
export function useNotificationItemGesture(
  notification: NotificationItem,
  onDelete?: (notification: NotificationItem) => void
) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleDelete = (notification: NotificationItem) => {
    if (onDelete) {
      onDelete(notification);
    }
  };

  const gestureHandler = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .shouldCancelWhenOutside(true)
    .onStart(() => {
      // Store initial position
    })
    .onUpdate((event) => {
      // Only allow horizontal swipe, don't interfere with vertical scrolling
      if (Math.abs(event.velocityX) > Math.abs(event.velocityY)) {
        const newTranslateX = event.translationX;
        if (newTranslateX < 0) {
          translateX.value = newTranslateX;
        }
      }
    })
    .onEnd((event) => {
      // Only trigger delete if it's a clear horizontal swipe
      const isHorizontalSwipe = Math.abs(event.translationX) > Math.abs(event.translationY);
      const shouldDelete = isHorizontalSwipe && event.translationX < -100;
      
      if (shouldDelete) {
        translateX.value = withSpring(-400);
        opacity.value = withSpring(0, undefined, () => {
          runOnJS(handleDelete)(notification);
        });
      } else {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return {
    gestureHandler,
    animatedStyle,
  };
}
