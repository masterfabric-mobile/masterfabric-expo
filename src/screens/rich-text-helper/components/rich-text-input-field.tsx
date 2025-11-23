import { Button } from '@/src/shared/components/button';
import { t } from '@/src/shared/i18n';
import { getThemeColors, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TextInput, View } from 'react-native';
import { RichTextInputFieldProps } from '../models/rich-text-helper-models';
import { richTextInputFieldStyles } from '../styles/rich-text-input-field.styles';

export function RichTextInputField({
  testInput,
  onInputChange,
  onRunTests,
  isLoading,
}: RichTextInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        richTextInputFieldStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: isDark ? colors.cardBorderDark : colors.cardBorderLight,
        },
      ]}
    >
      <ThemedText
        type="subtitle"
        style={[richTextInputFieldStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.richTextHelper.testInput')}
      </ThemedText>

      <View style={richTextInputFieldStyles.inputGroup}>
        <ThemedText
          style={[richTextInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.richTextHelper.htmlInput')}
        </ThemedText>
        <TextInput
          style={[
            richTextInputFieldStyles.textInput,
            {
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            },
          ]}
          value={testInput.htmlInput}
          onChangeText={(htmlInput) => onInputChange({ htmlInput })}
          placeholder={t('helpers.richTextHelper.htmlPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          multiline
        />
      </View>

      <View style={richTextInputFieldStyles.inputGroup}>
        <ThemedText
          style={[richTextInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.richTextHelper.markdownInput')}
        </ThemedText>
        <TextInput
          style={[
            richTextInputFieldStyles.textInput,
            {
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            },
          ]}
          value={testInput.markdownInput}
          onChangeText={(markdownInput) => onInputChange({ markdownInput })}
          placeholder={t('helpers.richTextHelper.markdownPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          multiline
        />
      </View>

      <View style={richTextInputFieldStyles.inputGroup}>
        <ThemedText
          style={[richTextInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.richTextHelper.textInput')}
        </ThemedText>
        <TextInput
          style={[
            richTextInputFieldStyles.textInput,
            {
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            },
          ]}
          value={testInput.textInput}
          onChangeText={(textInput) => onInputChange({ textInput })}
          placeholder={t('helpers.richTextHelper.textPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          multiline
        />
      </View>

      <Button
        title={
          isLoading
            ? t('helpers.richTextHelper.runningTests')
            : t('helpers.richTextHelper.runTests')
        }
        onPress={onRunTests}
        disabled={isLoading}
        variant="primary"
        size="large"
      />
    </ThemedView>
  );
}

