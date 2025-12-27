# Architecture

Recipio application architecture, project structure, navigation, and state management.

## MasterFabric Expo Core Integration

The Recipio project uses the `masterfabric-expo-core` package to access shared helpers, components, and utilities from a central location. This package will be used across all pages, and the necessary helpers and views will come from here.

### Package Location

```
packages/masterfabric-expo-core/
```

### Usage in Recipio

All screens and shared code in the Recipio project import the necessary components, helpers, and hooks from the `masterfabric-expo-core` package.

### Available Exports from masterfabric-expo-core

**Components:**
- `ThemedView` - Theme-aware View component
- `ThemedText` - Theme-aware Text component
- `ScreenHeader` - Reusable screen header component
- `MasterView` - Core MasterView component
- `BatteryHelper` - Battery status components
- `OnboardingHelper` - Onboarding flow components

**Hooks:**
- `useMasterView` - Main MasterView hook for activity tracking, theme, locale management
- `useBatteryHelper` - Battery status hook
- `useOnboardingHelperViewModel` - Onboarding helper hook
- `useThemeColors` - Theme colors hook

**Helpers:**
- `accessibility` - Accessibility utilities
- `batteryHelper` - Battery management helpers
- `connectivity` - Network connectivity helpers
- `device-info` - Device information helpers
- `logger_helper` - Logging utilities
- `onboarding_helper` - Onboarding flow helpers
- `permissions` - Permission management helpers
- `platform` - Platform detection utilities
- `rich_text_helper` - Rich text formatting helpers
- `snackbar_helper` - Snackbar notification helpers
- `string_helper` - String manipulation utilities
- `time_helper` - Time formatting and manipulation
- `toast_helper` - Toast notification helpers
- `typography_helper` - Typography utilities
- `url_launcher_helper` - URL launching helpers
- `validator_helper` - Form validation helpers

**Stores:**
- `batteryStore` - Battery state management
- `MasterViewStore` - Global MasterView state
- `onboardingStore` - Onboarding state management

**Utils:**
- `formatting` - Data formatting utilities
- `navigation` - Navigation utilities
- `storage` - AsyncStorage utilities
- `validation` - Validation utilities

**Types:**
- Core types for MasterView, User, Theme, Activity tracking, etc.

**Constants:**
- `Colors` - Theme color constants
- `MasterViewConfig` - MasterView configuration
- `Sizing` - Size constants

**Contexts:**
- `ThemeContext` - Theme context provider

**Integrations:**
- `FirebaseIntegration` - Firebase integration
- `SentryIntegration` - Sentry error tracking integration
- `SupabaseIntegration` - Supabase integration

### Integration Pattern

The `masterfabric-expo-core` package is used in the Recipio project as follows:

1. **Shared Components**: Recipio's own shared components can wrap or extend components from masterfabric-expo-core
2. **Helpers**: Required helpers are imported directly from masterfabric-expo-core
3. **Hooks**: Hooks like useMasterView are used in screens
4. **Stores**: masterfabric-expo-core stores can be used for global state

### Example Usage

```typescript
// In a screen component
import { ThemedText, useMasterView, useThemeColors } from 'masterfabric-expo-core';
import { ScreenHeader } from 'masterfabric-expo-core';

export function DashboardScreen() {
  const { trackActivity } = useMasterView();
  const colors = useThemeColors();
  
  useEffect(() => {
    trackActivity('dashboard_viewed');
  }, [trackActivity]);
  
  return (
    <View>
      <ScreenHeader title="Dashboard" />
      <ThemedText>Welcome</ThemedText>
    </View>
  );
}
```

```typescript
// In a screen logic hook (uses MasterFabric helpers)
import { useMasterView, logger_helper, time_helper } from 'masterfabric-expo-core';

export function useRecipeViewModel() {
  const { trackActivity } = useMasterView(); // MasterFabric activity tracking
  const log = logger_helper;
  const formatTime = time_helper.formatTime;
  
  // Use helpers and hooks from masterfabric-expo-core
}
```

### When to Use masterfabric-expo-core vs Shared

- **masterfabric-expo-core**: General-purpose components, helpers, and utilities that can be used across all projects
- **src/shared**: Recipio-specific, domain-specific code (recipe service, ingredient types, etc.)

This separation ensures that general utilities remain in the package, while project-specific code is kept in the shared folder.

## Project Structure

```
project/recipio/
├── app/
│   ├── _layout.tsx
│   ├── splash.tsx
│   ├── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── favorites.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   ├── ingredient-entry.tsx
│   ├── recipe-suggestions.tsx
│   ├── recipe-detail/[recipeId].tsx
│   └── cooking-mode/[recipeId].tsx
│
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   │
│   ├── navigation/
│   │   ├── app-navigator.tsx
│   │   ├── navigation-container.tsx
│   │   ├── navigation-config.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── screens/
│   │   ├── splash/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── ingredient-entry/
│   │   ├── recipe-suggestions/
│   │   ├── recipe-detail/
│   │   ├── cooking-mode/
│   │   ├── favorites/
│   │   ├── history/
│   │   ├── profile/
│   │   └── search/
│   │
│   └── shared/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── types/
│       ├── constants/
│       ├── utils/
│       ├── i18n/
│       ├── contexts/
│       └── helpers/
│
└── packages/
    └── masterfabric-expo-core/    # Shared package for components, helpers, and utilities
        ├── components/           # ThemedView, ThemedText, ScreenHeader, etc.
        ├── helpers/              # Helper functions (logger, time, string, etc.)
        ├── hooks/                # useMasterView, useBatteryHelper, etc.
        ├── stores/               # Global stores (MasterViewStore, etc.)
        ├── utils/                # Utility functions
        ├── types/                # TypeScript types
        ├── constants/            # Constants (Colors, Sizing, etc.)
        └── integrations/         # Firebase, Sentry, Supabase integrations
```

**Note:** The `masterfabric-expo-core` package is located in the `packages/` folder in the monorepo structure, and the Recipio project uses components, helpers, and utilities from this package.

## Screen Structure

Each screen follows this standard structure using MasterFabric MasterView pattern:

```
src/screens/{screen-name}/
├── components/                   # Screen-specific UI components
│   ├── {screen}-screen.tsx       # Main screen component (uses MasterView)
│   ├── {sub-component}.tsx       # Sub-components
│   └── sections/                 # Optional: Section components
│       └── {section}-section.tsx
│
├── hooks/                        # MasterView hooks and screen logic
│   └── use-{screen}-view-model.ts  # Screen-specific logic hook (uses useMasterView)
│
├── store/                        # Screen-specific store (optional)
│   └── {screen}-store.ts         # Zustand store for screen state
│
├── models/                       # TypeScript types and interfaces
│   └── {screen}-models.ts        # Screen-specific type definitions
│
├── styles/                       # Screen-specific styles
│   ├── {screen}-screen.styles.ts
│   ├── {component}.styles.ts     # Component-specific styles
│   └── ...
│
├── utils/                        # Screen-specific utilities
│   └── index.ts                  # Helper functions for this screen
│
└── index.ts                      # Central export file
```

