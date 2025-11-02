import { t } from '@/src/shared/i18n';
import type { DateFormat, TimeUnit } from '../models/time-helper-models';
import { getMonthName } from '../utils/time-formatters';

/**
 * Weekday labels for calendar display (Turkish short format)
 * Pa: Pazartesi, Pt: Salı, Sa: Çarşamba, Ça: Perşembe, Pe: Cuma, Cu: Cumartesi, Ct: Pazar
 */
export const WEEK_DAYS = ['Pa', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'] as const;

/**
 * Format options for time helper picker
 */
export const getFormatOptions = (): { label: string; value: DateFormat }[] => [
  { label: t('helpers.timeHelper.formatIso8601'), value: 'iso8601' },
  { label: t('helpers.timeHelper.formatRfc2822'), value: 'rfc2822' },
  { label: t('helpers.timeHelper.formatShort'), value: 'short' },
  { label: t('helpers.timeHelper.formatMedium'), value: 'medium' },
  { label: t('helpers.timeHelper.formatLong'), value: 'long' },
  { label: t('helpers.timeHelper.formatFull'), value: 'full' },
  { label: t('helpers.timeHelper.formatTimeShort'), value: 'time-short' },
  { label: t('helpers.timeHelper.formatTimeMedium'), value: 'time-medium' },
];

/**
 * Unit options for time helper picker
 */
export const getUnitOptions = (): { label: string; value: TimeUnit }[] => [
  { label: t('helpers.timeHelper.unitDays'), value: 'days' },
  { label: t('helpers.timeHelper.unitHours'), value: 'hours' },
  { label: t('helpers.timeHelper.unitMinutes'), value: 'minutes' },
  { label: t('helpers.timeHelper.unitMonths'), value: 'months' },
  { label: t('helpers.timeHelper.unitYears'), value: 'years' },
];

/**
 * Generate years for dropdown (current year ± 50 years)
 */
export const generateYearOptions = (): { label: string; value: string }[] => {
  const years: { label: string; value: string }[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 50; i <= currentYear + 50; i++) {
    years.push({ label: i.toString(), value: i.toString() });
  }
  return years;
};

/**
 * Generate months for dropdown
 */
export const generateMonthOptions = (locale: string = 'tr-TR'): { label: string; value: number }[] => {
  const months: { label: string; value: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const monthName = getMonthName(i, locale);
    months.push({ label: monthName, value: i });
  }
  return months;
};

/**
 * Generate hours array (0-23)
 */
export const generateHours = (): number[] => {
  const hours: number[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }
  return hours;
};

/**
 * Generate minutes array (0-59)
 */
export const generateMinutes = (): number[] => {
  const minutes: number[] = [];
  for (let i = 0; i < 60; i++) {
    minutes.push(i);
  }
  return minutes;
};

