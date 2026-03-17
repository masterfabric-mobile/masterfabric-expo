import { t } from '@/src/shared/i18n';
import { getThemeColors, ScreenHeader, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { richTextHelperScreenStyles } from '../styles/rich-text-helper-screen.styles';
import { HtmlParserCard } from './html-parser-card';
import { LinkProcessorCard } from './link-processor-card';
import { MarkdownConverterCard } from './markdown-converter-card';
import { PatternHighlighterCard } from './pattern-highlighter-card';
import { RichTextPreviewCard } from './rich-text-preview-card';
import { TextComparisonCard } from './text-comparison-card';
import { TextExtractorCard } from './text-extractor-card';
import { TextFormatterCard } from './text-formatter-card';
import { TextSanitizerCard } from './text-sanitizer-card';

export function RichTextHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <SafeAreaView
      style={[richTextHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.richTextHelper.title')}
        subtitle={t('helpers.richTextHelper.description')}
      />
      <ScrollView
        style={richTextHelperScreenStyles.scrollView}
        contentContainerStyle={richTextHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HtmlParserCard />
        <MarkdownConverterCard />
        <TextExtractorCard />
        <TextFormatterCard />
        <LinkProcessorCard />
        <TextSanitizerCard />
        <PatternHighlighterCard />
        <TextComparisonCard />
        <RichTextPreviewCard />
      </ScrollView>
    </SafeAreaView>
  );
}

