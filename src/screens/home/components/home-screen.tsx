import { navigationUtils } from '@/src/navigation/utils';
import { getDeviceInfoForLogging } from '@/src/shared/helpers/device-info';
import { useBasicDeviceInfo, useDeviceCompatibility } from '@/src/shared/hooks/use-device-info';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
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
      const deviceInfoData = await getDeviceInfoForLogging();
      
      // Translate the device info fields
      const translatedFields = deviceInfoData.fields.map(field => {
        let value = field.value;
        
        // Translate common values
        if (value === 'unknown') value = t('common.unknown');
        else if (value === 'yes') value = t('common.yes');
        else if (value === 'no') value = t('common.no');
        
        return `${t(field.labelKey)}: ${value}`;
      }).join('\n');
      
      const detailedInfo = `${t(deviceInfoData.titleKey)}:\n------------------\n${translatedFields}`;
      
      Alert.alert(
        `🔧 ${t('home.developer.deviceInfo.title')}`, 
        detailedInfo, 
        [
          { text: t('deviceInfo.copyToClipboard'), onPress: () => {
            try {
              Clipboard.setString(detailedInfo);
              Alert.alert(
                `✅ ${t('common.success')}`, 
                t('deviceInfo.copiedMessage'), 
                [{ text: t('common.ok') }], 
                { userInterfaceStyle: isDark ? 'dark' : 'light' }
              );
            } catch (error) {
              console.error('Failed to copy to clipboard:', error);
              Alert.alert(
                `❌ ${t('common.error')}`, 
                t('deviceInfo.copyError'), 
                [{ text: t('common.ok') }], 
                { userInterfaceStyle: isDark ? 'dark' : 'light' }
              );
            }
          }},
          { text: t('common.close'), style: 'cancel' }
        ],
        { 
          cancelable: true,
          userInterfaceStyle: isDark ? 'dark' : 'light'
        }
      );
    } catch (error) {
      console.error('Error getting device info:', error);
      Alert.alert(
        `❌ ${t('common.error')}`, 
        t('deviceInfo.getInfoError'),
        [{ text: t('common.ok') }],
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