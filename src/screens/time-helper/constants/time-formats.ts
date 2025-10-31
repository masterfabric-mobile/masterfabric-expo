export const TIME_FORMATS = {
  iso8601: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
  rfc2822: 'EEE, dd MMM yyyy HH:mm:ss xx',
  short: 'MM/dd/yyyy',
  medium: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  full: 'EEEE, MMMM dd, yyyy',
  'time-short': 'hh:mm a',
  'time-medium': 'hh:mm:ss a',
  'datetime-short': 'MM/dd/yyyy, hh:mm a',
  'datetime-medium': 'MMM dd, yyyy, hh:mm:ss a',
} as const;

export const DATE_FNS_FORMATS = {
  iso8601: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  rfc2822: 'EEE, dd MMM yyyy HH:mm:ss xx',
  short: 'P',
  medium: 'PP',
  long: 'PPP',
  full: 'PPPP',
  'time-short': 'p',
  'time-medium': 'pp',
  'datetime-short': 'Pp',
  'datetime-medium': 'PPpp',
} as const;
