import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { StageBadge } from '@/src/shared/components/StageBadge';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { headerLogoSectionStyles } from '../styles/header-logo-section.styles';

export function HeaderLogo() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [displayText, setDisplayText] = useState('');
  const fullText = t('home.typewriter');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        currentIndex = 0;
        setDisplayText('');
      }
    }, 300);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <View style={headerLogoSectionStyles.leftSection}>
      <Image
        source={require('@/src/assets/images/masterfabric-logo.svg')}
        style={headerLogoSectionStyles.logo}
        contentFit="contain"
      />
      <View style={headerLogoSectionStyles.textContainer}>
        <View style={headerLogoSectionStyles.titleRow}>
          <ThemedText type="defaultSemiBold" style={[
            headerLogoSectionStyles.appName,
            { color: colors.headerText, fontWeight: '700' }
          ]}>
            {t('app.name')}
          </ThemedText>
          <View style={[
            headerLogoSectionStyles.divider, 
            { backgroundColor: colors.headerBorder }
          ]} />
          <StageBadge type="text" />
        </View>
        <ThemedText style={[
          headerLogoSectionStyles.typewriterText,
          { color: colors.headerIcon, opacity: 0.8 }
        ]}>
          {displayText}
          <ThemedText style={[
            headerLogoSectionStyles.cursor,
            { color: colors.headerIcon }
          ]}>|</ThemedText>
        </ThemedText>
      </View>
    </View>
  );
}
