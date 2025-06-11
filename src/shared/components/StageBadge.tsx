import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { stageBadgeStyles } from '../../screens/splash/styles/stage-badge.styles';

// Import package.json to access stage data
const packageInfo = require('@/package.json');

interface StageBadgeProps {
  type?: 'background' | 'text';
}

export function StageBadge({ type = 'background' }: StageBadgeProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const stage = packageInfo.stage || 'development';
  
  const getStageColors = () => {
    switch (stage.toLowerCase()) {
      case 'production':
        return {
          background: colors.successColor + '20',
          border: colors.successColor,
          text: colors.successColor
        };
      case 'development':
        return {
          background: colors.activeButton + '20',
          border: colors.activeButton,
          text: colors.activeButton
        };
      case 'debug':
        return {
          background: colors.errorColor + '20',
          border: colors.errorColor,
          text: colors.errorColor
        };
      default:
        return {
          background: colors.buttonBackground,
          border: colors.surfaceBorder,
          text: colors.labelText
        };
    }
  };
  
  const stageColors = getStageColors();
  
  if (type === 'text') {
    return (
      <ThemedText 
        type="default" 
        style={[
          stageBadgeStyles.badgeText,
          { color: stageColors.text }
        ]}
      >
        {stage.toUpperCase()}
      </ThemedText>
    );
  }
  
  return (
    <View 
      style={[
        stageBadgeStyles.badge,
        {
          backgroundColor: stageColors.background,
          borderColor: stageColors.border,
        }
      ]}
    >
      <ThemedText 
        type="default" 
        style={[
          stageBadgeStyles.badgeText,
          { color: stageColors.text }
        ]}
      >
        {stage.toUpperCase()}
      </ThemedText>
    </View>
  );
}
