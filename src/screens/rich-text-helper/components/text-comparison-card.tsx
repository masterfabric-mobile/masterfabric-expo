import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import {
  getThemeColors,
  htmlToPlainText,
  parseHtmlToText,
  parseMarkdown,
  sanitizeHtml,
  ThemedText,
  ThemedView,
  useTheme
} from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { getDefaultHtmlInput } from '../constants';
import { ComparisonType } from '../models';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';
import { formatErrorMessage, formatFormattedTextParts } from '../utils';

export function TextComparisonCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [input, setInput] = useState(getDefaultHtmlInput(locale as 'en' | 'tr'));
  const [comparisonType, setComparisonType] = useState<ComparisonType>('html');
  const [originalResult, setOriginalResult] = useState<string>('');
  const [processedResult, setProcessedResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInput(getDefaultHtmlInput(locale as 'en' | 'tr'));
    setOriginalResult('');
    setProcessedResult('');
  }, [locale]);

  const handleCompare = useCallback((type?: ComparisonType) => {
    if (!input.trim()) return;

    const compareType = type || comparisonType;
    setIsLoading(true);
    try {
      switch (compareType) {
        case 'html': {
          const parsed = parseHtmlToText(input);
          setOriginalResult(input);
          setProcessedResult(formatFormattedTextParts(parsed));
          break;
        }
        case 'markdown': {
          const parsed = parseMarkdown(input);
          setOriginalResult(input);
          setProcessedResult(formatFormattedTextParts(parsed));
          break;
        }
        case 'sanitize': {
          const sanitized = sanitizeHtml(input);
          setOriginalResult(input);
          setProcessedResult(sanitized);
          break;
        }
        case 'plain': {
          const plain = htmlToPlainText(input);
          setOriginalResult(input);
          setProcessedResult(plain);
          break;
        }
      }
    } catch (error) {
      setProcessedResult(formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [input, comparisonType]);

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
          {t('helpers.richTextHelper.textComparison')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.textComparisonDescription')}
      </ThemedText>

      <View style={richTextTestCardStyles.inputOutputGroup}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
        >
          {t('helpers.richTextHelper.input')}
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
          value={input}
          onChangeText={setInput}
          placeholder={t('helpers.richTextHelper.htmlPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          multiline
        />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Button
          title={t('helpers.richTextHelper.compareHtml')}
          onPress={() => {
            setComparisonType('html');
            handleCompare('html');
          }}
          disabled={isLoading}
          variant={comparisonType === 'html' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.compareMarkdown')}
          onPress={() => {
            setComparisonType('markdown');
            handleCompare('markdown');
          }}
          disabled={isLoading}
          variant={comparisonType === 'markdown' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.compareSanitize')}
          onPress={() => {
            setComparisonType('sanitize');
            handleCompare('sanitize');
          }}
          disabled={isLoading}
          variant={comparisonType === 'sanitize' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.comparePlain')}
          onPress={() => {
            setComparisonType('plain');
            handleCompare('plain');
          }}
          disabled={isLoading}
          variant={comparisonType === 'plain' ? 'primary' : 'success'}
          size="small"
        />
      </View>

      {originalResult && processedResult && (
        <View style={{ marginTop: 16, gap: 12 }}>
          <View style={richTextTestCardStyles.inputOutputGroup}>
            <ThemedText
              type="defaultSemiBold"
              style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
            >
              {t('helpers.richTextHelper.original')}
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
              <ScrollView>
                <ThemedText
                  style={[richTextTestCardStyles.inputOutputText, { color: colors.bodyText }]}
                >
                  {originalResult}
                </ThemedText>
              </ScrollView>
            </ThemedView>
          </View>

          <View style={richTextTestCardStyles.inputOutputGroup}>
            <ThemedText
              type="defaultSemiBold"
              style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
            >
              {t('helpers.richTextHelper.processed')}
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
              <ScrollView>
                <ThemedText
                  style={[
                    richTextTestCardStyles.inputOutputText,
                    { color: colors.successText || colors.bodyText },
                  ]}
                >
                  {processedResult}
                </ThemedText>
              </ScrollView>
            </ThemedView>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

