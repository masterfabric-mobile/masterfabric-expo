# Folder Structure

Recipio uygulamasının klasör yapısı, mevcut çalışan sisteme göre organize edilmiştir.

## 📁 Proje Kök Yapısı

```
project/recipio/
├── app/                                    # Expo Router routes
│   ├── _layout.tsx                         # Root layout (ThemeProvider)
│   ├── index.tsx                           # Home screen route (initial check)
│   ├── splash.tsx                          # Splash screen route (opsiyonel)
│   ├── onboarding.tsx                       # Onboarding screen route
│   ├── enter-ingredients.tsx               # Enter ingredients route (sonraki aşama)
│   ├── recipe-results.tsx                  # Recipe results route (sonraki aşama)
│   └── recipe-detail.tsx                   # Recipe detail route (sonraki aşama)
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
│       │   ├── supabase-service.ts        # Supabase client (TEMEL)
│       │   ├── recipe-service.ts          # Recipe operations
│       │   ├── user-service.ts            # User operations
│       │   ├── recipe-search-service.ts   # Recipe search (sonraki aşama)
│       │   └── index.ts                   # Central export
│       └── utils/
│           └── storage.ts                  # AsyncStorage helpers
│
├── metro-stubs/                            # Optional dependency stubs
│   ├── firebase-stub.js                   # Firebase stub (kullanılmıyor)
│   ├── sentry-stub.js                     # Sentry stub (kullanılmıyor)
│   ├── slider-stub.js                     # Slider stub (kullanılmıyor)
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

## 📂 Ekran Yapısı (Screen Structure)

Her ekran, aşağıdaki yapıyı takip eder:

```
src/screens/[screen-name]/
├── components/                            # Ekrana özel bileşenler
│   ├── [screen-name]-screen.tsx          # Ana ekran bileşeni
│   └── [component-name].tsx              # Diğer bileşenler
├── hooks/                                 # Custom hook'lar
│   └── use-[screen-name]-view-model.ts    # View model hook
├── models/                                # Ekrana özel modeller
│   └── [screen-name]-models.ts           # Type definitions
├── store/                                 # Zustand store (opsiyonel)
│   └── [screen-name]-store.ts            # State management
├── styles/                                # Stil dosyaları
│   └── [screen-name]-screen.styles.ts    # Styles
├── utils/                                 # Yardımcı fonksiyonlar (opsiyonel)
│   └── index.ts
└── index.ts                               # Public exports
```

## 📋 Örnek: Home Screen Yapısı

```
src/screens/home/
├── components/
│   ├── home-screen.tsx                    # Ana container
│   ├── dashboard-header.tsx              # Header bölümü
│   ├── current-plan-card.tsx             # Plan kartı
│   ├── quick-actions.tsx                 # Hızlı erişim butonları
│   ├── cook-tonight-section.tsx          # Cook Tonight bölümü
│   ├── recent-activity-section.tsx       # Recent Activity bölümü
│   └── bottom-tabs.tsx                   # Alt tab navigasyonu
├── hooks/
│   └── use-home-view-model.ts            # Supabase data fetching
├── models/
│   └── home-models.ts                    # Recipe, Activity, QuickAction types
├── styles/
│   ├── home-screen.styles.ts            # Container styles
│   └── dashboard.styles.ts              # Dashboard styles (Dark theme)
└── index.ts
```

## 🔧 Shared Klasör Yapısı

```
src/shared/
├── constants/
│   └── app-config.ts                      # App-wide constants
│
├── services/
│   ├── supabase-service.ts               # Supabase client (TEMEL)
│   ├── recipe-service.ts                 # Recipe operations
│   │   ├── getCookTonightRecipes()       # Random recipes
│   │   ├── getRecentActivities()         # User activities
│   │   └── getMonthlyRecipesCount()      # Monthly count
│   ├── user-service.ts                  # User operations
│   │   ├── getCurrentUserProfile()      # User profile
│   │   └── getGreeting()                # Time-based greeting
│   ├── recipe-search-service.ts         # Recipe search (sonraki aşama)
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

## 🎨 MasterFabric Core Kullanımı

`@masterfabric-expo/core` paketi şu şekilde kullanılır:

**Import Path'leri:**
```typescript
// Components
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { ThemedText } from '@masterfabric-expo/core/dist/components/ThemedText';

// Constants
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

// Contexts
import { ThemeProvider } from '@masterfabric-expo/core/dist/contexts/ThemeContext';
```

**Kullanım Örneği:**
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

## 📝 İsimlendirme Kuralları

### Dosya İsimlendirme
- ✅ **kebab-case** kullanılır: `splash-screen.tsx`, `use-splash-navigation.ts`
- ✅ Component dosyaları: `component-name.tsx`
- ✅ Hook dosyaları: `use-hook-name.ts`
- ✅ Model dosyaları: `model-name-models.ts`
- ✅ Style dosyaları: `screen-name.styles.ts`
- ✅ Store dosyaları: `store-name-store.ts`

### Klasör İsimlendirme
- ✅ **kebab-case** kullanılır: `splash-screen`, `recipe-results`
- ✅ Her screen için aynı yapı: `components/`, `hooks/`, `models/`, `styles/`, `store/`

### Export Dosyaları
- ✅ Her screen klasöründe `index.ts` olmalı
- ✅ Central export pattern kullanılır

**Örnek Export:**
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

**Kullanım:**
```typescript
// ✅ DOĞRU: Path alias kullanımı
import { SplashScreen } from '@/screens/splash/components/splash-screen';
import { getSupabaseClient } from '@/shared/services/supabase-service';

// ❌ YANLIŞ: Relative import'lar
import { SplashScreen } from '../../../screens/splash/components/splash-screen';
```

## 🗂️ Metro Stubs Yapısı

```
metro-stubs/
├── firebase-stub.js              # Firebase stub (kullanılmıyor)
├── sentry-stub.js                # Sentry stub (kullanılmıyor)
├── slider-stub.js                # Slider stub (kullanılmıyor)
├── expo-haptics-stub.js          # Expo Haptics stub
├── expo-battery-stub.js          # Expo Battery stub
├── expo-av-stub.js               # Expo AV stub
└── expo-web-browser-stub.js      # Expo Web Browser stub
```

**Önemli Notlar:**
- ✅ Supabase **stub edilmez** - gerçek package kullanılır
- ✅ Firebase ve Sentry stub edilir (kullanılmıyor)
- ✅ Optional Expo paketleri stub edilir

## 📦 Package Yapısı

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

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
