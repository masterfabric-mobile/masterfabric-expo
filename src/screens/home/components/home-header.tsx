import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

export function HomeHeader({ onNotificationPress, onSettingsPress }: HomeHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleProfilePress = () => {
    // Navigate to profile or show profile menu
  };

  const handleNotificationsPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.leftSection}>
        <Image
          source={require('@/src/assets/images/masterfabric-logo.svg')}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="defaultSemiBold" style={styles.appName}>
          {t('app.name')}
        </ThemedText>
      </View>

      <View style={styles.rightSection}>
        <Pressable
          onPress={handleNotificationsPress}
          style={[
            styles.iconButton,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.notifications')}
        >
          <Ionicons 
            name="notifications-outline" 
            size={20} 
            color={isDark ? '#FFFFFF' : '#000000'} 
          />
        </Pressable>

        <Pressable
          onPress={handleSettingsPress}
          style={[
            styles.iconButton,
            { backgroundColor: isDark ? '#1C1E1C' : '#F2F2F7' }
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.settings')}
        >
          <Ionicons 
            name="settings-outline" 
            size={20} 
            color={isDark ? '#FFFFFF' : '#000000'} 
          />
        </Pressable>

        <Pressable
          onPress={handleProfilePress}
          style={[
            styles.profileButton,
            { backgroundColor: isDark ? '#1C1E1C' : '#F2F2F7' }
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.profile')}
        >
          <Ionicons 
            name="person-outline" 
            size={20} 
            color={isDark ? '#FFFFFF' : '#000000'} 
          />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});