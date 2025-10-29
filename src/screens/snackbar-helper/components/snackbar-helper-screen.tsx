import { Button } from '@/src/shared/components/button';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SNACKBAR_HELPER_COLORS } from '../constants/snackbar-colors';
import { useSnackbarHelperViewModel } from '../hooks/use-snackbar-helper-view-model';
import { snackbarHelperScreenStyles } from '../styles/snackbar-helper-screen.styles';
import { SnackbarColorPicker } from './snackbar-color-picker';
import { SnackbarInputField } from './snackbar-input-field';
import { SnackbarResultCard } from './snackbar-result-card';

export function SnackbarHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    scenarioInput,
    scenarioResults,
    isLoading,
    showSnackbarPreview,
    runAllScenarios,
    updateScenarioInput,
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
            style={[snackbarHelperScreenStyles.sectionTitle, { color: colors.sectionTitle }]}
          >
            {t('helpers.snackbarHelper.testSuite')}
          </ThemedText>

          {/* Message Input */}
          <SnackbarInputField
            label={t('helpers.snackbarHelper.message')}
            value={scenarioInput.message}
            onChangeText={(text) => updateScenarioInput({ message: text })}
            placeholder={t('helpers.snackbarHelper.messagePlaceholder')}
            multiline={true}
          />

          {/* Duration Dropdown */}
          <View style={snackbarHelperScreenStyles.dropdownContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
            >
              {t('helpers.snackbarHelper.duration')}
            </ThemedText>
            <Dropdown
              options={[
              { label: '2s', value: '2000' },
              { label: '3s', value: '3000' },
              { label: '4s', value: '4000' },
              { label: '5s', value: '5000' },
              { label: '8s', value: '8000' },
              { label: '10s', value: '10000' },
              ]}
              selectedValue={scenarioInput.duration.toString()}
              onSelect={(value) => updateScenarioInput({ duration: parseInt(value) })}
            />
            <ThemedText style={[{ color: colors.text, fontSize: 11, opacity: 0.6, marginTop: 4 }]}>
            {scenarioInput.duration / 1000}s = {scenarioInput.duration}ms
            </ThemedText>
          </View>

          {/* Action Dropdown */}
          <View style={snackbarHelperScreenStyles.dropdownContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
            >
              {t('helpers.snackbarHelper.action')}
            </ThemedText>
            <Dropdown
              options={[
                { label: t('helpers.snackbarHelper.actionNone'), value: '' },
                { label: t('helpers.snackbarHelper.actionUndo'), value: 'UNDO', icon: 'arrow-undo' },
                { label: t('helpers.snackbarHelper.actionRetry'), value: 'RETRY', icon: 'refresh' },
                { label: t('helpers.snackbarHelper.actionSave'), value: 'SAVE', icon: 'save' },
                { label: t('helpers.snackbarHelper.actionLearnMore'), value: 'LEARN MORE', icon: 'book' },
              ]}
              selectedValue={scenarioInput.actionLabel}
              onSelect={(value) => updateScenarioInput({ actionLabel: value })}
            />
          </View>

          {/* Type Dropdown */}
          <View style={snackbarHelperScreenStyles.dropdownContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
            >
              {t('helpers.snackbarHelper.type')}
            </ThemedText>
            <Dropdown
              options={[
              { label: t('helpers.snackbarHelper.typeSuccess'), value: 'success', icon: 'checkmark-circle' },
              { label: t('helpers.snackbarHelper.typeError'), value: 'error', icon: 'close-circle' },
              { label: t('helpers.snackbarHelper.typeWarning'), value: 'warning', icon: 'warning' },
              { label: t('helpers.snackbarHelper.typeInfo'), value: 'info', icon: 'information-circle' },
              { label: t('helpers.snackbarHelper.typeCustom'), value: 'custom', icon: 'color-palette' },
              ]}
              selectedValue={scenarioInput.type}
              onSelect={(value) => updateScenarioInput({ type: value as any })}
            />
          </View>

          {/* Custom Options (only if Custom type selected) */}
          {scenarioInput.type === 'custom' && (
            <>
              {/* Custom Icon Dropdown */
              }
              <View style={snackbarHelperScreenStyles.dropdownContainer}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
                >
                  {t('helpers.snackbarHelper.customIcon')}
                </ThemedText>
                <Dropdown
                  options={[
                    { label: t('helpers.snackbarHelper.iconSuccess'), value: 'checkmark-circle', icon: 'checkmark-circle' },
                    { label: t('helpers.snackbarHelper.iconError'), value: 'close-circle', icon: 'close-circle' },
                    { label: t('helpers.snackbarHelper.iconWarning'), value: 'warning', icon: 'warning' },
                    { label: t('helpers.snackbarHelper.iconInfo'), value: 'information-circle', icon: 'information-circle' },
                    { label: t('helpers.snackbarHelper.iconCheck'), value: 'checkmark', icon: 'checkmark' },
                    { label: t('helpers.snackbarHelper.iconArrow'), value: 'arrow-forward', icon: 'arrow-forward' },
                  ]}
                  selectedValue={scenarioInput.customIcon || 'checkmark-circle'}
                  onSelect={(value) => updateScenarioInput({ customIcon: value })}
                />
              </View>

              {/* Custom Color Picker */}
              <View style={snackbarHelperScreenStyles.colorPickerContainer}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
                >
                  {t('helpers.snackbarHelper.customColor')}
                </ThemedText>
                
                {/* Selected Color Preview - Click to Open Picker */}
                <Pressable 
                  style={snackbarHelperScreenStyles.colorPreviewContainer}
                  onPress={() => setShowColorPicker(true)}
                >
                <View 
                  style={[
                    snackbarHelperScreenStyles.colorPreview,
                    { 
                      backgroundColor: scenarioInput.customColor || SNACKBAR_HELPER_COLORS.customDefault,
                      borderColor: colors.surfaceBorder,
                    }
                  ]}
                />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={[snackbarHelperScreenStyles.colorHexText, { color: colors.text }]}>
                      {scenarioInput.customColor || SNACKBAR_HELPER_COLORS.customDefault}
                    </ThemedText>
                    <ThemedText style={[{ color: colors.text, fontSize: 12, opacity: 0.6 }]}>
                      {t('helpers.snackbarHelper.tapToChangeColor')}
                    </ThemedText>
                  </View>
                </Pressable>
              </View>
            </>
          )}

          {/* Color Picker Modal */}
          <SnackbarColorPicker
            visible={showColorPicker}
            onClose={() => setShowColorPicker(false)}
            initialColor={scenarioInput.customColor || SNACKBAR_HELPER_COLORS.customDefault}
            onColorSelect={(color) => updateScenarioInput({ customColor: color })}
          />

          {/* Position Dropdown */}
          <View style={snackbarHelperScreenStyles.dropdownContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.dropdownLabel, { color: colors.text }]}
            >
              {t('helpers.snackbarHelper.position')}
            </ThemedText>
            <Dropdown
              options={[
                { label: t('helpers.snackbarHelper.positionTop'), value: 'top' },
                { label: t('helpers.snackbarHelper.positionCenter'), value: 'center' },
                { label: t('helpers.snackbarHelper.positionBottom'), value: 'bottom' },
              ]}
              selectedValue={scenarioInput.position}
              onSelect={(value) => updateScenarioInput({ position: value as any })}
            />
          </View>

          {/* Persistent Switch */}
          <View style={snackbarHelperScreenStyles.switchContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[snackbarHelperScreenStyles.switchLabel, { color: colors.text }]}
            >
              {t('helpers.snackbarHelper.persistent')}
            </ThemedText>
            <Switch
              value={scenarioInput.persistent}
              onValueChange={(value) => updateScenarioInput({ persistent: value })}
              trackColor={{ false: colors.surfaceBorder, true: colors.successColor }}
              thumbColor={scenarioInput.persistent ? SNACKBAR_HELPER_COLORS.switchActiveLight : (isDark ? SNACKBAR_HELPER_COLORS.switchInactiveDark : SNACKBAR_HELPER_COLORS.switchInactiveLight)}
            />
          </View>

          {/* Test Buttons */}
          <View style={snackbarHelperScreenStyles.buttonRow}>
            <Button
              title={t('helpers.snackbarHelper.testSnackbar')}
              onPress={showSnackbarPreview}
              variant="primary"
              style={snackbarHelperScreenStyles.previewButton}
              textStyle={{ color: '#FFFFFF' }}
            />
            <Button
              title={isLoading ? t('helpers.snackbarHelper.loading') : t('helpers.snackbarHelper.runAllTests')}
              onPress={runAllScenarios}
              variant="secondary"
              style={snackbarHelperScreenStyles.previewButton}
              textStyle={{ color: '#FFFFFF' }}
              disabled={isLoading}
            />
          </View>
        </ThemedView>

        {/* Test Results Section */}
        {scenarioResults.length > 0 && (
          <View style={snackbarHelperScreenStyles.resultsSection}>
            <ThemedText
              type="subtitle"
              style={[snackbarHelperScreenStyles.sectionTitle, { color: colors.sectionTitle }]}
            >
              {t('helpers.snackbarHelper.testResultsTitle')} ({scenarioResults.length} {t('helpers.snackbarHelper.functions')}):
            </ThemedText>

            {scenarioResults.map((result) => (
              <SnackbarResultCard key={result.id} result={result} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
