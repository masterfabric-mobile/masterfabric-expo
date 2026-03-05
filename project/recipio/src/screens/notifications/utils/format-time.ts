/**
 * Returns a relative time label for notifications (e.g. "1 hour ago", "Yesterday").
 * Used with i18n keys: notifications.timeJustNow, notifications.timeMinutesAgo, etc.
 */
export function getRelativeTimeKey(isoDate: string): {
  key: string;
  count?: number;
} {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 1) return { key: 'notifications.timeJustNow' };
  if (diffMins < 60) return { key: 'notifications.timeMinutesAgo', count: diffMins };
  if (diffHours < 24) return { key: 'notifications.timeHoursAgo', count: diffHours };
  if (diffDays === 1) return { key: 'notifications.timeYesterday' };
  if (diffDays < 7) return { key: 'notifications.timeDaysAgo', count: diffDays };
  return { key: 'notifications.timeLongAgo' };
}
