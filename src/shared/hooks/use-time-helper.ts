import { useCallback } from 'react';
import * as TimeHelpers from 'masterfabric-expo-core/src/helpers/time_helper';

export function useTimeHelper() {
  const formatDate = useCallback((date: string | Date, format?: string, locale?: string) => {
    return TimeHelpers.formatDate(date, format, locale);
  }, []);

  const fromNow = useCallback((date: string | Date, locale?: string) => {
    return TimeHelpers.fromNow(date, locale);
  }, []);

  const addTime = useCallback((date: string | Date, amount: number, unit: string) => {
    return TimeHelpers.addTime(date, amount, unit);
  }, []);

  const subtractTime = useCallback((date: string | Date, amount: number, unit: string) => {
    return TimeHelpers.subtractTime(date, amount, unit);
  }, []);

  const diff = useCallback((startDate: string | Date, endDate: string | Date, unit?: string) => {
    return TimeHelpers.diff(startDate, endDate, unit);
  }, []);

  const isValidDate = useCallback((date: string | Date) => {
    return TimeHelpers.isValidDate(date);
  }, []);

  const isPast = useCallback((date: string | Date) => {
    return TimeHelpers.isPastDate(date);
  }, []);

  const isFuture = useCallback((date: string | Date) => {
    return TimeHelpers.isFutureDate(date);
  }, []);

  const isWeekend = useCallback((date: string | Date) => {
    return TimeHelpers.isWeekendDay(date);
  }, []);

  const calculateAge = useCallback((birthdate: string | Date) => {
    return TimeHelpers.calculateAge(birthdate);
  }, []);

  return {
    formatDate,
    fromNow,
    addTime,
    subtractTime,
    diff,
    isValidDate,
    isPast,
    isFuture,
    isWeekend,
    calculateAge,
  };
}
