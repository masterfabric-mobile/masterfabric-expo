import { Button, Dropdown, ThemedText } from '@/src/shared/components';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoggerHelperViewModel } from '../hooks/use-logger-helper-view-model';
import { loggerHelperScreenStyles } from '../styles/logger-helper-screen.styles';
import { LogViewer } from './log-viewer';
import { LoggerInputField } from './logger-input-field';

// Main screen component for logger helper tool - allows testing and viewing logs
export function LoggerHelperScreen() {
  const { input, isLoading, updateInput, runAllTests, runSingleTest } = useLoggerHelperViewModel();
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme === 'dark');

  // Available log levels for dropdown selection
  const levels: Array<'info' | 'debug' | 'warning' | 'error' | 'verbose'> = ['info', 'debug', 'warning', 'error', 'verbose'];

  return (
    <SafeAreaView style={[loggerHelperScreenStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title={t('helpers.loggerHelper.title')}
        subtitle={t('helpers.loggerHelper.description')}
        variant="minimal"
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[loggerHelperScreenStyles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            loggerHelperScreenStyles.card,
            { backgroundColor: colors.surfaceBackground, borderColor: colors.surfaceBorder }
          ]}
        >
          <Text style={[loggerHelperScreenStyles.sectionTitle, { color: colors.labelText }]}> 
            {t('helpers.toastHelper.input')}
          </Text>
          <View style={loggerHelperScreenStyles.section}>
            <LoggerInputField
              message={input.message}
              level={input.level}
              component={input.component}
              includeStackTrace={input.includeStackTrace}
              onChange={updateInput}
            />

            {/* Log level selection dropdown */}
            <View style={{ gap: 10, marginTop: 8 }}>
              <ThemedText style={{ color: colors.titleText, fontWeight: '600' }}>
                {t('helpers.loggerHelper.level')} {input.level.toUpperCase()}
              </ThemedText>
              <Dropdown
                options={levels.map((lvl) => ({ label: lvl.toUpperCase(), value: lvl }))}
                selectedValue={input.level}
                onSelect={(value) => updateInput({ level: value as typeof input.level })}
                placeholder={t('helpers.loggerHelper.level')}
              />
            </View>

            {/* Toggle timestamp visibility in logs */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <Switch
                value={input.showTimestamp}
                onValueChange={(value) => updateInput({ showTimestamp: value })}
                trackColor={{ false: colors.surfaceBorder, true: colors.tint }}
              />
              <ThemedText style={{ color: colors.bodyText }}>
                {t('helpers.loggerHelper.showTimestamp')}
              </ThemedText>
            </View>

            {/* Action buttons - run single test or run all tests */}
            <View style={[loggerHelperScreenStyles.actions, { gap: 12 }]}>
              <Button
                title={isLoading ? t('helpers.loggerHelper.running') : t('helpers.loggerHelper.run')}
                onPress={runSingleTest}
                disabled={isLoading}
                variant="primary"
                size="large"
              />
              <Button
                title={isLoading ? t('helpers.loggerHelper.running') : t('helpers.loggerHelper.runTests')}
                onPress={runAllTests}
                disabled={isLoading}
                variant="secondary"
                size="large"
              />
            </View>
          </View>
        </View>

        <View
          style={[
            loggerHelperScreenStyles.card,
            { backgroundColor: colors.surfaceBackground, borderColor: colors.surfaceBorder }
          ]}
        >
          <Text style={[loggerHelperScreenStyles.sectionTitle, { color: colors.labelText }]}>
            {t('helpers.toastHelper.results')}
          </Text>
          <View style={[loggerHelperScreenStyles.resultsList, { marginTop: 8 }]}>
            <LogViewer />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



