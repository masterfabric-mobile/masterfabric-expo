import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';

import { StageBadge } from '@/src/screens/splash/components/stage-badge';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { headerLogoSectionStyles } from '../styles/header-logo-section.styles';

export function HeaderLogo() {
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
          <ThemedText type="defaultSemiBold" style={headerLogoSectionStyles.appName}>
            {t('app.name')}
          </ThemedText>
          <View style={[
            headerLogoSectionStyles.divider, 
            { backgroundColor: isDark ? '#3C3C43' : '#C6C6C8' }
          ]} />
          <StageBadge type="text" />
        </View>
        <ThemedText style={headerLogoSectionStyles.typewriterText}>
          {displayText}
          <ThemedText style={headerLogoSectionStyles.cursor}>|</ThemedText>
        </ThemedText>
      </View>
    </View>
  );
}
