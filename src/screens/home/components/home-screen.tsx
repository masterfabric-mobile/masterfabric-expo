import { navigationUtils } from '@/src/navigation/utils';
import { getDeviceInfoForLogging } from '@/src/shared/helpers/device-info';
import { useBasicDeviceInfo, useDeviceCompatibility } from '@/src/shared/hooks/use-device-info';
import { useLocale } from '@/src/shared/hooks/use-locale';
import React from 'react';
import { Alert, Clipboard, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeViewModel } from '../hooks/use-home-view-model';
import { homeScreenStyles } from '../styles/home-screen.styles';
import { HomeHeader } from './home-header';
import { ActivitySection } from './sections/activity-section';
import { DeveloperSection } from './sections/developer-section';
import { DeviceInfoSection } from './sections/device-info-section';
import { QuickActionsSection } from './sections/quick-actions-section';
import { WelcomeSection } from './sections/welcome-section';

// Helper function to get icon name based on action id
function getIconName(actionId: string): any {
  switch (actionId) {
    case 'new-project':
      return 'rocket';
    case 'templates':
      return 'clipboard';
    case 'documentation':
      return 'book';
    case 'settings':
      return 'settings';
    default:
      return 'apps';
  }
}

export function HomeScreen() {
  const colorScheme = useColorScheme();
  const { user, greeting, quickActions } = useHomeViewModel();
  const { locale } = useLocale();
  const deviceInfo = useBasicDeviceInfo();
  const { compatibility, isLoading: compatibilityLoading } = useDeviceCompatibility();
  
  const isDark = colorScheme === 'dark';

  const handleQuickActionPress = (actionId: string, actionTitle: string) => {
    try {
      switch (actionId) {
        case 'new-project':
          console.log('Creating new project...');
          break;
        case 'templates':
          console.log('Opening templates...');
          break;
        case 'documentation':
          console.log('Opening documentation...');
          break;
        case 'settings':
          console.log('Opening settings...');
          break;
        case 'dev-onboarding':
          console.log('Opening onboarding...');
          navigationUtils.replace('onboarding');
          break;
        case 'dev-device-info':
          handleDeviceInfoPress();
          break;
        default:
          console.log(`Unknown action: ${actionId}`);
          break;
      }
    } catch (error) {
      console.error('Error handling quick action press:', error);
    }
  };

  const handleDeviceInfoPress = async () => {
    try {
      const detailedInfo = await getDeviceInfoForLogging();
      Alert.alert(
        '🔧 Developer Device Info', 
        detailedInfo, 
        [
          { text: 'Copy to Clipboard', onPress: () => {
            try {
              Clipboard.setString(detailedInfo);
              Alert.alert('✅ Copied', 'Device information copied to clipboard!', [{ text: 'OK' }], {
                userInterfaceStyle: isDark ? 'dark' : 'light'
              });
            } catch (error) {
              console.error('Failed to copy to clipboard:', error);
              Alert.alert('❌ Error', 'Failed to copy to clipboard', [{ text: 'OK' }], {
                userInterfaceStyle: isDark ? 'dark' : 'light'
              });
            }
          }},
          { text: 'Close', style: 'cancel' }
        ],
        { 
          cancelable: true,
          userInterfaceStyle: isDark ? 'dark' : 'light'
        }
      );
    } catch (error) {
      console.error('Error getting device info:', error);
      Alert.alert(
        '❌ Error', 
        'Failed to get device information\n\nPlease check console for details.',
        [{ text: 'OK' }],
        { 
          userInterfaceStyle: isDark ? 'dark' : 'light'
        }
      );
    }
  };

  const handleNotificationPress = () => {
    try {
      console.log('Opening notifications...');
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const handleSettingsPress = () => {
    try {
      console.log('Opening settings...');
    } catch (error) {
      console.error('Error handling settings press:', error);
    }
  };

  return (
    <SafeAreaView 
      style={[
        homeScreenStyles.container,
        { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }
      ]}
    >
      <HomeHeader 
        onNotificationPress={handleNotificationPress}
        onSettingsPress={handleSettingsPress}
      />
      
      <ScrollView 
        style={homeScreenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSection greeting={greeting} user={user} />
        
        <QuickActionsSection 
          quickActions={quickActions}
          onActionPress={handleQuickActionPress}
          getIconName={getIconName}
        />

        <ActivitySection />

        <DeviceInfoSection 
          deviceInfo={deviceInfo as any}
          compatibility={compatibility || undefined}
          compatibilityLoading={compatibilityLoading}
        />

        <DeveloperSection onActionPress={handleQuickActionPress} />
      </ScrollView>
    </SafeAreaView>
  );
}