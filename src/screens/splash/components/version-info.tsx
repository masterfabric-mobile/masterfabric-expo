import React from 'react';
import { useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { versionInfoStyles } from '../styles/version-info.styles';

// Import package.json to access version data
const packageInfo = require('@/package.json');

export function VersionInfo() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={versionInfoStyles.container}>
      <ThemedText 
        type="default" 
        style={[
          versionInfoStyles.versionText,
          { color: isDark ? '#888888' : '#666666' }
        ]}
      >
        v{packageInfo.version}
      </ThemedText>
      {packageInfo.name && (
        <ThemedText 
          type="default" 
          style={[
            versionInfoStyles.nameText,
            { color: isDark ? '#666666' : '#999999' }
          ]}
        >
          {packageInfo.name}
        </ThemedText>
      )}
    </View>
  );
}
