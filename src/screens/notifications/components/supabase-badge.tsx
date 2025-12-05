import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { notificationScreenStyles } from '../styles/notification-screen.styles';

interface SupabaseBadgeProps {
  additionalText?: string;
}

export function SupabaseBadge({ additionalText }: SupabaseBadgeProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={notificationScreenStyles.supabaseBadge}>
      <Image
        source={require('@/src/assets/images/supabase-logo-icon.svg')}
        style={notificationScreenStyles.supabaseLogo}
        contentFit="contain"
      />
      <ThemedText 
        style={[notificationScreenStyles.supabaseBadgeText, { color: colors.icon }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Supabase{additionalText ? ` • ${additionalText}` : ''}
      </ThemedText>
    </View>
  );
}

