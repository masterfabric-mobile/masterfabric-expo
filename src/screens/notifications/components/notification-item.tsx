import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useNotificationItemGesture, useNotificationItemTheme, useNotificationItemTime } from '../hooks/use-notification-view-model';
import { NotificationItemProps } from '../models/notification-models';
import { notificationItemStyles } from '../styles/notification-item.styles';

export function NotificationItemComponent({ notification, onPress, onDelete }: NotificationItemProps) {
  const { isDark, colors, getIconColor } = useNotificationItemTheme();
  const { formatTime } = useNotificationItemTime();
  const { gestureHandler, animatedStyle } = useNotificationItemGesture(notification, onDelete);
  
  // Animated values for read state transitions
  const unreadOpacity = useSharedValue(notification.isRead ? 0 : 1);
  const titleWeight = useSharedValue(notification.isRead ? 500 : 600);
  const scale = useSharedValue(1);
  
  // Update animated values when read state changes
  useEffect(() => {
    if (notification.isRead) {
      unreadOpacity.value = withTiming(0, { duration: 300 });
      titleWeight.value = withSpring(500);
      // Subtle scale animation when marking as read
      scale.value = withSequence(
        withSpring(0.98, { duration: 100 }),
        withSpring(1, { duration: 200 })
      );
    } else {
      unreadOpacity.value = withTiming(1, { duration: 200 });
      titleWeight.value = withSpring(600);
      scale.value = 1;
    }
  }, [notification.isRead]);
  
  // Animated styles for unread indicators
  const unreadIndicatorStyle = useAnimatedStyle(() => ({
    opacity: unreadOpacity.value,
  }));
  
  const unreadLineStyle = useAnimatedStyle(() => ({
    opacity: unreadOpacity.value,
  }));
  
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    fontWeight: titleWeight.value as any,
  }));
  
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePress = () => {
    if (!notification.isRead) {
      // Provide haptic feedback when marking as read
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(notification);
  };

  return (
    <GestureDetector gesture={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <Animated.View style={containerAnimatedStyle}>
          <Pressable
            style={({ pressed }) => [
              notificationItemStyles.container,
              {
                backgroundColor: pressed ? colors.surfaceBackground : colors.background,
                opacity: pressed ? 0.9 : 1,
              },
              !notification.isRead && notificationItemStyles.unreadContainer,
            ]}
            onPress={handlePress}
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
                <Animated.Text 
                  style={[
                    notificationItemStyles.title,
                    { color: colors.text },
                    titleAnimatedStyle
                  ]}
                >
                  {notification.title}
                </Animated.Text>
                <Animated.View 
                  style={[
                    notificationItemStyles.unreadIndicator,
                    { backgroundColor: getIconColor(notification.type) },
                    unreadIndicatorStyle
                  ]} 
                />
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
          <Animated.View 
            style={[
              notificationItemStyles.unreadLine,
              { backgroundColor: getIconColor(notification.type) },
              unreadLineStyle
            ]} 
          />
          </Pressable>
        </Animated.View>

        {/* Separator line */}
        <View style={[
          notificationItemStyles.separator,
          { backgroundColor: colors.surfaceBorder }
        ]} />
      </Animated.View>
    </GestureDetector>
  );
}


