import { Button } from '@/src/shared/components/button';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TextInput, View } from 'react-native';
import { getFormatOptions, getLocales, getTimezones, getUnitOptions } from '../constants';
import type { DateFormat, TimeTestInput, TimeUnit } from '../models/time-helper-models';
import { timeInputFieldStyles } from '../styles/time-input-field.styles';
import { handleLocaleChange, handleTimezoneChange } from '../utils/time-input-handlers';
import { TimeDatePicker } from './time-date-picker';
import { TimeHelperCustomPicker } from './time-helper-custom-picker';
import { TimeTimePicker } from './time-time-picker';

interface TimeInputFieldProps {
  testInput: TimeTestInput;
  onInputChange: (updates: Partial<TimeTestInput>) => void;
  onRunTests: () => void;
  isLoading: boolean;
  onDropdownVisibleChange?: (visible: boolean) => void;
}

/**
 * Time Input Field Component
 * Displays all input fields for time helper tests including date, time, timezone, locale, format, amount, and unit
 */
export function TimeInputField({ 
  testInput, 
  onInputChange, 
  onRunTests,
  isLoading,
  onDropdownVisibleChange
}: TimeInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView 
      style={[
        timeInputFieldStyles.inputCard,
        { 
          backgroundColor: colors.surfaceBackground,
        }
      ]}
    >
      <ThemedText 
        type="subtitle" 
        style={[timeInputFieldStyles.label, { color: colors.sectionTitle }]}
      >
        {t('helpers.timeHelper.testInput')}
      </ThemedText>

      {/* Date and Time Input Section */}
      <View style={timeInputFieldStyles.dateTimeRow}>
        <View style={timeInputFieldStyles.halfWidth}>
          <ThemedText 
            style={[timeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.timeHelper.date')}
          </ThemedText>
          <TimeDatePicker
            value={testInput.dateTime}
            onValueChange={(isoString) => onInputChange({ dateTime: isoString })}
            placeholder={t('helpers.timeHelper.date')}
          />
        </View>

        {/* Time Input */}
        <View style={timeInputFieldStyles.halfWidth}>
          <ThemedText 
            style={[timeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.timeHelper.time')} (HH:MM)
          </ThemedText>
          <TimeTimePicker
            value={testInput.dateTime}
            onValueChange={(isoString) => onInputChange({ dateTime: isoString })}
            placeholder="00:00"
            onDropdownVisibleChange={onDropdownVisibleChange}
          />
        </View>
      </View>

      {/* Timezone and Locale Section */}
      <View style={timeInputFieldStyles.row}>
        <View style={timeInputFieldStyles.halfWidth}>
          <ThemedText 
            style={[timeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.timeHelper.timezone')}
          </ThemedText>
          <TimeHelperCustomPicker
            items={getTimezones()}
            selectedValue={testInput.timezone}
            onValueChange={(value) => handleTimezoneChange(value, testInput.dateTime, onInputChange)}
            placeholder={t('helpers.timeHelper.timezone')}
          />
        </View>

        <View style={timeInputFieldStyles.halfWidth}>
          <ThemedText 
            style={[timeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.timeHelper.locale')}
          </ThemedText>
          <TimeHelperCustomPicker
            items={getLocales()}
            selectedValue={testInput.locale}
            onValueChange={(value) => handleLocaleChange(value, testInput.dateTime, onInputChange)}
            placeholder={t('helpers.timeHelper.locale')}
          />
        </View>
      </View>

      {/* Format Selection */}
      <View>
          <ThemedText 
            style={[timeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.timeHelper.format')}
          </ThemedText>
        <TimeHelperCustomPicker
          items={getFormatOptions()}
          selectedValue={testInput.format}
          onValueChange={(value) => onInputChange({ format: value as DateFormat })}
          placeholder={t('helpers.timeHelper.format')}
        />
      </View>

      {/* Amount and Unit Section */}
      <View style={timeInputFieldStyles.row}>
        <View style={timeInputFieldStyles.halfWidth}>
          <ThemedText 
            style={[timeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.timeHelper.amount')}
          </ThemedText>
          <TextInput
            style={[
              timeInputFieldStyles.input,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.amount.toString()}
            onChangeText={(text) => onInputChange({ amount: parseInt(text) || 1 })}
            placeholder="1"
                placeholderTextColor={colors.placeholderText}
            keyboardType="numeric"
            numberOfLines={1}
          />
        </View>

        <View style={timeInputFieldStyles.halfWidth}>
          <ThemedText 
            style={[timeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.timeHelper.unit')}
          </ThemedText>
          <TimeHelperCustomPicker
            items={getUnitOptions()}
            selectedValue={testInput.unit}
            onValueChange={(value) => onInputChange({ unit: value as TimeUnit })}
            placeholder={t('helpers.timeHelper.unit')}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={timeInputFieldStyles.buttonRow}>
        <Button
          title={isLoading ? t('common.loading') : t('helpers.timeHelper.runTests')}
          onPress={onRunTests}
          variant="primary"
          disabled={isLoading}
          style={timeInputFieldStyles.button}
        />
      </View>
    </ThemedView>
  );
}
