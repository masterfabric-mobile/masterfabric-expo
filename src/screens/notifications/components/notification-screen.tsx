import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScaffoldMessage } from '@/src/shared/components';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import { useNotificationViewModel } from '../hooks/use-notification-view-model';

import { NotificationTab } from '../models/notification-models';
import { notificationScreenStyles } from '../styles/notification-screen.styles';
import { NotificationItemComponent } from './notification-item';
import { NotificationSkeleton } from './notification-skeleton';
import { NotificationTabs } from './notification-tabs';
import { SupabaseBadge } from './supabase-badge';

export function NotificationScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const [scaffoldMessage, setScaffoldMessage] = React.useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  const [activeTab, setActiveTab] = React.useState<NotificationTab>('all');

  const {
    notifications: filteredNotifications,
    isLoading,
    isRefreshing,
    unreadCount,
    isAuthenticated,
    isInitialLoad,
    markAsRead,
    markAllAsRead,
    clearAll,
    refreshNotifications,
    removeNotification,
  } = useNotificationViewModel(activeTab);

  // Track if we've already loaded notifications on this mount
  const hasLoadedRef = React.useRef(false);
  
  // Only refresh on initial focus, not on every focus
  useFocusEffect(
    React.useCallback(() => {
      // Only refresh on the first focus if we haven't loaded yet
      if (!hasLoadedRef.current && !isInitialLoad && !isLoading && !isRefreshing) {
        hasLoadedRef.current = true;
        // Don't auto-refresh, let the initial load handle it
      }
      
      return () => {
        // Keep the flag when screen loses focus so we don't refresh again
      };
    }, [isInitialLoad, isLoading, isRefreshing])
  );

  const handleNotificationPress = (notification: any) => {
    // Mark as read if unread, otherwise just handle the press
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // TODO: Add navigation or action handling here if needed
    // For example: if (notification.actionUrl) { router.push(notification.actionUrl); }
  };

  const handleNotificationDelete = (notification: any) => {
    removeNotification(notification.id);
    setScaffoldMessage({
      visible: true,
      message: t('notifications.deletedMessage'),
      type: 'success',
    });
  };

  const hideScaffoldMessage = () => {
    setScaffoldMessage(prev => ({ ...prev, visible: false }));
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <SafeAreaView
        style={[
          notificationScreenStyles.container,
          { backgroundColor: colors.background }
        ]}
      >
        <ScreenHeader
          title={t('notifications.title')}
          subtitle={`${filteredNotifications.length} ${t('notifications.title').toLowerCase()}`}
          showStageBadge={true}
          variant="minimal"
        />

        {/* Supabase badge */}
        <SupabaseBadge additionalText="Real-time instant notification sync" />

        <NotificationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {filteredNotifications.length > 0 && (
          <View style={[notificationScreenStyles.actionBar, { 
            backgroundColor: 'transparent',
            borderBottomColor: colors.surfaceBorder,
          }]}>
            <View style={notificationScreenStyles.actionContainer}>
              <TouchableOpacity
                onPress={markAllAsRead}
                style={[notificationScreenStyles.modernActionButton, {
                  backgroundColor: colors.tint + '12',
                }]}
                accessibilityRole="button"
                accessibilityLabel={t('notifications.markAllRead')}
              >
                <Ionicons name="checkmark-done" size={Sizing.icon.s} color={colors.tint} />
                <Text style={[notificationScreenStyles.modernActionText, { color: colors.tint }]}>
                  {t('notifications.markAllRead')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={clearAll}
                style={[notificationScreenStyles.modernActionButton, {
                  backgroundColor: colors.errorColor + '12',
                }]}
                accessibilityRole="button"
                accessibilityLabel={t('notifications.clearAll')}
              >
                <Ionicons name="trash-outline" size={Sizing.icon.s} color={colors.errorColor} />
                <Text style={[notificationScreenStyles.modernActionText, { color: colors.errorColor }]}>
                  {t('notifications.clearAll')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {filteredNotifications.length === 0 ? (
          <View style={notificationScreenStyles.modernEmptyContainer}>
            <View style={[
              notificationScreenStyles.modernEmptyIconContainer,
              { backgroundColor: colors.tint + '10' }
            ]}>
              <Ionicons
                name="notifications-outline"
                size={Sizing.icon.xxxl}
                color={colors.tint}
                style={{ opacity: Sizing.opacity.xl }}
              />
            </View>
            <Text style={[notificationScreenStyles.modernEmptyTitle, { color: colors.text }]}>
              {t('notifications.empty.title')}
            </Text>
            <Text style={[notificationScreenStyles.modernEmptyMessage, { color: colors.labelText }]}>
              {t('notifications.empty.message')}
            </Text>
          </View>
        ) : (
          <FlatList
            style={notificationScreenStyles.modernListContainer}
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItemComponent
                notification={item}
                onPress={handleNotificationPress}
                onDelete={handleNotificationDelete}
              />
            )}
          />
        )}
      </SafeAreaView>

      <ScaffoldMessage
        visible={scaffoldMessage.visible}
        message={scaffoldMessage.message}
        type={scaffoldMessage.type}
        onHide={hideScaffoldMessage}
        icon="trash"
      />
    </>
  );
}
