# Recipio - Detaylı Implementation Analizi

## 📋 Genel Bakış

Bu dokümantasyon, Recipio uygulamasının **ilk aşama** implementasyonu için kapsamlı analiz ve gereklilikleri içerir. İlk aşamada sadece **3 temel ekran** oluşturulacak: **Splash**, **Onboarding** ve **Home**. Sistem MasterFabric Expo ekosistemi üzerine inşa edilmiştir ve `@masterfabric-expo/core` paketini kullanır.

---

## 🎯 İlk Aşama Hedefleri

### ✅ Oluşturulacak Ekranlar (Minimal)

1. **Splash Screen** - Uygulama başlangıç ekranı
   - MasterFabric Core bileşenleri kullanılır
   - Basit loading gösterimi
   - Onboarding durumunu kontrol eder

2. **Onboarding Screen** - İlk kullanım tanıtım ekranları
   - Multi-step onboarding flow
   - Zustand + AsyncStorage ile durum yönetimi
   - MasterFabric Core bileşenleri ve renkler

3. **Home Screen** - Ana sayfa (Dashboard)
   - Supabase'den veri çekme
   - Dark theme tasarım
   - Cook Tonight, Recent Activity, Quick Actions bölümleri

### ❌ Oluşturulmayacaklar (Sonraki Aşamalar)

- Malzeme giriş ekranı (Enter Ingredients) - ✅ **Şu an mevcut ama ilk aşamada gerekli değil**
- Tarif listesi (Recipe Results) - ✅ **Şu an mevcut ama ilk aşamada gerekli değil**
- Tarif detayı (Recipe Detail) - ✅ **Şu an mevcut ama ilk aşamada gerekli değil**
- Favoriler ekranı
- Profil ekranı
- Kullanıcı authentication (opsiyonel, sonraki aşama)

---

## 🏗️ Sistem Mimarisi

### 1. MasterFabric Core Package Entegrasyonu

**Package Yapısı:**
```json
{
  "dependencies": {
    "@masterfabric-expo/core": "file:../../packages/masterfabric-expo-core"
  }
}
```

**Kullanılan Bileşenler:**

```typescript
// Components
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { ThemedText } from '@masterfabric-expo/core/dist/components/ThemedText';

// Constants
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

// Contexts
import { ThemeProvider } from '@masterfabric-expo/core/dist/contexts/ThemeContext';
```

**Import Path Yapısı:**
- ✅ `@masterfabric-expo/core/dist/components/ThemedView` - Direkt path kullanımı
- ✅ `@masterfabric-expo/core/dist/constants/Colors` - Constants için direkt path
- ✅ `@masterfabric-expo/core/dist/contexts/ThemeContext` - Context'ler için direkt path

**Önemli Notlar:**
- ❌ Gereksiz import'lar yapılmamalı
- ✅ Sadece kullanılan bileşenler import edilmeli
- ✅ Type-safe import'lar kullanılmalı
- ✅ Metro bundler path resolution için `@ts-ignore` kullanılabilir (gerekirse)

**Kullanım Örnekleri:**

```typescript
// ✅ DOĞRU: Splash Screen'de kullanım
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

### 2. Expo Router Yapılandırması

**Dosya Yapısı:**
```
app/
├── _layout.tsx                    # Root layout (ThemeProvider wrapper)
├── index.tsx                       # Home screen route
├── splash.tsx                      # Splash screen route (opsiyonel, app/index.tsx'ten yönetilebilir)
├── onboarding.tsx                  # Onboarding screen route
├── enter-ingredients.tsx           # Enter ingredients route (sonraki aşama)
├── recipe-results.tsx              # Recipe results route (sonraki aşama)
└── recipe-detail.tsx               # Recipe detail route (sonraki aşama)
```

**Root Layout Yapısı:**

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '@masterfabric-expo/core/dist/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="index" />
        {/* Sonraki aşama için */}
        <Stack.Screen name="enter-ingredients" />
        <Stack.Screen name="recipe-results" />
        <Stack.Screen name="recipe-detail" />
      </Stack>
    </ThemeProvider>
  );
}
```

**Routing Mantığı:**

```
App Start
  ↓
app/index.tsx (ilk açılış kontrolü)
  ↓
  ├─→ [İlk kullanım] → /onboarding
  └─→ [Daha önce açıldı] → / (home)
```

