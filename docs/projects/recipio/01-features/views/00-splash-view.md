# 0. Splash View

The splash screen is the first screen the user sees when opening the app. Its main purpose is to provide a smooth entry point while the app initializes in the background.

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
|              (Spinner: Loading...)                 |
|                                                     |
+-----------------------------------------------------+
```

### Styling

**Using MasterFabric Colors:**
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

This view lives under `src/screens/splash/`.

### File structure

```
src/screens/splash/
├── components/
│   └── splash-screen.tsx          # Main splash screen component
├── hooks/
│   └── use-splash-navigation.ts   # Navigation hook (optional)
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

The splash screen is controlled from `app/index.tsx`:

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
2. **Onboarding check**: Read onboarding status from AsyncStorage
3. **Navigation**: Redirect based on onboarding status

## 📦 Core Packages & Helpers

- **`@masterfabric-expo/core`**:
  - `ThemedView`: Theme-aware View component
  - `ThemedText`: Theme-aware Text component
  - `Colors`: MasterFabric color palette
- **`@react-native-async-storage/async-storage`**: For onboarding status check
- **`react-native-safe-area-context`**: Safe area handling
- **`expo-router`**: Navigation

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

### Minimal approach

- Simple component structure
- Use MasterFabric Core components
- Navigation logic centralized in `app/index.tsx`
- Onboarding check via AsyncStorage

### Styling

- MasterFabric Colors
- StyleSheet API
- SafeAreaView for safe area handling

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0  
**Status:** Complete
