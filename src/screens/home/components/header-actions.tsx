import React from 'react';
import { View } from 'react-native';

import { t } from '@/src/shared/i18n';
import { headerActionsStyles } from '../styles/header-actions.styles';
import { HeaderActionButton } from './header-action-button';

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
  return (
    <View style={headerActionsStyles.container}>
      <HeaderActionButton
        iconName="notifications-outline"
        onPress={onNotificationPress}
        accessibilityLabel={t('accessibility.notifications')}
      />
      
      <HeaderActionButton
        iconName="settings-outline"
        onPress={onSettingsPress}
        accessibilityLabel={t('accessibility.settings')}
      />
      
      <HeaderActionButton
        iconName="person-outline"
        onPress={onProfilePress}
        accessibilityLabel={t('accessibility.profile')}
        variant="profile"
      />
    </View>
  );
}
