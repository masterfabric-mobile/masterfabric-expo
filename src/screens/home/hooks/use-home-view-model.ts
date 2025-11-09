import { useBasicDeviceInfo, useDeviceCompatibility } from '@/src/shared/hooks/use-device-info';
import { t } from '@/src/shared/i18n';
import { useAppStore } from '@/src/shared/store';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { getDeviceInfoForLogging } from 'masterfabric-expo-core';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, Clipboard } from 'react-native';
import { ActivityActionType, ActivityItem, ActivityType, useHomeStore } from '../store/home-store';
import { createDefaultQuickActions, formatGreeting, getDeveloperActions } from '../utils';

export function useHomeViewModel() {
  const { user } = useAppStore();
  const { quickActions, recentActivity, addActivity } = useHomeStore();
  const deviceInfo = useBasicDeviceInfo();
  const { compatibility, isLoading: compatibilityLoading } = useDeviceCompatibility();
  // Theme is available but not used in this hook
  // const { isDark } = useMasterView();
  const initialDeviceInfoAdded = useRef(false);

  const greeting = useMemo(() => {
    return formatGreeting(user);
  }, [user]);

  const defaultQuickActions = useMemo(() => {
    return createDefaultQuickActions();
  }, []);

  const developerActions = useMemo(() => {
    return getDeveloperActions();
  }, []);

  // Add device info activity when component mounts only once
  useEffect(() => {
    // Only add the initial device info activity if it hasn't been added yet
    if (!initialDeviceInfoAdded.current) {
      const deviceInfoActivity: ActivityItem = {
        id: Date.now().toString(),
        title: t('deviceInfo.title'), // This will correctly translate based on locale
        description: t('home.activity.deviceInfoRetrieved'),
        timestamp: new Date().toISOString(),
        type: 'device_info',
        details: {
          action: 'device_info'
        }
      };
      
      addActivity(deviceInfoActivity);
      initialDeviceInfoAdded.current = true;
    }
  }, [addActivity]);

  // Track activity for quick actions with proper localization
  const trackQuickAction = useCallback((actionId: string, actionTitle: string) => {
    let description = '';
    let title = '';
    let actionType: ActivityType = 'project';
    let action: ActivityActionType = 'app_start';
    
    // Determine the activity description and type based on the action
    switch (actionId) {
      case 'new-project':
        title = t('home.actions.projects.title');
        description = t('home.activity.allProjects');
        actionType = 'project';
        action = 'new_project';
        break;
      case 'templates':
        title = t('home.actions.templates.title');
        description = t('home.activity.templatesViewed');
        actionType = 'template';
        action = 'templates';
        break;
      case 'documentation':
        title = t('home.actions.documentation.title');
        description = t('home.activity.documentationOpened');
        actionType = 'documentation';
        action = 'documentation';
        break;
      case 'settings':
        title = t('home.actions.settings.title');
        description = t('home.activity.settingsOpened');
        actionType = 'settings';
        action = 'settings';
        break;
      case 'helpers':
        title = t('home.actions.helpers.title');
        description = t('home.activity.helpersOpened');
        actionType = 'project';
        action = 'app_start';
        break;
      default:
        // For developer tools or other unspecified actions
        title = actionId.includes('dev-') ? 
          t('home.developer.title') : actionTitle;
        description = actionId.includes('dev-') ? 
          t('home.activity.devToolUsed') : `${actionTitle} ${t('home.activity.opened')}`;
        actionType = actionId.includes('dev-') ? 'dev_tool' : 'project';
        action = actionId.includes('dev-') ? 'dev_tool' : 'app_start';
    }
    
    const activity: ActivityItem = {
      id: Date.now().toString(),
      title, // Use the translated title directly
      description,
      timestamp: new Date().toISOString(),
      type: actionType,
      details: {
        action, // Use the properly typed action
        actionId
      }
    };
    addActivity(activity);
  }, [addActivity]);

  // Track settings changes with proper translations
  const trackSettingChange = useCallback((settingType: 'theme_change' | 'language_change' | 'notification_settings' | 'general_settings', from: string, to: string) => {
    let title = '';
    
    switch (settingType) {
      case 'theme_change':
        title = t('settings.theme.title');
        break;
      case 'language_change':
        title = t('settings.language');
        break;
      case 'notification_settings':
        title = t('settings.notifications.title');
        break;
      case 'general_settings':
      default:
        title = t('settings.title');
        break;
    }
    
    const activity: ActivityItem = {
      id: Date.now().toString(),
      title, // Use the translated title directly
      timestamp: new Date().toISOString(),
      type: 'settings',
      details: {
        action: settingType,
        from,
        to
      }
    };
    addActivity(activity);
  }, [addActivity]);

  const handleDeviceInfoPress = useCallback(async (isDark: boolean) => {
    try {
      // Track the activity
      const activity: ActivityItem = {
        id: Date.now().toString(),
        title: t('home.developer.deviceInfo.title'),
        description: t('home.developer.deviceInfo.description'),
        timestamp: new Date().toISOString(),
        type: 'dev_tool',
        details: {
          action: 'dev_tool',
          tool: 'dev-device-info'
        }
      };
      addActivity(activity);
      
      const deviceInfoData = await getDeviceInfoForLogging();
      
      const translatedFields = deviceInfoData.fields.map(field => {
        let value = field.value;
        
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
  }, [addActivity]);

  const handleQuickActionPress = useCallback((actionId: string, actionTitle: string, isDark: boolean) => {
    try {
      // Track the activity first
      let activityDescription = '';
      let activityType: ActivityType = 'project';
      let actionType: ActivityActionType = 'app_start';
      
      switch (actionId) {
        case 'projects':
          activityDescription = t('home.activity.projectsViewed');
          activityType = 'project';
          actionType = 'new_project';
          break;
        case 'templates':
          activityDescription = t('home.activity.templatesViewed');
          activityType = 'template';
          actionType = 'templates';
          break;
        case 'documentation':
          activityDescription = t('home.activity.documentationOpened');
          activityType = 'documentation';
          actionType = 'documentation';
          break;
        case 'settings':
          activityDescription = t('home.activity.settingsOpened');
          activityType = 'settings';
          actionType = 'settings';
          break;
        case 'contact':
          activityDescription = t('home.actions.contact.description');
          activityType = 'project';
          actionType = 'app_start';
          break;
        case 'dev-onboarding':
          activityDescription = t('home.activity.onboardingStarted');
          activityType = 'dev_tool';
          actionType = 'dev_tool';
          break;
        case 'dev-device-info':
          activityDescription = t('home.developer.deviceInfo.description');
          activityType = 'dev_tool';
          break;
        default:
          activityDescription = `${actionTitle} ${t('home.activity.opened')}`;
          activityType = 'project';
          actionType = 'app_start';
      }
      
      // Create the activity
      const activity: ActivityItem = {
        id: Date.now().toString(),
        title: actionTitle,
        description: activityDescription,
        timestamp: new Date().toISOString(),
        type: activityType,
        details: {
          action: actionType,
          tool: actionId
        }
      };
      
      // Add the activity
      addActivity(activity);
      
      // Handle the action itself
      switch(actionId) {
        case 'projects':
          console.log('🚀 Navigating to projects...');
          router.push('/projects');
          break;
        case 'templates':
          console.log('🌐 Opening templates repository...');
          const url = 'https://github.com/masterfabric-mobile';
          Linking.canOpenURL(url).then(canOpen => {
            if (canOpen) {
              Linking.openURL(url);
            } else {
              console.error('Cannot open URL:', url);
              Alert.alert(
                'Unable to Open',
                'Could not open the GitHub repository. Please check your internet connection.',
                [{ text: 'OK' }],
                { userInterfaceStyle: isDark ? 'dark' : 'light' }
              );
            }
          }).catch(error => {
            console.error('Error opening URL:', error);
            Alert.alert(
              'Error',
              'An error occurred while trying to open the repository.',
              [{ text: 'OK' }],
              { userInterfaceStyle: isDark ? 'dark' : 'light' }
            );
          });
          break;
        case 'helpers':
          console.log('🔧 Navigating to helpers...');
          router.push('/helpers');
          break;
        case 'documentation':
          console.log('📚 Navigating to documentation...');
          router.push('/documentation');
          break;
        case 'contact':
          console.log('🌐 Opening MasterFabric website...');
          const contactUrl = 'https://masterfabric.co';
          Linking.canOpenURL(contactUrl).then(canOpen => {
            if (canOpen) {
              Linking.openURL(contactUrl);
            } else {
              console.error('Cannot open URL:', contactUrl);
              Alert.alert(
                'Unable to Open',
                'Could not open the MasterFabric website. Please check your internet connection.',
                [{ text: 'OK' }],
                { userInterfaceStyle: isDark ? 'dark' : 'light' }
              );
            }
          }).catch(error => {
            console.error('Error opening URL:', error);
            Alert.alert(
              'Error',
              'An error occurred while trying to open the website.',
              [{ text: 'OK' }],
              { userInterfaceStyle: isDark ? 'dark' : 'light' }
            );
          });
          break;
        case 'settings':
          console.log('🔧 Navigating to settings...');
          router.push('/settings');
          break;
        case 'dev-onboarding':
          console.log('Opening onboarding...');
          router.push('/onboarding');
          break;
        case 'dev-device-info':
          handleDeviceInfoPress(isDark);
          break;
        default:
          console.log(`Unknown action: ${actionId}`);
          break;
      }
    } catch (error) {
      console.error('Error handling quick action press:', error);
    }
  }, [handleDeviceInfoPress, addActivity]);

  const handleNotificationPress = useCallback(() => {
    try {
      console.log('Opening notifications...');
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  }, []);

  const handleSettingsPress = useCallback(() => {
    try {
      console.log('🔧 Navigating to settings from header...');
      router.push('/settings');
    } catch (error) {
      console.error('Error handling settings press:', error);
    }
  }, []);

  return {
    // Data
    user: user || null,
    greeting: greeting,
    quickActions: quickActions.length > 0 ? quickActions : defaultQuickActions,
    developerActions,
    recentActivity,
    deviceInfo,
    compatibility,
    compatibilityLoading,
    // Actions
    handleQuickActionPress,
    handleNotificationPress,
    handleSettingsPress,
    trackSettingChange,
    trackQuickAction,
  };
}
