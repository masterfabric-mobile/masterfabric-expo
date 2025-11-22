import { Button } from '@/src/shared/components/button';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import {
  extractEmails,
  extractHashtags,
  extractMentions,
  extractPhoneNumbers,
  extractUrls,
  getThemeColors,
  ThemedText,
  ThemedView,
  useTheme,
} from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { getDefaultTextExtractorInput } from '../constants';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';
import { formatErrorMessage } from '../utils';

export function TextExtractorCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();
  const [textInput, setTextInput] = useState(getDefaultTextExtractorInput(locale as 'en' | 'tr'));
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExtractType, setSelectedExtractType] = useState<string | null>(null);

  useEffect(() => {
    setTextInput(getDefaultTextExtractorInput(locale as 'en' | 'tr'));
    setResult(null);
  }, [locale]);

  const handleExtractUrls = useCallback(() => {
    if (!textInput.trim()) return;
    setSelectedExtractType('urls');
    setIsLoading(true);
    try {
      const urls = extractUrls(textInput);
      setResult(urls.length > 0 ? urls.join('\n') : t('helpers.richTextHelper.noUrlsFound'));
    } catch (error) {
      setResult(formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [textInput]);

  const handleExtractMentions = useCallback(() => {
    if (!textInput.trim()) return;
    setSelectedExtractType('mentions');
    setIsLoading(true);
    try {
      const mentions = extractMentions(textInput);
      setResult(mentions.length > 0 ? mentions.map(m => `@${m}`).join('\n') : t('helpers.richTextHelper.noMentionsFound'));
    } catch (error) {
      setResult(formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [textInput]);

  const handleExtractHashtags = useCallback(() => {
    if (!textInput.trim()) return;
    setSelectedExtractType('hashtags');
    setIsLoading(true);
    try {
      const hashtags = extractHashtags(textInput);
      setResult(hashtags.length > 0 ? hashtags.map(h => `#${h}`).join('\n') : t('helpers.richTextHelper.noHashtagsFound'));
    } catch (error) {
      setResult(formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [textInput]);

  const handleExtractEmails = useCallback(() => {
    if (!textInput.trim()) return;
    setSelectedExtractType('emails');
    setIsLoading(true);
    try {
      const emails = extractEmails(textInput);
      setResult(emails.length > 0 ? emails.join('\n') : t('helpers.richTextHelper.noEmailsFound'));
    } catch (error) {
      setResult(formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [textInput]);

  const handleExtractPhones = useCallback(() => {
    if (!textInput.trim()) return;
    setSelectedExtractType('phones');
    setIsLoading(true);
    try {
      const phones = extractPhoneNumbers(textInput);
      setResult(phones.length > 0 ? phones.join('\n') : t('helpers.richTextHelper.noPhonesFound'));
    } catch (error) {
      setResult(formatErrorMessage(error));
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
          {t('helpers.richTextHelper.textExtractor')}
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText, marginBottom: 16 }]}
      >
        {t('helpers.richTextHelper.textExtractorDescription')}
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
          title={t('helpers.richTextHelper.extractUrls')}
          onPress={handleExtractUrls}
          disabled={isLoading}
          variant={selectedExtractType === 'urls' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.extractMentions')}
          onPress={handleExtractMentions}
          disabled={isLoading}
          variant={selectedExtractType === 'mentions' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.extractHashtags')}
          onPress={handleExtractHashtags}
          disabled={isLoading}
          variant={selectedExtractType === 'hashtags' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.extractEmails')}
          onPress={handleExtractEmails}
          disabled={isLoading}
          variant={selectedExtractType === 'emails' ? 'primary' : 'success'}
          size="small"
        />
        <Button
          title={t('helpers.richTextHelper.extractPhones')}
          onPress={handleExtractPhones}
          disabled={isLoading}
          variant={selectedExtractType === 'phones' ? 'primary' : 'success'}
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
