// Time Validation Utility Functions

export const validateDateString = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const validateTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

export const validateLocale = (locale: string): boolean => {
  try {
    new Intl.DateTimeFormat(locale);
    return true;
  } catch {
    return false;
  }
};
