import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScaffoldMessage } from '@/src/shared/components';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { useNotificationViewModel } from '../hooks/use-notification-view-model';

import { NotificationTab } from '../models/notification-models';
import { notificationScreenStyles } from '../styles/notification-screen.styles';
import { NotificationItemComponent } from './notification-item';
import { NotificationSkeleton } from './notification-skeleton';
import { NotificationTabs } from './notification-tabs';

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
    unreadCount,
    isAuthenticated,
    isInitialLoad,
    markAsRead,
    markAllAsRead,
    clearAll,
    refreshNotifications,
    removeNotification,
  } = useNotificationViewModel(activeTab);

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
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

        <NotificationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Sign-in prompt for unauthenticated users */}
        {isAuthenticated === false && !isLoading && (
          <View
            style={[
              notificationScreenStyles.modernEmptyContainer,
              {
                padding: 20,
                margin: 16,
                borderRadius: 16,
                backgroundColor: colors.tint + '10',
                borderWidth: 1,
                borderColor: colors.tint + '30',
              },
            ]}
          >
            <Ionicons
              name="lock-closed"
              size={48}
              color={colors.tint}
              style={{ opacity: 0.8, marginBottom: 12 }}
            />
            <ThemedText
              style={[
                notificationScreenStyles.modernEmptyTitle,
                { color: colors.text, marginBottom: 8 },
              ]}
            >
              Sign in to track notifications
            </ThemedText>
            <ThemedText
              style={[
                notificationScreenStyles.modernEmptyMessage,
                { color: colors.labelText, marginBottom: 16, textAlign: 'center' },
              ]}
            >
              Sign in to mark notifications as read and keep track of what you've seen.
            </ThemedText>
            <TouchableOpacity
              onPress={() => router.push('/supabase-auth')}
              style={{
                backgroundColor: colors.tint,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                Sign In
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Skeleton loading during initial load */}
        {isInitialLoad && isLoading && <NotificationSkeleton />}

        {filteredNotifications.length > 0 && !isInitialLoad && (
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
                <Ionicons name="checkmark-done" size={16} color={colors.tint} />
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
                <Ionicons name="trash-outline" size={16} color={colors.errorColor} />
                <Text style={[notificationScreenStyles.modernActionText, { color: colors.errorColor }]}>
                  {t('notifications.clearAll')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {filteredNotifications.length === 0 && !isInitialLoad && !isLoading && (
          <View style={notificationScreenStyles.modernEmptyContainer}>
            <View style={[
              notificationScreenStyles.modernEmptyIconContainer,
              { backgroundColor: colors.tint + '10' }
            ]}>
              <Ionicons
                name="notifications-outline"
                size={48}
                color={colors.tint}
                style={{ opacity: 0.8 }}
              />
            </View>
            <Text style={[notificationScreenStyles.modernEmptyTitle, { color: colors.text }]}>
              {t('notifications.empty.title')}
            </Text>
            <Text style={[notificationScreenStyles.modernEmptyMessage, { color: colors.labelText }]}>
              {t('notifications.empty.message')}
            </Text>
          </View>
        )}

        {filteredNotifications.length > 0 && !isInitialLoad && (
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={notificationScreenStyles.listContentContainer}
            refreshing={isLoading}
            onRefresh={refreshNotifications}
            scrollEnabled={true}
            bounces={true}
            alwaysBounceVertical={true}
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
