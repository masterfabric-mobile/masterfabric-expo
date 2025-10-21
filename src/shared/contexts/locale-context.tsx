import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { i18n } from '../i18n';

interface LocaleContextType {
  locale: string;
  changeLocale: (newLocale: string) => boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = '@masterfabric/locale';

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>('en');

  const changeLocale = useCallback((newLocale: string) => {
    try {
      console.log('🌐 Changing locale to', newLocale);
      
      // Validate locale
      if (!['en', 'tr'].includes(newLocale)) {
        console.warn('Unsupported locale:', newLocale);
        return false;
      }
      
      // Update i18n
      i18n.locale = newLocale;
      
      // Save to storage
      AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale).catch(error => {
        console.warn('Failed to save locale:', error);
      });
      
      // Update state
      setLocaleState(newLocale);
      
      console.log('✅ Locale changed successfully to:', newLocale);
      return true;
    } catch (error) {
      console.error('Error changing locale:', error);
      return false;
    }
  }, [setLocaleState]);

  const loadLocale = useCallback(async () => {
    try {
      // First try to load from storage
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      
      if (savedLocale) {
        console.log('📱 Loaded saved locale:', savedLocale);
        changeLocale(savedLocale);
      } else {
        // If no saved locale, use device locale
        let deviceLocale = 'en';
        
        try {
          if (Platform.OS === 'web') {
            // On web, use the browser language
            deviceLocale = navigator.language?.split('-')[0] || 'en';
          } else {
            // On mobile, use expo-localization
            const deviceLocales = getLocales();
            deviceLocale = deviceLocales[0]?.languageCode || 'en';
          }
        } catch (error) {
          console.warn('Failed to get device locale:', error);
          deviceLocale = 'en';
        }
        
        const supportedLocale = ['en', 'tr'].includes(deviceLocale) ? deviceLocale : 'en';
        
        console.log('📱 Using device locale:', supportedLocale);
        changeLocale(supportedLocale);
      }
    } catch (error) {
      console.warn('Failed to load locale:', error);
      changeLocale('en'); // Fallback to English
    }
  }, [changeLocale]);

  useEffect(() => {
    loadLocale();
  }, [loadLocale]);

  

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
