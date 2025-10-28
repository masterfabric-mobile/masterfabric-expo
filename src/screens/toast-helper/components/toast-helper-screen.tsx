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

/**
 * ToastHelperScreen Component
 * 
 * A comprehensive screen for testing and demonstrating toast notifications.
 * Provides an interactive interface for users to:
 * - Configure toast parameters (message, type, position, duration, animation)
 * - Test different toast types (success, error, warning, info, custom)
 * - Run predefined examples
 * - View operation results and descriptions
 * 
 * Features:
 * - Real-time toast preview
 * - Custom configuration options
 * - Example demonstrations
 * - Results tracking
 * - Theme-aware UI
 */
export function ToastHelperScreen() {
  // Get current theme and colors for consistent styling
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  // Get view model functions and state for toast operations
  const { input, results, isLoading, runAllExamples, updateInput, showCustomToast } = useToastHelperViewModel();

  return (
    <SafeAreaView 
      style={[toastHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Screen header with title and description */}
      <ScreenHeader 
        title={t('helpers.toastHelper.title')}
        subtitle={t('helpers.toastHelper.description')}
        variant="minimal"
      />
      
      {/* Scrollable content area */}
      <ScrollView 
        style={toastHelperScreenStyles.scrollView}
        contentContainerStyle={toastHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Toast configuration input field */}
        <ToastInputField 
          input={input}
          onInputChange={updateInput}
          onRunExamples={runAllExamples}
          onShowCustomToast={showCustomToast}
          isLoading={isLoading}
        />

        {/* Results section - only shown when there are results */}
        {results.length > 0 && (
          <View>
            <ThemedText 
              type="subtitle" 
              style={[toastHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.toastHelper.results')} ({results.length} {t('helpers.toastHelper.operations')})
            </ThemedText>
            
            {/* Render each result card */}
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