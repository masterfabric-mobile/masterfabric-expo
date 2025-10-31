import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { timeDateTimePickerStyles } from '../styles/time-date-time-picker.styles';

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
  const [modalVisible, setModalVisible] = useState(false);

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
      const year = date.getFullYear();
      if (year < 1000 || year > 9999) {
        return new Date();
      }
      return date;
    } catch {
      return new Date();
    }
  };

  /**
   * Format date for display (DD.MM.YYYY)
   */
  const formatDisplayDate = (date: Date): string => {
    try {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return date.toLocaleDateString();
    }
  };

  /**
   * Get month name based on locale
   */
  const getMonthName = (monthIndex: number, locale: string = 'tr-TR'): string => {
    const date = new Date(2025, monthIndex, 1);
    return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
  };

  // Get initial date from value or use current date
  const initialDate = parseDate(value);
  
  // State for calendar selection
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

  // State for year picker visibility
  const [showYearPicker, setShowYearPicker] = useState(false);
  // State for month picker visibility
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Initialize state when modal opens
  useEffect(() => {
    if (modalVisible) {
      const currentDate = parseDate(value);
      setSelectedYear(currentDate.getFullYear());
      setSelectedMonth(currentDate.getMonth());
      setSelectedDay(currentDate.getDate());
      setShowYearPicker(false);
      setShowMonthPicker(false);
    }
  }, [modalVisible, value]);

  /**
   * Generate years for dropdown (current year ± 50 years)
   */
  const generateYearOptions = () => {
    const years: { label: string; value: string }[] = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      years.push({ label: i.toString(), value: i.toString() });
    }
    return years;
  };

  /**
   * Generate months for dropdown
   */
  const generateMonthOptions = () => {
    const months: { label: string; value: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const monthName = getMonthName(i, 'tr-TR');
      months.push({ label: monthName, value: i });
    }
    return months;
  };

  /**
   * Get days in month (handles leap years)
   */
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  /**
   * Navigate to previous month
   */
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  /**
   * Navigate to next month
   */
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  /**
   * Generate calendar grid with previous/next month days
   * Includes trailing days from previous month and leading days from next month
   */
  const generateCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const weeks: { day: number; isCurrentMonth: boolean }[][] = [];
    
    // Get previous month's last days
    const previousMonthDays = getDaysInMonth(
      selectedMonth === 0 ? selectedYear - 1 : selectedYear,
      selectedMonth === 0 ? 11 : selectedMonth - 1
    );
    
    // Start with previous month's trailing days
    let currentWeek: { day: number; isCurrentMonth: boolean }[] = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      currentWeek.push({ 
        day: previousMonthDays - i, 
        isCurrentMonth: false 
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({ day, isCurrentMonth: true });
      
      // When week is complete (7 days), start new week
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill remaining week with next month's days
    let nextMonthDay = 1;
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: nextMonthDay, isCurrentMonth: false });
      nextMonthDay++;
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  /**
   * Weekday labels (Turkish short format)
   * Pa: Pazartesi, Pt: Salı, Sa: Çarşamba, Ça: Perşembe, Pe: Cuma, Cu: Cumartesi, Ct: Pazar
   */
  const weekDays = ['Pa', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

  /**
   * Validate and adjust day if month/year changes
   * Prevents invalid dates (e.g., Feb 30)
   */
  useEffect(() => {
    const maxDays = getDaysInMonth(selectedYear, selectedMonth);
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth]);


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
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating date:', error);
    }
  };

  const displayValue = value ? formatDisplayDate(parseDate(value)) : placeholder || t('helpers.timeHelper.selectDateTime');
  const calendarGrid = generateCalendarGrid();
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
        onPress={() => setModalVisible(true)}
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
        onRequestClose={() => setModalVisible(false)}
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
            setShowYearPicker(false);
            setModalVisible(false);
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
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <ThemedText style={[timeDateTimePickerStyles.cancelButton, { color: colors.bodyText }]}>
                    {t('common.cancel')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
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
                                    ? colors.primary + '20' 
                                    : 'transparent',
                                  borderLeftWidth: isSelected ? 3 : 0,
                                  borderLeftColor: isSelected ? colors.primary : 'transparent',
                                  borderBottomColor: colors.surfaceBorder + '30',
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
                        {generateMonthOptions().map((monthOption) => {
                          const isSelected = selectedMonth === monthOption.value;
                          return (
                            <TouchableOpacity
                              key={monthOption.value}
                              style={[
                                timeDateTimePickerStyles.yearItem,
                                {
                                  backgroundColor: isSelected 
                                    ? colors.primary + '20' 
                                    : 'transparent',
                                  borderLeftWidth: isSelected ? 3 : 0,
                                  borderLeftColor: isSelected ? colors.primary : 'transparent',
                                  borderBottomColor: colors.surfaceBorder + '30',
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
                    {weekDays.map((day) => (
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
                                    ? colors.primary + '20' 
                                    : isToday
                                    ? colors.successColor + '40'
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

