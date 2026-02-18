import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getThemeColors,
  ScreenHeader,
  ThemedText,
  useTheme,
} from 'masterfabric-expo-core';
import { t } from '@/src/shared/i18n';
import { useDoubleHelperViewModel } from '../hooks/use-double-helper-view-model';
import { doubleHelperScreenStyles } from '../styles/double-helper-screen.styles';
import { DoubleInputField } from './double-input-field';
import { DoubleTestCard } from './double-test-card';

export function DoubleHelperScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const { testInput, testResults, isLoading, runAllTests, updateTestInput } =
    useDoubleHelperViewModel();

  return (
    <SafeAreaView
      style={[doubleHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.doubleExtensionHelper.title')}
        subtitle={t('helpers.doubleExtensionHelper.description')}
      />
      <ScrollView
        style={doubleHelperScreenStyles.scrollView}
        contentContainerStyle={doubleHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DoubleInputField
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          isLoading={isLoading}
        />
        {testResults.length > 0 && (
          <View>
            <ThemedText
              type="subtitle"
              style={[doubleHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }] as any}
            >
              {t('helpers.doubleExtensionHelper.testResults')} ({testResults.length}{' '}
              {t('helpers.doubleExtensionHelper.functions')})
            </ThemedText>
            {testResults.map((result) => (
              <DoubleTestCard key={result.id} result={result} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
