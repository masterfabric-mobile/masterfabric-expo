import React from 'react';
import { BlurView } from 'expo-blur';

import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { homeHeaderStyles } from '../styles/home-header.styles';
import { getHeaderIntensity, getHeaderTint } from '../utils';
import { HeaderActions } from './header-actions';
import { HeaderLogo } from './header-logo';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
}

export function HomeHeader({ onNotificationPress }: HomeHeaderProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

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
        onNotificationPress={onNotificationPress}
      />
    </BlurView>
  );
}