**Navigation Helper:**

```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  splash: undefined;
  onboarding: undefined;
  index: undefined; // Home screen
  'enter-ingredients': undefined;
  'recipe-results': { ingredients?: string };
  'recipe-detail': { recipeId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

### 3. Import Yapısı ve Path Aliases

**tsconfig.json Yapılandırması:**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@/screens/*": ["./src/screens/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/navigation/*": ["./src/navigation/*"]
    }
  }
}
```

**Metro Config Path Alias:**

```javascript
// metro.config.js
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(projectRoot, 'src'),
  },
  // ...
};
```

**Import Örnekleri:**

```typescript
// ✅ DOĞRU: Path alias kullanımı
import { SplashScreen } from '@/screens/splash/components/splash-screen';
import { useSplashNavigation } from '@/screens/splash/hooks/use-splash-navigation';
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';
import { getSupabaseClient } from '@/shared/services/supabase-service';

// ❌ YANLIŞ: Relative import'lar
import { SplashScreen } from '../../../screens/splash/components/splash-screen';
```

### 4. State Management

**Yapı:**

- **Splash Screen**: Local state yeterli (`useState`)
- **Onboarding Screen**: Zustand store + AsyncStorage persistence
- **Home Screen**: Local state + Supabase data fetching

**Onboarding Store Örneği:**

```typescript
// src/screens/onboarding/store/onboarding-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingStore {
  isCompleted: boolean;
  setCompleted: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isCompleted: false,
      setCompleted: (value: boolean) => set({ isCompleted: value }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**Storage Helper:**

```typescript
// src/shared/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@recipio:onboarding_completed',
} as const;

export const storage = {
  async setOnboardingCompleted(value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  },

  async getOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error reading onboarding status:', error);
      return false;
    }
  },
};
```

### 5. Styling Yapısı

**Yaklaşım:**

- Her ekran için ayrı styles dosyası
- Dark theme için direkt color tanımları (Home screen)
- MasterFabric Colors kullanımı (Splash, Onboarding)
- StyleSheet API kullanımı

**Home Screen Styling (Dark Theme):**

```typescript
// src/screens/home/styles/dashboard.styles.ts
import { StyleSheet } from 'react-native';

// Dark theme colors matching the design exactly
const colors = {
  background: '#000000', // Pure black
  cardBackground: '#1C1C1E', // Dark grey card
  text: '#FFFFFF', // White text
  textSecondary: '#8E8E93', // Light grey secondary text
  primary: '#FF9500', // Orange accent
  success: '#34C759', // Green for VEGAN tag
  border: '#38383A', // Border color
};

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // ... diğer stiller
});
```

**Splash/Onboarding Styling (MasterFabric Colors):**

```typescript
// src/screens/splash/styles/splash-screen.styles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.splashSubtext,
  },
});
```

### 6. Supabase Entegrasyonu

**Servis Yapısı:**

```
src/shared/services/
├── supabase-service.ts          # Temel Supabase client (GEREKLİ)
├── recipe-service.ts            # Tarif işlemleri (GEREKLİ)
├── user-service.ts              # Kullanıcı işlemleri (GEREKLİ)
├── recipe-search-service.ts     # Tarif arama (SONRAKI AŞAMA)
└── index.ts                     # Central export
```

**Supabase Service:**

```typescript
// src/shared/services/supabase-service.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase URL ve Anon Key'i al
// Öncelik sırası: app.json -> .env -> process.env
const SUPABASE_URL = 
  Constants.expoConfig?.extra?.supabaseUrl || 
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;

const SUPABASE_ANON_KEY = 
  Constants.expoConfig?.extra?.supabaseAnonKey || 
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL ve Anon Key bulunamadı!');
  }

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  console.log('✅ Supabase client başlatıldı');
  return supabaseClient;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}
```

**app.json Yapılandırması:**

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project-id.supabase.co",
      "supabaseAnonKey": "your-anon-key-here"
    }
  }
}
```

**Recipe Service Kullanımı:**