### Example: Splash Screen Structure

```
src/screens/splash/
├── components/
│   ├── splash-screen.tsx         # Main splash screen component
│   ├── package-info.tsx          # Package information component
│   ├── version-info.tsx          # Version display component
│   └── sections/                 # Section components
│       ├── info-section.tsx
│       ├── logo-section.tsx
│       └── progress-section.tsx
│
├── hooks/
│   └── use-splash-view-model.ts  # Screen logic hook (uses useMasterView)
│       # - Manages splash initialization logic
│       # - Handles progress tracking
│       # - Controls navigation flow
│       # - Uses useMasterView for activity tracking, theme, locale
│
├── store/
│   └── splash-store.ts           # Zustand store
│       # - isLoading state
│       # - progress state
│       # - currentStep state
│       # - completedSteps array
│
├── models/
│   └── splash-models.ts          # TypeScript interfaces
│       # - SplashStep interface
│       # - SplashConfig interface
│       # - SplashState interface
│       # - NavigationState interface
│
├── styles/
│   ├── splash-screen.styles.ts
│   ├── package-info.styles.ts
│   ├── version-info.styles.ts
│   ├── info-section.styles.ts
│   ├── logo-section.styles.ts
│   ├── progress-section.styles.ts
│   └── stage-badge.styles.ts
│
├── utils/
│   └── index.ts                  # Utility functions
│       # - createSplashSteps()
│       # - calculateTotalDuration()
│       # - getProgressPercentage()
│       # - isValidSplashStep()
│       # - getStepById()
│       # - getLoadingMessage()
│
└── index.ts                      # Exports all public APIs
    # - SplashScreen component
    # - useSplashViewModel hook
    # - useSplashStore hook
    # - All models
    # - All components
    # - All utilities
```

### Screen Structure Guidelines

**Components Folder:**
- Main screen component: `{screen}-screen.tsx`
- Sub-components: `{component-name}.tsx`
- Complex screens may have `sections/` subfolder for organized section components
- Each component should be self-contained and reusable within the screen

**Hooks Folder:**
- Screen logic hook: `use-{screen}-view-model.ts`
- Uses `useMasterView` from masterfabric-expo-core for activity tracking, theme, locale
- Contains screen-specific business logic
- Manages state, API calls, navigation logic
- Returns data and handlers for the component

**Store Folder (Optional):**
- Screen-specific Zustand store: `{screen}-store.ts`
- Use when screen has complex local state
- For simple state, use React useState in screen logic hook
- Store should only contain screen-specific state, not global app state
- Global state uses MasterViewStore from masterfabric-expo-core

**Models Folder:**
- TypeScript interfaces and types: `{screen}-models.ts`
- All screen-specific type definitions
- Shared types should go in `src/shared/types/`

**Styles Folder:**
- StyleSheet definitions for components
- One style file per component: `{component}.styles.ts`
- Use StyleSheet.create() for performance
- Keep styles close to components

**Utils Folder:**
- Screen-specific utility functions: `index.ts`
- Helper functions used only within this screen
- Shared utilities should go in `src/shared/utils/`

**Index File (REQUIRED):**
- **MUST exist** in every screen folder: `src/screens/{screen-name}/index.ts`
- Central export point for the screen
- Exports all public APIs (components, hooks, stores, models, utils)
- Allows clean imports: `import { SplashScreen } from '@/screens/splash'`
- **Without index.ts, imports will fail** and cause "Cannot find module" errors
- Route files in `app/` should import from screen folders using index: `import { ScreenName } from '@/screens/screen-name'`

## Navigation Structure (CRITICAL - MUST FOLLOW)

 
> Route errors are the most common issues in Expo Router apps. This section defines the EXACT structure and patterns you MUST follow. Any deviation will cause route errors.

### Navigation Folder Structure 

**The `src/navigation/` folder MUST exist and contain the following structure:**

```
src/navigation/
├── index.ts                    # REQUIRED: Central export for all navigation utilities
├── app-navigator.tsx           # Main app navigator component
├── navigation-container.tsx    # Navigation container wrapper
├── navigation-config.ts        # Navigation configuration (screen options, animations, deep linking)
├── types.ts                    # Navigation TypeScript types
└── utils.ts                    # Navigation utility functions
```

**Why this is critical:**
- Centralizes all navigation logic in one place
- Prevents route errors and navigation conflicts
- Ensures consistent navigation behavior across the app
- Makes navigation configuration maintainable

### Navigation Index Export 

**Every navigation file MUST be exported through `src/navigation/index.ts`:**

```typescript
// src/navigation/index.ts
export { AppNavigator } from './app-navigator';
export { NavigationContainer } from './navigation-container';
export { navigationConfig } from './navigation-config';
export { navigationUtils } from './utils';
export type { RootStackParamList, TabParamList } from './types';
```

**Usage:**
```typescript
// Import from navigation index
import { AppNavigator, navigationConfig } from '@/navigation';
```

### Route Files and Index Exports (CRITICAL - NO ERRORS ALLOWED)

**This is the MOST CRITICAL part to prevent route errors. Follow these rules EXACTLY:**

#### Rule 1: Every Screen Folder MUST Have index.ts

**Structure:**
```
src/screens/{screen-name}/
├── components/
│   └── {screen-name}-screen.tsx
├── hooks/
│   └── use-{screen-name}-view-model.ts
├── store/
│   └── {screen-name}-store.ts
├── models/
│   └── {screen-name}-models.ts
├── styles/
│   └── {screen-name}-screen.styles.ts
├── utils/
│   └── index.ts
└── index.ts                    # ⚠️ REQUIRED - MUST EXIST
```

#### Rule 2: index.ts MUST Export All Public APIs

**Example `src/screens/splash/index.ts`:**
```typescript
// Components
export { SplashScreen } from './components/splash-screen';

// Hooks
export { useSplashViewModel } from './hooks/use-splash-view-model';

// Store
export { useSplashStore } from './store/splash-store';

// Models (types)
export type {
  SplashStep,
  SplashConfig,
  SplashState,
} from './models/splash-models';

// Styles
export { splashScreenStyles } from './styles/splash-screen.styles';

// Utils
export {
  createSplashSteps,
  calculateTotalDuration,
} from './utils';
```

#### Rule 3: Route Files MUST Import from Screen Index

**✅ CORRECT - Route file imports from index:**
```typescript
// app/splash.tsx
import { SplashScreen } from '@/screens/splash';  // ✅ Uses index.ts

export default SplashScreen;
```

**❌ WRONG - Direct import from component:**
```typescript
// app/splash.tsx
import { SplashScreen } from '@/screens/splash/components/splash-screen';  // ❌ ERROR!

export default SplashScreen;
```

#### Rule 4: All Route Files Must Follow This Pattern

**Every route file in `app/` folder:**
```typescript
// app/{route-name}.tsx
import { ScreenComponent } from '@/screens/{screen-name}';  // Always from index

export default ScreenComponent;
```

