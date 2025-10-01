import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { getCurrentLocale, t } from '@/src/shared/i18n';
import { useEffect, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { NotificationItem, NotificationTab, TabItem } from '../models/notification-models';
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

  useEffect(() => {
    loadNotifications();
  }, []);

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

  const loadNotifications = async () => {
    setLoading(true);
    
    // Simulate API call - replace with actual API
    try {
      const allNotifications: NotificationItem[] = [
        {
          id: '1',
          title: 'Welcome to MasterFabric',
          message: 'Your account has been successfully created. Start exploring our features and build amazing mobile apps!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isRead: false,
          type: 'success',
          category: 'app',
          icon: 'checkmark-circle',
          language: 'en',
        },
        {
          id: '2',
          title: 'MasterFabric\'e Hoş Geldiniz',
          message: 'Hesabınız başarıyla oluşturuldu. Özelliklerimizi keşfetmeye başlayın ve harika mobil uygulamalar geliştirin!',
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          isRead: false,
          type: 'success',
          category: 'app',
          icon: 'checkmark-circle',
          language: 'tr',
        },
        {
          id: '3',
          title: 'System Update Available',
          message: 'New features and improvements are available. Update your app to get the latest experience with enhanced performance.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isRead: false,
          type: 'info',
          category: 'system',
          icon: 'download',
          language: 'en',
        },
        {
          id: '4',
          title: 'Sistem Güncellemesi Mevcut',
          message: 'Yeni özellikler ve iyileştirmeler mevcut. Geliştirilmiş performansla en son deneyimi elde etmek için uygulamanızı güncelleyin.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          isRead: true,
          type: 'info',
          category: 'system',
          icon: 'download',
          language: 'tr',
        },
        {
          id: '5',
          title: 'Maintenance Notice',
          message: 'Scheduled maintenance will occur tonight from 12 AM to 2 AM EST. Some features may be temporarily unavailable.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          isRead: true,
          type: 'warning',
          category: 'system',
          icon: 'warning',
          language: 'en',
        },
        {
          id: '6',
          title: 'Bakım Bildirimi',
          message: 'Planlanmış bakım bu gece 00:00 - 02:00 saatleri arasında gerçekleştirilecek. Bazı özellikler geçici olarak kullanılamayabilir.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day 2 hours ago
          isRead: true,
          type: 'warning',
          category: 'system',
          icon: 'warning',
          language: 'tr',
        },
        {
          id: '7',
          title: 'New Template Available',
          message: 'Check out our latest React Native template with advanced navigation and state management features.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
          isRead: false,
          type: 'info',
          category: 'app',
          icon: 'code-slash',
          language: 'en',
        },
        {
          id: '8',
          title: 'Yeni Şablon Mevcut',
          message: 'Gelişmiş navigasyon ve durum yönetimi özellikleri ile en son React Native şablonumuza göz atın.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50), // 2 days 2 hours ago
          isRead: true,
          type: 'info',
          category: 'app',
          icon: 'code-slash',
          language: 'tr',
        },
        {
          id: '9',
          title: 'Security Alert',
          message: 'We detected unusual activity on your account. Please review your recent login sessions for security.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
          isRead: true,
          type: 'error',
          category: 'system',
          icon: 'shield-checkmark',
          language: 'en',
        },
        {
          id: '10',
          title: 'Güvenlik Uyarısı',
          message: 'Hesabınızda olağandışı aktivite tespit ettik. Güvenlik için son giriş oturumlarınızı gözden geçirin.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 74), // 3 days 2 hours ago
          isRead: false,
          type: 'error',
          category: 'system',
          icon: 'shield-checkmark',
          language: 'tr',
        },
      ];

      // Filter notifications by current language
      const currentLanguage = getCurrentLocale();
      const languageNotifications = allNotifications.filter(
        notification => notification.language === currentLanguage
      );

      setTimeout(() => {
        setNotifications(languageNotifications);
        setLoading(false);
        updateLastUpdated();
      }, 1000);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setLoading(false);
    }
  };

  const refreshNotifications = () => {
    loadNotifications();
  };

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
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    refreshNotifications,
    addNotification,
    tabs,
  };
}

// Hook for notification item theme and styling
export function useNotificationItemTheme() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
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
