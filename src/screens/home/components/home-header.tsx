import React from 'react';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { homeHeaderStyles } from '../styles/home-header.styles';
import { HeaderActions } from './header-actions';
import { HeaderLogo } from './header-logo';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

export function HomeHeader({ onNotificationPress, onSettingsPress }: HomeHeaderProps) {
  const handleProfilePress = () => {
    // Navigate to profile or show profile menu
  };

  return (
    <ThemedView style={homeHeaderStyles.container}>
      <HeaderLogo />
      
      <HeaderActions
        onNotificationPress={onNotificationPress}
        onSettingsPress={onSettingsPress}
        onProfilePress={handleProfilePress}
      />
    </ThemedView>
  );
}