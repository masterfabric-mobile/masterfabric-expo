import { t } from '@/src/shared/i18n';
import * as TimeHelpers from 'masterfabric-expo-core/src/helpers/time_helper';
import { useCallback } from 'react';
import { TimeTestResult } from '../models/time-helper-models';
import { useTimeHelperStore } from '../store/time-helper-store';

export function useTimeHelperViewModel() {
  const { 
    testInput, 
    testResults, 
    isLoading, 
    setTestInput, 
    updateTestInput,
    setTestResults, 
    setIsLoading,
    clearResults,
    resetInput
  } = useTimeHelperStore();

  // Helper function to translate unit
  const translateUnit = useCallback((unit: string): string => {
    const unitMap: Record<string, string> = {
      'days': t('helpers.timeHelper.dayUnit'),
      'hours': t('helpers.timeHelper.hourUnit'),
      'minutes': t('helpers.timeHelper.minuteUnit'),
      'months': t('helpers.timeHelper.monthUnit'),
      'years': t('helpers.timeHelper.yearUnit'),
    };
    return unitMap[unit] || unit;
  }, []);

  // Helper function to translate format
  const translateFormat = useCallback((format: string): string => {
    const formatMap: Record<string, string> = {
      'iso8601': t('helpers.timeHelper.formatIso8601'),
      'rfc2822': t('helpers.timeHelper.formatRfc2822'),
      'short': t('helpers.timeHelper.formatShort'),
      'medium': t('helpers.timeHelper.formatMedium'),
      'long': t('helpers.timeHelper.formatLong'),
      'full': t('helpers.timeHelper.formatFull'),
      'time-short': t('helpers.timeHelper.formatTimeShort'),
      'time-medium': t('helpers.timeHelper.formatTimeMedium'),
    };
    return formatMap[format] || format;
  }, []);

  const runAllTests = useCallback(() => {
    setIsLoading(true);
    
    const results: TimeTestResult[] = [];
    const { 
      dateTime, 
      timezone, 
      locale, 
      format,
      amount, 
      unit, 
      startDate, 
      endDate 
    } = testInput;

    // Validate dateTime before processing
    let validatedDateTime = dateTime;
    try {
      const testDate = new Date(dateTime);
      if (isNaN(testDate.getTime())) {
        validatedDateTime = new Date().toISOString();
      } else {
        // Check if date is in valid range
        const year = testDate.getFullYear();
        if (year < 1000 || year > 9999) {
          validatedDateTime = new Date().toISOString();
        }
      }
    } catch {
      validatedDateTime = new Date().toISOString();
    }

    try {
      // Format Date
      try {
        results.push({
          id: 'format-date',
          functionName: 'formatDate',
          input: `${validatedDateTime} (${translateFormat(format)})`,
          output: TimeHelpers.formatDate(validatedDateTime, format, locale),
          description: t('helpers.timeHelper.formatDate'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'format-date',
          functionName: 'formatDate',
          input: `${validatedDateTime} (${translateFormat(format)})`,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.formatDate'),
          success: false,
        });
      }

      // Relative Time (fromNow)
      try {
        results.push({
          id: 'from-now',
          functionName: 'fromNow',
          input: validatedDateTime,
          output: TimeHelpers.fromNow(validatedDateTime, locale),
          description: t('helpers.timeHelper.fromNow'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'from-now',
          functionName: 'fromNow',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.fromNow'),
          success: false,
        });
      }

      // Add Time
      try {
        results.push({
          id: 'add-time',
          functionName: 'addTime',
          input: `${validatedDateTime} + ${amount} ${translateUnit(unit)}`,
          output: TimeHelpers.addTime(validatedDateTime, amount, unit).toISOString(),
          description: t('helpers.timeHelper.addTime'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'add-time',
          functionName: 'addTime',
          input: `${validatedDateTime} + ${amount} ${translateUnit(unit)}`,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.addTime'),
          success: false,
        });
      }

      // Subtract Time
      try {
        results.push({
          id: 'subtract-time',
          functionName: 'subtractTime',
          input: `${validatedDateTime} - ${amount} ${translateUnit(unit)}`,
          output: TimeHelpers.subtractTime(validatedDateTime, amount, unit).toISOString(),
          description: t('helpers.timeHelper.subtractTime'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'subtract-time',
          functionName: 'subtractTime',
          input: `${validatedDateTime} - ${amount} ${translateUnit(unit)}`,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.subtractTime'),
          success: false,
        });
      }

      // Difference
      if (startDate && endDate) {
        results.push({
          id: 'diff',
          functionName: 'diff',
          input: `${startDate} → ${endDate}`,
          output: `${TimeHelpers.diff(startDate, endDate, unit)} ${translateUnit(unit)}`,
          description: t('helpers.timeHelper.diff'),
          success: true,
        });
      }

      // Start of Day
      try {
        results.push({
          id: 'start-of-day',
          functionName: 'startOf',
          input: `${validatedDateTime} (${t('helpers.timeHelper.dayUnit')})`,
          output: TimeHelpers.startOf(validatedDateTime, 'day').toISOString(),
          description: t('helpers.timeHelper.startOf'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'start-of-day',
          functionName: 'startOf',
          input: `${validatedDateTime} (${t('helpers.timeHelper.dayUnit')})`,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.startOf'),
          success: false,
        });
      }

      // End of Day
      try {
        results.push({
          id: 'end-of-day',
          functionName: 'endOf',
          input: `${validatedDateTime} (${t('helpers.timeHelper.dayUnit')})`,
          output: TimeHelpers.endOf(validatedDateTime, 'day').toISOString(),
          description: t('helpers.timeHelper.endOf'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'end-of-day',
          functionName: 'endOf',
          input: `${validatedDateTime} (${t('helpers.timeHelper.dayUnit')})`,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.endOf'),
          success: false,
        });
      }

      // Timezone Conversion
      try {
        results.push({
          id: 'to-timezone',
          functionName: 'toTimezone',
          input: `${validatedDateTime} → ${timezone}`,
          output: TimeHelpers.toTimezone(validatedDateTime, timezone),
          description: t('helpers.timeHelper.toTimezone'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'to-timezone',
          functionName: 'toTimezone',
          input: `${validatedDateTime} → ${timezone}`,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.toTimezone'),
          success: false,
        });
      }

      // Is Valid
      try {
        results.push({
          id: 'is-valid',
          functionName: 'isValidDate',
          input: validatedDateTime,
          output: TimeHelpers.isValidDate(validatedDateTime) ? t('helpers.timeHelper.true') : t('helpers.timeHelper.false'),
          description: t('helpers.timeHelper.isValid'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'is-valid',
          functionName: 'isValidDate',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.isValid'),
          success: false,
        });
      }

      // Is Past
      try {
        results.push({
          id: 'is-past',
          functionName: 'isPastDate',
          input: validatedDateTime,
          output: TimeHelpers.isPastDate(validatedDateTime) ? t('helpers.timeHelper.true') : t('helpers.timeHelper.false'),
          description: t('helpers.timeHelper.isPast'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'is-past',
          functionName: 'isPastDate',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.isPast'),
          success: false,
        });
      }

      // Is Future
      try {
        results.push({
          id: 'is-future',
          functionName: 'isFutureDate',
          input: validatedDateTime,
          output: TimeHelpers.isFutureDate(validatedDateTime) ? t('helpers.timeHelper.true') : t('helpers.timeHelper.false'),
          description: t('helpers.timeHelper.isFuture'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'is-future',
          functionName: 'isFutureDate',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.isFuture'),
          success: false,
        });
      }

      // Is Weekend
      try {
        results.push({
          id: 'is-weekend',
          functionName: 'isWeekendDay',
          input: validatedDateTime,
          output: TimeHelpers.isWeekendDay(validatedDateTime) ? t('helpers.timeHelper.true') : t('helpers.timeHelper.false'),
          description: t('helpers.timeHelper.isWeekend'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'is-weekend',
          functionName: 'isWeekendDay',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.isWeekend'),
          success: false,
        });
      }

      // Add Business Days
      try {
        results.push({
          id: 'add-business-days',
          functionName: 'addBusinessDaysToDate',
          input: `${validatedDateTime} + ${amount} ${t('helpers.timeHelper.businessDays')}`,
          output: TimeHelpers.addBusinessDaysToDate(validatedDateTime, amount).toISOString(),
          description: t('helpers.timeHelper.addBusinessDays'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'add-business-days',
          functionName: 'addBusinessDaysToDate',
          input: `${validatedDateTime} + ${amount} ${t('helpers.timeHelper.businessDays')}`,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.addBusinessDays'),
          success: false,
        });
      }

      // Calculate Age
      const birthdate = '1990-01-01';
      results.push({
        id: 'calculate-age',
        functionName: 'calculateAge',
        input: birthdate,
        output: `${TimeHelpers.calculateAge(birthdate)} ${t('helpers.timeHelper.years')}`,
        description: t('helpers.timeHelper.calculateAge'),
        success: true,
      });

      // Get Week Number
      try {
        results.push({
          id: 'get-week-number',
          functionName: 'getWeekNumber',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.week')} ${TimeHelpers.getWeekNumber(validatedDateTime)}`,
          description: t('helpers.timeHelper.getWeekNumber'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'get-week-number',
          functionName: 'getWeekNumber',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.getWeekNumber'),
          success: false,
        });
      }

      // Days in Month
      try {
        results.push({
          id: 'days-in-month',
          functionName: 'getDaysInMonthCount',
          input: validatedDateTime,
          output: `${TimeHelpers.getDaysInMonthCount(validatedDateTime)} ${t('helpers.timeHelper.days')}`,
          description: t('helpers.timeHelper.getDaysInMonth'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'days-in-month',
          functionName: 'getDaysInMonthCount',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.getDaysInMonth'),
          success: false,
        });
      }

      // Is Leap Year
      try {
        results.push({
          id: 'is-leap-year',
          functionName: 'isLeapYearCheck',
          input: validatedDateTime,
          output: TimeHelpers.isLeapYearCheck(validatedDateTime) ? t('helpers.timeHelper.true') : t('helpers.timeHelper.false'),
          description: t('helpers.timeHelper.isLeapYear'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'is-leap-year',
          functionName: 'isLeapYearCheck',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.isLeapYear'),
          success: false,
        });
      }

      // Unix Timestamp
      try {
        results.push({
          id: 'to-unix-timestamp',
          functionName: 'toUnixTimestamp',
          input: validatedDateTime,
          output: `${TimeHelpers.toUnixTimestamp(validatedDateTime)}`,
          description: t('helpers.timeHelper.toUnixTimestamp'),
          success: true,
        });
      } catch (error) {
        results.push({
          id: 'to-unix-timestamp',
          functionName: 'toUnixTimestamp',
          input: validatedDateTime,
          output: `${t('helpers.timeHelper.error')}: ${error instanceof Error ? error.message : t('helpers.timeHelper.unknownError')}`,
          description: t('helpers.timeHelper.toUnixTimestamp'),
          success: false,
        });
      }

      setTestResults(results);
    } catch (error) {
      console.error('Error running time helper tests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [testInput, setTestResults, setIsLoading, translateUnit, translateFormat]);

  return {
    testInput,
    testResults,
    isLoading,
    runAllTests,
    updateTestInput,
    clearResults,
    resetInput,
  };
}
