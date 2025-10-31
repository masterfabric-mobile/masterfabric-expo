import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { timeDateTimePickerStyles } from '../styles/time-date-time-picker.styles';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  
  // Refs for scrolling to selected values
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  /**
   * Safe parse ISO string to Date object
   */
  const parseDate = (isoString: string): Date => {
    if (!isoString) return new Date();
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return new Date();
      }
      return date;
    } catch {
      return new Date();
    }
  };

  /**
   * Format time for display (HH:MM)
   */
  const formatDisplayTime = (date: Date): string => {
    try {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '00:00';
    }
  };

  /**
   * Parse text input (HH:MM format) with validation
   * Returns hour, minute, and error message if invalid
   */
  const parseTimeText = (text: string): { hour: number; minute: number; error: string | null } => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { hour: 0, minute: 0, error: null };
    }
    
    const match = trimmed.match(/^(\d{1,2}):?(\d{2})?$/);
    if (!match) {
      return { hour: 0, minute: 0, error: t('helpers.timeHelper.invalidTimeFormat') };
    }
    
    const hourStr = match[1];
    const minuteStr = match[2] || '00';
    
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    // Validate hour (0-23)
    if (hour < 0 || hour > 23) {
      return { hour: 0, minute: 0, error: t('helpers.timeHelper.hourRangeError') };
    }
    
    // Validate minute (0-59)
    if (minute < 0 || minute > 59) {
      return { hour: 0, minute: 0, error: t('helpers.timeHelper.minuteRangeError') };
    }
    
    return { hour, minute, error: null };
  };

  // Get initial date from value or use current date
  const initialDate = parseDate(value);
  
  // State for time selection
  const [selectedHour, setSelectedHour] = useState(initialDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState(initialDate.getMinutes());

  // Initialize state when value changes
  useEffect(() => {
    const currentDate = parseDate(value);
    setSelectedHour(currentDate.getHours());
    setSelectedMinute(currentDate.getMinutes());
    setTextInputValue(formatDisplayTime(currentDate));
    setInputError(null);
  }, [value]);

  // Scroll to selected values when modal opens
  useEffect(() => {
    if (modalVisible) {
      // Scroll to selected hour
      setTimeout(() => {
        hourScrollRef.current?.scrollTo({
          y: selectedHour * 48, // Approximate item height
          animated: false, // Changed to false to prevent triggering parent scroll
        });
      }, 100);
      
      // Scroll to selected minute
      setTimeout(() => {
        minuteScrollRef.current?.scrollTo({
          y: selectedMinute * 48, // Approximate item height
          animated: false, // Changed to false to prevent triggering parent scroll
        });
      }, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]); // Only scroll when modal opens, not when selection changes

  // Handle text input change with validation
  const handleTextInputChange = (text: string) => {
    setTextInputValue(text);
    const parsed = parseTimeText(text);
    
    if (parsed.error) {
      setInputError(parsed.error);
      return;
    }
    
    setInputError(null);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    
    // Auto-update value
    const currentDate = parseDate(value);
    const finalDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      parsed.hour,
      parsed.minute,
      0,
      0
    );
    if (!isNaN(finalDate.getTime())) {
      onValueChange(finalDate.toISOString());
    }
  };

  /**
   * Generate hours array (0-23)
   */
  const generateHours = (): number[] => {
    const hours: number[] = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  /**
   * Generate minutes array (0-59)
   */
  const generateMinutes = (): number[] => {
    const minutes: number[] = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    return minutes;
  };

  /**
   * Handle time selection from picker
   * Updates both text input and picker values
   */
  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    const newTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setTextInputValue(newTime);
    setInputError(null);
    
    // Update value
    const currentDate = parseDate(value);
    const finalDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hour,
      minute,
      0,
      0
    );
    if (!isNaN(finalDate.getTime())) {
      onValueChange(finalDate.toISOString());
    }
    // Keep dropdown open for quick selection
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
          borderColor: inputError ? colors.errorColor || '#FF3B30' : colors.surfaceBorder,
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
          setModalVisible(true);
          onDropdownVisibleChange?.(true);
        }}
        />
        <TouchableOpacity onPress={() => {
          setModalVisible(true);
          onDropdownVisibleChange?.(true);
        }}>
          <ThemedText style={{ color: colors.bodyText }}>▼</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Error Message Display */}
      {inputError && (
        <ThemedText
          style={[
            timeDateTimePickerStyles.inputErrorText,
            { color: colors.errorColor || '#FF3B30', marginTop: 4 }
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
          setModalVisible(false);
          onDropdownVisibleChange?.(false);
        }}
      >
        <TouchableOpacity
          style={[
            timeDateTimePickerStyles.modalOverlay,
            { 
              backgroundColor: isDark 
                ? 'rgba(0, 0, 0, 0.7)' 
                : 'rgba(0, 0, 0, 0.5)' 
            }
          ]}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            onDropdownVisibleChange?.(false);
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
                  setModalVisible(false);
                  onDropdownVisibleChange?.(false);
                }}>
                  <ThemedText style={[timeDateTimePickerStyles.cancelButton, { color: colors.bodyText }]}>
                    {t('common.cancel')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                  onDropdownVisibleChange?.(false);
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
                            ? colors.primary + '20' 
                            : 'transparent',
                          borderLeftWidth: isSelected ? 3 : 0,
                          borderLeftColor: isSelected ? colors.primary : 'transparent',
                          borderBottomColor: colors.surfaceBorder + '30',
                        }
                      ]}
                      onPress={() => handleTimeSelect(hour, selectedMinute)}
                      activeOpacity={0.7}
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
                            ? colors.primary + '20' 
                            : 'transparent',
                          borderLeftWidth: isSelected ? 3 : 0,
                          borderLeftColor: isSelected ? colors.primary : 'transparent',
                          borderBottomColor: colors.surfaceBorder + '30',
                        }
                      ]}
                      onPress={() => handleTimeSelect(selectedHour, minute)}
                      activeOpacity={0.7}
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
