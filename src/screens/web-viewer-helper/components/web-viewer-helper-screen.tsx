/**
 * Web Viewer Helper Screen
 * 
 * Main screen component for testing and using Web Viewer Helper functionality.
 * Provides UI for testing HTML content rendering and URL loading with WebView.
 */

import { t } from '@/src/shared/i18n';
import { ScreenHeader, ThemedText } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWebViewerHelperViewModel } from '../hooks/use-web-viewer-helper-view-model';
import { webViewerHelperScreenStyles } from '../styles/web-viewer-helper-screen.styles';
import { WebViewInputField } from './web-view-input-field';
import { WebViewPreview } from './web-view-preview';
import { WebViewTestCard } from './web-view-test-card';

export function WebViewerHelperScreen() {
  const {
    testInput,
    testResults,
    isLoading,
    currentSource,
    colors,
    runAllTests,
    loadContent,
    updateTestInput,
  } = useWebViewerHelperViewModel();

  return (
    <SafeAreaView
      style={[webViewerHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.webViewerHelper.title')}
        subtitle={t('helpers.webViewerHelper.description')}
      />
      <ScrollView
        style={webViewerHelperScreenStyles.scrollView}
        contentContainerStyle={webViewerHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Section */}
        <WebViewInputField
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          onLoadContent={loadContent}
          isLoading={isLoading}
        />

        {/* WebView Preview */}
        {currentSource && (
          <View style={webViewerHelperScreenStyles.previewSection}>
            <ThemedText
              type="subtitle"
              style={[webViewerHelperScreenStyles.previewTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.webViewerHelper.preview')}
            </ThemedText>
            <WebViewPreview source={currentSource} />
          </View>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <View style={webViewerHelperScreenStyles.resultsSection}>
            <ThemedText
              type="subtitle"
              style={[webViewerHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.webViewerHelper.testResults')} ({testResults.length} {t('helpers.webViewerHelper.functions')})
            </ThemedText>

            {testResults.map((result) => (
              <WebViewTestCard key={result.id} result={result} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
