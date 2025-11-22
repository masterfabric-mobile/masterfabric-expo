import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { getThemeColors, parseMarkdown, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { getDefaultMarkdownInput } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';

export function MarkdownConverterCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [markdownInput, setMarkdownInput] = useState(getDefaultMarkdownInput(locale as 'en' | 'tr'));
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMarkdownInput(getDefaultMarkdownInput(locale as 'en' | 'tr'));
    setResult(null);
  }, [locale]);

  const handleConvert = useCallback(() => {
    if (!markdownInput.trim()) return;
    
    setIsLoading(true);
    try {
      const parsed = parseMarkdown(markdownInput);
      // Format result for display: show readable text with style info
      const formatted = parsed.map((part, index) => {
        const styleInfo = Object.keys(part.style || {}).length > 0 
          ? ` [${Object.entries(part.style || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}]`
          : '';
        return `${part.text}${styleInfo}`;
      }).join('\n');
      setResult(formatted || '(empty)');
    } catch (error) {
      setResult(`${t('helpers.richTextHelper.error')}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [markdownInput]);

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
          {t('helpers.richTextHelper.markdownConverter')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.markdownConverterDescription')}
      </ThemedText>

      <View style={richTextTestCardStyles.inputOutputGroup}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
        >
          {t('helpers.richTextHelper.markdownInput')}
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
          value={markdownInput}
          onChangeText={setMarkdownInput}
          placeholder={t('helpers.richTextHelper.markdownPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          multiline
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button
          title={t('helpers.richTextHelper.convertMarkdown')}
          onPress={handleConvert}
          disabled={isLoading}
          variant="primary"
          size="medium"
        />
      </View>

      {result && (
        <View style={[richTextTestCardStyles.inputOutputGroup, { marginTop: 16 }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.richTextHelper.result')}
          </ThemedText>
          <ThemedView
            style={[
              richTextTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.successBackground || colors.inputBackground,
                borderColor: colors.successBorder || colors.surfaceBorder,
                maxHeight: 200,
              },
            ]}
          >
            <ThemedText
              style={[
                richTextTestCardStyles.inputOutputText,
                { color: colors.successText || colors.bodyText },
              ]}
            >
              {result}
            </ThemedText>
          </ThemedView>
        </View>
      )}
    </ThemedView>
  );
}
