// Time Validation Utility Functions

/**
 * Parse text input (HH:MM format) with validation
 * Returns hour, minute, and error message if invalid
 */
export const parseTimeText = (
  text: string,
  errorMessages: {
    invalidFormat?: string;
    hourRangeError?: string;
    minuteRangeError?: string;
  } = {}
): { hour: number; minute: number; error: string | null } => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { hour: 0, minute: 0, error: null };
  }
  
  const match = trimmed.match(/^(\d{1,2}):?(\d{2})?$/);
  if (!match) {
    return { 
      hour: 0, 
      minute: 0, 
      error: errorMessages.invalidFormat || 'Invalid time format' 
    };
  }
  
  const hourStr = match[1];
  const minuteStr = match[2] || '00';
  
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  // Validate hour (0-23)
  if (hour < 0 || hour > 23) {
    return { 
      hour: 0, 
      minute: 0, 
      error: errorMessages.hourRangeError || 'Hour must be between 0-23' 
    };
  }
  
  // Validate minute (0-59)
  if (minute < 0 || minute > 59) {
    return { 
      hour: 0, 
      minute: 0, 
      error: errorMessages.minuteRangeError || 'Minute must be between 0-59' 
    };
  }
  
  return { hour, minute, error: null };
};