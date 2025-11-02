import { t } from '@/src/shared/i18n';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { TIME_PICKER_ITEM_HEIGHT, TIME_PICKER_SCROLL_DELAY_HOUR, TIME_PICKER_SCROLL_DELAY_MINUTE } from '../constants';
import { formatDisplayTime } from '../utils/time-formatters';
import { parseDate } from '../utils/time-helper-utils';
import { parseTimeText } from '../utils/time-validators';

interface UseTimePickerProps {
  value: string;
  onValueChange: (isoString: string) => void;
}

interface UseTimePickerReturn {
  selectedHour: number;
  selectedMinute: number;
  textInputValue: string;
  inputError: string | null;
  modalVisible: boolean;
  hourScrollRef: React.RefObject<ScrollView | null>;
  minuteScrollRef: React.RefObject<ScrollView | null>;
  textInputRef: React.RefObject<TextInput | null>;
  setModalVisible: (visible: boolean) => void;
  setTextInputValue: (value: string) => void;
  handleTextInputChange: (text: string) => void;
  handleTimeSelect: (hour: number, minute: number) => void;
}

/**
 * Custom hook for time picker state management
 * Handles time selection, text input, validation, and scroll positioning
 */
export function useTimePicker({ 
  value, 
  onValueChange
}: UseTimePickerProps): UseTimePickerReturn {
  const [modalVisible, setModalVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  
  // Refs for scrolling to selected values
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

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
          y: selectedHour * TIME_PICKER_ITEM_HEIGHT,
          animated: false, // Changed to false to prevent triggering parent scroll
        });
      }, TIME_PICKER_SCROLL_DELAY_HOUR);
      
      // Scroll to selected minute
      setTimeout(() => {
        minuteScrollRef.current?.scrollTo({
          y: selectedMinute * TIME_PICKER_ITEM_HEIGHT,
          animated: false, // Changed to false to prevent triggering parent scroll
        });
      }, TIME_PICKER_SCROLL_DELAY_MINUTE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]); // Only scroll when modal opens, not when selection changes

  // Handle text input change with validation
  const handleTextInputChange = (text: string) => {
    setTextInputValue(text);
    const parsed = parseTimeText(text, {
      invalidFormat: t('helpers.timeHelper.invalidTimeFormat'),
      hourRangeError: t('helpers.timeHelper.hourRangeError'),
      minuteRangeError: t('helpers.timeHelper.minuteRangeError'),
    });
    
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

  return {
    selectedHour,
    selectedMinute,
    textInputValue,
    inputError,
    modalVisible,
    hourScrollRef,
    minuteScrollRef,
    textInputRef,
    setModalVisible,
    setTextInputValue,
    handleTextInputChange,
    handleTimeSelect,
  };
}

