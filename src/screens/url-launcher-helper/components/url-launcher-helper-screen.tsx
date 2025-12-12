import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { ThemedText, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUrlLauncherHelperViewModel } from '../hooks/use-url-launcher-helper-view-model';
import { urlLauncherHelperScreenStyles } from '../styles/url-launcher-helper-screen.styles';
import { UrlInputField } from './url-input-field';
import { UrlResultCard } from './url-result-card';

export function UrlLauncherHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { 
    testInput, 
    testResults, 
    isLoading,
    history,
    runAllTests, 
    updateTestInput,
    launchUrl,
    launchEmail,
    launchPhone,
    launchSMS,
    launchMap,
    launchInBrowser,
    launchAppStore,
    launchSettings,
    launchDeepLink,
    reLaunchFromHistory,
  } = useUrlLauncherHelperViewModel();

  return (
    <SafeAreaView 
      style={[urlLauncherHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('helpers.urlLauncherHelper.title')}
        subtitle={t('helpers.urlLauncherHelper.description')}
        variant="minimal"
      />
      <ScrollView 
        style={urlLauncherHelperScreenStyles.scrollView}
        contentContainerStyle={urlLauncherHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UrlInputField 
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          onLaunchUrl={launchUrl}
          onLaunchEmail={launchEmail}
          onLaunchPhone={launchPhone}
          onLaunchSMS={launchSMS}
          onLaunchMap={launchMap}
          onLaunchInBrowser={launchInBrowser}
          onLaunchAppStore={launchAppStore}
          onLaunchSettings={launchSettings}
          onLaunchDeepLink={launchDeepLink}
          isLoading={isLoading}
        />

        {/* Test Results - Only shown when Run All Tests is executed */}
        {testResults.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <ThemedText 
              type="subtitle" 
              style={[urlLauncherHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.urlLauncherHelper.testResults')} ({testResults.length} {t('helpers.urlLauncherHelper.operations')})
            </ThemedText>
            
            {testResults.map((result) => (
              <UrlResultCard 
                key={result.id}
                result={result}
              />
            ))}
          </View>
        )}

        {/* Launch History - Only actual launches, limited to 10 */}
        {history.length > 0 && (
          <View style={{ marginTop: testResults.length > 0 ? 24 : 24 }}>
            <ThemedText 
              type="subtitle" 
              style={[urlLauncherHelperScreenStyles.historyTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.urlLauncherHelper.history')} ({history.length})
            </ThemedText>
            
            {history.map((result) => (
              <UrlResultCard 
                key={result.id}
                result={result}
                showTimestamp={true}
                showActions={true}
                onReLaunch={reLaunchFromHistory}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

