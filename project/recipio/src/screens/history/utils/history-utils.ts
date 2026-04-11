import type { DateFilterType } from '../models/history-models';

export const HISTORY_PLACEHOLDER = {
  title: 'History (Phase 2)',
  subtext: 'Your cooking history will appear here',
} as const;

/** True if ISO date string falls within the given date filter (today / this week / this month). */
export function isInDateRange(dateIso: string, filter: DateFilterType): boolean {
  const d = new Date(dateIso);
  const now = new Date();
  if (Number.isNaN(d.getTime())) return false;

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const startOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  };
  const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

  switch (filter) {
    case 'today':
      return sameDay(d, now);
    case 'thisWeek': {
      const weekStart = startOfWeek(now);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      return d >= weekStart && d <= weekEnd;
    }
    case 'thisMonth': {
      const monthStart = startOfMonth(now);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return d >= monthStart && d <= monthEnd;
    }
    default:
      return true;
  }
}
