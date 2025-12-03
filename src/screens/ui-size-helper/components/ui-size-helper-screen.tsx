import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import {
  Sizing,
  getThemeColors,
  uiSizeHelper,
  useTheme
} from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUISizeHelperViewModel } from '../hooks/use-ui-size-helper-view-model';
import { uiSizeHelperScreenStyles } from '../styles/ui-size-helper-screen.styles';
import { UISizeInputField } from './ui-size-input-field';
import { UISizePreviewCard } from './ui-size-preview-card';
import { UISizeTestCard } from './ui-size-test-card';
import { UISizeShowcase } from './ui-size-showcase';

export function UISizeHelperScreen() {
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
  } = useUISizeHelperViewModel();

  return (
    <SafeAreaView
      style={[uiSizeHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.uiSizeHelper.title')}
        subtitle={t('helpers.uiSizeHelper.description')}
        variant="minimal"
      />
      <ScrollView
        style={uiSizeHelperScreenStyles.scrollView}
        contentContainerStyle={uiSizeHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UISizeInputField
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          isLoading={isLoading}
          deviceInfo={deviceInfo}
        />

        <UISizePreviewCard preview={preview} />

        <UISizeShowcase />

        {testResults.length > 0 && (
          <View>
            <ThemedText
              type="subtitle"
              style={[uiSizeHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.uiSizeHelper.testResults')} ({testResults.length} {t('helpers.uiSizeHelper.functions')})
            </ThemedText>

            {testResults.map((result) => (
              <UISizeTestCard
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
