/**
 * i18n context — locale state and t() for Recipio
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import en from './locales/en.json';
import tr from './locales/tr.json';
import { storage } from '@/shared/utils/storage';

export type Locale = 'en' | 'tr';

const LOCALE_STORAGE_KEY = '@recipio/locale';

const messages: Record<Locale, Record<string, string>> = {
  en: en as Record<string, string>,
  tr: tr as Record<string, string>,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)),
    text
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    storage.setLocale(next).catch(() => {});
  }, []);

  React.useEffect(() => {
    storage.getLocale().then((saved) => {
      if (saved === 'tr' || saved === 'en') setLocaleState(saved);
    });
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = messages[locale] ?? messages.en;
      const text = dict[key] ?? messages.en[key] ?? key;
      return interpolate(text, params);
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const fallbackT = (key: string, params?: Record<string, string | number>) =>
      interpolate((messages.en as Record<string, string>)[key] ?? key, params);
    return {
      locale: 'en',
      setLocale: () => {},
      t: fallbackT,
    };
  }
  return ctx;
}
