import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, typographyHelper, useTheme } from 'masterfabric-expo-core';
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
  const inputStyle = {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.m,
    borderColor: colors.surfaceBorder,
    color: colors.bodyText,
    backgroundColor: colors.inputBackground,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
  } as const;

  return (
    <View style={{ gap: Sizing.gap.s }}>
      <Text style={[{ color: colors.titleText }, typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal')]}>{t('helpers.loggerHelper.message')}</Text>
      <TextInput
        value={message}
        onChangeText={(text) => onChange({ message: text })}
        placeholder={t('helpers.toastHelper.messagePlaceholder')}
        placeholderTextColor={colors.placeholderText}
        style={[inputStyle, { minHeight: Sizing.height.xxl + Sizing.padding.l, textAlignVertical: 'top' }]}
        multiline
        numberOfLines={4}
      />
      <Text style={[{ color: colors.titleText }, typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal')]}>{t('helpers.loggerHelper.component')}</Text>
      <TextInput
        value={component}
        onChangeText={(text) => onChange({ component: text })}
        placeholder={t('helpers.loggerHelper.component')}
        placeholderTextColor={colors.placeholderText}
        style={[inputStyle, { minHeight: Sizing.button.height.medium }]}
      />
      <View style={{ flexDirection: Sizing.layout.flexDirection.row, alignItems: Sizing.layout.alignItems.center, gap: Sizing.gap.s }}>
        <Switch value={includeStackTrace} onValueChange={(v) => onChange({ includeStackTrace: v })} />
        <Text style={{ color: colors.bodyText }}>{t('helpers.loggerHelper.includeStack')}</Text>
      </View>
    </View>
  );
}
