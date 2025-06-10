import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { packageInfoStyles } from '../styles/package-info.styles';

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
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

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
    <View style={packageInfoStyles.container}>
      <ThemedText 
        type="default" 
        style={[
          packageInfoStyles.text,
          { color: colors.splashSubtext },
          textStyle
        ]}
      >
        {displayValues.join(separator)}
      </ThemedText>
    </View>
  );
}
