import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { LoggerLevel } from '../models/logger-helper-models';

// Input field component props for logger helper
interface LoggerInputFieldProps {
  message: string;
  level: LoggerLevel;
  component?: string;
  includeStackTrace: boolean;
  onChange: (changes: Partial<{ message: string; level: LoggerLevel; component?: string; includeStackTrace: boolean }>) => void;
}

// Component for inputting log message, component name, and stack trace option
export function LoggerInputField({ message, level, component, includeStackTrace, onChange }: LoggerInputFieldProps) {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme === 'dark');

  // Styling for input fields with theme colors
  const inputStyle = { borderWidth: 1, borderRadius: 10, padding: 12, borderColor: colors.surfaceBorder, color: colors.bodyText, backgroundColor: colors.inputBackground, fontSize: 16 } as const;

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.titleText }}>{t('helpers.loggerHelper.message')}</Text>
      <TextInput
        value={message}
        onChangeText={(text) => onChange({ message: text })}
        placeholder={t('helpers.toastHelper.messagePlaceholder')}
        placeholderTextColor={colors.placeholderText}
        style={[inputStyle, { minHeight: 88, textAlignVertical: 'top' }]}
        multiline
        numberOfLines={4}
      />
      <Text style={{ color: colors.titleText }}>{t('helpers.loggerHelper.component')}</Text>
      <TextInput
        value={component}
        onChangeText={(text) => onChange({ component: text })}
        placeholder={t('helpers.loggerHelper.component')}
        placeholderTextColor={colors.placeholderText}
        style={[inputStyle, { minHeight: 52 }]}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Switch value={includeStackTrace} onValueChange={(v) => onChange({ includeStackTrace: v })} />
        <Text style={{ color: colors.bodyText }}>{t('helpers.loggerHelper.includeStack')}</Text>
      </View>
    </View>
  );
}


