import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Typography, copyWith, getThemeColors, t as typoT, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTypographyHelperViewModel } from '../hooks/use-typography-helper-view-model';
import { typographyHelperScreenStyles } from '../styles/typography-helper-screen.styles';
import { TypographyInputField } from './typography-input-field';
import { TypographyPreviewCard } from './typography-preview-card';
import { TypographyTestCard } from './typography-test-card';

export function TypographyHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    testInput,
    testResults,
    isLoading,
    preview,
    deviceInfo,
    runAllTests,
    updateTestInput,
  } = useTypographyHelperViewModel();

  return (
    <SafeAreaView
      style={[typographyHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.typographyHelper.title')}
        subtitle={t('helpers.typographyHelper.description')}
        variant="minimal"
      />
      <ScrollView
        style={typographyHelperScreenStyles.scrollView}
        contentContainerStyle={typographyHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TypographyInputField
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          isLoading={isLoading}
          deviceInfo={deviceInfo}
        />

        <TypographyPreviewCard preview={preview} />

        {/* Typography Styles Showcase */}
        <ThemedView
          style={[
            typographyHelperScreenStyles.showcaseContainer,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder + '30',
            }
          ]}
        >
          <ThemedText
            type="subtitle"
            style={[typographyHelperScreenStyles.showcaseTitle, { color: colors.sectionTitle }]}
          >
            Typography Styles Showcase
          </ThemedText>

          {/* Pre-defined Typography Styles */}
          <View style={typographyHelperScreenStyles.showcaseSection}>
            <ThemedText style={[typographyHelperScreenStyles.sectionLabel, { color: colors.bodyText }]}>
              Pre-defined Styles:
            </ThemedText>
            <Text style={Typography.h1 as any}>H1 Header Style</Text>
            <Text style={Typography.h2 as any}>H2 Header Style</Text>
            <Text style={Typography.title as any}>Title Style</Text>
            <Text style={Typography.subtitle as any}>Subtitle Style</Text>
            <Text style={Typography.body as any}>Body Text Style</Text>
            <Text style={Typography.caption as any}>Caption Style</Text>
          </View>

          {/* copyWith Examples */}
          <View style={typographyHelperScreenStyles.showcaseSection}>
            <ThemedText style={[typographyHelperScreenStyles.sectionLabel, { color: colors.bodyText }]}>
              copyWith Examples:
            </ThemedText>
            <Text style={copyWith(Typography.title, { color: '#FF6B6B' }) as any}>
              Red Title (copyWith)
            </Text>
            <Text style={copyWith(Typography.body, { fontWeight: 700, letterSpacing: 0.5 }) as any}>
              Bold Body with Letter Spacing
            </Text>
            <Text style={copyWith(Typography.subtitle, { 
              color: '#4ECDC4', 
              textDecorationLine: 'underline',
              textTransform: 'uppercase' 
            }) as any}>
              Styled Subtitle
            </Text>
          </View>

          {/* t() Helper Examples */}
          <View style={typographyHelperScreenStyles.showcaseSection}>
            <ThemedText style={[typographyHelperScreenStyles.sectionLabel, { color: colors.bodyText }]}>
              t() Helper Examples:
            </ThemedText>
            <Text style={typoT('h3', { color: '#9B59B6' }) as any}>
              Purple H3 (t helper)
            </Text>
            <Text style={typoT('body', { color: '#95A5A6', fontStyle: 'italic' }) as any}>
              Italic grey body text
            </Text>
            <Text style={typoT('caption', { 
              color: '#E74C3C', 
              fontWeight: 600,
              textTransform: 'lowercase' 
            }) as any}>
              CUSTOM CAPTION STYLE
            </Text>
          </View>

          {/* Complex Style Examples */}
          <View style={typographyHelperScreenStyles.showcaseSection}>
            <ThemedText style={[typographyHelperScreenStyles.sectionLabel, { color: colors.bodyText }]}>
              Complex Styles:
            </ThemedText>
            <Text style={copyWith(Typography.title, {
              color: '#2C3E50',
              textShadowOffset: { width: 1, height: 1 },
              textShadowOpacity: 0.3,
              textShadowRadius: 2,
              textShadowColor: '#BDC3C7'
            }) as any}>
              Title with Shadow Effect
            </Text>
            <Text style={typoT('subtitle', {
              color: '#27AE60',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              fontWeight: 700
            }) as any}>
              Spaced Uppercase Subtitle
            </Text>
          </View>
        </ThemedView>

        {testResults.length > 0 && (
          <View>
            <ThemedText
              type="subtitle"
              style={[typographyHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.typographyHelper.testResults')} ({testResults.length} {t('helpers.typographyHelper.functions')})
            </ThemedText>

            {testResults.map((result) => (
              <TypographyTestCard
                key={result.id}
                result={result}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
