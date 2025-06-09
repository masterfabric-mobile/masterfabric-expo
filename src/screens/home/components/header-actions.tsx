import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View, useColorScheme } from 'react-native';

import { t } from '@/src/shared/i18n';
import { headerActionsStyles } from '../styles/header-actions.styles';

interface HeaderActionsProps {
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
}

export function HeaderActions({ 
  onNotificationPress, 
  onSettingsPress, 
  onProfilePress 
}: HeaderActionsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleNotificationsPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  return (
    <View style={headerActionsStyles.container}>
      <Pressable
        onPress={handleNotificationsPress}
        style={[
          headerActionsStyles.iconButton,
          { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
        ]}
        accessibilityRole="button"
        accessibilityLabel={t('accessibility.notifications')}
      >
        <Ionicons 
          name="notifications-outline" 
          size={20} 
          color={isDark ? '#FFFFFF' : '#000000'} 
        />
      </Pressable>
    </View>
  );
}
