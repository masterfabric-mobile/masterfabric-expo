import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';

// Import package.json to access version data
const packageInfo = require('@/package.json');

export function VersionInfo() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <ThemedText 
        type="default" 
        style={[
          styles.versionText,
          { color: isDark ? '#888888' : '#666666' }
        ]}
      >
        v{packageInfo.version}
      </ThemedText>
      {packageInfo.name && (
        <ThemedText 
          type="default" 
          style={[
            styles.nameText,
            { color: isDark ? '#666666' : '#999999' }
          ]}
        >
          {packageInfo.name}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.8,
  },
});
