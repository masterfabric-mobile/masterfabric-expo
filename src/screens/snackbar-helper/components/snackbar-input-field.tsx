import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TextInput, View } from 'react-native';
import { snackbarInputFieldStyles } from '../styles/snackbar-input-field.styles';

interface SnackbarInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}

export function SnackbarInputField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = 'default',
}: SnackbarInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={snackbarInputFieldStyles.container}>
      <ThemedText
        type="defaultSemiBold"
        style={[snackbarInputFieldStyles.label, { color: colors.text }]}
      >
        {label}
      </ThemedText>
      <ThemedView
        style={[
          snackbarInputFieldStyles.inputContainer,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text + '60'}
          style={[
            snackbarInputFieldStyles.input,
            {
              color: colors.text,
              minHeight: multiline ? 80 : 44,
            },
          ]}
          multiline={multiline}
          keyboardType={keyboardType}
        />
      </ThemedView>
    </View>
  );
}

