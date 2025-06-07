import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { changeLocale as changeI18nLocale, getCurrentLocale } from '../i18n';

interface LocaleContextType {
  locale: string;
  changeLocale: (newLocale: string) => boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState(getCurrentLocale());

  const changeLocale = useCallback((newLocale: string) => {
    console.log('LocaleProvider: Changing locale to', newLocale);
    const success = changeI18nLocale(newLocale);
    if (success) {
      setLocale(newLocale);
      console.log('LocaleProvider: Locale changed successfully to', newLocale);
    } else {
      console.warn('LocaleProvider: Failed to change locale to', newLocale);
    }
    return success;
  }, []);

  const value = {
    locale,
    changeLocale,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
