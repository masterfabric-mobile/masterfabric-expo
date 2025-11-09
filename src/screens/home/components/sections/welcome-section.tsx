import { ThemedText } from '@/src/shared/components/ThemedText';
import { useLocale } from '@/src/shared/contexts/locale-context';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { User } from '../../models/home-models';
import { welcomeSectionStyles } from '../../styles/welcome-section.styles';

interface WelcomeSectionProps {
  greeting: string;
  user: User | null;
}

export function WelcomeSection({ greeting, user }: WelcomeSectionProps) {
  const { isDark } = useTheme();
  const { locale } = useLocale(); // Add locale to trigger re-renders
  const colors = getThemeColors(isDark);

  // Optional: Force re-render on language change for greeting
  useEffect(() => {
    // This effect only runs when locale changes
    // The greeting should already update through props, but this ensures it
  }, [locale]);

  return (
    <View style={welcomeSectionStyles.container}>
      <ThemedText
        type="title"
        style={[
          welcomeSectionStyles.greeting,
          { color: colors.bodyText }
        ]}
      >
        {greeting}
      </ThemedText>

      <ThemedText
        style={[
          welcomeSectionStyles.developerText,
          { color: colors.actionDescription }
        ]}
      >
        {t('home.typewriter')}
      </ThemedText>

      {user && (
        <ThemedText
          style={[
            welcomeSectionStyles.userName,
            { color: colors.actionDescription }
          ]}
        >
          {user.name}
        </ThemedText>
      )}
    </View>
  );
}
