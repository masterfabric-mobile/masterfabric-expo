import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimeHelperViewModel } from '../hooks/use-time-helper-view-model';
import { timeHelperScreenStyles } from '../styles/time-helper-screen.styles';
import { TimeInputField } from './time-input-field';
import { TimeResultCard } from './time-result-card';

/**
 * Time Helper Screen Component
 * Main screen for date and time manipulation utilities
 */
export function TimeHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { testInput, testResults, isLoading, runAllTests, updateTestInput } = useTimeHelperViewModel();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <SafeAreaView 
      style={[timeHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Screen Header */}
      <ScreenHeader 
        title={t('helpers.timeHelper.title')}
        subtitle={t('helpers.timeHelper.description')}
        variant="minimal"
      />
      
      {/* Scrollable Content */}
      <ScrollView 
        style={timeHelperScreenStyles.scrollView}
        contentContainerStyle={timeHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!dropdownVisible}
        nestedScrollEnabled={true}
      >
        {/* Input Fields Section */}
        <TimeInputField 
          testInput={testInput}
          onInputChange={updateTestInput}
          onRunTests={runAllTests}
          isLoading={isLoading}
          onDropdownVisibleChange={setDropdownVisible}
        />

        {/* Test Results Section */}
        {testResults.length > 0 && (
          <View>
            <ThemedText 
              type="subtitle" 
              style={[timeHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.timeHelper.testResults')} ({testResults.length} {t('helpers.timeHelper.functions')})
            </ThemedText>
            
            {testResults.map((result) => (
              <TimeResultCard 
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
