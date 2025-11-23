/**
 * Default input values for Rich Text Helper component cards
 * These values are locale-aware and automatically adapt to the selected language
 * Values are retrieved from i18n translation files
 */

import enTranslations from '@/src/shared/i18n/translations/en.json';
import trTranslations from '@/src/shared/i18n/translations/tr.json';

/**
 * Get translation for a specific locale
 */
const getTranslation = (key: string, locale: 'en' | 'tr'): string => {
  const translations: any = locale === 'tr' ? trTranslations : enTranslations;
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  console.warn(`Translation value is not a string for key: ${key}`);
  return key;
};

/**
 * Get default HTML input value
 */
export const getDefaultHtmlInput = (locale: 'en' | 'tr'): string => {
  return getTranslation('helpers.richTextHelper.defaultValues.html', locale);
};

/**
 * Get default Markdown input value
 */
export const getDefaultMarkdownInput = (locale: 'en' | 'tr'): string => {
  return getTranslation('helpers.richTextHelper.defaultValues.markdown', locale);
};

/**
 * Get default text input value
 */
export const getDefaultTextInput = (locale: 'en' | 'tr'): string => {
  return getTranslation('helpers.richTextHelper.defaultValues.text', locale);
};

/**
 * Get default text extractor input value
 */
export const getDefaultTextExtractorInput = (locale: 'en' | 'tr'): string => {
  return getTranslation('helpers.richTextHelper.defaultValues.textExtractor', locale);
};

/**
 * Get default link processor input value
 */
export const getDefaultLinkProcessorInput = (locale: 'en' | 'tr'): string => {
  return getTranslation('helpers.richTextHelper.defaultValues.linkProcessor', locale);
};

/**
 * Get default sanitizer input value
 */
export const getDefaultSanitizerInput = (locale: 'en' | 'tr'): string => {
  return getTranslation('helpers.richTextHelper.defaultValues.sanitizer', locale);
};

/**
 * Get default pattern highlighter values
 */
export const getDefaultPatternHighlighterValues = (locale: 'en' | 'tr') => {
  return {
    text: getTranslation('helpers.richTextHelper.defaultValues.patternHighlighter.text', locale),
    searchTerms: getTranslation('helpers.richTextHelper.defaultValues.patternHighlighter.searchTerms', locale),
  };
};