**Examples:**
```typescript
// app/splash.tsx
import { SplashScreen } from '@/screens/splash';
export default SplashScreen;

// app/onboarding.tsx
import { OnboardingScreen } from '@/screens/onboarding';
export default OnboardingScreen;

// app/ingredient-entry.tsx
import { IngredientEntryScreen } from '@/screens/ingredient-entry';
export default IngredientEntryScreen;
```

### Why Index Exports Are Critical

**Without proper index.ts files, you WILL get these errors:**
1. ❌ `Cannot find module '@/screens/splash'`
2. ❌ `Module not found: Can't resolve '@/screens/onboarding'`
3. ❌ `Attempted import error: '@/screens/...' is not exported`
4. ❌ Route files fail to load, causing app crashes

**With proper index.ts files:**
1. ✅ Clean imports: `import { Screen } from '@/screens/screen-name'`
2. ✅ Type safety: All exports are properly typed
3. ✅ No route errors: All routes can find their components
4. ✅ Maintainable: Change internal structure without breaking imports

### Initial Route Configuration (MasterFabric Expo Pattern)

The app uses Expo Router's file-based routing following the **MasterFabric Expo navigation pattern**. The initial route flow is:

1. **App starts** → `app/index.tsx` redirects to `/splash`
2. **Splash Screen** → `app/splash.tsx` → `src/screens/splash/` (initial screen)
3. **Navigation Decision** → `shouldShowOnboarding()` check in splash view model
   - **First-time users** → `app/onboarding.tsx` → `src/screens/onboarding/`
   - **Returning users** → `app/(tabs)/index.tsx` → `src/screens/home/`
4. **Main App** → `app/(tabs)/index.tsx` (home screen after onboarding or directly from splash)

**Navigation Implementation:**

```typescript
// src/screens/splash/hooks/use-splash-view-model.ts
const navigateToNextScreen = async () => {
  if (await shouldShowOnboarding()) {
    router.push('/onboarding');  // First-time users
  } else {
    navigationUtils.replace('(tabs)');  // Returning users → Home
  }
};
```

**Important:** 
- The splash screen uses `shouldShowOnboarding()` from `masterfabric-expo-core` to determine navigation
- Navigation uses centralized utilities from `src/navigation/utils.ts`
- First-time users: `router.push('/onboarding')` (allows back navigation)
- Returning users: `navigationUtils.replace('(tabs)')` (replaces splash, no back navigation)
- Each screen folder in `src/screens/` must have an `index.ts` file for proper exports
- Route files in `app/` should import from screen folders using the index export: `import { ScreenName } from '@/screens/screen-name'`

### Route Structure

```
app/
├── _layout.tsx           # Root layout
├── splash.tsx            # Splash screen
├── onboarding.tsx        # Onboarding
├── (tabs)/               # Tab group
│   ├── _layout.tsx
│   ├── index.tsx         # Dashboard
│   ├── favorites.tsx
│   ├── history.tsx
│   └── profile.tsx
├── ingredient-entry.tsx
├── recipe-suggestions.tsx
├── recipe-detail/[recipeId].tsx       # Dynamic: /recipe-detail/123
├── cooking-mode/[recipeId].tsx        # Dynamic: /cooking-mode/123
└── search.tsx
```

### Root Layout

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="recipe-detail/[recipeId]" />
      <Stack.Screen name="cooking-mode/[recipeId]" />
    </Stack>
  );
}
```

### Navigation Usage (MasterFabric Expo Pattern)

**Recommended: Use Centralized Navigation Utilities**

```typescript
// ✅ RECOMMENDED - Use centralized navigation utilities
import { navigationUtils } from '@/navigation';

export function RecipeCard({ recipeId }: { recipeId: string }) {
  const handlePress = () => {
    // Type-safe navigation using navigationUtils
    navigationUtils.navigate('recipe-detail', { recipeId });
  };
  
  return <TouchableOpacity onPress={handlePress}>...</TouchableOpacity>;
}
```

**Alternative: Direct Expo Router Usage**

```typescript
// Alternative - Direct Expo Router usage (also valid)
import { useRouter } from 'expo-router';

