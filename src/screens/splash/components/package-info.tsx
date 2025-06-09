import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';

// Import package.json to access data
const packageInfo = require('@/package.json');

interface PackageInfoProps {
  keys: string[];
  showKeys?: boolean;
  separator?: string;
  textStyle?: any;
}

export function PackageInfo({ 
  keys, 
  showKeys = false, 
  separator = ' | ',
  textStyle 
}: PackageInfoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getNestedValue = (obj: any, keyPath: string) => {
    return keyPath.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  const displayValues = keys
    .map(key => {
      const value = getNestedValue(packageInfo, key);
      if (value === null || value === undefined) return null;
      
      if (showKeys) {
        return `${key}: ${value}`;
      }
      return value;
    })
    .filter(Boolean);

  if (displayValues.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText 
        type="default" 
        style={[
          styles.text,
          { color: isDark ? '#888888' : '#666666' },
          textStyle
        ]}
      >
        {displayValues.join(separator)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});
