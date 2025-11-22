import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { createFormattedText, getThemeColors, linkifyText, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { getDefaultTextInput } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';

export function TextFormatterCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [textInput, setTextInput] = useState(getDefaultTextInput(locale as 'en' | 'tr'));
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    setTextInput(getDefaultTextInput(locale as 'en' | 'tr'));
    setResult(null);
  }, [locale]);

  const handleFormatText = useCallback(() => {
    setSelectedAction('format');
    setIsLoading(true);
    try {
      const formattedParts = [
        { text: 'Hello ', style: {} },
        { text: 'World', style: { fontWeight: 'bold', color: 'red' } },
        { text: '!', style: {} },
      ];
      const formatted = createFormattedText(formattedParts);
      // Format result for display
      const displayText = formatted.map((part, index) => {
        const styleInfo = Object.keys(part.style || {}).length > 0 
          ? ` [${Object.entries(part.style || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}]`
          : '';
        return `${index + 1}. "${part.text}"${styleInfo}`;
      }).join('\n');
      setResult(displayText || '(empty)');
    } catch (error) {
      setResult(`${t('helpers.richTextHelper.error')}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLinkify = useCallback(() => {
    if (!textInput.trim()) return;
    setSelectedAction('linkify');
    setIsLoading(true);
    try {
      const linkified = linkifyText(textInput);
      // Format result for display: show readable text with style info
      const formatted = linkified.map((part, index) => {
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
  }, [textInput]);

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
          {t('helpers.richTextHelper.textFormatter')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.textFormatterDescription')}
      </ThemedText>

      <View style={richTextTestCardStyles.inputOutputGroup}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
        >
          {t('helpers.richTextHelper.textInput')}
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
          value={textInput}
          onChangeText={setTextInput}
          placeholder={t('helpers.richTextHelper.textPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          multiline
        />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Button
          title={t('helpers.richTextHelper.formatText')}
          onPress={handleFormatText}
          disabled={isLoading}
          variant={selectedAction === 'format' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.linkify')}
          onPress={handleLinkify}
          disabled={isLoading}
          variant={selectedAction === 'linkify' ? 'primary' : 'success'}
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
