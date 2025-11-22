import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { getThemeColors, sanitizeHtml, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { getDefaultSanitizerInput } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';

export function TextSanitizerCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [htmlInput, setHtmlInput] = useState(getDefaultSanitizerInput(locale as 'en' | 'tr'));
  const [beforeResult, setBeforeResult] = useState<string | null>(null);
  const [afterResult, setAfterResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setHtmlInput(getDefaultSanitizerInput(locale as 'en' | 'tr'));
    setBeforeResult(null);
    setAfterResult(null);
  }, [locale]);

  const handleSanitize = useCallback(() => {
    if (!htmlInput.trim()) return;
    setIsLoading(true);
    try {
      setBeforeResult(htmlInput);
      const sanitized = sanitizeHtml(htmlInput);
      setAfterResult(sanitized || '(empty)');
    } catch (error) {
      setAfterResult(`${t('helpers.richTextHelper.error')}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [htmlInput]);

  return (
    <ThemedView
      style={[
        richTextTestCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: isDark ? colors.cardBorderDark : colors.cardBorderLight,
        },
      ]}
    >
      <View style={richTextTestCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.functionName, { color: colors.titleText }]}
        >
          {t('helpers.richTextHelper.textSanitizer')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.textSanitizerDescription')}
      </ThemedText>

      <View style={richTextTestCardStyles.inputOutputGroup}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
        >
          {t('helpers.richTextHelper.htmlInput')}
        </ThemedText>
        <TextInput
          style={[
            richTextTestCardStyles.inputOutputBox,
            {
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
              minHeight: 80,
            },
          ]}
          value={htmlInput}
          onChangeText={setHtmlInput}
          placeholder={t('helpers.richTextHelper.htmlPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          multiline
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button
          title={t('helpers.richTextHelper.sanitize')}
          onPress={handleSanitize}
          disabled={isLoading}
          variant="primary"
          size="medium"
        />
      </View>

      {beforeResult && (
        <View style={[richTextTestCardStyles.inputOutputGroup, { marginTop: 16 }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.richTextHelper.before')}
          </ThemedText>
          <ThemedView
            style={[
              richTextTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
                maxHeight: 150,
              },
            ]}
          >
            <ThemedText
              style={[
                richTextTestCardStyles.inputOutputText,
                { color: colors.bodyText },
              ]}
            >
              {beforeResult}
            </ThemedText>
          </ThemedView>
        </View>
      )}

      {afterResult && (
        <View style={[richTextTestCardStyles.inputOutputGroup, { marginTop: 16 }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.richTextHelper.after')}
          </ThemedText>
          <ThemedView
            style={[
              richTextTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.successBackground || colors.inputBackground,
                borderColor: colors.successBorder || colors.surfaceBorder,
                maxHeight: 150,
              },
            ]}
          >
            <ThemedText
              style={[
                richTextTestCardStyles.inputOutputText,
                { color: colors.successText || colors.bodyText },
              ]}
            >
              {afterResult}
            </ThemedText>
          </ThemedView>
        </View>
      )}
    </ThemedView>
  );
}
