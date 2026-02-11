# Folder Structure

Recipio app folder structure, aligned with the current working system.

**Proje konumu:** Tüm Recipio uygulaması `project/recipio` altında geliştirilir. Ekstra proje klasörü oluşturulmaz; uygulama doğrudan bu dizine kurulur.

## Phased Development (Summary)

The app is developed **in phases**; only the screens for that phase get folders and files created.

| Phase | Views |
|-------|-------|
| **Phase 1** | Splash ✅, Onboarding, Home (Find Your Next Meal card, search icon) |
| **Phase 2** | Ingredient Input, Recipe List, Recipe Detail, Cooking Guide, Favorites, History |
| **Phase 3** | Profile, Auth (login/signup) |

Detailed phase descriptions and view–structure matrix: **[Phased Development & View Structure Analysis](./phased-development-and-view-structure.md)**.

---

## Project Root

```
project/recipio/
├── app/                                    # Expo Router routes
│   ├── _layout.tsx                         # Root layout (ThemeProvider)
│   ├── index.tsx                           # Entry; onboarding vs home check
│   ├── splash.tsx                          # (optional) Splash route
│   ├── onboarding.tsx                     # Phase 1 — Onboarding
│   ├── (tabs)/                             # Phase 1: home; Phase 2: favorites, history
│   │   ├── _layout.tsx
│   │   ├── index.tsx                       # Home
│   │   ├── favorites.tsx                  # Phase 2
│   │   ├── history.tsx                     # Phase 2
│   │   └── profile.tsx                     # Phase 3
│   ├── enter-ingredients.tsx               # Phase 2 — Ingredient input
│   ├── recipe-results.tsx                  # Phase 2 — Recipe list
│   ├── recipe-detail/[id].tsx              # Phase 2 — Recipe detail
│   ├── cooking-guide/[id].tsx             # Phase 2 — Cooking guide
│   └── (auth)/                             # Phase 3 — login, signup (optional)
│
├── src/
│   ├── navigation/
│   │   └── types.ts                        # Navigation type definitions
│   │
│   ├── screens/
│   │   ├── splash/
│   │   │   ├── components/
│   │   │   │   └── splash-screen.tsx       # Splash screen component
│   │   │   ├── hooks/
│   │   │   │   └── use-splash-navigation.ts # Navigation hook
│   │   │   ├── models/
│   │   │   │   └── splash-models.ts         # Type definitions
│   │   │   ├── styles/
│   │   │   │   └── splash-screen.styles.ts # Styles (MasterFabric Colors)
│   │   │   └── index.ts                    # Export file
│   │   │
│   │   ├── onboarding/
│   │   │   ├── components/
│   │   │   │   ├── onboarding-screen.tsx   # Main onboarding component
│   │   │   │   ├── step-content.tsx        # Step content component
│   │   │   │   ├── step-controls.tsx       # Step controls component
│   │   │   │   └── step-indicator.tsx      # Step indicator component
│   │   │   ├── hooks/
│   │   │   │   └── use-onboarding-view-model.ts # View model hook
│   │   │   ├── models/
│   │   │   │   └── onboarding-models.ts     # Type definitions
│   │   │   ├── store/
│   │   │   │   └── onboarding-store.ts      # Zustand store
│   │   │   ├── styles/
│   │   │   │   └── onboarding-screen.styles.ts # Styles (MasterFabric Colors)
│   │   │   └── index.ts                    # Export file
│   │   │
│   │   └── home/
│   │       ├── components/
│   │       │   ├── home-screen.tsx         # Main home component
│   │       │   ├── dashboard-header.tsx   # Header component
│   │       │   ├── current-plan-card.tsx  # Plan card component
│   │       │   ├── quick-actions.tsx       # Quick actions component
│   │       │   ├── cook-tonight-section.tsx # Cook tonight section
│   │       │   ├── recent-activity-section.tsx # Recent activity section
│   │       │   └── bottom-tabs.tsx          # Bottom tabs component
│   │       ├── hooks/
│   │       │   └── use-home-view-model.ts  # View model hook (Supabase integration)
│   │       ├── models/
│   │       │   └── home-models.ts          # Type definitions
│   │       ├── styles/
│   │       │   ├── home-screen.styles.ts  # Main styles
│   │       │   └── dashboard.styles.ts    # Dashboard styles (Dark theme)
│   │       └── index.ts                   # Export file
│   │
│   └── shared/
│       ├── constants/
│       │   └── app-config.ts              # App configuration
│       ├── services/
│       │   ├── supabase-service.ts        # Supabase client (core)
│       │   ├── recipe-service.ts          # Recipe operations
│       │   ├── user-service.ts            # User operations
│       │   ├── recipe-search-service.ts   # Recipe search (later phase)
│       │   └── index.ts                   # Central export
│       └── utils/
│           └── storage.ts                  # AsyncStorage helpers
│
├── metro-stubs/                            # Optional dependency stubs
│   ├── firebase-stub.js                   # Firebase stub (not used)
│   ├── sentry-stub.js                     # Sentry stub (not used)
│   ├── slider-stub.js                     # Slider stub (not used)
│   ├── expo-haptics-stub.js              # Expo Haptics stub
│   ├── expo-battery-stub.js              # Expo Battery stub
│   ├── expo-av-stub.js                    # Expo AV stub
│   └── expo-web-browser-stub.js          # Expo Web Browser stub
│
├── package.json                            # Dependencies
├── tsconfig.json                           # TypeScript config
├── metro.config.js                         # Metro bundler config
├── app.json                                # Expo config (Supabase credentials)
└── index.js                                # Entry point
```

