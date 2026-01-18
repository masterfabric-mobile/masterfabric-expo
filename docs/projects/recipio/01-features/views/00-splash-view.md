# 0. Splash View

Splash ekranı, kullanıcının uygulamayı açtığında gördüğü ilk ekrandır. Ana amacı, uygulamanın arka planda başlatılması sırasında sorunsuz bir giriş noktası sağlamaktır.

## 🎨 Design

### Layout

```
+-----------------------------------------------------+
|                                                     |
|                                                     |
|                                                     |
|                                                     |
|                  [App Logo]                         |
|                                                     |
|                  Recipio 🍳                         |
|                                                     |
|         "Find recipes based on your ingredients"   |
|                                                     |
|                                                     |
|              (Spinner: Yükleniyor...)              |
|                                                     |
+-----------------------------------------------------+
```

### Styling

**MasterFabric Colors Kullanımı:**
```typescript
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

## 🏗️ Architecture & Components

Bu görünüm `src/screens/splash/` klasörü altında yer alır.

### Dosya Yapısı

```
src/screens/splash/
├── components/
│   └── splash-screen.tsx          # Ana splash ekranı bileşeni
├── hooks/
│   └── use-splash-navigation.ts   # Navigation hook (opsiyonel)
├── models/
│   └── splash-models.ts           # Type definitions
├── styles/
│   └── splash-screen.styles.ts   # Styles (MasterFabric Colors)
└── index.ts                       # Export file
```

### Core Component

```typescript
// src/screens/splash/components/splash-screen.tsx
import { ThemedText } from '@masterfabric-expo/core/dist/components/ThemedText';
import { ThemedView } from '@masterfabric-expo/core/dist/components/ThemedView';
import { Colors } from '@masterfabric-expo/core/dist/constants/Colors';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SplashScreen() {
  return (
    <SafeAreaView style={splashScreenStyles.container}>
      <ThemedView style={splashScreenStyles.content}>
        <ThemedText style={splashScreenStyles.title}>Recipio</ThemedText>
        <ThemedText style={splashScreenStyles.subtitle}>
          Find recipes based on your ingredients
        </ThemedText>
        <ActivityIndicator 
          size="large" 
          color={Colors.light.primary} 
          style={splashScreenStyles.loader} 
        />
      </ThemedView>
    </SafeAreaView>
  );
}
```

## 🔄 Core Logic & Functionality

### Initialization Flow

Splash ekranı `app/index.tsx` içinde yönetilir:

```typescript
// app/index.tsx
export default function Index() {
  const router = useRouter();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      // Show splash for minimum time
      await new Promise(resolve => setTimeout(resolve, DEFAULT_SPLASH_CONFIG.navigationDelay));
      
      // Check onboarding status
      const completed = await storage.getOnboardingCompleted();
      setIsOnboardingCompleted(completed);
      setIsInitializing(false);
      
      // Navigate based on onboarding status
      if (!completed) {
        router.replace('/onboarding');
      }
    };

    initialize();
  }, [router]);

  // Show splash while initializing
  if (isInitializing || isOnboardingCompleted === null) {
    return <SplashScreen />;
  }

  // Show home if onboarding is completed
  if (isOnboardingCompleted) {
    return <HomeScreen />;
  }

  return <SplashScreen />;
}
```

### Initialization Steps

1. **Splash Display**: Minimum delay (DEFAULT_SPLASH_CONFIG.navigationDelay)
2. **Onboarding Check**: AsyncStorage'dan onboarding durumu kontrol edilir
3. **Navigation**: Onboarding durumuna göre yönlendirme yapılır

## 📦 Core Packages & Helpers

- **`@masterfabric-expo/core`**:
  - `ThemedView`: Tema desteği olan View component
  - `ThemedText`: Tema desteği olan Text component
  - `Colors`: MasterFabric color palette
- **`@react-native-async-storage/async-storage`**: Onboarding durumu kontrolü için
- **`react-native-safe-area-context`**: Safe area handling
- **`expo-router`**: Navigation için

## 🧭 Navigation Flow

```
App Start
  ↓
app/index.tsx (initial check)
  ↓
Splash Screen (minimum delay)
  ↓
  ├─→ [First Launch] → /onboarding
  └─→ [Completed] → / (home)
```

## 📝 Translation Keys

```json
{
  "splash": {
    "appName": "Recipio",
    "tagline": "Find recipes based on your ingredients",
    "loading": "Loading..."
  }
}
```

## 🎯 Implementation Details

### Minimal Approach

- ✅ Basit component yapısı
- ✅ MasterFabric Core bileşenleri kullanımı
- ✅ Navigation logic `app/index.tsx`'te merkezi
- ✅ AsyncStorage ile onboarding kontrolü

### Styling

- ✅ MasterFabric Colors kullanımı
- ✅ StyleSheet API
- ✅ SafeAreaView ile safe area handling

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0  
**Durum:** ✅ Tamamlandı
