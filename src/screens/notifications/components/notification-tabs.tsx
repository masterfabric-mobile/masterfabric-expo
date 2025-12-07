import { ThemedText } from '@/src/shared/components/ThemedText';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNotificationViewModel } from '../hooks/use-notification-view-model';
import { NotificationTabsProps } from '../models/notification-models';
import { notificationTabsStyles } from '../styles/notification-tabs.styles';

export function NotificationTabs({ activeTab, onTabChange }: NotificationTabsProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { tabs } = useNotificationViewModel();

  return (
    <View style={[notificationTabsStyles.container, { 
      backgroundColor: colors.background,
      borderBottomColor: colors.headerBorder,
    }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            notificationTabsStyles.tab,
            activeTab === tab.key && {
              borderBottomColor: colors.tint,
              borderBottomWidth: Sizing.borderWidth.m,
            }
          ]}
          onPress={() => onTabChange(tab.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.key }}
        >
          <ThemedText
            style={[
              notificationTabsStyles.tabText,
              {
                color: activeTab === tab.key ? colors.tint : colors.bodyText,
                opacity: activeTab === tab.key ? Sizing.opacity.full : Sizing.opacity.l,
              }
            ]}
          >
            {tab.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
