import type { ThemeColors } from 'masterfabric-expo-core';
import {
  STATUS_BADGE_THEME_KEYS,
  STATUS_I18N,
  UNAVAILABLE_MESSAGE_TO_I18N,
} from '../constants/permissions-helper.constants';

/**
 * Returns i18n key for "unavailable" explanation when core message matches a known reason
 * (Expo Go, Android only, iOS only, etc.). Otherwise returns null (use status.message or generic).
 */
export function getUnavailableReasonI18nKey(
  message: string | undefined
): string | null {
  if (!message || typeof message !== 'string') return null;
  const lower = message.toLowerCase();
  for (const { pattern, i18nKey } of UNAVAILABLE_MESSAGE_TO_I18N) {
    const matches =
      typeof pattern === 'string'
        ? lower.includes(pattern)
        : (pattern as RegExp).test(lower);
    if (matches) return i18nKey;
  }
  return null;
}

export function getPermissionStatusDisplay(
  status: {
    status: string;
    granted: boolean;
    canAskAgain?: boolean;
    message?: string;
  } | null,
  t: (key: string) => string,
  colors: ThemeColors,
  _options?: { permissionKey?: string }
): { label: string; color: string; unavailableExplanation?: string } {
  if (status != null) {
    const s = status.status;
    const key = STATUS_I18N[s] || s;
    const themeKey = STATUS_BADGE_THEME_KEYS[s] ?? 'inactiveText';
    const color = colors[themeKey] ?? colors.inactiveText;
    const unavailableExplanation =
      s === 'unavailable'
        ? (() => {
            const i18nKey = getUnavailableReasonI18nKey(status.message);
            if (!i18nKey) return status.message;
            // Don't show "Not supported in Expo Go" etc. under the card (no subtext)
            if (i18nKey === 'helpers.permissionsHelper.unavailableReasonExpoGo')
              return '';
            return t(i18nKey);
          })()
        : undefined;
    return { label: t(key), color, unavailableExplanation };
  }
  return {
    label: t('helpers.permissionsHelper.notChecked'),
    color: colors.inactiveText,
  };
}
