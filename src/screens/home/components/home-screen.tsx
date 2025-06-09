import { navigationUtils } from '@/src/navigation/utils';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { getDeviceInfoForLogging } from '@/src/shared/helpers/device-info';
import { useBasicDeviceInfo, useDeviceCompatibility } from '@/src/shared/hooks/use-device-info';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Clipboard, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeViewModel } from '../hooks/use-home-view-model';
import { HomeHeader } from './home-header';

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
          // Handle new project creation
          console.log('Creating new project...');
          // TODO: Navigate to project creation flow
          break;
        case 'templates':
          // Handle templates navigation
          console.log('Opening templates...');
          // TODO: Navigate to templates screen
          break;
        case 'documentation':
          // Handle documentation navigation
          console.log('Opening documentation...');
          // TODO: Navigate to documentation or external link
          break;
        case 'settings':
          // Handle settings navigation
          console.log('Opening settings...');
          // TODO: Navigate to settings screen
          break;
        case 'dev-onboarding':
          // Handle onboarding navigation for development
          console.log('Opening onboarding...');
          // Navigate to onboarding screen
          navigationUtils.replace('onboarding');
        
          break;
        case 'dev-device-info':
          // Show detailed device information
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
      // TODO: Navigate to notifications screen
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const handleSettingsPress = () => {
    try {
      console.log('Opening settings...');
      // TODO: Navigate to settings screen
    } catch (error) {
      console.error('Error handling settings press:', error);
    }
  };

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }
      ]}
    >
      <HomeHeader 
        onNotificationPress={handleNotificationPress}
        onSettingsPress={handleSettingsPress}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.welcomeSection}>
          <ThemedText type="title" style={styles.greeting}>
            {greeting}
          </ThemedText>
          {user && (
            <ThemedText type="subtitle" style={styles.userName}>
              {user.name}
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('home.quickActions')}
          </ThemedText>
          
          <View style={styles.quickActionsList}>
            {quickActions.map((action: any) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => handleQuickActionPress(action.id, action.title)}
                activeOpacity={0.7}
              >
                <ThemedView 
                  style={[
                    styles.actionCard,
                    { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
                  ]}
                >
                  <View style={[
                    styles.actionIcon,
                    { backgroundColor: action.color }
                  ]}>
                    <Ionicons 
                      name={getIconName(action.id)} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                  
                  <View style={styles.actionContent}>
                    <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                      {action.title}
                    </ThemedText>
                    
                    <ThemedText style={styles.actionDescription}>
                      {action.description}
                    </ThemedText>
                  </View>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('home.recentActivity')}
          </ThemedText>
          
          <ThemedView style={[
            styles.activityCard,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
          ]}>
            <ThemedText style={styles.activityText}>
              {t('home.noActivity')}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Device Information Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Device Information
          </ThemedText>
          
          <ThemedView style={[
            styles.deviceInfoCard,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
          ]}>
            <ThemedText style={styles.deviceInfoText}>
              {`Platform: ${deviceInfo.platform || 'Unknown'}`}
            </ThemedText>
            <ThemedText style={styles.deviceInfoText}>
              {`Device: ${deviceInfo.deviceName || 'Unknown'}`}
            </ThemedText>
            <ThemedText style={styles.deviceInfoText}>
              {`OS: ${deviceInfo.osName || 'Unknown'} ${deviceInfo.osVersion || ''}`}
            </ThemedText>
            <ThemedText style={styles.deviceInfoText}>
              {`App Version: ${deviceInfo.appVersion || 'Unknown'}`}
            </ThemedText>
            <ThemedText style={styles.deviceInfoText}>
              {`Screen: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`}
            </ThemedText>
            <ThemedText style={styles.deviceInfoText}>
              {`Is Device: ${deviceInfo.isDevice ? 'Yes' : 'No'}`}
            </ThemedText>
            {!compatibilityLoading && compatibility && (
              <>
                <ThemedText style={[
                  styles.deviceInfoText,
                  { color: compatibility.isCompatible ? '#34C759' : '#FF3B30' }
                ]}>
                  {`Compatible: ${compatibility.isCompatible ? 'Yes' : 'No'}`}
                </ThemedText>
                {compatibility.warnings.length > 0 && (
                  <ThemedText style={[styles.deviceInfoText, { color: '#FF9500' }]}>
                    {`Warnings: ${compatibility.warnings.length}`}
                  </ThemedText>
                )}
              </>
            )}
          </ThemedView>
        </ThemedView>

        {/* Developer Section */}
        {__DEV__ && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Developer Tools
            </ThemedText>
            
            <View style={styles.developerToolsList}>
              <TouchableOpacity
                onPress={() => handleQuickActionPress('dev-onboarding', 'View Onboarding')}
                activeOpacity={0.7}
              >
                <ThemedView 
                  style={[
                    styles.actionCard,
                    { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
                  ]}
                >
                  <View style={[
                    styles.actionIcon,
                    { backgroundColor: '#FF9500' }
                  ]}>
                    <Ionicons 
                      name="build" 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                  
                  <View style={styles.actionContent}>
                    <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                      View Onboarding
                    </ThemedText>
                    
                    <ThemedText style={styles.actionDescription}>
                      Preview onboarding flow for development
                    </ThemedText>
                  </View>
                </ThemedView>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleQuickActionPress('dev-device-info', 'Show Device Info')}
                activeOpacity={0.7}
              >
                <ThemedView 
                  style={[
                    styles.actionCard,
                    { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
                  ]}
                >
                  <View style={[
                    styles.actionIcon,
                    { backgroundColor: '#007AFF' }
                  ]}>
                    <Ionicons 
                      name="phone-portrait" 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                  
                  <View style={styles.actionContent}>
                    <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                      Device Information
                    </ThemedText>
                    
                    <ThemedText style={styles.actionDescription}>
                      Show detailed device and system information
                    </ThemedText>
                  </View>
                </ThemedView>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsList: {
    gap: 12,
  },
  developerToolsList: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  activityCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  activityText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  deviceInfoCard: {
    padding: 16,
    borderRadius: 12,
  },
  deviceInfoText: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
});