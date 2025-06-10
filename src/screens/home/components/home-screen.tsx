import { useTheme } from '@/src/shared/contexts/theme-context';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useHomeViewModel } from '../hooks/use-home-view-model';
import { homeScreenStyles } from '../styles/home-screen.styles';
import { getActionIconName } from '../utils';
import { HomeHeader } from './home-header';
import { ActivitySection } from './sections/activity-section';
import { DeveloperSection } from './sections/developer-section';
import { DeviceInfoSection } from './sections/device-info-section';
import { QuickActionsSection } from './sections/quick-actions-section';
import { WelcomeSection } from './sections/welcome-section';

export function HomeScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
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
          onActionPress={(actionId, actionTitle) => handleQuickActionPress(actionId, actionTitle, isDark)}
          getIconName={getActionIconName}
        />

        <ActivitySection />

        <DeviceInfoSection 
          deviceInfo={deviceInfo as any}
          compatibility={compatibility || undefined}
          compatibilityLoading={compatibilityLoading}
        />

        <DeveloperSection 
          onActionPress={(actionId, actionTitle) => handleQuickActionPress(actionId, actionTitle, isDark)} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}