```typescript
// src/shared/services/recipe-service.ts
import { getSupabaseClient } from './supabase-service';

export async function getCookTonightRecipes(filters?: RecipeFilters): Promise<Recipe[]> {
  try {
    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('recipes')
      .select('*')
      .limit(filters?.limit || 5);

    const { data, error } = await query;
    
    if (error) {
      console.error('❌ Error fetching recipes:', error);
      return [];
    }

    // Mapping logic...
    return mappedRecipes;
  } catch (error) {
    console.error('❌ Error in getCookTonightRecipes:', error);
    return [];
  }
}
```

### 7. Metro Bundler Yapılandırması ve Stubs

**Metro Config:**

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Stub paths for optional dependencies
const firebaseStub = path.resolve(projectRoot, 'metro-stubs/firebase-stub.js');
const sentryStub = path.resolve(projectRoot, 'metro-stubs/sentry-stub.js');
const sliderStub = path.resolve(projectRoot, 'metro-stubs/slider-stub.js');
const expoHapticsStub = path.resolve(projectRoot, 'metro-stubs/expo-haptics-stub.js');
const expoBatteryStub = path.resolve(projectRoot, 'metro-stubs/expo-battery-stub.js');
const expoAvStub = path.resolve(projectRoot, 'metro-stubs/expo-av-stub.js');
const expoWebBrowserStub = path.resolve(projectRoot, 'metro-stubs/expo-web-browser-stub.js');

// Custom resolver to handle optional dependencies
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Stub Firebase modules
  if (moduleName.startsWith('firebase/') || moduleName === 'firebase') {
    return { filePath: firebaseStub, type: 'sourceFile' };
  }

  // Stub Sentry
  if (moduleName === '@sentry/react-native') {
    return { filePath: sentryStub, type: 'sourceFile' };
  }

  // Stub other optional packages...
  
  // Use default resolver for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Path alias support
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(projectRoot, 'src'),
  },
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
  extraNodeModules: {
    '@masterfabric-expo/core': path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
    'firebase': firebaseStub,
    '@sentry/react-native': sentryStub,
    // ... diğer stubs
  },
};

// Watch local packages
config.watchFolders = [
  path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
];