export function RecipeCard({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/recipe-detail/${recipeId}`);
  };
  
  return <TouchableOpacity onPress={handlePress}>...</TouchableOpacity>;
}
```

**Navigation Utilities Available:**

```typescript
// From src/navigation/utils.ts
import { navigationUtils } from '@/navigation';

// Navigate to a screen (pushes to stack)
navigationUtils.navigate('(tabs)');
navigationUtils.navigate('recipe-detail', { recipeId: '123' });

// Replace current screen (replaces in stack)
navigationUtils.replace('(tabs)');  // Used for splash → home

// Go back
navigationUtils.goBack();

// Go to home (tabs)
navigationUtils.goToHome();

// Go to splash
navigationUtils.goToSplash();

// Check if can go back
if (navigationUtils.canGoBack()) {
  navigationUtils.goBack();
}
```

**Screen Navigation Pattern:**

```typescript
// In screen view model hooks (e.g., use-splash-view-model.ts)
import { navigationUtils } from '@/navigation';
import { router } from 'expo-router';
import { shouldShowOnboarding } from 'masterfabric-expo-core';

export function useSplashViewModel() {
  const navigateToNextScreen = async () => {
    if (await shouldShowOnboarding()) {
      router.push('/onboarding');  // First-time users
    } else {
      navigationUtils.replace('(tabs)');  // Returning users
    }
  };
  
  return { navigateToNextScreen };
}
```

### Common Route Errors and Solutions

**Error: Route not found / Cannot find route**
- **Cause:** Missing route file in `app/` folder or incorrect route path
- **Solution:** Ensure route file exists in `app/` folder matching the route name (e.g., `app/onboarding.tsx` for `/onboarding`)

**Error: Cannot find module '@/screens/screen-name'**
- **Cause:** Missing `index.ts` file in screen folder
- **Solution:** 
  1. **CRITICAL:** Create `index.ts` in `src/screens/{screen-name}/` 
  2. Export ALL public APIs (components, hooks, stores, models, utils)
  3. Route files MUST import from index: `import { Screen } from '@/screens/screen-name'`
  4. **NEVER** import directly from component files in route files

**Error: Module not found: src/navigation**
- **Cause:** Missing `src/navigation/` folder
- **Solution:** 
  1. **CRITICAL:** Create `src/navigation/` folder with required files
  2. Create `index.ts` that exports all navigation utilities
  3. Ensure `app-navigator.tsx`, `navigation-config.ts`, `types.ts`, `utils.ts` exist
  4. Import navigation utilities from `@/navigation` (not direct paths)

**Error: Navigation from splash to onboarding fails**
- **Cause:** Route path incorrect or onboarding route not registered
- **Solution:** 
  - Use `router.replace('/onboarding')` (not `router.push`)
  - Ensure `app/onboarding.tsx` exists
  - Ensure onboarding route is registered in `_layout.tsx` Stack

**Error: Dynamic route [id] not working**
- **Cause:** Expo Router requires specific naming for dynamic routes
- **Solution:** Use descriptive parameter names like `[recipeId].tsx` instead of `[id].tsx` for better clarity and to avoid conflicts

### ⚠️ CRITICAL CHECKLIST - Prevent Route Errors

**Before creating any new screen, ensure:**

1. ✅ **Navigation folder exists:** `src/navigation/` with `index.ts`
2. ✅ **Screen folder has index.ts:** `src/screens/{screen-name}/index.ts` exists
3. ✅ **All exports in index.ts:** Components, hooks, stores, models, utils exported
4. ✅ **Route file imports from index:** `import { Screen } from '@/screens/screen-name'`
5. ✅ **Route file exists:** `app/{route-name}.tsx` exists
6. ✅ **Route registered in _layout.tsx:** Stack.Screen name matches route file

**If ANY of these are missing, you WILL get route errors!**

### Quick Reference: Route and Index Export Pattern

**For every new screen, follow this EXACT pattern:**

1. **Create screen folder structure:**
   ```
   src/screens/my-screen/
   ├── components/
   │   └── my-screen-screen.tsx
   ├── hooks/
   │   └── use-my-screen-view-model.ts
   ├── store/
   │   └── my-screen-store.ts
   ├── models/
   │   └── my-screen-models.ts
   ├── styles/
   │   └── my-screen-screen.styles.ts
   ├── utils/
   │   └── index.ts
   └── index.ts  ⚠️ REQUIRED
   ```

2. **Create index.ts with all exports:**
   ```typescript
   // src/screens/my-screen/index.ts
   export { MyScreenScreen } from './components/my-screen-screen';
   export { useMyScreenViewModel } from './hooks/use-my-screen-view-model';
   export { useMyScreenStore } from './store/my-screen-store';
   export type { MyScreenState } from './models/my-screen-models';
   export { myScreenStyles } from './styles/my-screen-screen.styles';
   export { helperFunction } from './utils';
   ```

3. **Create route file:**
   ```typescript
   // app/my-screen.tsx
   import { MyScreenScreen } from '@/screens/my-screen';  // ✅ From index
   
   export default MyScreenScreen;
   ```

4. **Register route in _layout.tsx:**
   ```typescript
   <Stack.Screen name="my-screen" />
   ```

**This pattern prevents ALL route errors!**

## Screen Transitions & Navigation Flow (MasterFabric Expo Pattern)

This section provides a detailed analysis of screen transitions and navigation flow, similar to usage analytics tools like Stitch. It shows how users navigate through the app and the transitions between screens.

### Complete Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    APP LAUNCH SEQUENCE                          │
└─────────────────────────────────────────────────────────────────┘

1. App Launch
   │
   ├─→ app/index.tsx
   │   └─→ <Redirect href="/splash" />
   │
   └─→ app/splash.tsx
       │
       ├─→ src/screens/splash/components/splash-screen.tsx
       │   └─→ src/screens/splash/hooks/use-splash-view-model.ts
       │       │
       │       ├─→ Initialize App Services
       │       ├─→ Load Fonts & Assets
       │       ├─→ Check Authentication
       │       └─→ Check Onboarding Status
       │
       └─→ Navigation Decision Point
           │
           ├─→ [First-Time User]
           │   │
           │   └─→ app/onboarding.tsx
           │       │
           │       ├─→ src/screens/onboarding/components/onboarding-screen.tsx
           │       │   └─→ src/screens/onboarding/hooks/use-onboarding-view-model.ts
           │       │
           │       └─→ [Onboarding Complete]
           │           │
           │           └─→ app/(tabs)/index.tsx (Home)
           │
           └─→ [Returning User]
               │
               └─→ app/(tabs)/index.tsx (Home)
                   │
                   └─→ src/screens/home/components/home-screen.tsx
```

### Screen Transition Matrix

| From Screen | To Screen | Navigation Method | Trigger | Animation |
|------------|-----------|-------------------|---------|-----------|
| **App Launch** | **Splash** | Redirect | App start | None |
| **Splash** | **Onboarding** | `router.push('/onboarding')` | First-time user | Default |
| **Splash** | **Home (Tabs)** | `navigationUtils.replace('(tabs)')` | Returning user | Default |
| **Onboarding** | **Home (Tabs)** | `navigationUtils.replace('(tabs)')` | Onboarding complete | Default |
| **Home** | **Ingredient Entry** | `navigationUtils.navigate('ingredient-entry')` | User action | Default |
| **Ingredient Entry** | **Recipe Suggestions** | `navigationUtils.navigate('recipe-suggestions')` | Find recipes | Default |
| **Recipe Suggestions** | **Recipe Detail** | `navigationUtils.navigate('recipe-detail', { recipeId })` | Recipe selection | Default |
| **Recipe Detail** | **Cooking Mode** | `navigationUtils.navigate('cooking-mode', { recipeId })` | Start cooking | Default |
| **Home** | **Favorites** | Tab navigation | Tab selection | Tab transition |
| **Home** | **History** | Tab navigation | Tab selection | Tab transition |
| **Home** | **Profile** | Tab navigation | Tab selection | Tab transition |
| **Favorites** | **Recipe Detail** | `navigationUtils.navigate('recipe-detail', { recipeId })` | Recipe selection | Default |
| **History** | **Recipe Detail** | `navigationUtils.navigate('recipe-detail', { recipeId })` | Recipe selection | Default |
| **Search** | **Recipe Detail** | `navigationUtils.navigate('recipe-detail', { recipeId })` | Recipe selection | Default |
| **Any Screen** | **Previous** | `navigationUtils.goBack()` | Back button/gesture | Back animation |

### Navigation Flow Analysis

#### 1. Initial App Flow (Cold Start)

**Path:** `App Launch → Splash → [Decision] → Onboarding/Home`

**Duration:**
- Splash screen: ~2-3 seconds (initialization)
- Onboarding: ~30-60 seconds (user interaction)
- Total cold start: ~3-5 seconds

**Key Decisions:**
- `shouldShowOnboarding()` check determines navigation path
- First-time users: Splash → Onboarding → Home
- Returning users: Splash → Home (direct)

**Implementation:**
```typescript
// src/screens/splash/hooks/use-splash-view-model.ts
const navigateToNextScreen = async () => {
  if (await shouldShowOnboarding()) {
    router.push('/onboarding');  // First-time users
  } else {
    navigationUtils.replace('(tabs)');  // Returning users
  }
};
```

#### 2. Main App Flow (Tabs Navigation)

**Path:** `Home ↔ Favorites ↔ History ↔ Profile`

**Navigation Type:** Tab-based (bottom navigation)

**Features:**
- Persistent across app sessions
- Quick access to main features
- No back navigation between tabs

**Implementation:**
```typescript
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen name="index" />      // Home
  <Tabs.Screen name="favorites" />
  <Tabs.Screen name="history" />
  <Tabs.Screen name="profile" />
</Tabs>
```

#### 3. Recipe Discovery Flow

**Path:** `Home → Ingredient Entry → Recipe Suggestions → Recipe Detail → Cooking Mode`

**Navigation Type:** Stack-based (sequential flow)

**User Journey:**
1. User enters ingredients
2. System suggests recipes
3. User selects a recipe
4. User views recipe details
5. User starts cooking mode

**Back Navigation:** Available at each step

**Implementation:**
```typescript
// From Home
navigationUtils.navigate('ingredient-entry');

// From Ingredient Entry
navigationUtils.navigate('recipe-suggestions', { ingredients });

// From Recipe Suggestions
navigationUtils.navigate('recipe-detail', { recipeId });

// From Recipe Detail
navigationUtils.navigate('cooking-mode', { recipeId });
```

#### 4. Recipe Access Flow (From Favorites/History/Search)

**Path:** `Favorites/History/Search → Recipe Detail → Cooking Mode`

**Navigation Type:** Stack-based (modal-like)

**Features:**
- Quick access to saved recipes
- Can start cooking directly
- Back navigation to source screen

### Screen Transition Patterns

#### Pattern 1: Replace (No Back Navigation)
**Used for:** Splash → Home, Onboarding → Home

```typescript
navigationUtils.replace('(tabs)');
```

**Why:** User shouldn't go back to splash/onboarding after completion.

#### Pattern 2: Push (With Back Navigation)
**Used for:** Home → Ingredient Entry → Recipe Suggestions

```typescript
navigationUtils.navigate('ingredient-entry');
```

**Why:** User should be able to go back to previous screen.

#### Pattern 3: Tab Navigation
**Used for:** Home ↔ Favorites ↔ History ↔ Profile

```typescript
// Handled by Expo Router Tabs
<Tabs>
  <Tabs.Screen name="index" />
  <Tabs.Screen name="favorites" />
</Tabs>
```

**Why:** Tabs are main navigation points, should be easily accessible.

### Navigation State Management

**Global Navigation State:**
- Managed by Expo Router
- Navigation history maintained automatically
- Deep linking support via `navigation-config.ts`

**Screen-Specific Navigation:**
- Each screen's view model handles its own navigation logic
- Navigation decisions made in hooks (e.g., `use-splash-view-model.ts`)
- Uses centralized utilities from `src/navigation/utils.ts`

### Deep Linking Support

**Configuration:** `src/navigation/navigation-config.ts`

```typescript
linking: {
  prefixes: ['masterfabricexpo://'],
  config: {
    screens: {
      splash: '/splash',
      onboarding: '/onboarding',
      '(tabs)': {
        screens: {
          index: '/home',
          favorites: '/favorites',
        },
      },
    },
  },
}
```

**Supported Deep Links:**
- `masterfabricexpo://splash` → Splash screen
- `masterfabricexpo://onboarding` → Onboarding screen
- `masterfabricexpo://home` → Home tab
- `masterfabricexpo://favorites` → Favorites tab

### Navigation Analytics (Usage Tracking)

**Activity Tracking:**
- Uses `useMasterView` hook from `masterfabric-expo-core`
- Tracks screen views and navigation events
- Logs navigation patterns for analytics

**Example:**
```typescript
// In screen view model
import { useMasterView } from 'masterfabric-expo-core';

export function useRecipeDetailViewModel() {
  const { trackActivity } = useMasterView();
  
  useEffect(() => {
    trackActivity('recipe_detail_viewed', { recipeId });
  }, []);
}
```

### Common Navigation Scenarios

#### Scenario 1: First App Launch
1. App launches → `app/index.tsx`
2. Redirects to → `app/splash.tsx`
3. Splash initializes → Checks `shouldShowOnboarding()`
4. Returns `true` → Navigates to `app/onboarding.tsx`
5. User completes onboarding → Navigates to `app/(tabs)/index.tsx` (Home)

#### Scenario 2: Returning User
1. App launches → `app/index.tsx`
2. Redirects to → `app/splash.tsx`
3. Splash initializes → Checks `shouldShowOnboarding()`
4. Returns `false` → Navigates directly to `app/(tabs)/index.tsx` (Home)

#### Scenario 3: Recipe Discovery
1. User on Home → Taps "Enter Ingredients"
2. Navigates to → `app/ingredient-entry.tsx`
3. User enters ingredients → Taps "Find Recipes"
4. Navigates to → `app/recipe-suggestions.tsx`
5. User selects recipe → Navigates to → `app/recipe-detail/[recipeId].tsx`
6. User taps "Start Cooking" → Navigates to → `app/cooking-mode/[recipeId].tsx`

#### Scenario 4: Accessing Favorite Recipe
1. User on Home → Taps "Favorites" tab
2. Navigates to → `app/(tabs)/favorites.tsx`
3. User selects favorite recipe → Navigates to → `app/recipe-detail/[recipeId].tsx`
4. User can start cooking or go back to favorites

### Navigation Best Practices

1. **Use Centralized Utilities:** Always use `navigationUtils` from `@/navigation` for type-safe navigation
2. **Replace vs Push:** Use `replace()` for splash/onboarding, `push()` for normal navigation
3. **Type Safety:** Always use `RootStackParamList` types for navigation parameters
4. **Screen Index Exports:** Always import screens from `@/screens/{screen-name}` (uses index.ts)
5. **Navigation Logic:** Keep navigation logic in view model hooks, not in components
6. **Deep Linking:** Configure all routes in `navigation-config.ts` for deep linking support

## State Management

### Global Store (Zustand)

```typescript
// src/shared/store/app-store.ts
import { create } from 'zustand';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentIngredients: Ingredient[];
  favoriteRecipes: string[];
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  currentIngredients: [],
  favoriteRecipes: [],
  
  setUser: (user) => set({ user }),
  addFavorite: (id) => set((state) => ({
    favoriteRecipes: [...state.favoriteRecipes, id]
  })),
}));
```

### MasterView Pattern

```typescript
// src/screens/ingredient-entry/hooks/use-ingredient-entry-view-model.ts
import { useState, useCallback } from 'react';
import { useMasterView } from 'masterfabric-expo-core';
import { useIngredientEntryStore } from '../store/ingredient-entry-store';

export function useIngredientEntryViewModel() {
  const { trackActivity } = useMasterView(); // MasterFabric activity tracking
  const { items, addItem } = useIngredientEntryStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAdd = useCallback((ingredient: string) => {
    addItem({ name: ingredient });
    trackActivity('ingredient_added');
  }, [addItem, trackActivity]);
  
  return {
    items,
    isLoading,
    handleAdd,
  };
}
```

## Services

### Service Structure

```
src/shared/services/
├── api.ts              # API client
├── recipe-service.ts   # Recipe API
├── ingredient-service.ts
└── supabase-service.ts
```

### Supabase Integration

```typescript
// src/shared/services/supabase-service.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export { supabase };
```

### Database Schema

- **recipes** - Recipe information (id, name, description, ingredients, steps, image_url, prep_time, cook_time, servings, difficulty)
- **users** - User profiles (id, email, name, avatar_url, subscription_tier)
- **favorites** - User favorites (id, user_id, recipe_id)
- **history** - Cooking history (id, user_id, recipe_id, cooked_at, rating)

## Data Models

### Core Types

```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  required: boolean;
}

interface Recipe {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  prepTime: number; // minutes
  cookTime: number; // minutes
}

interface RecipeStep {
  order: number;
  text: string;
  duration?: number; // minutes
  imageUrl?: string;
  tip?: string;
}

interface RecipeMatch {
  recipe: Recipe;
  score: number; // 0-100
  availableIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
}
```

## Naming Conventions

All file and folder names in the Recipio project are written in **kebab-case** format. Kebab-case is a naming format where words are written in lowercase and separated by hyphens (-).

### Kebab-Case Rules

- All letters must be lowercase
- Words should be separated by hyphens (-)
- Spaces or underscores (_) should not be used
- Numbers can be used but should not be at the beginning

### Naming Examples

**Folders:**
- ✅ `ingredient-entry/`
- ✅ `recipe-suggestions/`
- ✅ `cooking-mode/`
- ❌ `IngredientEntry/` (PascalCase - wrong)
- ❌ `ingredient_entry/` (snake_case - wrong)
- ❌ `ingredientEntry/` (camelCase - wrong)

**Files:**
- ✅ `recipe-card.tsx`
- ✅ `ingredient-entry-screen.tsx`
- ✅ `use-recipe-detail-view-model.ts`
- ✅ `recipe-store.ts`
- ✅ `recipe-models.ts`
- ✅ `recipe-screen.styles.ts`
- ❌ `RecipeCard.tsx` (PascalCase - wrong)
- ❌ `recipeCard.tsx` (camelCase - wrong)
- ❌ `recipe_card.tsx` (snake_case - wrong)

### Naming by File Type

- **Folders**: `kebab-case/` → `ingredient-entry/`, `recipe-suggestions/`
- **Components**: `kebab-case.tsx` → `recipe-card.tsx`, `splash-screen.tsx`
- **Hooks**: `use-kebab-case.ts` → `use-recipe-detail-view-model.ts`, `use-splash-view-model.ts`
- **Store**: `kebab-case-store.ts` → `recipe-store.ts`, `splash-store.ts`
- **Models**: `kebab-case-models.ts` → `recipe-models.ts`, `splash-models.ts`
- **Styles**: `kebab-case.styles.ts` → `recipe-screen.styles.ts`, `splash-screen.styles.ts`
- **Utils**: `kebab-case.ts` or `index.ts` → `format-time.ts`, `calculate-score.ts`
- **Services**: `kebab-case-service.ts` → `recipe-service.ts`, `supabase-service.ts`
- **Types**: `kebab-case.ts` → `recipe-types.ts` (usually `index.ts` is used)

### Special Cases

- **Route files** (in `app/` folder): Following Expo Router conventions, use `kebab-case.tsx` format
  - ✅ `ingredient-entry.tsx`
  - ✅ `recipe-suggestions.tsx`
  - ✅ `recipe-detail/[recipeId].tsx` (dynamic route with descriptive parameter name)
  - ✅ `cooking-mode/[recipeId].tsx` (dynamic route with descriptive parameter name)
  - ❌ `recipe/[id].tsx` (avoid generic [id], use descriptive names like [recipeId])

- **Index files**: Always named as `index.ts` or `index.tsx`
  - ✅ `index.ts`
  - ✅ `index.tsx`

- **Layout files**: For Expo Router, use `_layout.tsx` format
  - ✅ `_layout.tsx`

### Why Kebab-Case?

- **Consistency**: Same naming standard across the entire project
- **Readability**: Easier to read with hyphens between words
- **Platform compatibility**: Works smoothly on all operating systems
- **URL compatibility**: Can use the same format on the web
- **React Native/Expo compatibility**: Aligns with Expo Router and React Native standards

## Import Paths

### Path Alias (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Import Examples

```typescript
// Shared
import { Button } from '@/shared/components/button';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { apiService } from '@/shared/services/api';

// Screen
import { IngredientEntryScreen } from '@/screens/ingredient-entry';
import { useIngredientEntryViewModel } from '@/screens/ingredient-entry/hooks/use-ingredient-entry-view-model';

// Relative
import { IngredientInput } from './ingredient-input';
```

## i18n Usage

### Basic Usage

```typescript
import { t } from '@/shared/i18n';

<Text>{t('recipeApp.splash.title')}</Text>
<Button title={t('recipeApp.onboarding.next')} />
```

### Translation Key Structure

```json
{
  "recipeApp": {
    "splash": {
      "title": "Recipio",
      "initializing": "Initializing..."
    },
    "dashboard": {
      "title": "Dashboard",
      "welcome": "Welcome back, {{name}}!"
    },
    "common": {
      "loading": "Loading...",
      "error": "An error occurred"
    }
  }
}
```

Supported languages: English (en), Turkish (tr)

## UI Component Library & Design System

### Component Library Approach

Recipio uses a **custom component library** built on top of React Native StyleSheet and Expo components, following Shadcn UI design principles adapted for React Native. Components are built with accessibility, theming, and reusability in mind.

### Styling Approach

**Primary Styling Method:**
- **React Native StyleSheet** - Core styling with `StyleSheet.create()`
- **Theme-aware styling** - Components automatically adapt to light/dark mode
- **Responsive design** - Uses `useWindowDimensions` for screen size adjustments
- **Flexbox layouts** - Standard React Native layout system

**Why not NativeWind/Tailwind?**
- Better performance with StyleSheet.create()
- Type-safe styling with TypeScript
- Easier theme integration with masterfabric-expo-core
- Smaller bundle size
- Better IDE support and autocomplete

### Design System Structure

```
src/shared/components/
├── button.tsx                 # Primary button component
├── card.tsx                   # Card container component
├── input.tsx                  # Text input component
├── text.tsx                   # Themed text component
├── view.tsx                   # Themed view component
├── badge.tsx                  # Badge/status indicator
├── avatar.tsx                 # User avatar component
├── image.tsx                  # Optimized image component
├── list.tsx                   # List container component
├── separator.tsx              # Divider/separator component
├── skeleton.tsx               # Loading skeleton component
├── toast.tsx                  # Toast notification component
├── modal.tsx                  # Modal dialog component
├── bottom-sheet.tsx           # Bottom sheet component
├── picker.tsx                 # Picker/select component
├── switch.tsx                 # Toggle switch component
├── slider.tsx                 # Slider component
├── progress.tsx               # Progress indicator
└── tabs.tsx                   # Tab navigation component
```

### Core UI Components

#### Button Component

```typescript
// src/shared/components/button.tsx
import { Button } from '@/shared/components/button';

<Button
  title="Find Recipes"
  onPress={handleFindRecipes}
  variant="primary"        // 'primary' | 'secondary' | 'outline' | 'ghost'
  size="medium"            // 'small' | 'medium' | 'large'
  disabled={isLoading}
  style={customStyles}
/>
```

**Variants:**
- `primary` - Main action button (blue background)
- `secondary` - Secondary action (green background)
- `outline` - Outlined button (transparent with border)
- `ghost` - Minimal button (no background, no border)

**Sizes:**
- `small` - Compact button (height: 32px)
- `medium` - Standard button (height: 44px)
- `large` - Large button (height: 52px)

#### Card Component

```typescript
// src/shared/components/card.tsx
import { Card } from '@/shared/components/card';

<Card padding={16} shadow={true}>
  <Text>Recipe Content</Text>
</Card>
```

**Props:**
- `padding` - Padding value (default: 16)
- `shadow` - Enable shadow (default: true)
- `style` - Additional styles

#### Input Component

```typescript
// src/shared/components/input.tsx
import { Input } from '@/shared/components/input';

<Input
  placeholder="Enter ingredient name"
  value={ingredient}
  onChangeText={setIngredient}
  error={errors.ingredient}
  label="Ingredient"
  required
/>
```

**Props:**
- `label` - Input label text
- `placeholder` - Placeholder text
- `value` - Input value
- `onChangeText` - Change handler
- `error` - Error message
- `required` - Show required indicator
- `secureTextEntry` - Password input
- `keyboardType` - Keyboard type
- `autoCapitalize` - Auto capitalization

#### Badge Component

```typescript
// src/shared/components/badge.tsx
import { Badge } from '@/shared/components/badge';

<Badge variant="success" size="medium">
  Available
</Badge>
```

**Variants:**
- `success` - Green badge
- `error` - Red badge
- `warning` - Orange badge
- `info` - Blue badge
- `default` - Gray badge

#### Avatar Component

```typescript
// src/shared/components/avatar.tsx
import { Avatar } from '@/shared/components/avatar';

<Avatar
  source={{ uri: user.avatarUrl }}
  size={48}
  fallback="JD"
/>
```

#### Image Component

```typescript
// src/shared/components/image.tsx
import { OptimizedImage } from '@/shared/components/image';

<OptimizedImage
  source={{ uri: recipe.coverImageUrl }}
  style={styles.recipeImage}
  placeholder="recipe-placeholder"
  resizeMode="cover"
/>
```

### Theme Integration

All components automatically use theme colors from `masterfabric-expo-core`:

```typescript
// Components use useThemeColors hook internally
import { useThemeColors } from 'masterfabric-expo-core';

export function Button({ variant, ...props }) {
  const colors = useThemeColors();
  
  const backgroundColor = variant === 'primary' 
    ? colors.primary 
    : colors.buttonBackground;
  
  // Component implementation
}
```

### Component Usage Examples

#### Recipe Card

```typescript
import { Card } from '@/shared/components/card';
import { Button } from '@/shared/components/button';
import { Badge } from '@/shared/components/badge';
import { OptimizedImage } from '@/shared/components/image';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card shadow={true}>
      <OptimizedImage 
        source={{ uri: recipe.coverImageUrl }} 
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.badges}>
          <Badge variant="info">{recipe.difficulty}</Badge>
          <Badge variant="default">{recipe.servings} servings</Badge>
        </View>
        <Button 
          title="View Recipe" 
          variant="primary"
          onPress={() => navigationUtils.navigate('recipe-detail', { recipeId: recipe.id })}
        />
      </View>
    </Card>
  );
}
```

#### Ingredient Input Form

```typescript
import { Input } from '@/shared/components/input';
import { Button } from '@/shared/components/button';

export function IngredientForm() {
  const [ingredient, setIngredient] = useState('');
  const [error, setError] = useState('');

  return (
    <View>
      <Input
        label="Ingredient Name"
        placeholder="e.g., Chicken, Tomatoes"
        value={ingredient}
        onChangeText={setIngredient}
        error={error}
        required
      />
      <Button
        title="Add Ingredient"
        variant="primary"
        onPress={handleAdd}
        disabled={!ingredient}
      />
    </View>
  );
}
```

### Design Tokens

Design tokens are defined in `masterfabric-expo-core` constants:

**Colors:**
- Primary: `#007AFF` (iOS Blue)
- Success: `#34C759` (Green)
- Error: `#FF3B30` (Red)
- Warning: `#FF9500` (Orange)
- Background: Light/Dark theme aware
- Text: Light/Dark theme aware

**Spacing:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

**Typography:**
- Heading 1: 32px, bold
- Heading 2: 24px, bold
- Heading 3: 20px, semibold
- Body: 16px, regular
- Caption: 14px, regular
- Small: 12px, regular

**Border Radius:**
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 999px (circular)

**Shadows:**
- sm: `{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }`
- md: `{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }`
- lg: `{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }`

### Accessibility

All components follow React Native accessibility best practices:

```typescript
// Components include accessibility props
<Button
  title="Find Recipes"
  accessibilityLabel="Find recipes with available ingredients"
  accessibilityHint="Opens recipe suggestions based on your ingredients"
  accessibilityRole="button"
/>
```

**Accessibility Features:**
- `accessibilityLabel` - Descriptive label for screen readers
- `accessibilityHint` - Additional context for actions
- `accessibilityRole` - Semantic role (button, text, image, etc.)
- `accessibilityState` - State information (disabled, selected, etc.)
- Keyboard navigation support
- Focus management

### Animation

Components use `react-native-reanimated` for smooth animations:

```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

// Button press animation
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.95);
};

const handlePressOut = () => {
  scale.value = withSpring(1);
};
```

## API Services & Endpoints

### Service Architecture

All API services are located in `src/shared/services/` and use Supabase as the backend.

### Service Structure

```
src/shared/services/
├── api.ts                    # Base API client
├── supabase-service.ts        # Supabase client initialization
├── recipe-service.ts          # Recipe CRUD operations
├── ingredient-service.ts     # Ingredient operations
├── user-service.ts            # User profile operations
├── favorite-service.ts        # Favorite recipes operations
├── history-service.ts         # Cooking history operations
└── search-service.ts          # Recipe search operations
```

### Supabase Service

```typescript
// src/shared/services/supabase-service.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type SupabaseClient = typeof supabase;
```

### Recipe Service

```typescript
// src/shared/services/recipe-service.ts
import { supabase } from './supabase-service';

export interface RecipeFilters {
  categoryId?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxPrepTime?: number;
  maxCookTime?: number;
  isFree?: boolean;
  locale?: string;
}

export const recipeService = {
  // Get published recipes with filters
  async getRecipes(filters: RecipeFilters = {}) {
    const { data, error } = await supabase
      .from('v_public_recipe_cards')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get recipe by ID with full details
  async getRecipeById(recipeId: number, locale: string = 'en') {
    const { data, error } = await supabase
      .from('v_recipe_detail')
      .select('*')
      .eq('recipe_id', recipeId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get recipe suggestions based on ingredients
  async getRecipeSuggestions(ingredientIds: number[], locale: string = 'en') {
    // This would use a database function or view
    const { data, error } = await supabase
      .rpc('get_recipe_suggestions', {
        ingredient_ids: ingredientIds,
        user_locale: locale,
      });
    
    if (error) throw error;
    return data;
  },

  // Search recipes
  async searchRecipes(query: string, locale: string = 'en') {
    const { data, error } = await supabase
      .from('recipe_translations')
      .select(`
        recipe_id,
        title,
        description,
        recipes!inner(status, is_free, cover_image_url)
      `)
      .eq('locale', locale)
      .eq('recipes.status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);
    
    if (error) throw error;
    return data;
  },
};
```

### Ingredient Service

```typescript
// src/shared/services/ingredient-service.ts
import { supabase } from './supabase-service';

export const ingredientService = {
  // Get all ingredients with translations
  async getIngredients(locale: string = 'en') {
    const { data, error } = await supabase
      .from('ingredient_translations')
      .select(`
        ingredient_id,
        name,
        ingredients(slug, image_url)
      `)
      .eq('locale', locale)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Search ingredients
  async searchIngredients(query: string, locale: string = 'en') {
    const { data, error } = await supabase
      .from('ingredient_translations')
      .select('*')
      .eq('locale', locale)
      .ilike('name', `%${query}%`)
      .limit(10);
    
    if (error) throw error;
    return data;
  },
};
```

### User Service

```typescript
// src/shared/services/user-service.ts
import { supabase } from './supabase-service';

export const userService = {
  // Get current user profile
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(updates: {
    display_name?: string;
    avatar_url?: string;
    locale?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
```

### Favorite Service

```typescript
// src/shared/services/favorite-service.ts
import { supabase } from './supabase-service';

export const favoriteService = {
  // Get user favorites
  async getFavorites(userId: string, locale: string = 'en') {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        recipe_id,
        created_at,
        recipes!inner(
          status,
          is_free,
          cover_image_url,
          recipe_translations!inner(title, description)
        )
      `)
      .eq('user_id', userId)
      .eq('recipes.status', 'published')
      .eq('recipe_translations.locale', locale)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Add to favorites
  async addFavorite(userId: string, recipeId: number) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, recipe_id: recipeId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Remove from favorites
  async removeFavorite(userId: string, recipeId: number) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);
    
    if (error) throw error;
  },
};
```

### History Service

```typescript
// src/shared/services/history-service.ts
import { supabase } from './supabase-service';

