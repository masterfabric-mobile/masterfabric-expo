import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { getThemeColors, parseHtmlToText, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { getDefaultHtmlInput } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';

export function RichTextPreviewCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [htmlInput, setHtmlInput] = useState(getDefaultHtmlInput(locale as 'en' | 'tr'));

  useEffect(() => {
    setHtmlInput(getDefaultHtmlInput(locale as 'en' | 'tr'));
  }, [locale]);

  const parsedHtml = htmlInput ? parseHtmlToText(htmlInput) : [];

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
          {t('helpers.richTextHelper.preview')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.previewDescription')}
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

      <View style={[richTextTestCardStyles.inputOutputGroup, { marginTop: 16 }]}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
        >
          {t('helpers.richTextHelper.htmlPreview')}
        </ThemedText>
        <ThemedView
          style={[
            richTextTestCardStyles.inputOutputBox,
            {
              backgroundColor: colors.successBackground || colors.inputBackground,
              borderColor: colors.successBorder || colors.surfaceBorder,
              minHeight: 100,
              padding: 12,
            },
          ]}
        >
          <ScrollView 
            style={{ maxHeight: 200 }}
            contentContainerStyle={{ padding: 0 }}
            nestedScrollEnabled={true}
          >
            {parsedHtml.length > 0 ? (
              <Text style={{ color: colors.bodyText }}>
                {parsedHtml.map((part, index) => (
                  <Text 
                    key={index} 
                    style={[
                      part.style || {},
                      { color: part.style?.color || colors.bodyText },
                    ]}
                  >
                    {part.text}
                  </Text>
                ))}
              </Text>
            ) : (
              <ThemedText
                style={[richTextTestCardStyles.inputOutputText, { color: colors.placeholderText }]}
              >
                {t('helpers.richTextHelper.noPreview')}
              </ThemedText>
            )}
          </ScrollView>
        </ThemedView>
      </View>
    </ThemedView>
  );
}