## Screen Structure

Each screen follows this structure:

```
src/screens/[screen-name]/
├── components/                            # Screen-specific components
│   ├── [screen-name]-screen.tsx          # Main screen component
│   └── [component-name].tsx              # Other components
├── hooks/                                 # Custom hooks
│   └── use-[screen-name]-view-model.ts   # View model hook
├── models/                                # Screen-specific models
│   └── [screen-name]-models.ts           # Type definitions
├── store/                                 # Zustand store (optional)
│   └── [screen-name]-store.ts            # State management
├── styles/                                # Style files
│   └── [screen-name]-screen.styles.ts   # Styles
├── utils/                                 # Helpers (optional)
│   └── index.ts
└── index.ts                               # Public exports
```

### All Views — Standard Structure (components, hook, model, store, styles, utils)

The structure below is the target for each view. Add `store` and `utils` only when needed.

| View | Phase | components | hooks | models | store | styles | utils |
|------|-------|------------|-------|--------|-------|--------|-------|
| splash | 1 | ✅ | ✅ | ✅ | opt | ✅ | opt |
| onboarding | 1 | ✅ | ✅ | ✅ | ✅ | ✅ | opt |
| home | 1 | ✅ | ✅ | ✅ | opt | ✅ | opt |
| ingredient-input | 2 | ✅ | ✅ | ✅ | ✅ | ✅ | opt |
| recipe-list | 2 | ✅ | ✅ | ✅ | opt | ✅ | opt |
| recipe-detail | 2 | ✅ | ✅ | ✅ | opt | ✅ | opt |
| cooking-guide | 2 | ✅ | ✅ | ✅ | opt | ✅ | opt |
| favorites | 2 | ✅ | ✅ | ✅ | ✅ | ✅ | opt |
| history | 2 | ✅ | ✅ | ✅ | opt | ✅ | opt |
| profile | 3 | ✅ | ✅ | ✅ | ✅ | ✅ | opt |

**Views not yet in the project:** home, onboarding, ingredient-input, recipe-list, recipe-detail, cooking-guide, favorites, history, profile. Create `src/screens/[view-name]/` only when that view's phase is active; structure follows the template above.

### Planned Screens — Folder Template (Phase 2 & 3)

Each uses the same structure under `src/screens/[view-name]/`:

```
# ingredient-input (Phase 2)
src/screens/ingredient-input/
├── components/  (ingredient-input-screen.tsx, sections/, ingredient-item.tsx)
├── hooks/       (use-ingredient-input-view-model.ts)
├── models/      (ingredient-input-models.ts)
├── store/       (ingredient-input-store.ts)
├── styles/      (ingredient-input-screen.styles.ts)
├── utils/       (opt)
└── index.ts

# recipe-list (Phase 2)
src/screens/recipe-list/
├── components/  (recipe-list-screen.tsx, recipe-card.tsx, ...)
├── hooks/       (use-recipe-list-view-model.ts)
├── models/      (recipe-list-models.ts)
├── styles/      (recipe-list-screen.styles.ts)
└── index.ts

# recipe-detail (Phase 2)
src/screens/recipe-detail/
├── components/  (recipe-detail-screen.tsx, servings-selector.tsx, ...)
├── hooks/       (use-recipe-detail-view-model.ts)
├── models/      (recipe-detail-models.ts)
├── styles/      (recipe-detail-screen.styles.ts)
└── index.ts

# cooking-guide (Phase 2)
src/screens/cooking-guide/
├── components/  (cooking-guide-screen.tsx, step-view.tsx, ...)
├── hooks/       (use-cooking-guide-view-model.ts)
├── models/      (cooking-guide-models.ts)
├── styles/      (cooking-guide-screen.styles.ts)
└── index.ts

# favorites (Phase 2)
src/screens/favorites/
├── components/  (favorites-screen.tsx, favorite-card.tsx, sections/)
├── hooks/       (use-favorites-view-model.ts)
├── models/      (favorites-models.ts)
├── store/       (favorites-store.ts)
├── styles/      (favorites-screen.styles.ts)
└── index.ts

# history (Phase 2)
src/screens/history/
├── components/  (history-screen.tsx, history-item.tsx, ...)
├── hooks/       (use-history-view-model.ts)
├── models/      (history-models.ts)
├── styles/      (history-screen.styles.ts)
└── index.ts

# profile (Phase 3)
src/screens/profile/
├── components/  (profile-screen.tsx, sections/, stat-card.tsx)
├── hooks/       (use-profile-view-model.ts)
├── models/      (profile-models.ts)
├── store/       (profile-store.ts)
├── styles/      (profile-screen.styles.ts)
└── index.ts
```

