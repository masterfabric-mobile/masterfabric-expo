import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { useLocale } from '@/src/shared/hooks/use-locale';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { User } from '../../models/home-models';
import { welcomeSectionStyles } from '../../styles/welcome-section.styles';

interface WelcomeSectionProps {
  greeting: string;
  user: User | null;
}

export function WelcomeSection({ greeting, user }: WelcomeSectionProps) {
  const { currentTheme } = useTheme();
  const { locale } = useLocale(); // Add locale to trigger re-renders
  const isDark = currentTheme === 'dark';
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
