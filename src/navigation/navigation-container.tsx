import { DarkTheme, DefaultTheme, NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { t } from '../shared/i18n';

import { navigationConfig } from './navigation-config';

interface NavigationContainerProps {
  children: React.ReactNode;
}

/**
 * Centralized Navigation Container
 * Handles theme switching and navigation configuration
 */
export function NavigationContainer({ children }: NavigationContainerProps) {
  const { isDark } = useTheme();

  return (
    <RNNavigationContainer
      theme={isDark ? DarkTheme : DefaultTheme}
      linking={navigationConfig.linking}
      documentTitle={{
        formatter: (options, route) => 
          `${options?.title ?? route?.name ?? t('app.name')} - ${t('app.name')}`
      }}
    >
      {children}
    </RNNavigationContainer>
  );
}
