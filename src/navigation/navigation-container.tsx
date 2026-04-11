import { DarkTheme, DefaultTheme, NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';
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
  const colorScheme = useColorScheme();

  return (
    <RNNavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      linking={navigationConfig.linking as any}
      documentTitle={{
        formatter: (options, route) => 
          `${options?.title ?? route?.name ?? t('app.name')} - ${t('app.name')}`
      }}
    >
      {children}
    </RNNavigationContainer>
  );
}
