import { Button } from '@/src/shared/components/button';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TextInput, View } from 'react-native';
import { getLocales, getTimezones } from '../constants';
import type { DateFormat, TimeTestInput, TimeUnit } from '../models/time-helper-models';
import { timeInputFieldStyles } from '../styles/time-input-field.styles';
import { TimeDatePicker } from './time-date-picker';
import { TimeHelperCustomPicker } from './time-helper-custom-picker';
import { TimeTimePicker } from './time-time-picker';

interface TimeInputFieldProps {
  testInput: TimeTestInput;
  onInputChange: (updates: Partial<TimeTestInput>) => void;
  onRunTests: () => void;
  onReset: () => void;
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
  onReset,
  isLoading,
  onDropdownVisibleChange
}: TimeInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  /**
   * Validate and update date when timezone changes
   */
  const handleTimezoneChange = (value: string) => {
    try {
      const currentDate = new Date(testInput.dateTime);
      if (isNaN(currentDate.getTime())) {
        onInputChange({ 
          timezone: value, 
          dateTime: new Date().toISOString() 
        });
      } else {
        onInputChange({ timezone: value });
      }
    } catch {
      onInputChange({ 
        timezone: value, 
        dateTime: new Date().toISOString() 
      });
    }
  };

  /**
   * Validate and update date when locale changes
   */
  const handleLocaleChange = (value: string) => {
    try {
      const currentDate = new Date(testInput.dateTime);
      if (isNaN(currentDate.getTime())) {
        onInputChange({ 
          locale: value, 
          dateTime: new Date().toISOString() 
        });
      } else {
        onInputChange({ locale: value });
      }
    } catch {
      onInputChange({ 
        locale: value, 
        dateTime: new Date().toISOString() 
      });
    }
  };

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
            onValueChange={handleTimezoneChange}
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
            onValueChange={handleLocaleChange}
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
          items={[
            { label: t('helpers.timeHelper.formatIso8601'), value: 'iso8601' },
            { label: t('helpers.timeHelper.formatRfc2822'), value: 'rfc2822' },
            { label: t('helpers.timeHelper.formatShort'), value: 'short' },
            { label: t('helpers.timeHelper.formatMedium'), value: 'medium' },
            { label: t('helpers.timeHelper.formatLong'), value: 'long' },
            { label: t('helpers.timeHelper.formatFull'), value: 'full' },
            { label: t('helpers.timeHelper.formatTimeShort'), value: 'time-short' },
            { label: t('helpers.timeHelper.formatTimeMedium'), value: 'time-medium' },
          ]}
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
            items={[
              { label: t('helpers.timeHelper.unitDays'), value: 'days' },
              { label: t('helpers.timeHelper.unitHours'), value: 'hours' },
              { label: t('helpers.timeHelper.unitMinutes'), value: 'minutes' },
              { label: t('helpers.timeHelper.unitMonths'), value: 'months' },
              { label: t('helpers.timeHelper.unitYears'), value: 'years' },
            ]}
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
