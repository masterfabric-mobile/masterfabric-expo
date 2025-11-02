import { useEffect, useState } from 'react';
import { getDaysInMonth } from '../utils/time-calculations';
import { parseDate } from '../utils/time-helper-utils';

interface UseDatePickerProps {
  value: string;
  modalVisible: boolean;
}

interface UseDatePickerReturn {
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  showYearPicker: boolean;
  showMonthPicker: boolean;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedDay: (day: number) => void;
  setShowYearPicker: (show: boolean) => void;
  setShowMonthPicker: (show: boolean) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

/**
 * Custom hook for date picker state management
 * Handles calendar selection, month navigation, and picker visibility
 */
export function useDatePicker({ value, modalVisible }: UseDatePickerProps): UseDatePickerReturn {
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

  return {
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
  };
}

