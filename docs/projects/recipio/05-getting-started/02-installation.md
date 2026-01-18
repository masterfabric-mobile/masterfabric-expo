# Installation

Recipio uygulamasını yerel geliştirme ortamına kurma adımları.

## 📦 Clone Repository

```bash
# Workspace kök dizinine git
cd masterfabric-expo

# Proje dizinine git
cd project/recipio
```

## 🔧 Install Dependencies

```bash
npm install
```

Bu komut şunları yükler:
- React Native ve Expo bağımlılıkları
- TypeScript ve tip tanımlamaları
- `@masterfabric-expo/core` paketi (local workspace package)
- Supabase client (`@supabase/supabase-js`)
- Zustand (state management)
- AsyncStorage
- Diğer tüm bağımlılıklar

## ✅ Verify Installation

Kurulumun başarılı olduğunu kontrol etmek için:

```bash
# Expo CLI versiyonu
npx expo --version

# Installed packages
npm list --depth=0

# MasterFabric Core package kontrolü
ls ../../packages/masterfabric-expo-core
```

## 🔍 Troubleshooting

### Node Modules Issues

Eğer bağımlılıklarla ilgili sorun yaşıyorsanız:

```bash
# node_modules ve lock dosyasını temizle
rm -rf node_modules package-lock.json

# Yeniden yükle
npm install
```

### MasterFabric Core Package Issues

Eğer `@masterfabric-expo/core` paketi bulunamıyorsa:

```bash
# Workspace kök dizinine git
cd ../../

# MasterFabric Core package'ini kontrol et
ls packages/masterfabric-expo-core

# Eğer yoksa, package'i oluşturmanız gerekebilir
```

### Metro Bundler Cache Issues

```bash
# Expo cache'i temizle
npx expo start --clear

# Metro cache'i temizle
npx expo start --reset-cache
```

### iOS Pods (macOS only)

```bash
cd ios
pod install
cd ..
```

## 📋 Installation Checklist

- [ ] Node.js kurulu (v18+)
- [ ] npm kurulu
- [ ] Git kurulu
- [ ] Expo CLI erişilebilir (`npx expo`)
- [ ] Dependencies yüklendi (`npm install`)
- [ ] MasterFabric Core package mevcut
- [ ] Supabase credentials hazır (app.json veya .env)

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
