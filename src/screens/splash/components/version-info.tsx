import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { versionInfoStyles } from '../styles/version-info.styles';

// Import package.json to access version data
const packageInfo = require('@/package.json');

export function VersionInfo() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={versionInfoStyles.container}>
      <ThemedText 
        type="default" 
        style={[
          versionInfoStyles.versionText,
          { color: colors.splashText }
        ]}
      >
        v{packageInfo.version}
      </ThemedText>
      {packageInfo.name && (
        <ThemedText 
          type="default" 
          style={[
            versionInfoStyles.nameText,
            { color: colors.splashSubtext }
          ]}
        >
          {packageInfo.name}
        </ThemedText>
      )}
    </View>
  );
}
