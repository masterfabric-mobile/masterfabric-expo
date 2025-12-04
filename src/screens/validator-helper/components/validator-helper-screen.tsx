import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import {
  getThemeColors,
  ThemedText,
  useTheme,
} from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useValidatorHelperViewModel } from '../hooks/use-validator-helper-view-model';
import { ValidatorTestResult } from '../models/validator-helper-models';
import { validatorHelperScreenStyles } from '../styles/validator-helper-screen.styles';
import { ValidatorAuthForm } from './validator-auth-form';
import { ValidatorInputField } from './validator-input-field';
import { ValidatorTestCard } from './validator-test-card';

export function ValidatorHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const { testInput, testResults, currentResult, isLoading, runAllTests, updateTestInput } =
    useValidatorHelperViewModel();

  return (
    <SafeAreaView
      style={[validatorHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.validatorHelper.title')}
        subtitle={t('helpers.validatorHelper.description')}
        variant="minimal"
      />
      <ScrollView
        style={validatorHelperScreenStyles.scrollView}
        contentContainerStyle={validatorHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ValidatorAuthForm />

        <ValidatorInputField
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          isLoading={isLoading}
        />

        {/* Current selected validator result */}
        {currentResult && (
          <View>
            <ThemedText
              type="subtitle"
              style={[
                validatorHelperScreenStyles.resultsTitle,
                { color: colors.sectionTitle },
              ]}
            >
              {t('helpers.validatorHelper.currentResult')}
            </ThemedText>
            <ValidatorTestCard result={currentResult} />
          </View>
        )}

        {/* All test results */}
        {testResults.length > 0 && (
          <View>
            <ThemedText
              type="subtitle"
              style={[
                validatorHelperScreenStyles.resultsTitle,
                { color: colors.sectionTitle },
              ]}
            >
              {t('helpers.validatorHelper.testResults')} ({testResults.length}{' '}
              {t('helpers.validatorHelper.validatorCount')})
            </ThemedText>

            {testResults.map((result: ValidatorTestResult) => (
              <ValidatorTestCard key={result.id} result={result} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