## Example: Home Screen

```
src/screens/home/
├── components/
│   ├── home-screen.tsx                    # Main container
│   ├── dashboard-header.tsx              # Header (search icon, no notification)
│   ├── current-plan-card.tsx             # Plan card
│   ├── find-recipes-card.tsx             # Single "Find Your Next Meal" card
│   ├── cook-tonight-section.tsx          # Cook Tonight section
│   ├── recent-activity-section.tsx       # Recent Activity section
│   └── bottom-tabs.tsx                   # Bottom tab navigation
├── hooks/
│   └── use-home-view-model.ts            # Supabase data fetching
├── models/
│   └── home-models.ts                    # Recipe, Activity, QuickAction types
├── styles/
│   ├── home-screen.styles.ts            # Container styles
│   └── dashboard.styles.ts              # Dashboard styles (Dark theme)
└── index.ts
```

## Shared Folder

```
src/shared/
├── constants/
│   └── app-config.ts                      # App-wide constants
│
├── services/
│   ├── supabase-service.ts               # Supabase client (core)
│   ├── recipe-service.ts                 # Recipe operations
│   │   ├── getCookTonightRecipes()       # Random recipes
│   │   ├── getRecentActivities()         # User activities
│   │   └── getMonthlyRecipesCount()      # Monthly count
│   ├── user-service.ts                  # User operations
│   │   ├── getCurrentUserProfile()      # User profile
│   │   └── getGreeting()                # Time-based greeting
│   ├── recipe-search-service.ts         # Recipe search (later phase)
│   │   ├── searchRecipesByIngredients()  # AI-powered search
│   │   └── getRecipeById()              # Recipe detail
│   └── index.ts                          # Central export
│
└── utils/
    └── storage.ts                         # AsyncStorage helpers
        ├── setOnboardingCompleted()      # Save onboarding status
        ├── getOnboardingCompleted()      # Read onboarding status
        └── clearOnboardingStatus()       # Clear onboarding status
```

## MasterFabric Core Usage

Use `@masterfabric-expo/core` as follows:

**Import paths:**
```typescript
// Components
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { ThemedText } from '@masterfabric-expo/core/dist/components/ThemedText';

// Constants
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

// Contexts
import { ThemeProvider } from '@masterfabric-expo/core/dist/contexts/ThemeContext';
```

**Example:**
```typescript
// Splash Screen
import { ThemedText } from '@masterfabric-expo/core/dist/components/ThemedText';
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

export function SplashScreen() {
  return (
    <SafeAreaView style={splashScreenStyles.container}>
      <ThemedView style={splashScreenStyles.content}>
        <ThemedText style={splashScreenStyles.title}>Recipio</ThemedText>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    </SafeAreaView>
  );
}
```

## Naming Conventions

### File naming
- **kebab-case**: `splash-screen.tsx`, `use-splash-navigation.ts`
- Component files: `component-name.tsx`
- Hook files: `use-hook-name.ts`
- Model files: `model-name-models.ts`
- Style files: `screen-name.styles.ts`
- Store files: `store-name-store.ts`

### Folder naming
- **kebab-case**: `splash-screen`, `recipe-results`
- Same structure per screen: `components/`, `hooks/`, `models/`, `styles/`, `store/`

### Export files
- Each screen folder should have `index.ts`
- Use a central export pattern

**Example export:**
```typescript
// src/screens/splash/index.ts
export { SplashScreen } from './components/splash-screen';
export { useSplashNavigation } from './hooks/use-splash-navigation';
export type { SplashConfig } from './models/splash-models';
```

## 🔗 Path Aliases

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/screens/*": ["./src/screens/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/navigation/*": ["./src/navigation/*"]
    }
  }
}
```

**Usage:**
```typescript
// Prefer path aliases
import { SplashScreen } from '@/screens/splash/components/splash-screen';
import { getSupabaseClient } from '@/shared/services/supabase-service';

// Avoid deep relative imports
import { SplashScreen } from '../../../screens/splash/components/splash-screen';
```

## Metro Stubs

```
metro-stubs/
├── firebase-stub.js              # Firebase stub (not used)
├── sentry-stub.js                # Sentry stub (not used)
├── slider-stub.js                # Slider stub (not used)
├── expo-haptics-stub.js          # Expo Haptics stub
├── expo-battery-stub.js          # Expo Battery stub
├── expo-av-stub.js               # Expo AV stub
└── expo-web-browser-stub.js      # Expo Web Browser stub
```

**Notes:**
- Supabase is **not** stubbed — the real package is used
- Firebase and Sentry are stubbed (not used)
- Optional Expo packages are stubbed

## Package Layout

**Local Package:**
- `@masterfabric-expo/core`: `file:../../packages/masterfabric-expo-core`

**Metro Config:**
```javascript
config.watchFolders = [
  path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
];

config.resolver.extraNodeModules = {
  '@masterfabric-expo/core': path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
};
```

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
