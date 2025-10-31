export type TimeUnit = 
  | 'years' 
  | 'months' 
  | 'weeks' 
  | 'days' 
  | 'hours' 
  | 'minutes' 
  | 'seconds';

export type DateFormat = 
  | 'iso8601'
  | 'rfc2822'
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'time-short'
  | 'time-medium'
  | 'datetime-short'
  | 'datetime-medium';

export type TimeOperation =
  | 'format'
  | 'fromNow'
  | 'add'
  | 'subtract'
  | 'diff'
  | 'startOf'
  | 'endOf'
  | 'toTimezone'
  | 'isValid'
  | 'isPast'
  | 'isFuture'
  | 'isWeekend'
  | 'addBusinessDays'
  | 'calculateAge'
  | 'getWeekNumber'
  | 'getDaysInMonth'
  | 'isLeapYear'
  | 'toUnixTimestamp';

export interface TimeTestInput {
  dateTime: string;
  timezone: string;
  locale: string;
  operation: TimeOperation;
  format: DateFormat;
  amount: number;
  unit: TimeUnit;
  startDate?: string;
  endDate?: string;
}

export interface TimeTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  description: string;
  success: boolean;
}

export interface TimeHelperState {
  testInput: TimeTestInput;
  testResults: TimeTestResult[];
  isLoading: boolean;
}

export interface TimeHelperPickerItem {
  label: string;
  value: string;
}