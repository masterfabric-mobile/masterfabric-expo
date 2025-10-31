// Time Formatter Utility Functions

/**
 * Format date for display (DD.MM.YYYY)
 */
export const formatDisplayDate = (date: Date): string => {
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
 * Format time for display (HH:MM)
 */
export const formatDisplayTime = (date: Date): string => {
  try {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '00:00';
  }
};

/**
 * Get month name based on locale
 */
export const getMonthName = (monthIndex: number, locale: string = 'tr-TR'): string => {
  const date = new Date(2025, monthIndex, 1);
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
};