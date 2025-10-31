// Time Calculation Utility Functions

export const millisecondsToSeconds = (ms: number): number => {
  return Math.floor(ms / 1000);
};

export const secondsToMilliseconds = (seconds: number): number => {
  return seconds * 1000;
};

export const minutesToMilliseconds = (minutes: number): number => {
  return minutes * 60 * 1000;
};

export const hoursToMilliseconds = (hours: number): number => {
  return hours * 60 * 60 * 1000;
};

export const daysToMilliseconds = (days: number): number => {
  return days * 24 * 60 * 60 * 1000;
};
