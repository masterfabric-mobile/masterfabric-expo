import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ThemeProvider,
  useMasterView,
  useThemeColors
} from 'masterfabric-expo-core';
import { useHomeViewModel } from '../hooks/use-home-view-model';
import { homeScreenStyles } from '../styles/home-screen.styles';
import { getActionIconName } from '../utils';
import { HomeHeader } from './home-header';
import { ActivitySection } from './sections/activity-section';
import { DeveloperSection } from './sections/developer-section';
import { DeviceInfoSection } from './sections/device-info-section';
import { QuickActionsSection } from './sections/quick-actions-section';
import { WelcomeSection } from './sections/welcome-section';

// Hook-based MasterView implementation for Home Screen
function HomeScreenContent() {
  const colors = useThemeColors();
  const { trackActivity } = useMasterView();
  
  const {
    user,
    greeting,
    quickActions,
    deviceInfo,
    compatibility,
    compatibilityLoading,
    handleQuickActionPress,
    handleNotificationPress,
  } = useHomeViewModel();

  // Track activity when component mounts
  React.useEffect(() => {
    trackActivity('home_initialized');
    
    return () => {
      trackActivity('home_destroyed');
    };
  }, [trackActivity]);

  return (
    <SafeAreaView 
      style={[
        homeScreenStyles.container,
        { backgroundColor: colors.background }
      ]}
      edges={['top', 'left', 'right']}
    >
      <HomeHeader 
        onNotificationPress={handleNotificationPress}
      />
      
      <ScrollView 
        style={homeScreenStyles.content}
        contentContainerStyle={homeScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSection greeting={greeting} user={user} />
        
        <QuickActionsSection 
          quickActions={quickActions}
          onActionPress={(actionId, actionTitle) => handleQuickActionPress(actionId, actionTitle, colors.text === '#FFFFFF')}
          getIconName={getActionIconName}
        />

        <ActivitySection />

        <DeviceInfoSection 
          deviceInfo={deviceInfo as any}
          compatibility={compatibility || undefined}
          compatibilityLoading={compatibilityLoading}
        />

        <DeveloperSection 
          onActionPress={(actionId, actionTitle) => handleQuickActionPress(actionId, actionTitle, colors.text === '#FFFFFF')} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export function HomeScreen() {
  return (
    <ThemeProvider>
      <HomeScreenContent />
    </ThemeProvider>
  );
}