import * as TimeHelpers from 'masterfabric-expo-core/src/helpers/time_helper';

class TimeService {
  private static instance: TimeService;

  static getInstance(): TimeService {
    if (!TimeService.instance) {
      TimeService.instance = new TimeService();
    }
    return TimeService.instance;
  }

  formatDate(date: Date | string, format?: string, locale?: string): string {
    return TimeHelpers.formatDate(date, format, locale);
  }

  getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  getUserLocale(): string {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getCurrentISOString(): string {
    return new Date().toISOString();
  }

  fromNow(date: Date | string, locale?: string): string {
    return TimeHelpers.fromNow(date, locale);
  }

  addTime(date: Date | string, amount: number, unit: string): Date {
    return TimeHelpers.addTime(date, amount, unit);
  }

  subtractTime(date: Date | string, amount: number, unit: string): Date {
    return TimeHelpers.subtractTime(date, amount, unit);
  }

  diff(startDate: Date | string, endDate: Date | string, unit?: string): number {
    return TimeHelpers.diff(startDate, endDate, unit);
  }
}

export const timeService = TimeService.getInstance();
