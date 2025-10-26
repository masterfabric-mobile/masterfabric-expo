import { Button } from '@/src/shared/components/button';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSnackbarHelperViewModel } from '../hooks/use-snackbar-helper-view-model';
import { snackbarHelperScreenStyles } from '../styles/snackbar-helper-screen.styles';
import { SnackbarInputField } from './snackbar-input-field';
import { SnackbarTestCard } from './snackbar-test-card';

export function SnackbarHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    testInput,
    testResults,
    isLoading,
    testSnackbar,
    runAllTests,
    updateTestInput,
  } = useSnackbarHelperViewModel();

  return (
    <SafeAreaView
      style={[snackbarHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.snackbarHelper.title')}
        subtitle={t('helpers.snackbarHelper.description')}
        variant="minimal"
      />

      <ScrollView
        style={snackbarHelperScreenStyles.scrollView}
        contentContainerStyle={snackbarHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Test Input Section */}
        <ThemedView
          style={[
            snackbarHelperScreenStyles.inputSection,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder + '30',
            },
          ]}
        >
          <ThemedText
            type="subtitle"
            style={[snackbarHelperScreenStyles.sectionTitle, { color: colors.text }]}
          >
            🍪 {t('helpers.snackbarHelper.testSuite')}
          </ThemedText>

          {/* Message Input */}
          <SnackbarInputField
            label="Message:"
            value={testInput.message}
            onChangeText={(text) => updateTestInput({ message: text })}
            placeholder="Item deleted"
          />

          {/* Duration Dropdown */}
          <View style={snackbarHelperScreenStyles.dropdownContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
            >
              Duration:
            </ThemedText>
            <Dropdown
              options={[
                { label: '2000ms', value: '2000' },
                { label: '3000ms', value: '3000' },
                { label: '4000ms', value: '4000' },
                { label: '5000ms', value: '5000' },
                { label: '8000ms', value: '8000' },
                { label: '10000ms', value: '10000' },
              ]}
              selectedValue={testInput.duration.toString()}
              onSelect={(value) => updateTestInput({ duration: parseInt(value) })}
            />
          </View>

          {/* Action Dropdown */}
          <View style={snackbarHelperScreenStyles.dropdownContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
            >
              Action:
            </ThemedText>
            <Dropdown
              options={[
                { label: 'UNDO', value: 'UNDO' },
                { label: 'RETRY', value: 'RETRY' },
                { label: 'SAVE', value: 'SAVE' },
                { label: 'LEARN MORE', value: 'LEARN MORE' },
                { label: 'DISMISS', value: 'DISMISS' },
                { label: 'FIX', value: 'FIX' },
                { label: 'REVERT', value: 'REVERT' },
              ]}
              selectedValue={testInput.actionLabel}
              onSelect={(value) => updateTestInput({ actionLabel: value })}
            />
          </View>

          {/* Action Type Dropdown */}
          <View style={snackbarHelperScreenStyles.dropdownContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
            >
              Action Type:
            </ThemedText>
            <Dropdown
              options={[
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
              ]}
              selectedValue={testInput.actionType}
              onSelect={(value) => updateTestInput({ actionType: value as any })}
            />
          </View>

          {/* Persistent Switch */}
          <View style={snackbarHelperScreenStyles.switchContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.switchLabel, { color: colors.text }]}
            >
              Persistent:
            </ThemedText>
            <Switch
              value={testInput.persistent}
              onValueChange={(value) => updateTestInput({ persistent: value })}
              trackColor={{ false: colors.surfaceBorder, true: '#4CAF50' }}
              thumbColor={testInput.persistent ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>

          {/* Test Buttons */}
          <View style={snackbarHelperScreenStyles.buttonRow}>
            <Button
              title="🧪 Test Snackbar"
              onPress={testSnackbar}
              variant="primary"
              style={snackbarHelperScreenStyles.testButton}
            />
            <Button
              title={isLoading ? '⏳ Loading...' : '🔄 Run All Tests'}
              onPress={runAllTests}
              variant="secondary"
              style={snackbarHelperScreenStyles.testButton}
              disabled={isLoading}
            />
          </View>
        </ThemedView>

        {/* Test Results Section */}
        {testResults.length > 0 && (
          <ThemedView style={snackbarHelperScreenStyles.resultsSection}>
            <ThemedText
              type="subtitle"
              style={[snackbarHelperScreenStyles.sectionTitle, { color: colors.text }]}
            >
              Test Results ({testResults.length} functions):
            </ThemedText>

            {testResults.map((result) => (
              <SnackbarTestCard key={result.id} result={result} />
            ))}
          </ThemedView>
        )}

        {/* Usage Info */}
        <ThemedView
          style={[
            snackbarHelperScreenStyles.infoBox,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder + '30',
            },
          ]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[snackbarHelperScreenStyles.infoTitle, { color: colors.text }]}
          >
            💡 Usage Tip
          </ThemedText>
          <ThemedText style={[snackbarHelperScreenStyles.infoText, { color: colors.text }]}>
            You can use the snackbar helper from anywhere in your app:
          </ThemedText>
          <ThemedView
            style={[
              snackbarHelperScreenStyles.codeBox,
              {
                backgroundColor: colors.background,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <ThemedText style={[snackbarHelperScreenStyles.codeText, { color: colors.text }]}>
              {`import { useSnackbar } from '@/src/shared/hooks/use-snackbar';

const { showSnackbar } = useSnackbar();

showSnackbar({
  message: 'Item deleted',
  type: 'success',
  duration: 5000,
  action: {
    label: 'UNDO',
    onPress: () => {},
  },
});`}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
