// Placeholder time helper functions
// Will be replaced with actual date-fns implementation

export const formatDate = (date: string | Date, format: string = 'long', locale: string = 'en-US'): string => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: format === 'long' ? 'long' : format === 'short' ? 'numeric' : 'short',
      day: 'numeric' 
    });
  } catch {
    return 'Invalid Date';
  }
};

export const fromNow = (date: string | Date, locale: string = 'en-US'): string => {
  try {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  } catch {
    return 'Invalid Date';
  }
};

export const addTime = (date: string | Date, amount: number, unit: string): Date => {
  const d = new Date(date);
  switch (unit) {
    case 'days': d.setDate(d.getDate() + amount); break;
    case 'hours': d.setHours(d.getHours() + amount); break;
    case 'minutes': d.setMinutes(d.getMinutes() + amount); break;
    case 'months': d.setMonth(d.getMonth() + amount); break;
    case 'years': d.setFullYear(d.getFullYear() + amount); break;
  }
  return d;
};

export const subtractTime = (date: string | Date, amount: number, unit: string): Date => {
  return addTime(date, -amount, unit);
};

export const diff = (startDate: string | Date, endDate: string | Date, unit: string = 'days'): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  
  switch (unit) {
    case 'days': return Math.floor(diffMs / 86400000);
    case 'hours': return Math.floor(diffMs / 3600000);
    case 'minutes': return Math.floor(diffMs / 60000);
    case 'seconds': return Math.floor(diffMs / 1000);
    default: return Math.floor(diffMs / 86400000);
  }
};

export const startOf = (date: string | Date, unit: string): Date => {
  const d = new Date(date);
  switch (unit) {
    case 'day': d.setHours(0, 0, 0, 0); break;
    case 'month': d.setDate(1); d.setHours(0, 0, 0, 0); break;
    case 'year': d.setMonth(0, 1); d.setHours(0, 0, 0, 0); break;
  }
  return d;
};

export const endOf = (date: string | Date, unit: string): Date => {
  const d = new Date(date);
  switch (unit) {
    case 'day': d.setHours(23, 59, 59, 999); break;
    case 'month': d.setMonth(d.getMonth() + 1, 0); d.setHours(23, 59, 59, 999); break;
    case 'year': d.setMonth(11, 31); d.setHours(23, 59, 59, 999); break;
  }
  return d;
};

export const toTimezone = (date: string | Date, timezone: string, format: string = 'long'): string => {
  try {
    const d = new Date(date);
    return d.toLocaleString('en-US', { timeZone: timezone });
  } catch {
    return 'Invalid Date';
  }
};

export const isValidDate = (date: string | Date): boolean => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

export const isPastDate = (date: string | Date): boolean => {
  const d = new Date(date);
  return d.getTime() < Date.now();
};

export const isFutureDate = (date: string | Date): boolean => {
  const d = new Date(date);
  return d.getTime() > Date.now();
};

export const isWeekendDay = (date: string | Date): boolean => {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
};

export const addBusinessDaysToDate = (date: string | Date, days: number): Date => {
  let d = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    d.setDate(d.getDate() + 1);
    if (!isWeekendDay(d)) {
      addedDays++;
    }
  }
  return d;
};

export const calculateAge = (birthdate: string | Date): number => {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const getWeekNumber = (date: string | Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export const getDaysInMonthCount = (date: string | Date): number => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
};

export const isLeapYearCheck = (date: string | Date): boolean => {
  const d = new Date(date);
  const year = d.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

export const toUnixTimestamp = (date: string | Date): number => {
  const d = new Date(date);
  return Math.floor(d.getTime() / 1000);
};

export const fromUnixTimestamp = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};
