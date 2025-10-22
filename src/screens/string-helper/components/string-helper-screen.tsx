import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStringHelperViewModel } from '../hooks/use-string-helper-view-model';
import { stringHelperScreenStyles } from '../styles/string-helper-screen.styles';
import { StringInputField } from './string-input-field';
import { StringTestCard } from './string-test-card';

export function StringHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { testInput, testResults, isLoading, runAllTests, updateTestInput } = useStringHelperViewModel();

  return (
    <SafeAreaView 
      style={[stringHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('helpers.stringHelper.title')}
        subtitle={t('helpers.stringHelper.description')}
        variant="minimal"
      />
      <ScrollView 
        style={stringHelperScreenStyles.scrollView}
        contentContainerStyle={stringHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StringInputField 
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          isLoading={isLoading}
        />

        {testResults.length > 0 && (
          <View>
            <ThemedText 
              type="subtitle" 
              style={[stringHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.stringHelper.testResults')} ({testResults.length} {t('helpers.stringHelper.functions')})
            </ThemedText>
            
            {testResults.map((result) => (
              <StringTestCard 
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
