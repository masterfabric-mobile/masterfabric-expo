import type { TimeTestInput } from '../models/time-helper-models';

/**
 * Validate and update date when timezone changes
 */
export const handleTimezoneChange = (
  value: string,
  currentDateTime: string,
  onInputChange: (updates: Partial<TimeTestInput>) => void
): void => {
  try {
    const currentDate = new Date(currentDateTime);
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
export const handleLocaleChange = (
  value: string,
  currentDateTime: string,
  onInputChange: (updates: Partial<TimeTestInput>) => void
): void => {
  try {
    const currentDate = new Date(currentDateTime);
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

