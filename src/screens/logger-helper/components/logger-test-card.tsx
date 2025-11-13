import React from 'react';
import { View, Text } from 'react-native';
import { LoggerTestResult } from '../models/logger-helper-models';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';

// Props for test result card component
interface LoggerTestCardProps {
  result: LoggerTestResult;
}

// Card component for displaying logger test results
export function LoggerTestCard({ result }: LoggerTestCardProps) {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme === 'dark');

  return (
    <View style={{ borderWidth: 1, borderRadius: 8, padding: 12, gap: 4, borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }}>
      <Text style={{ fontWeight: '600', color: colors.titleText }}>{result.functionName}</Text>
      <Text style={{ color: colors.bodyText }}>Input: {result.input}</Text>
      <Text style={{ color: colors.bodyText }}>Output: {result.output}</Text>
      <Text style={{ color: colors.labelText }}>{result.description}</Text>
    </View>
  );
}