module.exports = config;
```

**Stub Dosyaları:**

```
metro-stubs/
├── firebase-stub.js              # Firebase stub (kullanılmıyor)
├── sentry-stub.js                # Sentry stub (kullanılmıyor)
├── slider-stub.js                # Slider stub (kullanılmıyor)
├── expo-haptics-stub.js          # Expo Haptics stub (kullanılmıyor)
├── expo-battery-stub.js          # Expo Battery stub (kullanılmıyor)
├── expo-av-stub.js               # Expo AV stub (kullanılmıyor)
└── expo-web-browser-stub.js      # Expo Web Browser stub (kullanılmıyor)
```

**Stub Örneği:**

```javascript
// metro-stubs/firebase-stub.js
module.exports = {
  initializeApp: () => ({}),
  getAuth: () => ({}),
  // ... diğer mock fonksiyonlar
};
```

**Önemli Notlar:**
- ✅ Supabase **stub edilmez** - gerçek package kullanılır
- ✅ Firebase ve Sentry stub edilir (kullanılmıyor)
- ✅ Optional Expo paketleri stub edilir

### 8. Stub'dan Pakete Geçiş (Genel Kural - Tüm Stub'lar İçin)

**Durum:** İleride stub edilmiş herhangi bir paketi kullanmak istediğinizde, stub'u kaldırıp gerçek paketi yükleyebilirsiniz. Bu kural **tüm stub'larda bulunan paketler** için geçerlidir.

**Stub'da Bulunan Paketler:**
- `firebase` / `firebase/*` (Firebase SDK)
- `@sentry/react-native` (Sentry error tracking)
- `@react-native-community/slider` (Slider component)
- `expo-haptics` (Haptic feedback)
- `expo-battery` (Battery information)
- `expo-av` (Audio/Video)
- `expo-web-browser` (Web browser)

**Genel Geçiş Süreci (Tüm Paketler İçin):**

#### Adım 1: Paketi Yükleyin

```bash
# Örnek: Firebase için
npm install firebase

# Örnek: Sentry için
npm install @sentry/react-native

# Örnek: expo-haptics için
npm install expo-haptics

# Örnek: expo-av için
npm install expo-av

# Genel format: npm install <package-name>
```

#### Adım 2: Metro Config'den Stub'u Kaldırın

`metro.config.js` dosyasında 3 yerde değişiklik yapmanız gerekir:

**2.1. Stub Path Tanımını Kaldırın veya Comment Edin:**

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const config = getDefaultConfig(projectRoot);

// Stub paths - Kullanmak istediğiniz paketin stub'unu kaldırın
// const firebaseStub = path.resolve(projectRoot, 'metro-stubs/firebase-stub.js'); // ← Kaldırıldı
const sentryStub = path.resolve(projectRoot, 'metro-stubs/sentry-stub.js');
const sliderStub = path.resolve(projectRoot, 'metro-stubs/slider-stub.js');
// ... diğer stub'lar
```

**2.2. resolveRequest Fonksiyonundan Stub Kontrolünü Kaldırın:**

```javascript
// Custom resolver
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Kullanmak istediğiniz paketin stub kontrolünü kaldırın veya comment edin
  
  // Örnek: Firebase için
  // if (moduleName.startsWith('firebase/') || moduleName === 'firebase') {
  //   return { filePath: firebaseStub, type: 'sourceFile' };
  // } // ← Bu satırları kaldırın veya comment edin

  // Örnek: Sentry için
  // if (moduleName === '@sentry/react-native') {
  //   return { filePath: sentryStub, type: 'sourceFile' };
  // } // ← Kullanmak istiyorsanız bu satırları kaldırın

  // Örnek: expo-haptics için
  // if (moduleName === 'expo-haptics') {
  //   return { filePath: expoHapticsStub, type: 'sourceFile' };
  // } // ← Kullanmak istiyorsanız bu satırları kaldırın

  // Diğer stub kontrolleri (kullanılmayan paketler için)
  if (moduleName === '@sentry/react-native') {
    return { filePath: sentryStub, type: 'sourceFile' };
  }
  // ... diğer stub kontrolleri

  // Use default resolver for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};
```

**2.3. extraNodeModules'dan Stub Referansını Kaldırın:**

```javascript
config.resolver.extraNodeModules = {
  '@masterfabric-expo/core': path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
  // 'firebase': firebaseStub, // ← Kullanmak istiyorsanız bu satırı kaldırın
  // '@sentry/react-native': sentryStub, // ← Kullanmak istiyorsanız bu satırı kaldırın
  // 'expo-haptics': expoHapticsStub, // ← Kullanmak istiyorsanız bu satırı kaldırın
  // ... diğer stub referansları
};
```

#### Adım 3: Stub Dosyasını Silin (Opsiyonel)

```bash
# Stub dosyasını silebilirsiniz (artık gerekli değil)
# Örnek: Firebase için
rm metro-stubs/firebase-stub.js

# Örnek: Sentry için
rm metro-stubs/sentry-stub.js

# Örnek: expo-haptics için
rm metro-stubs/expo-haptics-stub.js

# Not: Silmek zorunlu değildir, sadece kullanılmaz
```

#### Adım 4: Paketi Import Edip Kullanın

```typescript
// Artık paketi normal şekilde import edebilirsiniz

// Örnek: Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Örnek: Sentry
import * as Sentry from '@sentry/react-native';
Sentry.init({ dsn: 'your-sentry-dsn' });

// Örnek: expo-haptics
import * as Haptics from 'expo-haptics';
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Örnek: expo-av
import { Audio } from 'expo-av';
const sound = new Audio.Sound();

// Örnek: expo-web-browser
import * as WebBrowser from 'expo-web-browser';
await WebBrowser.openBrowserAsync('https://example.com');

// Örnek: @react-native-community/slider
import Slider from '@react-native-community/slider';
<Slider value={50} minimumValue={0} maximumValue={100} />
```

#### Adım 5: Native Modül Kurulumu (Gerekirse)

Bazı paketler native modül gerektirir (özellikle Expo paketleri):

```bash
# iOS için CocoaPods
cd ios
pod install
cd ..

# Android için
# Gradle sync otomatik olarak yapılır (Expo paketleri için)
# Native modül gerektiren paketler için manuel kurulum gerekebilir
```

**Native Modül Gerektiren Paketler:**
- ✅ `expo-haptics` - Native modül gerektirir
- ✅ `expo-battery` - Native modül gerektirir
- ✅ `expo-av` - Native modül gerektirir
- ✅ `expo-web-browser` - Native modül gerektirir
- ✅ `@sentry/react-native` - Native modül gerektirir
- ⚠️ `firebase` - Bazı modüller native gerektirebilir
- ⚠️ `@react-native-community/slider` - Native modül gerektirir

#### Adım 6: Metro Bundler'ı Yeniden Başlatın

```bash
# Cache'i temizleyip yeniden başlatın (ÖNEMLİ!)
npx expo start --clear

# Veya
npm start -- --clear
```

**Önemli:** Metro config değişikliklerinden sonra mutlaka `--clear` flag'i ile yeniden başlatın, aksi halde stub hala kullanılabilir.

#### Genel Geçiş Checklist (Tüm Paketler İçin)

Herhangi bir stub edilmiş paketi kullanmak için:

- [ ] **Paketi yükleyin**: `npm install <package-name>`
- [ ] **Metro config'den stub path tanımını kaldırın** (veya comment edin)
- [ ] **resolveRequest fonksiyonundan stub kontrolünü kaldırın**
- [ ] **extraNodeModules'dan stub referansını kaldırın**
- [ ] **Stub dosyasını silin** (opsiyonel, zorunlu değil)
- [ ] **Paketi import edip kullanın**
- [ ] **Native modül kurulumu yapın** (gerekirse: `cd ios && pod install`)
- [ ] **Metro bundler'ı `--clear` ile yeniden başlatın**: `npx expo start --clear`

#### Paket-Specific Notlar

**Firebase:**
- Tüm Firebase modülleri için (`firebase/app`, `firebase/auth`, `firebase/firestore`, vb.) tek stub kontrolü yeterli
- Native modül gerektirebilir (özellikle Auth ve Analytics için)

**Sentry:**
- `@sentry/react-native` paketi native modül gerektirir
- iOS için CocoaPods kurulumu gerekli
- Android için Gradle sync gerekli

**Expo Paketleri (expo-haptics, expo-battery, expo-av, expo-web-browser):**
- Hepsi native modül gerektirir
- `pod install` gerekli (iOS)
- Expo SDK versiyonu ile uyumlu olmalı

**Slider:**
- `@react-native-community/slider` native modül gerektirir
- iOS ve Android için native kurulum gerekli

**Önemli Genel Notlar:**
- ✅ **Stub'dan pakete geçiş her zaman mümkündür** - Tüm stub'larda bulunan paketler için geçerlidir
- ✅ **Stub dosyasını silmek zorunlu değildir** - Sadece kullanılmaz, ama silmek daha temizdir
- ✅ **Metro config'i güncelledikten sonra mutlaka `--clear` ile yeniden başlatın** - Aksi halde stub hala kullanılabilir
- ✅ **Native modül gerektiren paketler için iOS/Android kurulumu gerekebilir** - `pod install` veya Gradle sync
- ✅ **Paketi kullanmaya başladıktan sonra stub artık çalışmaz** - Çünkü gerçek paket yüklü ve Metro onu bulur
- ✅ **Birden fazla paketi aynı anda geçirebilirsiniz** - Her paket için aynı adımları tekrarlayın
- ✅ **Stub'u kaldırmadan paketi yüklerseniz hata alabilirsiniz** - Metro stub'u kullanmaya devam eder

---

## 📁 Dosya Yapısı ve İsimlendirme

### Tam Klasör Yapısı

```
project/recipio/
├── app/                                    # Expo Router routes
│   ├── _layout.tsx                         # Root layout (ThemeProvider)
│   ├── index.tsx                           # Home screen route (initial check)
│   ├── splash.tsx                          # Splash screen route (opsiyonel)
│   ├── onboarding.tsx                      # Onboarding screen route
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
│   │   │   │   └── splash-screen.styles.ts # Styles
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
│   │   │   │   └── onboarding-screen.styles.ts # Styles
│   │   │   └── index.ts                    # Export file
│   │   │
│   │   └── home/
│   │       ├── components/
│   │       │   ├── home-screen.tsx         # Main home component
│   │       │   ├── dashboard-header.tsx   # Header component
│   │       │   ├── current-plan-card.tsx  # Plan card component
│   │       │   ├── quick-actions.tsx      # Quick actions component
│   │       │   ├── cook-tonight-section.tsx # Cook tonight section
│   │       │   ├── recent-activity-section.tsx # Recent activity section
│   │       │   └── bottom-tabs.tsx         # Bottom tabs component
│   │       ├── hooks/
│   │       │   └── use-home-view-model.ts  # View model hook
│   │       ├── models/
│   │       │   └── home-models.ts          # Type definitions
│   │       ├── styles/
│   │       │   ├── home-screen.styles.ts   # Main styles
│   │       │   └── dashboard.styles.ts    # Dashboard styles
│   │       └── index.ts                    # Export file
│   │
│   └── shared/
│       ├── constants/
│       │   └── app-config.ts               # App configuration
│       ├── services/
│       │   ├── supabase-service.ts         # Supabase client (TEMEL)
│       │   ├── recipe-service.ts           # Recipe operations
│       │   ├── user-service.ts             # User operations
│       │   ├── recipe-search-service.ts     # Recipe search (sonraki aşama)
│       │   └── index.ts                     # Central export
│       └── utils/
│           └── storage.ts                   # AsyncStorage helpers
│
├── metro-stubs/                             # Optional dependency stubs
│   ├── firebase-stub.js
│   ├── sentry-stub.js
│   ├── slider-stub.js
│   ├── expo-haptics-stub.js
│   ├── expo-battery-stub.js
│   ├── expo-av-stub.js
│   └── expo-web-browser-stub.js
│
├── package.json                             # Dependencies
├── tsconfig.json                            # TypeScript config
├── metro.config.js                          # Metro bundler config
├── app.json                                 # Expo config
└── index.js                                 # Entry point
```

### İsimlendirme Kuralları

**Dosya İsimlendirme:**
- ✅ `kebab-case` kullanılır: `splash-screen.tsx`, `use-splash-navigation.ts`
- ✅ Component dosyaları: `component-name.tsx`
- ✅ Hook dosyaları: `use-hook-name.ts`
- ✅ Model dosyaları: `model-name-models.ts`
- ✅ Style dosyaları: `screen-name.styles.ts`
- ✅ Store dosyaları: `store-name-store.ts`

**Klasör İsimlendirme:**
- ✅ `kebab-case` kullanılır: `splash-screen`, `recipe-results`
- ✅ Her screen için aynı yapı: `components/`, `hooks/`, `models/`, `styles/`, `store/`

**Export Dosyaları:**
- ✅ Her screen klasöründe `index.ts` olmalı
- ✅ Central export pattern kullanılır

**Örnek Export:**

```typescript
// src/screens/splash/index.ts
export { SplashScreen } from './components/splash-screen';
export { useSplashNavigation } from './hooks/use-splash-navigation';
export type { SplashConfig } from './models/splash-models';
```

---

## 🔧 Gerekli Package'ler

### Core Dependencies

```json
{
  "dependencies": {
    "expo": "~54.0.31",
    "expo-router": "~6.0.17",
    "expo-splash-screen": "~31.0.12",
    "expo-constants": "~18.0.13",
    "expo-device": "~8.0.10",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "~0.21.0",
    "@masterfabric-expo/core": "file:../../packages/masterfabric-expo-core",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@expo/vector-icons": "^15.0.2",
    "zustand": "^4.4.0"
  },
  "overrides": {
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.1.10",
    "typescript": "~5.9.2"
  }
}
```

### Package Açıklamaları

- **expo-router**: File-based routing için
- **@masterfabric-expo/core**: MasterFabric Core bileşenleri ve utilities
- **@supabase/supabase-js**: Supabase client library
- **zustand**: State management (onboarding store için)
- **@react-native-async-storage/async-storage**: Local storage (onboarding durumu için)
- **react-native-safe-area-context**: Safe area handling
- **@expo/vector-icons**: Icon library (MaterialIcons kullanımı)

---

## 🎨 MasterFabric Core Kullanımı

### Kullanılan Bileşenler

**Components:**
- `ThemedView` - Theme-aware View component
- `ThemedText` - Theme-aware Text component

**Constants:**
- `Colors` - MasterFabric color palette

**Contexts:**
- `ThemeProvider` - Theme context provider

### Kullanım Örnekleri

**Splash Screen:**

```typescript
import { ThemedText } from '@masterfabric-expo/core/dist/components/ThemedText';
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

export function SplashScreen() {
  return (
    <SafeAreaView style={splashScreenStyles.container}>
      <ThemedView style={splashScreenStyles.content}>
        <ThemedText style={splashScreenStyles.title}>Recipio</ThemedText>
        <ThemedText style={splashScreenStyles.subtitle}>
          Find recipes based on your ingredients
        </ThemedText>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    </SafeAreaView>
  );
}
```

**Onboarding Screen:**

```typescript
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';

export function OnboardingScreen() {
  return (
    <ThemedView style={onboardingScreenStyles.content}>
      {/* Content */}
    </ThemedView>
  );
}
```

**Root Layout:**

```typescript
import { ThemeProvider } from '@masterfabric-expo/core/dist/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Screens */}
      </Stack>
    </ThemeProvider>
  );
}
```

---

## 🛠️ Helper'lar ve Utilities

### Mevcut Helper'lar

**Storage Helper:**
- `src/shared/utils/storage.ts` - AsyncStorage wrapper

**App Config:**
- `src/shared/constants/app-config.ts` - App-wide constants

### Kullanılabilir Helper'lar (MasterFabric Core'dan)

**⚠️ NOT: Bu helper'lar şu an kullanılmıyor, ama gerektiğinde kullanılabilir:**

1. **Snackbar Service** (Kullanılacaksa)
   - Toast mesajları için
   - Başarı/hata bildirimleri için
   - Import: `@masterfabric-expo/core/dist/services/snackbar-service`

2. **Typography** (Kullanılacaksa)
   - Text styling utilities
   - Font size helpers
   - Import: `@masterfabric-expo/core/dist/utils/typography`

3. **Logger** (Kullanılacaksa)
   - Debug logging
   - Error logging
   - Import: `@masterfabric-expo/core/dist/utils/logger`

**Kullanım Örneği (Gelecekte):**

```typescript
// Snackbar kullanımı (gelecekte)
import { useSnackbar } from '@masterfabric-expo/core/dist/services/snackbar-service';

