import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { ACTIVE_OPACITY, COLOR_OPACITY, FALLBACK_ERROR_COLOR, MODAL_OVERLAY_OPACITY, generateHours, generateMinutes } from '../constants';
import { useTimePicker } from '../hooks/use-time-picker';
import { timeDateTimePickerStyles } from '../styles/time-date-time-picker.styles';
import { formatDisplayTime } from '../utils/time-formatters';
import { parseDate } from '../utils/time-helper-utils';

interface TimeTimePickerProps {
  value: string; // ISO string
  onValueChange: (isoString: string) => void;
  placeholder?: string;
  onDropdownVisibleChange?: (visible: boolean) => void;
}

/**
 * Time Time Picker Component
 * Provides time selection with text input and two-column scrollable picker for hours and minutes
 */
export function TimeTimePicker({ 
  value, 
  onValueChange, 
  placeholder,
  onDropdownVisibleChange
}: TimeTimePickerProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    selectedHour,
    selectedMinute,
    textInputValue,
    inputError,
    modalVisible,
    hourScrollRef,
    minuteScrollRef,
    textInputRef,
    setModalVisible,
    handleTextInputChange,
    handleTimeSelect,
  } = useTimePicker({ value, onValueChange });

  // Handle modal visibility change callback
  const handleModalVisibleChange = (visible: boolean) => {
    setModalVisible(visible);
    onDropdownVisibleChange?.(visible);
  };

  const displayValue = value ? formatDisplayTime(parseDate(value)) : placeholder || '00:00';
  const hours = generateHours();
  const minutes = generateMinutes();

  return (
    <View style={timeDateTimePickerStyles.timePickerWrapper}>
      <View style={[
        timeDateTimePickerStyles.pickerButton,
        { 
          backgroundColor: colors.inputBackground,
          borderColor: inputError ? colors.errorColor || FALLBACK_ERROR_COLOR : colors.surfaceBorder,
        }
      ]}>
        <TextInput
          ref={textInputRef}
          style={[
            { 
              color: colors.bodyText, 
              flex: 1,
              fontSize: 16,
            }
          ]}
          value={textInputValue || displayValue}
          onChangeText={handleTextInputChange}
          placeholder={placeholder || '00:00'} // Time format is universal, no translation needed
          placeholderTextColor={colors.placeholderText}
          keyboardType="numeric"
          maxLength={5}
          onFocus={() => {
          handleModalVisibleChange(true);
        }}
        />
        <TouchableOpacity onPress={() => {
          handleModalVisibleChange(true);
        }}>
          <ThemedText style={{ color: colors.bodyText }}>▼</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Error Message Display */}
      {inputError && (
        <ThemedText
          style={[
            timeDateTimePickerStyles.inputErrorText,
            { color: colors.errorColor || FALLBACK_ERROR_COLOR, marginTop: 4 }
          ]}
        >
          {inputError}
        </ThemedText>
      )}

      {/* Modal Time Picker */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          handleModalVisibleChange(false);
        }}
      >
        <TouchableOpacity
          style={[
            timeDateTimePickerStyles.modalOverlay,
            { 
              backgroundColor: `rgba(0, 0, 0, ${isDark ? MODAL_OVERLAY_OPACITY.dark : MODAL_OVERLAY_OPACITY.light})`
            }
          ]}
          activeOpacity={1}
          onPress={() => {
            handleModalVisibleChange(false);
          }}
        >
          <ThemedView
            style={[
              timeDateTimePickerStyles.modalContent,
              { backgroundColor: colors.surfaceBackground }
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[
              timeDateTimePickerStyles.modalHeader,
              { borderBottomColor: colors.surfaceBorder }
            ]}>
              <ThemedText type="subtitle" style={{ color: colors.titleText }}>
                {t('helpers.timeHelper.time')} (HH:MM)
              </ThemedText>
              <View style={timeDateTimePickerStyles.headerButtons}>
                <TouchableOpacity onPress={() => {
                  handleModalVisibleChange(false);
                }}>
                  <ThemedText style={[timeDateTimePickerStyles.cancelButton, { color: colors.bodyText }]}>
                    {t('common.cancel')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  handleModalVisibleChange(false);
                }}>
                  <ThemedText style={[timeDateTimePickerStyles.confirmButton, { color: colors.primary }]}>
                    {t('common.confirm')}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Two Column Time Picker */}
            <View style={timeDateTimePickerStyles.timePickerTwoColumn}>
            {/* Hours Column */}
            <View style={timeDateTimePickerStyles.timePickerColumn}>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  timeDateTimePickerStyles.timeColumnTitle,
                  { color: colors.sectionTitle }
                ]}
              >
                {t('helpers.timeHelper.hour')}
              </ThemedText>
              <ScrollView 
                ref={hourScrollRef}
                style={timeDateTimePickerStyles.timeColumnScroll}
                contentContainerStyle={timeDateTimePickerStyles.timeColumnContent}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                bounces={true}
                scrollEventThrottle={16}
              >
                {hours.map((hour) => {
                  const isSelected = selectedHour === hour;
                  return (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        timeDateTimePickerStyles.timePickerItem,
                        {
                          backgroundColor: isSelected 
                            ? colors.primary + COLOR_OPACITY.light
                            : 'transparent',
                          borderLeftWidth: isSelected ? 3 : 0,
                          borderLeftColor: isSelected ? colors.primary : 'transparent',
                          borderBottomColor: colors.surfaceBorder + COLOR_OPACITY.medium,
                        }
                      ]}
                      onPress={() => handleTimeSelect(hour, selectedMinute)}
                      activeOpacity={ACTIVE_OPACITY}
                    >
                      <ThemedText
                        style={[
                          timeDateTimePickerStyles.timePickerText,
                          { 
                              color: isSelected ? colors.primary : colors.bodyText,
                            fontWeight: isSelected ? '600' : '400',
                          }
                        ]}
                      >
                        {String(hour).padStart(2, '0')}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Separator */}
            <View style={[timeDateTimePickerStyles.timePickerColumnSeparator, { backgroundColor: colors.surfaceBorder }]} />

            {/* Minutes Column */}
            <View style={timeDateTimePickerStyles.timePickerColumn}>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  timeDateTimePickerStyles.timeColumnTitle,
                  { color: colors.sectionTitle }
                ]}
              >
                {t('helpers.timeHelper.minute')}
              </ThemedText>
              <ScrollView 
                ref={minuteScrollRef}
                style={timeDateTimePickerStyles.timeColumnScroll}
                contentContainerStyle={timeDateTimePickerStyles.timeColumnContent}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                bounces={true}
                scrollEventThrottle={16}
              >
                {minutes.map((minute) => {
                  const isSelected = selectedMinute === minute;
                  return (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        timeDateTimePickerStyles.timePickerItem,
                        {
                          backgroundColor: isSelected 
                            ? colors.primary + COLOR_OPACITY.light
                            : 'transparent',
                          borderLeftWidth: isSelected ? 3 : 0,
                          borderLeftColor: isSelected ? colors.primary : 'transparent',
                          borderBottomColor: colors.surfaceBorder + COLOR_OPACITY.medium,
                        }
                      ]}
                      onPress={() => handleTimeSelect(selectedHour, minute)}
                      activeOpacity={ACTIVE_OPACITY}
                    >
                      <ThemedText
                        style={[
                          timeDateTimePickerStyles.timePickerText,
                          { 
                              color: isSelected ? colors.primary : colors.bodyText,
                            fontWeight: isSelected ? '600' : '400',
                          }
                        ]}
                      >
                        {String(minute).padStart(2, '0')}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
