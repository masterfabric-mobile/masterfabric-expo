import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { StageBadge } from '@/src/screens/splash/components/stage-badge';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';

interface HomeHeaderProps {
  onNotificationPress?: () => void;
}

export function HomeHeader({ onNotificationPress }: HomeHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [displayText, setDisplayText] = useState('');
  const fullText = t('home.typewriter');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        // Reset and start over
        currentIndex = 0;
        setDisplayText('');
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationsPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
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
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <ThemedText type="defaultSemiBold" style={styles.appName}>
              {t('app.name')}
            </ThemedText>
            <View style={[styles.divider, { backgroundColor: isDark ? '#3C3C43' : '#C6C6C8' }]} />
            <StageBadge type="text" />
          </View>
          <ThemedText style={styles.typewriterText}>
            {displayText}
            <ThemedText style={styles.cursor}>|</ThemedText>
          </ThemedText>
        </View>
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
  textContainer: {
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
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
  divider: {
    width: 1,
    height: 16,
    opacity: 0.6,
  },
  typewriterText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  cursor: {
    fontFamily: 'Courier New',
    opacity: 1,
  },
});