export const historyService = {
  // Get cooking history
  async getHistory(userId: string, locale: string = 'en') {
    const { data, error } = await supabase
      .from('tried_recipes')
      .select(`
        recipe_id,
        created_at,
        recipes!inner(
          status,
          cover_image_url,
          recipe_translations!inner(title)
        )
      `)
      .eq('user_id', userId)
      .eq('recipes.status', 'published')
      .eq('recipe_translations.locale', locale)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Add to history
  async addToHistory(userId: string, recipeId: number) {
    const { data, error } = await supabase
      .from('tried_recipes')
      .insert({ user_id: userId, recipe_id: recipeId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
```

### Error Handling in Services

```typescript
// src/shared/services/api.ts
import { supabase } from './supabase-service';
import { logger_helper } from 'masterfabric-expo-core';

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiCall<T>(
  apiCall: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await apiCall();
    
    if (error) {
      logger_helper.error('API Error:', error);
      throw new ApiError(
        error.message || 'An error occurred',
        error.code,
        error.statusCode
      );
    }
    
    if (!data) {
      throw new ApiError('No data returned from API');
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger_helper.error('Unexpected error:', error);
    throw new ApiError('An unexpected error occurred');
  }
}
```

## Error Handling Strategy

### Error Types

```typescript
// src/shared/types/errors.ts
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION = 'PERMISSION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
}
```

### Error Handling Hook

```typescript
// src/shared/hooks/use-error-handler.ts
import { useState, useCallback } from 'react';
import { toast_helper } from 'masterfabric-expo-core';
import { ErrorType, AppError } from '@/shared/types/errors';

export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);

  const handleError = useCallback((error: unknown) => {
    let appError: AppError;

    if (error instanceof ApiError) {
      appError = {
        type: mapApiErrorToType(error),
        message: error.message,
        code: error.code,
      };
    } else if (error instanceof Error) {
      appError = {
        type: ErrorType.UNKNOWN,
        message: error.message,
      };
    } else {
      appError = {
        type: ErrorType.UNKNOWN,
        message: 'An unexpected error occurred',
      };
    }

    setError(appError);
    toast_helper.showError(appError.message);
    
    // Log to Sentry
    if (appError.type !== ErrorType.VALIDATION) {
      logger_helper.error('App Error:', appError);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
```

### Error Display Components

```typescript
// src/shared/components/error-display.tsx
import { View, Text } from 'react-native';
import { useThemeColors } from 'masterfabric-expo-core';
import { AppError } from '@/shared/types/errors';

export function ErrorDisplay({ error }: { error: AppError }) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.errorBackground }]}>
      <Text style={[styles.message, { color: colors.errorText }]}>
        {error.message}
      </Text>
    </View>
  );
}
```

### Global Error Boundary

```typescript
// src/shared/components/error-boundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';
import { logger_helper } from 'masterfabric-expo-core';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger_helper.error('Error Boundary caught:', error, errorInfo);
    // Log to Sentry
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>
          <Button
            title="Try Again"
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

## Environment Variables

### Required Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Sentry Error Tracking
EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Optional: Firebase Configuration (if using Firebase)
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Optional: API Endpoints
EXPO_PUBLIC_API_BASE_URL=https://api.recipio.com

# Optional: Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
```

### Environment Variable Usage

```typescript
// Access environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Type-safe environment variables
// src/shared/config/env.ts
export const env = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  },
  sentry: {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  },
  features: {
    analytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
    crashReporting: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true',
  },
} as const;
```

### Environment-Specific Configuration

```typescript
// src/shared/config/app-config.ts
import Constants from 'expo-constants';

