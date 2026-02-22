import type { ThemeColors } from 'masterfabric-expo-core';
import { STATUS_BADGE_THEME_KEYS, STATUS_I18N } from '../constants/permissions-helper.constants';

export function getPermissionStatusDisplay(
  status: { status: string; granted: boolean; canAskAgain?: boolean } | null,
  t: (key: string) => string,
  colors: ThemeColors,
  options?: { requestAttempted?: boolean }
): { label: string; color: string } {
  if (!status) return { label: t('helpers.permissionsHelper.notChecked'), color: colors.inactiveText };
  const requestAttempted = options?.requestAttempted === true;
  if (!requestAttempted) {
    return { label: t('helpers.permissionsHelper.notYetRequested'), color: colors.inactiveText };
  }
  const s = status.status;
  const key = STATUS_I18N[s] || s;
  const themeKey = STATUS_BADGE_THEME_KEYS[s] ?? 'inactiveText';
  const color = colors[themeKey] ?? colors.inactiveText;
  return { label: t(key), color };
}
