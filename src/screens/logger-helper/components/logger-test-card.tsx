import { Sizing, getThemeColors, typographyHelper, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Text, View } from 'react-native';
import { LoggerTestResult } from '../models/logger-helper-models';

// Props for test result card component
interface LoggerTestCardProps {
  result: LoggerTestResult;
}

// Card component for displaying logger test results
export function LoggerTestCard({ result }: LoggerTestCardProps) {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme === 'dark');

  return (
    <View style={{ borderWidth: Sizing.borderWidth.s, borderRadius: Sizing.card.borderRadius.small, padding: Sizing.padding.m, gap: Sizing.gap.xxs, borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }}>
      <Text style={[{ fontWeight: '600', color: colors.titleText }, typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal')]}>{result.functionName}</Text>
      <Text style={[{ color: colors.bodyText }, typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal')]}>Input: {result.input}</Text>
      <Text style={[{ color: colors.bodyText }, typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal')]}>Output: {result.output}</Text>
      <Text style={[{ color: colors.labelText }, typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal')]}>{result.description}</Text>
    </View>
  );
}
