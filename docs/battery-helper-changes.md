# Changes Made

## New Feature: Battery Helper

A new "Battery Helper" feature has been implemented, allowing users to view device battery information.

### Details:

*   **`src/screens/helpers/utils/index.ts` Modified:**
    *   A new `HelperItem` for "Battery Helper" was added to the `createDefaultHelperItems` array.
    *   `getHelperIcon` and `getHelperColor` functions were updated to include cases for `'battery-helper'`, using `'battery-charging-outline'` icon and `'#10B981'` color respectively.
*   **Battery Helper Screen Created:**
    *   A new directory `src/screens/battery-helper/` was created.
    *   `src/screens/battery-helper/index.ts` was created to export the screen component.
    *   `src/screens/battery-helper/components/battery-helper-screen.tsx` was created to display battery level, state, and low power mode status.
    *   `src/screens/battery-helper/hooks/use-battery-helper-view-model.ts` was created to handle fetching battery data using `expo-battery`.
    *   `src/screens/battery-helper/styles/battery-helper-screen.styles.ts` was created for screen-specific styling.
*   **Battery Helper Route Created:**
    *   `app/battery-helper.tsx` was created to define the route for the Battery Helper screen.
*   **Translations Added:**
    *   "Battery Helper" translations were added to `src/shared/i18n/translations/en.json` and `src/shared/i18n/translations/tr.json`.
*   **Installed `expo-battery`:**
    *   The `expo-battery` package was installed as a project dependency.

## Bug Fixes (Linting & Runtime Errors)

Several issues identified during development and linting were addressed:

*   **`useLocale` Multiple Export Error:**
    *   The redundant file `src/shared/hooks/use-locale.ts` was deleted.
    *   All imports of `useLocale` across the project (e.g., in `src/screens/onboarding/hooks/use-onboarding-view-model.ts`, `src/screens/home/hooks/use-home-view-model.ts`, `src/navigation/app-navigator.tsx`, `app/(tabs)/_layout.tsx`, etc.) were updated to directly import `useLocale` from `src/shared/contexts/locale-context`.
    *   The `useLocale` export was removed from `src/shared/contexts/index.ts` and `src/shared/hooks/index.ts` to ensure a single source of truth for the export.
*   **`ActivityIndicator` not defined:**
    *   The `ActivityIndicator` component was correctly imported from `react-native` in `src/screens/helpers/components/helpers-screen.tsx`.
*   **Deprecated `expo-battery` APIs:**
    *   Usage of deprecated `Battery.isChargingAsync()` and `Battery.addChargingStateListener()` was removed from `src/screens/battery-helper/hooks/use-battery-helper-view-model.ts`. The charging status is now derived from `Battery.getBatteryStateAsync()`.
    *   The display of `isCharging` was removed from `src/screens/battery-helper/components/battery-helper-screen.tsx` to align with the API changes.