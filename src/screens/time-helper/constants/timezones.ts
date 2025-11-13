import { t } from '@/src/shared/i18n';

export const getTimezones = () => [
  { value: 'UTC', label: t('helpers.timeHelper.timezoneUtc') },
  { value: 'America/New_York', label: t('helpers.timeHelper.timezoneNewYork') },
  { value: 'America/Los_Angeles', label: t('helpers.timeHelper.timezoneLosAngeles') },
  { value: 'America/Chicago', label: t('helpers.timeHelper.timezoneChicago') },
  { value: 'America/Denver', label: t('helpers.timeHelper.timezoneDenver') },
  { value: 'Europe/London', label: t('helpers.timeHelper.timezoneLondon') },
  { value: 'Europe/Paris', label: t('helpers.timeHelper.timezoneParis') },
  { value: 'Europe/Istanbul', label: t('helpers.timeHelper.timezoneIstanbul') },
  { value: 'Asia/Tokyo', label: t('helpers.timeHelper.timezoneTokyo') },
  { value: 'Asia/Shanghai', label: t('helpers.timeHelper.timezoneShanghai') },
  { value: 'Asia/Dubai', label: t('helpers.timeHelper.timezoneDubai') },
  { value: 'Australia/Sydney', label: t('helpers.timeHelper.timezoneSydney') },
];

export const getLocales = () => [
  { value: 'en-US', label: t('helpers.timeHelper.localeEnUs') },
  { value: 'en-GB', label: t('helpers.timeHelper.localeEnGb') },
  { value: 'tr-TR', label: t('helpers.timeHelper.localeTrTr') },
  { value: 'de-DE', label: t('helpers.timeHelper.localeDeDe') },
  { value: 'fr-FR', label: t('helpers.timeHelper.localeFrFr') },
  { value: 'es-ES', label: t('helpers.timeHelper.localeEsEs') },
  { value: 'ja-JP', label: t('helpers.timeHelper.localeJaJp') },
  { value: 'zh-CN', label: t('helpers.timeHelper.localeZhCn') },
];

// Legacy exports for backwards compatibility (deprecated, use getTimezones() and getLocales() instead)
export const TIMEZONES = getTimezones();
export const LOCALES = getLocales();
