import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import {
  getThemeColors,
  htmlToPlainText,
  parseHtmlToText,
  stripHtmlTags,
  ThemedText,
  ThemedView,
  unescapeHtmlEntities,
  useTheme
} from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { getDefaultHtmlInput } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';

export function HtmlParserCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [htmlInput, setHtmlInput] = useState(getDefaultHtmlInput(locale as 'en' | 'tr'));
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    setHtmlInput(getDefaultHtmlInput(locale as 'en' | 'tr'));
    setResult(null);
  }, [locale]);

  const handleParse = useCallback(() => {
    if (!htmlInput.trim()) return;
    setSelectedAction('parse');
    setIsLoading(true);
    try {
      const parsed = parseHtmlToText(htmlInput);
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
  }, [htmlInput]);

  const handleToPlainText = useCallback(() => {
    if (!htmlInput.trim()) return;
    setSelectedAction('plain');
    setIsLoading(true);
    try {
      const plain = htmlToPlainText(htmlInput);
      setResult(plain || '(empty)');
    } catch (error) {
      setResult(`${t('helpers.richTextHelper.error')}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [htmlInput]);

  const handleStripTags = useCallback(() => {
    if (!htmlInput.trim()) return;
    setSelectedAction('strip');
    setIsLoading(true);
    try {
      const stripped = stripHtmlTags(htmlInput, true);
      setResult(stripped || '(empty)');
    } catch (error) {
      setResult(`${t('helpers.richTextHelper.error')}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, [htmlInput]);

  const handleUnescape = useCallback(() => {
    if (!htmlInput.trim()) return;
    setSelectedAction('unescape');
    setIsLoading(true);
    try {
      const unescaped = unescapeHtmlEntities(htmlInput);
      setResult(unescaped || '(empty)');
    } catch (error) {
      setResult(`${t('helpers.richTextHelper.error')}: ${error instanceof Error ? error.message : String(error)}`);
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
          {t('helpers.richTextHelper.htmlParser')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.htmlParserDescription')}
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

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Button
          title={t('helpers.richTextHelper.parseHtml')}
          onPress={handleParse}
          disabled={isLoading}
          variant={selectedAction === 'parse' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.toPlainText')}
          onPress={handleToPlainText}
          disabled={isLoading}
          variant={selectedAction === 'plain' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.stripTags')}
          onPress={handleStripTags}
          disabled={isLoading}
          variant={selectedAction === 'strip' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.unescape')}
          onPress={handleUnescape}
          disabled={isLoading}
          variant={selectedAction === 'unescape' ? 'primary' : 'success'}
          size="small"
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
