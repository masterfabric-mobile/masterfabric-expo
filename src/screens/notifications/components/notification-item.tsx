import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useNotificationItemGesture, useNotificationItemTheme, useNotificationItemTime } from '../hooks/use-notification-view-model';
import { NotificationItemProps } from '../models/notification-models';
import { notificationItemStyles } from '../styles/notification-item.styles';

export function NotificationItemComponent({ notification, onPress, onDelete }: NotificationItemProps) {
  const { isDark, colors, getIconColor } = useNotificationItemTheme();
  const { formatTime } = useNotificationItemTime();
  const { gestureHandler, animatedStyle } = useNotificationItemGesture(notification, onDelete);

  return (
    <PanGestureHandler 
      onGestureEvent={gestureHandler}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-20, 20]}
      shouldCancelWhenOutside={true}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          style={({ pressed }) => [
            notificationItemStyles.container,
            {
              backgroundColor: pressed ? colors.surfaceBackground : colors.background,
              opacity: pressed ? 0.9 : 1,
            },
            !notification.isRead && notificationItemStyles.unreadContainer,
          ]}
          onPress={() => onPress(notification)}
          accessibilityRole="button"
          accessibilityState={{ selected: !notification.isRead }}
          accessibilityHint={t('notifications.swipeToDelete')}
        >
          <View style={notificationItemStyles.content}>
            <View style={notificationItemStyles.iconContainer}>
              <View style={[
                notificationItemStyles.iconWrapper,
                { 
                  backgroundColor: getIconColor(notification.type) + (isDark ? '15' : '10'),
                }
              ]}>
                <Ionicons
                  name={notification.icon as any || 'notifications'}
                  size={20}
                  color={getIconColor(notification.type)}
                />
              </View>
            </View>

            <View style={notificationItemStyles.textContainer}>
              <View style={notificationItemStyles.header}>
                <Text style={[
                  notificationItemStyles.title,
                  { color: colors.text },
                  !notification.isRead && notificationItemStyles.unreadTitle
                ]}>
                  {notification.title}
                </Text>
                {!notification.isRead && (
                  <View style={[
                    notificationItemStyles.unreadIndicator,
                    { backgroundColor: getIconColor(notification.type) }
                  ]} />
                )}
              </View>

              <Text style={[
                notificationItemStyles.message,
                { color: colors.bodyText }
              ]}>
                {notification.message}
              </Text>

              <View style={notificationItemStyles.footer}>
                <View style={notificationItemStyles.metaContainer}>
                  <Ionicons 
                    name="time-outline" 
                    size={12} 
                    color={colors.labelText} 
                    style={notificationItemStyles.timeIcon}
                  />
                  <Text style={[
                    notificationItemStyles.timestamp,
                    { color: colors.labelText }
                  ]}>
                    {formatTime(notification.timestamp)}
                  </Text>
                </View>
                
                <View style={[
                  notificationItemStyles.categoryBadge,
                  { 
                    backgroundColor: getIconColor(notification.type) + (isDark ? '15' : '08'),
                  }
                ]}>
                  <Ionicons 
                    name={notification.category === 'app' ? 'apps' : 'settings'} 
                    size={10} 
                    color={getIconColor(notification.type)} 
                    style={notificationItemStyles.categoryIcon}
                  />
                  <Text style={[
                    notificationItemStyles.categoryText,
                    { color: getIconColor(notification.type) }
                  ]}>
                    {notification.category}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Unread indicator line */}
          {!notification.isRead && (
            <View style={[
              notificationItemStyles.unreadLine,
              { backgroundColor: getIconColor(notification.type) }
            ]} />
          )}
        </Pressable>

        {/* Separator line */}
        <View style={[
          notificationItemStyles.separator,
          { backgroundColor: colors.surfaceBorder }
        ]} />
      </Animated.View>
    </PanGestureHandler>
  );
}


