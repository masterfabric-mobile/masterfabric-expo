import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { getThemeColors, highlightText, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { getDefaultPatternHighlighterValues } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';

export function PatternHighlighterCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const defaultValues = getDefaultPatternHighlighterValues(locale as 'en' | 'tr');
  const [textInput, setTextInput] = useState(defaultValues.text);
  const [searchTerms, setSearchTerms] = useState(defaultValues.searchTerms);
  const [highlightedParts, setHighlightedParts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const values = getDefaultPatternHighlighterValues(locale as 'en' | 'tr');
    setTextInput(values.text);
    setSearchTerms(values.searchTerms);
    setHighlightedParts([]);
  }, [locale]);

  const handleHighlight = useCallback(() => {
    if (!textInput.trim() || !searchTerms.trim()) return;

    setIsLoading(true);
    try {
      const terms = searchTerms
        .split(',')
        .map((term) => term.trim())
        .filter((term) => term.length > 0);

      const highlighted = highlightText(textInput, terms, {
        backgroundColor: colors.warningColor,
        color: colors.titleText,
        fontWeight: 'bold',
      });

      setHighlightedParts(highlighted);
    } catch {
      setHighlightedParts([{ text: textInput }]);
    } finally {
      setIsLoading(false);
    }
  }, [textInput, searchTerms, colors.warningColor, colors.titleText]);

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
          {t('helpers.richTextHelper.patternHighlighter')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.patternHighlighterDescription')}
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

      <View style={[richTextTestCardStyles.inputOutputGroup, { marginTop: 12 }]}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
        >
          {t('helpers.richTextHelper.searchTerms')}
        </ThemedText>
        <TextInput
          style={[
            richTextTestCardStyles.inputOutputBox,
            {
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            },
          ]}
          value={searchTerms}
          onChangeText={setSearchTerms}
          placeholder={t('helpers.richTextHelper.searchTermsPlaceholder')}
          placeholderTextColor={colors.placeholderText}
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button
          title={t('helpers.richTextHelper.highlight')}
          onPress={handleHighlight}
          disabled={isLoading}
          variant="primary"
          size="small"
        />
      </View>

      {highlightedParts.length > 0 && (
        <View style={[richTextTestCardStyles.inputOutputGroup, { marginTop: 16 }]}>
          <ThemedText
            type="defaultSemiBold"
            style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.richTextHelper.highlightedText')}
          </ThemedText>
          <ThemedView
            style={[
              richTextTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
                padding: 12,
                minHeight: 100,
              },
            ]}
          >
            <ScrollView>
              <Text>
                {highlightedParts.map((part, index) => (
                  <Text
                    key={index}
                    style={part.style || { color: colors.bodyText }}
                  >
                    {part.text}
                  </Text>
                ))}
              </Text>
            </ScrollView>
          </ThemedView>
        </View>
      )}
    </ThemedView>
  );
}

