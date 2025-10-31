// Time Helper Utility Functions

export const formatTimeUnit = (unit: string): string => {
  const unitMap: Record<string, string> = {
    years: 'Years',
    months: 'Months',
    weeks: 'Weeks',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
  };
  return unitMap[unit] || unit;
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const isValidISOString = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
