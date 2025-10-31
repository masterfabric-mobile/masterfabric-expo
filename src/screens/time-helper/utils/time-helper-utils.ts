// Time Helper Utility Functions

/**
 * Safe parse ISO string to Date object
 * Validates year range (1000-9999) and handles invalid dates
 */
export const parseDate = (isoString: string): Date => {
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