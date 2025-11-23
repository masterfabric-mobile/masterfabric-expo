import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { extractHtmlLinks, getThemeColors, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { getDefaultLinkProcessorInput } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';
import { formatErrorMessage, formatLinksForDisplay } from '../utils';

export function LinkProcessorCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [htmlInput, setHtmlInput] = useState(getDefaultLinkProcessorInput(locale as 'en' | 'tr'));
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setHtmlInput(getDefaultLinkProcessorInput(locale as 'en' | 'tr'));
    setResult(null);
  }, [locale]);

  const handleExtractLinks = useCallback(() => {
    if (!htmlInput.trim()) return;
    setIsLoading(true);
    try {
      const links = extractHtmlLinks(htmlInput);
      if (links.length > 0) {
        setResult(formatLinksForDisplay(links));
      } else {
        setResult(t('helpers.richTextHelper.noLinksFound'));
      }
    } catch (error) {
      setResult(formatErrorMessage(error));
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
          {t('helpers.richTextHelper.linkProcessor')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.linkProcessorDescription')}
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
          title={t('helpers.richTextHelper.extractLinks')}
          onPress={handleExtractLinks}
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
