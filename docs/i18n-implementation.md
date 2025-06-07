# Internationalization (i18n) Implementation Guide

This document outlines the complete internationalization implementation for the MasterFabric Expo project.

## Overview

The application now fully supports internationalization with English and Turkish languages. All user-facing text, error messages, accessibility labels, and validation messages have been converted to use the i18n system.

## Languages Supported

- **English (en)** - Default language
- **Turkish (tr)** - Secondary language

## File Structure

```
src/shared/i18n/
├── index.ts                 # Main i18n configuration and functions
└── translations/
    ├── en.json             # English translations
    └── tr.json             # Turkish translations
```

## Key Features

### 1. Translation System
- **Translation Function**: `t(key, options?)` - Main function for getting translations
- **Dynamic Locale Switching**: `changeLocale(locale)` - Change language at runtime
- **Locale Information**: `getCurrentLocale()` and `getLocaleDisplayName(locale)`
- **Error Handling**: Graceful fallback to key name if translation is missing

### 2. Translation Keys Structure

```json
{
  "app": {
    "name": "App name",
    "tagline": "App tagline"
  },
  "common": {
    "ok": "OK",
    "cancel": "Cancel",
    "save": "Save",
    "loading": "Loading...",
    "retry": "Try Again",
    "close": "Close"
  },
  "errors": {
    "network": "Network error message",
    "unknown": "Unknown error message",
    "somethingWentWrong": "Something went wrong",
    "unexpectedError": "An unexpected error occurred"
  },
  "validation": {
    "nameMinLength": "Name validation message",
    "emailInvalid": "Email validation message",
    "passwordMinLength": "Password validation message",
    "passwordsNoMatch": "Password confirmation message"
  },
  "accessibility": {
    "closeModal": "Close modal",
    "modalDialog": "Modal dialog",
    "loadingIndicator": "Loading indicator"
  },
  "settings": {
    "language": "Language",
    "switchTo": "Switch to"
  }
}
```

## Updated Components

### 1. Screen Components
- **SplashScreen** - App name and tagline
- **HomeScreen** - Greetings, section titles, and action descriptions
- **ExploreScreen** - All section content and descriptions
- **NotFoundScreen** - Error message and navigation text

### 2. Shared Components
- **ErrorBoundary** - Error messages and retry button
- **Loading** - Loading text and accessibility labels
- **AccessibleModal** - Accessibility labels and close button
- **LanguageSwitcher** - Language selection interface

### 3. Navigation
- **TabLayout** - Tab titles
- **AppNavigator** - Screen titles
- **NavigationContainer** - Document title format

### 4. Models and Data
- **HomeModels** - User and action data with translations

## Implementation Details

### 1. Translation Usage

```tsx
import { t } from '@/src/shared/i18n';

// Basic usage
const title = t('home.title');

// With interpolation
const greeting = t('greetings.hello', { name: 'John' });

// With fallback
const text = t('some.key') || 'Default Text';
```

### 2. Validation Schemas

```tsx
// Factory functions for i18n support
export const createLoginSchema = () => z.object({
  email: z.string().email(t('validation.emailInvalid')),
  password: z.string().min(6, t('validation.passwordMinLength')),
});
```

### 3. Language Switching

```tsx
import { LanguageSwitcher } from '@/src/shared/components';

// In your settings screen or header
<LanguageSwitcher onLanguageChange={(locale) => {
  // Handle language change if needed
  console.log('Language changed to:', locale);
}} />
```

## Best Practices

### 1. Translation Keys
- Use hierarchical structure: `section.subsection.key`
- Keep keys descriptive and consistent
- Group related translations together

### 2. Component Implementation
- Always import `t` function where translations are needed
- Use interpolation for dynamic content: `t('key', { variable: value })`
- Provide meaningful accessibility labels

### 3. Error Handling
- The system gracefully handles missing keys by returning the key itself
- Console warnings are logged for missing translations during development

## Testing the Implementation

1. **Language Switching**: Use the `LanguageSwitcher` component to test locale changes
2. **Screen Navigation**: Navigate through all screens to verify translations
3. **Error States**: Test error boundaries and loading states
4. **Accessibility**: Use screen readers to test accessibility labels

## Adding New Languages

1. Create a new translation file: `src/shared/i18n/translations/[locale].json`
2. Copy the structure from `en.json` and translate all values
3. Import and add to the i18n configuration in `src/shared/i18n/index.ts`
4. Update the `getLocaleDisplayName` function with the new locale

## Adding New Translations

1. Add the key-value pair to all translation files
2. Use the new key in your components with `t('your.new.key')`
3. Test to ensure the translation displays correctly

## Migration Notes

- All hardcoded strings have been replaced with translation calls
- Legacy validation schemas are preserved for backward compatibility
- New factory functions provide i18n-compatible schemas
- Accessibility labels now use translations for better localization

## Performance Considerations

- Translations are loaded at app startup
- No network requests required for translations
- Minimal impact on app performance
- Translations are cached in memory

## Future Enhancements

- Add more languages as needed
- Implement right-to-left (RTL) support for Arabic/Hebrew
- Add pluralization support for complex number formatting
- Consider using translation management services for larger teams
