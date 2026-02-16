import { t } from '@/src/shared/i18n';
import { LocalNotificationHelperView } from 'masterfabric-expo-core';

export function LocalNotificationHelperScreen() {
  const translate = (key: string, options?: Record<string, string | number>) =>
    t(`helpers.localNotificationHelper.${key}`, options);
  return <LocalNotificationHelperView translate={translate} />;
}
