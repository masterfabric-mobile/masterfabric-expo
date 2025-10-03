import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React from 'react';

import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { homeHeaderStyles } from '../styles/home-header.styles';
import { getHeaderIntensity, getHeaderTint } from '../utils';
import { HeaderActions } from './header-actions';
import { HeaderLogo } from './header-logo';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
}

export function HomeHeader({ onNotificationPress }: HomeHeaderProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const handleNotificationPress = () => {
    router.push('/notifications');
    onNotificationPress?.();
  };

  return (
    <BlurView
      intensity={getHeaderIntensity(isDark)}
      tint={getHeaderTint(isDark)}
      style={[
        homeHeaderStyles.container,
        {
          backgroundColor: colors.tabBarBackground,
          borderBottomColor: colors.headerBorder,
        }
      ]}
    >
      <HeaderLogo />
      
      <HeaderActions
        onNotificationPress={handleNotificationPress}
      />
    </BlurView>
  );
}
