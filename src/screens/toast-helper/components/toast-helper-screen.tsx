import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToastHelperViewModel } from '../hooks/use-toast-helper-view-model';
import { toastHelperScreenStyles } from '../styles/toast-helper-screen.styles';
import { ToastInputField } from './toast-input-field';
import { ToastResultCard } from './toast-result-card';

export function ToastHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { input, results, isLoading, runAllExamples, updateInput, showCustomToast } = useToastHelperViewModel();

  return (
    <SafeAreaView 
      style={[toastHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('helpers.toastHelper.title')}
        subtitle={t('helpers.toastHelper.description')}
        variant="minimal"
      />
      <ScrollView 
        style={toastHelperScreenStyles.scrollView}
        contentContainerStyle={toastHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ToastInputField 
          input={input}
          onInputChange={updateInput}
          onRunExamples={runAllExamples}
          onShowCustomToast={showCustomToast}
          isLoading={isLoading}
        />

        {results.length > 0 && (
          <View>
            <ThemedText 
              type="subtitle" 
              style={[toastHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.toastHelper.results')} ({results.length} {t('helpers.toastHelper.operations')})
            </ThemedText>
            
            {results.map((result) => (
              <ToastResultCard 
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