import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { COLOR_OPACITY, generateMonthOptions, generateYearOptions, MODAL_OVERLAY_OPACITY, WEEK_DAYS } from '../constants';
import { useDatePicker } from '../hooks/use-date-picker';
import { useModal } from '../hooks/use-modal';
import { timeDateTimePickerStyles } from '../styles/time-date-time-picker.styles';
import { generateCalendarGrid } from '../utils/time-calculations';
import { formatDisplayDate, getMonthName } from '../utils/time-formatters';
import { parseDate } from '../utils/time-helper-utils';

interface TimeDatePickerProps {
  value: string; // ISO string
  onValueChange: (isoString: string) => void;
  placeholder?: string;
}

/**
 * Time Date Picker Component
 * Provides a calendar-style date picker with month/year navigation and day selection
 */
export function TimeDatePicker({ 
  value, 
  onValueChange, 
  placeholder 
}: TimeDatePickerProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { modalVisible, openModal, closeModal } = useModal();

  const {
    selectedYear,
    selectedMonth,
    selectedDay,
    showYearPicker,
    showMonthPicker,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    setShowYearPicker,
    setShowMonthPicker,
    goToPreviousMonth,
    goToNextMonth,
  } = useDatePicker({ value, modalVisible });


  /**
   * Convert selected date to ISO string and save
   * Preserves existing time from value
   */
  const handleConfirm = () => {
    try {
      // Preserve existing time from value
      const currentDate = parseDate(value);
      const finalDate = new Date(
        selectedYear,
        selectedMonth,
        selectedDay,
        currentDate.getHours(),
        currentDate.getMinutes(),
        0,
        0
      );

      if (isNaN(finalDate.getTime())) {
        console.error('Invalid date created');
        return;
      }

      if (finalDate.getFullYear() < 1000 || finalDate.getFullYear() > 9999) {
        console.error('Date year out of bounds');
        return;
      }

      const isoString = finalDate.toISOString();
      onValueChange(isoString);
    } catch (error) {
      console.error('Error creating date:', error);
    }
  };

  const displayValue = value ? formatDisplayDate(parseDate(value)) : placeholder || t('helpers.timeHelper.selectDateTime');
  const calendarGrid = generateCalendarGrid(selectedYear, selectedMonth);
  const monthName = getMonthName(selectedMonth, 'tr-TR');

  return (
    <>
      <TouchableOpacity
        style={[
          timeDateTimePickerStyles.pickerButton,
          { 
            backgroundColor: colors.inputBackground,
            borderColor: colors.surfaceBorder,
          }
        ]}
        onPress={openModal}
      >
        <ThemedText 
          style={{ color: colors.bodyText, flex: 1 }}
          numberOfLines={1}
        >
          {displayValue}
        </ThemedText>
        <ThemedText style={{ color: colors.bodyText }}>▼</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
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
            setShowYearPicker(false);
            closeModal();
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
                {t('helpers.timeHelper.date')}
              </ThemedText>
              <View style={timeDateTimePickerStyles.headerButtons}>
                <TouchableOpacity onPress={closeModal}>
                  <ThemedText style={[timeDateTimePickerStyles.cancelButton, { color: colors.bodyText }]}>
                    {t('common.cancel')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  handleConfirm();
                  closeModal();
                }}>
                  <ThemedText style={[timeDateTimePickerStyles.confirmButton, { color: colors.primary }]}>
                    {t('common.confirm')}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={timeDateTimePickerStyles.scrollView}>
              {/* Month Header Section */}
              <View style={timeDateTimePickerStyles.section}>
                <View style={timeDateTimePickerStyles.monthHeader}>
                  {/* Previous Month Button */}
                  <TouchableOpacity
                    style={timeDateTimePickerStyles.monthNavButton}
                    onPress={goToPreviousMonth}
                  >
                    <ThemedText style={[timeDateTimePickerStyles.monthNavArrow, { color: colors.bodyText }]}>
                      ←
                    </ThemedText>
                  </TouchableOpacity>

                  {/* Month/Year Selector */}
                  <TouchableOpacity
                    style={timeDateTimePickerStyles.monthTitleButton}
                    onPress={() => {
                      if (showYearPicker) {
                        setShowYearPicker(false);
                        setShowMonthPicker(true);
                      } else if (showMonthPicker) {
                        setShowMonthPicker(false);
                      } else {
                        setShowYearPicker(true);
                      }
                    }}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={[timeDateTimePickerStyles.monthTitle, { color: colors.titleText }]}
                    >
                      {monthName} {selectedYear} ▼
                    </ThemedText>
                  </TouchableOpacity>

                  {/* Next Month Navigation Button */}
                  <TouchableOpacity
                    style={timeDateTimePickerStyles.monthNavButton}
                    onPress={goToNextMonth}
                  >
                    <ThemedText style={[timeDateTimePickerStyles.monthNavArrow, { color: colors.bodyText }]}>
                      →
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Calendar Grid Container */}
                <View style={timeDateTimePickerStyles.calendarContainer}>
                  {/* Year Dropdown Overlay - Shown when month/year header is clicked */}
                  {showYearPicker && (
                    <View style={[
                      timeDateTimePickerStyles.yearDropdownOverlay,
                      { backgroundColor: colors.surfaceBackground, borderColor: colors.surfaceBorder }
                    ]}>
                      <ScrollView 
                        style={timeDateTimePickerStyles.yearList}
                        showsVerticalScrollIndicator={true}
                      >
                        {generateYearOptions().map((yearOption) => {
                          const isSelected = selectedYear === parseInt(yearOption.value);
                          return (
                            <TouchableOpacity
                              key={yearOption.value}
                              style={[
                                timeDateTimePickerStyles.yearItem,
                                {
                                  backgroundColor: isSelected 
                                    ? colors.primary + COLOR_OPACITY.light
                                    : 'transparent',
                                  borderLeftWidth: isSelected ? 3 : 0,
                                  borderLeftColor: isSelected ? colors.primary : 'transparent',
                                  borderBottomColor: colors.surfaceBorder + COLOR_OPACITY.medium,
                                }
                              ]}
                              onPress={() => {
                                setSelectedYear(parseInt(yearOption.value));
                                setShowYearPicker(false);
                                setShowMonthPicker(true); // Open month picker after year selection
                              }}
                            >
                              <ThemedText
                                style={[
                                  timeDateTimePickerStyles.yearItemText,
                                  { 
                                    color: isSelected ? colors.primary : colors.bodyText,
                                    fontWeight: isSelected ? '600' : '400',
                                  }
                                ]}
                              >
                                {yearOption.label}
                              </ThemedText>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}
                  
                  {/* Month Dropdown Overlay - Shown after year selection */}
                  {showMonthPicker && (
                    <View style={[
                      timeDateTimePickerStyles.yearDropdownOverlay,
                      { backgroundColor: colors.surfaceBackground, borderColor: colors.surfaceBorder }
                    ]}>
                      <ScrollView 
                        style={timeDateTimePickerStyles.yearList}
                        showsVerticalScrollIndicator={true}
                      >
                        {generateMonthOptions('tr-TR').map((monthOption) => {
                          const isSelected = selectedMonth === monthOption.value;
                          return (
                            <TouchableOpacity
                              key={monthOption.value}
                              style={[
                                timeDateTimePickerStyles.yearItem,
                                {
                                  backgroundColor: isSelected 
                                    ? colors.primary + COLOR_OPACITY.light
                                    : 'transparent',
                                  borderLeftWidth: isSelected ? 3 : 0,
                                  borderLeftColor: isSelected ? colors.primary : 'transparent',
                                  borderBottomColor: colors.surfaceBorder + COLOR_OPACITY.medium,
                                }
                              ]}
                              onPress={() => {
                                setSelectedMonth(monthOption.value);
                                setShowMonthPicker(false);
                              }}
                            >
                              <ThemedText
                                style={[
                                  timeDateTimePickerStyles.yearItemText,
                                  { 
                                    color: isSelected ? colors.primary : colors.bodyText,
                                    fontWeight: isSelected ? '600' : '400',
                                  }
                                ]}
                              >
                                {monthOption.label}
                              </ThemedText>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}
                  
                  {/* Weekday Headers Row */}
                  <View style={timeDateTimePickerStyles.weekdayRow}>
                    {WEEK_DAYS.map((day) => (
                      <View key={day} style={timeDateTimePickerStyles.weekdayHeader}>
                        <ThemedText
                          style={[
                            timeDateTimePickerStyles.weekdayText,
                            { color: colors.sectionTitle }
                          ]}
                        >
                          {day}
                        </ThemedText>
                      </View>
                    ))}
                  </View>

                  {/* Calendar Grid - Day Selection */}
                  <View style={timeDateTimePickerStyles.calendarGrid}>
                    {calendarGrid.map((week, weekIndex) => (
                      <View key={weekIndex} style={timeDateTimePickerStyles.calendarRow}>
                        {week.map((dayData, dayIndex) => {
                          const { day, isCurrentMonth } = dayData;
                          
                          const isSelected = isCurrentMonth && selectedDay === day;
                          const isToday = 
                            isCurrentMonth &&
                            day === new Date().getDate() &&
                            selectedMonth === new Date().getMonth() &&
                            selectedYear === new Date().getFullYear();
                          
                          return (
                            <TouchableOpacity
                              key={`${weekIndex}-${dayIndex}`}
                              style={[
                                timeDateTimePickerStyles.calendarDay,
                                {
                                  backgroundColor: isSelected 
                                    ? colors.primary + COLOR_OPACITY.light
                                    : isToday
                                    ? colors.successColor + COLOR_OPACITY.heavy
                                    : 'transparent',
                                  borderColor: isSelected 
                                    ? colors.primary 
                                    : isToday
                                    ? colors.successColor
                                    : 'transparent',
                                  borderWidth: isToday ? 2 : (isSelected ? 1 : 0),
                                  opacity: isCurrentMonth ? 1 : 0.3,
                                }
                              ]}
                              onPress={() => {
                                // Close year picker if open
                                if (showYearPicker) {
                                  setShowYearPicker(false);
                                  return;
                                }
                                
                                if (isCurrentMonth) {
                                  setSelectedDay(day);
                                  } else {
                                    // Navigate to that month if clicked on previous/next month day
                                    if (day > 15) {
                                      goToPreviousMonth();
                                    } else {
                                      goToNextMonth();
                                    }
                                    setSelectedDay(day);
                                  }
                                  // Close dropdowns when day is selected
                                  setShowYearPicker(false);
                                  setShowMonthPicker(false);
                                }}
                            >
                              <ThemedText
                                style={[
                                  timeDateTimePickerStyles.calendarDayText,
                                  { 
                                    color: isSelected 
                                      ? colors.primary 
                                      : isToday
                                      ? colors.successColor
                                      : colors.bodyText,
                                    fontWeight: isSelected || isToday ? '600' : '400',
                                  }
                                ]}
                              >
                                {day}
                              </ThemedText>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

