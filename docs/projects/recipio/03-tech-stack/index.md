# Technology Stack

Recipio uygulamasında kullanılan teknolojiler, framework'ler ve kütüphaneler.

## 🚀 Core Framework

- **Expo SDK 54.0.31**: React Native tabanlı cross-platform geliştirme framework'ü
- **React Native 0.81.5**: Mobil uygulama geliştirme kütüphanesi
- **React 19.1.0**: UI library
- **TypeScript 5.9.2**: Tip güvenliği için JavaScript süper seti

## 🎨 UI & Styling

- **React Native StyleSheet**: Native stil yönetimi
- **@masterfabric-expo/core**: MasterFabric core bileşenleri ve stilleri
  - `ThemedView`: Tema desteği olan View component
  - `ThemedText`: Tema desteği olan Text component
  - `Colors`: Renk paleti sabitleri
  - `ThemeProvider`: Theme context provider
- **@expo/vector-icons**: Icon library (MaterialIcons)

## 📊 State Management

- **Zustand 4.4.0**: Hafif ve modern state yönetimi kütüphanesi
- **@react-native-async-storage/async-storage 2.2.0**: Kalıcı veri depolama
  - Onboarding durumu için kullanılır
  - Zustand persist middleware ile entegre

## 🧭 Navigation

- **Expo Router 6.0.17**: File-based routing
  - `app/` klasöründe route tanımları
  - Type-safe navigation
  - Deep linking desteği
- **react-native-screens 4.16.0**: Native screen management
- **react-native-safe-area-context 5.6.0**: Safe area handling

## 🗄️ Backend & Database

- **Supabase**: Backend-as-a-Service platformu
  - PostgreSQL veritabanı
  - Authentication (opsiyonel, sonraki aşama)
  - Real-time subscriptions (opsiyonel)
  - Storage (opsiyonel)
- **@supabase/supabase-js 2.39.0**: Supabase JavaScript client

## 🔧 Development Tools

- **Metro Bundler**: React Native için JavaScript bundler
  - Custom resolver (stubs, path aliases)
  - Local package resolution
  - Watch folders configuration
- **TypeScript**: Tip kontrolü ve geliştirici deneyimi
- **@babel/core 7.25.2**: JavaScript compiler

## 📦 Utilities

- **expo-splash-screen 31.0.12**: Native splash screen yönetimi
- **expo-constants 18.0.13**: Uygulama sabitleri (Supabase config için)
- **expo-device 8.0.10**: Cihaz bilgileri
- **expo-status-bar 3.0.9**: Status bar yönetimi
- **react-native-gesture-handler 2.28.0**: Gesture handling

## 🎯 Platform Support

- **iOS**: iOS 13.0+
- **Android**: Android 6.0+ (API level 23+)
- **Web**: Modern web tarayıcıları (opsiyonel)

## 📋 Package Versions

### Core Dependencies

```json
{
  "dependencies": {
    "expo": "~54.0.31",
    "expo-router": "~6.0.17",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "@masterfabric-expo/core": "file:../../packages/masterfabric-expo-core",
    "@supabase/supabase-js": "^2.39.0",
    "@react-native-async-storage/async-storage": "2.2.0",
    "zustand": "^4.4.0",
    "@expo/vector-icons": "^15.0.2"
  }
}
```

### Overrides

```json
{
  "overrides": {
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

## 🔌 Optional Dependencies (Stubbed)

Bu paketler kullanılmıyor ve Metro config'de stub edilmiş:

- **Firebase**: Stub edilmiş (kullanılmıyor)
- **Sentry**: Stub edilmiş (kullanılmıyor)
- **@react-native-community/slider**: Stub edilmiş
- **expo-haptics**: Stub edilmiş
- **expo-battery**: Stub edilmiş
- **expo-av**: Stub edilmiş
- **expo-web-browser**: Stub edilmiş

## 🛠️ Build Tools

- **npm**: Node paket yöneticisi
- **Metro Bundler**: JavaScript bundler
- **TypeScript Compiler**: Type checking

## 📚 Development Workflow

1. **Development Server**: `npm start` veya `npx expo start`
2. **Hot Reload**: Otomatik olarak etkin
3. **Type Checking**: TypeScript compiler
4. **Metro Bundler**: JavaScript bundling ve transformation

## 🔗 Related Documentation

- [Implementation Analysis](../00-implementation-analysis.md) - Detaylı implementasyon bilgileri
- [Architecture Overview](../02-architecture/overview.md) - Mimari detayları
- [Supabase Integration](../04-integrations/supabase.md) - Backend entegrasyonu

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
