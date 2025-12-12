// URL Launcher Helper utilities
import { t } from '@/src/shared/i18n';

/**
 * Get URL Launcher Helper icon name
 */
export const getUrlLauncherHelperIcon = (): string => 'link-outline';

/**
 * Get URL Launcher Helper color
 */
export const getUrlLauncherHelperColor = (): string => '#007AFF';

/**
 * Format timestamp to time string
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

/**
 * Format timestamp to date and time string
 */
export const formatTimestampFull = (timestamp: number): { dateString: string; timeString: string } => {
  const date = new Date(timestamp);
  return {
    dateString: date.toLocaleDateString(),
    timeString: date.toLocaleTimeString(),
  };
};

/**
 * Build copy text from launch result
 */
export const buildCopyText = (result: {
  functionName: string;
  input: string;
  output: string;
  timestamp: number;
  success: boolean;
}): string => {
  const { dateString, timeString } = formatTimestampFull(result.timestamp);
  const functionNameKey = `helpers.urlLauncherHelper.functionNames.${result.functionName}`;
  const functionName = t(functionNameKey, { defaultValue: result.functionName });
  
  return [
    `${t('helpers.urlLauncherHelper.copyText.type')}: ${functionName}()`,
    `${t('helpers.urlLauncherHelper.copyText.input')}: ${result.input || '-'}`,
    `${t('helpers.urlLauncherHelper.copyText.output')}: ${result.output || '-'}`,
    `${t('helpers.urlLauncherHelper.copyText.time')}: ${dateString} ${timeString}`,
    `${t('helpers.urlLauncherHelper.copyText.status')}: ${result.success ? t('helpers.urlLauncherHelper.messages.success') : t('helpers.urlLauncherHelper.messages.failure')}`,
  ].join('\n');
};

/**
 * Check if email can be launched (recipient OR subject/body)
 */
export const canLaunchEmail = (testInput: {
  email?: string;
  emailSubject?: string;
  emailBody?: string;
}): boolean => {
  return !!(testInput.email || testInput.emailSubject || testInput.emailBody);
};

