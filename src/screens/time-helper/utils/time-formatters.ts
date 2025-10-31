// Time Formatter Utility Functions

export const formatDateToDisplay = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

export const formatTimeToDisplay = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString();
};

export const formatDateTimeToDisplay = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString();
};