export const appConfig = {
  environment: Constants.expoConfig?.extra?.environment || 'development',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.recipio.com',
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
};
```

## Testing Strategy

### Testing Setup

```typescript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
};
```

### Unit Testing

```typescript
// src/shared/utils/__tests__/format-time.test.ts
import { formatTime } from '../format-time';

describe('formatTime', () => {
  it('formats minutes correctly', () => {
    expect(formatTime(30)).toBe('30 min');
    expect(formatTime(60)).toBe('1 hr');
    expect(formatTime(90)).toBe('1 hr 30 min');
  });
});
```

### Component Testing

```typescript
// src/shared/components/__tests__/button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Integration Testing

```typescript
// src/screens/ingredient-entry/__tests__/ingredient-entry.test.tsx
import { render, waitFor } from '@testing-library/react-native';
import { IngredientEntryScreen } from '../components/ingredient-entry-screen';

describe('IngredientEntryScreen', () => {
  it('loads and displays ingredients', async () => {
    const { getByPlaceholderText } = render(<IngredientEntryScreen />);
    
    await waitFor(() => {
      expect(getByPlaceholderText('Enter ingredient')).toBeTruthy();
    });
  });
});
```

## Deployment

### Build Configuration

```json
// app.json
{
  "expo": {
    "name": "Recipio",
    "slug": "recipio",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.recipio.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.recipio.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Build Commands

```bash
# Development build
npm run start

# iOS build
npm run ios

# Android build
npm run android

# Production build (EAS)
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### EAS Build Configuration

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-id"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