function MyComponent() {
  const snackbar = useSnackbar();
  
  const handleSave = () => {
    snackbar.success('Recipe saved!');
  };
}

// Logger kullanımı (gelecekte)
import { logger } from '@masterfabric-expo/core/dist/utils/logger';

logger.debug('Debug message');
logger.error('Error message');
```

---

## ⚠️ Hata Önleme Stratejileri

### 1. Router/Navigation Hataları

**Sorun:** TypeScript router type hataları

**Çözüm:**
```typescript
// ✅ DOĞRU: Navigation types tanımla
export type RootStackParamList = {
  index: undefined;
  splash: undefined;
  onboarding: undefined;
};

// ✅ DOĞRU: Type-safe navigation
import { router } from 'expo-router';
router.replace('/onboarding');

// ❌ YANLIŞ
router.replace('/onboarding' as any);
```

### 2. Import Hataları

**Sorun:** Yanlış import path'leri

**Çözüm:**
- ✅ Her screen klasöründe `index.ts` export dosyası olmalı
- ✅ Path aliases kullanılmalı (`@/screens/...`)
- ✅ Relative import'lar sadece aynı klasör içinde

### 3. MasterFabric Package Hataları

**Sorun:** Package bulunamıyor

**Çözüm:**
- ✅ Package'in `package.json`'da dependency olarak eklenmesi
- ✅ Local package için workspace link (`file:../../packages/masterfabric-expo-core`)
- ✅ Metro config'de `watchFolders` ve `extraNodeModules` yapılandırması
- ✅ Sadece documented export'lar kullanılmalı

### 4. Supabase Hataları

**Sorun:** Supabase client başlatılamıyor

**Çözüm:**
- ✅ `app.json`'da `extra` bölümüne Supabase bilgileri eklenmeli
- ✅ Environment variables kontrol edilmeli
- ✅ Error handling eklenmeli

### 5. TypeScript Hataları

**Sorun:** Type tanımları eksik

**Çözüm:**
- ✅ Her model için type tanımları
- ✅ Navigation types
- ✅ Component prop types
- ✅ `any` kullanımından kaçınılmalı

---

## 📝 İlk Aşama Implementation Checklist

### Phase 1: Setup & Configuration
- [x] MasterFabric core package ekleme ve link etme
- [x] Expo Router yapılandırması
- [x] TypeScript path aliases yapılandırması
- [x] Navigation types tanımlama
- [x] Metro config yapılandırması (stubs, path aliases)
- [x] Supabase yapılandırması (app.json)
- [x] Gerekli package'lerin eklenmesi

### Phase 2: Splash Screen
- [x] Splash screen component oluşturma
- [x] Splash navigation hook
- [x] Splash models ve types
- [x] Splash styles (MasterFabric Colors)
- [x] App route yapılandırması (`app/index.tsx`)

### Phase 3: Onboarding Screen
- [x] Onboarding screen component
- [x] Step content component
- [x] Step controls component
- [x] Step indicator component
- [x] Onboarding store (Zustand + AsyncStorage)
- [x] Onboarding models
- [x] Onboarding styles (MasterFabric Colors)
- [x] App route yapılandırması (`app/onboarding.tsx`)

### Phase 4: Home Screen
- [x] Home screen component (Dashboard)
- [x] Dashboard header component
- [x] Current plan card component
- [x] Quick actions component
- [x] Cook tonight section component
- [x] Recent activity section component
- [x] Bottom tabs component
- [x] Home view model hook (Supabase integration)
- [x] Home models
- [x] Home styles (Dark theme)
- [x] App route yapılandırması (`app/index.tsx`)

### Phase 5: Supabase Integration
- [x] Supabase service oluşturma
- [x] Recipe service oluşturma
- [x] User service oluşturma
- [x] Supabase client yapılandırması
- [x] Error handling

### Phase 6: Root Layout
- [x] `app/_layout.tsx` oluşturma
- [x] ThemeProvider wrapper
- [x] Stack navigator setup

### Phase 7: Testing & Validation
- [x] Tüm ekranlar arası navigasyon testi
- [x] TypeScript hata kontrolü
- [x] Import path kontrolü
- [x] MasterFabric component kullanım kontrolü
- [x] Supabase bağlantı testi
- [x] Linter hata kontrolü

---

## 🎨 Basitlik Prensipleri

### Yapılacaklar ✅
- Minimal state yönetimi
- Basit navigation (direkt router kullanımı)
- Sadece gerekli component'ler
- Type-safe kod
- Clean import yapısı
- Modüler servis yapısı (supabase-service, recipe-service, user-service)
- Stub'lar ile optional dependency yönetimi

### Yapılmayacaklar ❌
- Karmaşık state management (sadece gerekli yerlerde Zustand)
- Gereksiz abstraction'lar
- Over-engineering
- Karmaşık navigation wrapper'lar
- Gereksiz dependency'ler
- Firebase/Sentry entegrasyonu (stub edilmiş)

---

## 🚀 Sonraki Adımlar

Bu analiz tamamlandıktan sonra:

1. **Setup Phase**: Package'lerin eklenmesi ve yapılandırma ✅
2. **Splash Implementation**: İlk ekranın oluşturulması ✅
3. **Onboarding Implementation**: İkinci ekranın oluşturulması ✅
4. **Home Implementation**: Üçüncü ekranın oluşturulması ✅
5. **Supabase Integration**: Veri çekme işlemleri ✅
6. **Integration & Testing**: Tüm ekranların birleştirilmesi ve test edilmesi ✅

**Sonraki Aşamalar:**
- Enter Ingredients screen
- Recipe Results screen
- Recipe Detail screen
- Favorites screen
- Profile screen
- Authentication (opsiyonel)

---

## 📚 Referanslar

- [MasterFabric Core Documentation](../../../../packages/masterfabric-expo-core/README.md)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Recipio Features Documentation](./01-features/)
- [Recipio Architecture Documentation](./02-architecture/)

---

## 📌 Önemli Notlar

1. **Minimal Yaklaşım**: İlk aşamada sadece 3 ekran (Splash, Onboarding, Home)
2. **MasterFabric Core**: Tüm UI bileşenleri MasterFabric Core'dan alınır
3. **Supabase**: Temel veri çekme işlemleri için kullanılır
4. **Stubs**: Optional dependency'ler stub edilir (Firebase, Sentry)
5. **Modüler Yapı**: Her servis ayrı dosyada, temiz export yapısı
6. **Type Safety**: Tüm kod TypeScript ile type-safe
7. **Path Aliases**: `@/` prefix ile temiz import'lar
8. **Dark Theme**: Home screen için özel dark theme tasarımı

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0  
**Durum:** ✅ İlk aşama tamamlandı
