# Architecture Overview

The app follows a **feature-based architecture**: code is organized by domain or feature for a scalable, modular structure with clear separation and easier maintenance, testing, and scaling.

The foundation is the `@masterfabric-expo/core` package, which provides shared components, hooks, contexts, and utilities for consistency and less boilerplate.

## Core Principles

### 1. Modularity

Each feature (e.g. `splash`, `onboarding`, `home`) is a self-contained module: all logic, UI, and state for that feature live together.

**Example:**
```
src/screens/home/
├── components/        # UI components
├── hooks/            # Business logic
├── models/           # Type definitions
├── styles/           # Styling
└── store/            # State management (optional)
```

### 2. Separation of Concerns

Clear separation is kept between layers:

- **UI Layer**: `components/`, `screens/`, `styles/`
- **Business Logic Layer**: `hooks/`, `store/`, `utils/`
- **Data & Services Layer**: `services/`, `models/`

**Example:**
```typescript
// UI Layer
export function HomeScreen() {
  const { recipes, isLoading } = useHomeViewModel(); // Business Logic
  return <View>...</View>; // UI
}

// Business Logic Layer
export function useHomeViewModel() {
  const recipes = await getCookTonightRecipes(); // Data Layer
  return { recipes, isLoading };
}

// Data Layer
export async function getCookTonightRecipes() {
  const supabase = getSupabaseClient(); // Service
  return await supabase.from('recipes').select('*');
}
```

### 3. Scalability

The structure is designed to grow. Adding a new feature is as simple as creating a new directory under `src/screens/` without breaking existing code.

## MasterFabric Core Integration

The app uses these elements from `@masterfabric-expo/core`:

### Components
- **ThemedView**: Theme-aware View component
- **ThemedText**: Theme-aware Text component

### Constants
- **Colors**: MasterFabric color palette

### Contexts
- **ThemeProvider**: Theme context provider

**Usage:**
```typescript
// Root Layout
import { ThemeProvider } from '@masterfabric-expo/core/dist/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        {/* Screens */}
      </Stack>
    </ThemeProvider>
  );
}

// Screen Component
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { ThemedText } from '@masterfabric-expo/core/dist/components/ThemedText';
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';
```

## State Management

The app uses **Zustand** for state management:

### Usage

1. **Onboarding Store** (with AsyncStorage persistence)
   ```typescript
   // src/screens/onboarding/store/onboarding-store.ts
   import { create } from 'zustand';
   import { persist, createJSONStorage } from 'zustand/middleware';
   import AsyncStorage from '@react-native-async-storage/async-storage';

   export const useOnboardingStore = create(
     persist(
       (set) => ({
         isCompleted: false,
         setCompleted: (value) => set({ isCompleted: value }),
       }),
       {
         name: 'onboarding-storage',
         storage: createJSONStorage(() => AsyncStorage),
       }
     )
   );
   ```

2. **Local State** (for simple cases)
   ```typescript
   // Inside component
   const [isLoading, setIsLoading] = useState(false);
   ```

### Strategy

- **Zustand**: When global state or persistence is needed
- **Local State**: For component-specific state
- **AsyncStorage**: For persistent data (e.g. onboarding status)

## 🗄️ Data Layer

### Supabase Integration

**Service layout:**
```
src/shared/services/
├── supabase-service.ts          # Temel Supabase client
├── recipe-service.ts            # Recipe operations
├── user-service.ts              # User operations
└── recipe-search-service.ts     # Recipe search (later phase)
```

**Usage:**
```typescript
// Service
import { getSupabaseClient } from './supabase-service';

export async function getCookTonightRecipes() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .limit(5);
  return data || [];
}

// View Model
export function useHomeViewModel() {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    getCookTonightRecipes().then(setRecipes);
  }, []);
  
  return { recipes };
}
```

### Type Safety

- TypeScript for type safety
- Type definitions in model files
- Type mapping for Supabase query results

## 🧭 Navigation

### Expo Router

**File-based Routing:**
```
app/
├── _layout.tsx                 # Root layout
├── index.tsx                    # Home route
├── splash.tsx                   # Splash route
├── onboarding.tsx               # Onboarding route
└── enter-ingredients.tsx       # Enter ingredients route
```

**Navigation Helper:**
```typescript
import { router } from 'expo-router';

// Navigate
router.push('/onboarding');
router.replace('/home');

// Type-safe navigation
export type RootStackParamList = {
  index: undefined;
  onboarding: undefined;
  'enter-ingredients': undefined;
};
```

### Navigation Flow

```
App Start
  ↓
app/index.tsx (initial check)
  ↓
  ├─→ [First Launch] → /onboarding
  └─→ [Completed] → / (home)
```

## Styling Architecture

### Approach

1. **MasterFabric Colors** (Splash, Onboarding)
   ```typescript
   import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';
   
   export const styles = StyleSheet.create({
     container: {
       backgroundColor: Colors.light.background,
     },
   });
   ```

2. **Direct Colors** (Home - Dark Theme)
   ```typescript
   const colors = {
     background: '#000000',
     cardBackground: '#1C1C1E',
     primary: '#FF5722',
   };
   
   export const styles = StyleSheet.create({
     container: {
       backgroundColor: colors.background,
     },
   });
   ```

### Style Organization

- One styles file per screen
- Component-specific styles
- StyleSheet API

## Metro Bundler Configuration

### Stubs

Optional dependencies are stubbed:
- Firebase (not used)
- Sentry (not used)
- Optional Expo packages

### Path Aliases

```javascript
config.resolver.alias = {
  '@': path.resolve(projectRoot, 'src'),
};
```

### Local Package Resolution

```javascript
config.resolver.extraNodeModules = {
  '@masterfabric-expo/core': path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
};

config.watchFolders = [
  path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
];
```

## 📦 Package Management

### Local Package

```json
{
  "dependencies": {
    "@masterfabric-expo/core": "file:../../packages/masterfabric-expo-core"
  }
}
```

### Workspace Structure

```
masterfabric-expo/
├── packages/
│   └── masterfabric-expo-core/    # Local package
└── project/
    └── recipio/                    # Application
```

## 🎯 Best Practices

### 1. Import Organization

```typescript
// 1. External packages
import React from 'react';
import { View, Text } from 'react-native';

// 2. MasterFabric Core
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';

// 3. Path aliases
import { SplashScreen } from '@/screens/splash/components/splash-screen';

// 4. Relative imports (same folder only)
import { styles } from './styles';
```

### 2. Component Structure

```typescript
// Component
export function HomeScreen() {
  // Hooks
  const { recipes, isLoading } = useHomeViewModel();
  
  // Early returns
  if (isLoading) return <Loading />;
  
  // Render
  return (
    <View>
      {/* Content */}
    </View>
  );
}
```

### 3. Error Handling

```typescript
try {
  const recipes = await getCookTonightRecipes();
  setRecipes(recipes);
} catch (error) {
  console.error('Error loading recipes:', error);
  // Fallback UI
}
```

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
