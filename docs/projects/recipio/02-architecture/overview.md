# Architecture Overview

Uygulama, **feature-based architecture** (özellik tabanlı mimari) yaklaşımını takip eder. Bu, kodun domain veya özellik bazında organize edildiği ölçeklenebilir ve modüler bir yaklaşımdır. Bu, güçlü bir ayrım sağlar ve kod tabanını sürdürmeyi, test etmeyi ve ölçeklendirmeyi kolaylaştırır.

Bu mimarinin temeli, paylaşılan bileşenler, hook'lar, context'ler ve yardımcı fonksiyonların sağlam bir temelini sağlayan `@masterfabric-expo/core` paketine dayanır. Bu, uygulama genelinde tutarlılığı sağlar ve boilerplate kodunu azaltır.

## 🏗️ Core Principles

### 1. Modularity (Modülerlik)

Her özellik (örn. `splash`, `onboarding`, `home`) kendi kendine yeten bir modüldür. Bu, bir özellik için tüm mantık, UI ve state'in birlikte gruplandırıldığı anlamına gelir.

**Örnek:**
```
src/screens/home/
├── components/        # UI bileşenleri
├── hooks/            # Business logic
├── models/           # Type definitions
├── styles/           # Styling
└── store/            # State management (opsiyonel)
```

### 2. Separation of Concerns (Endişelerin Ayrılması)

Uygulamanın farklı katmanları arasında net bir ayrım korunur:

- **UI Layer**: `components/`, `screens/`, `styles/`
- **Business Logic Layer**: `hooks/`, `store/`, `utils/`
- **Data & Services Layer**: `services/`, `models/`

**Örnek:**
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

### 3. Scalability (Ölçeklenebilirlik)

Yapı büyümek için tasarlanmıştır. Yeni bir özellik eklemek, mevcut kodu bozmadan `src/screens/` altında yeni bir dizin oluşturmak kadar basittir.

## 🔌 MasterFabric Core Integration

Uygulama, `@masterfabric-expo/core` paketinden şu öğeleri kullanır:

### Components
- **ThemedView**: Tema desteği olan View component
- **ThemedText**: Tema desteği olan Text component

### Constants
- **Colors**: MasterFabric color palette

### Contexts
- **ThemeProvider**: Theme context provider

**Kullanım:**
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

## 📊 State Management

Uygulama, state yönetimi için **Zustand** kullanır:

### Kullanım Senaryoları

1. **Onboarding Store** (AsyncStorage ile persistence)
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

2. **Local State** (Basit durumlar için)
   ```typescript
   // Component içinde
   const [isLoading, setIsLoading] = useState(false);
   ```

### State Yönetimi Stratejisi

- ✅ **Zustand**: Global state ve persistence gerektiğinde
- ✅ **Local State**: Component-specific state için
- ✅ **AsyncStorage**: Kalıcı veri için (onboarding durumu)

## 🗄️ Data Layer

### Supabase Integration

**Servis Yapısı:**
```
src/shared/services/
├── supabase-service.ts          # Temel Supabase client
├── recipe-service.ts            # Recipe operations
├── user-service.ts              # User operations
└── recipe-search-service.ts     # Recipe search (sonraki aşama)
```

**Kullanım:**
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

- ✅ TypeScript ile tip güvenliği
- ✅ Model dosyalarında type definitions
- ✅ Supabase query sonuçları için type mapping

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

## 🎨 Styling Architecture

### Styling Yaklaşımı

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
     primary: '#FF9500',
   };
   
   export const styles = StyleSheet.create({
     container: {
       backgroundColor: colors.background,
     },
   });
   ```

### Style Organization

- ✅ Her screen için ayrı styles dosyası
- ✅ Component-specific styles
- ✅ StyleSheet API kullanımı

## 🔧 Metro Bundler Configuration

### Stubs

Optional dependency'ler stub edilir:
- Firebase (kullanılmıyor)
- Sentry (kullanılmıyor)
- Expo optional packages

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

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
