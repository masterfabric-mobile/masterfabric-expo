# Prerequisites

Recipio uygulamasını geliştirmek için gereken yazılımlar ve araçlar.

## 📋 Gerekli Yazılımlar

### Node.js
- **Version**: 18.0.0 veya üzeri
- **Download**: [nodejs.org](https://nodejs.org/)
- **Kontrol**: `node --version`

### npm
- Node.js ile birlikte gelir
- **Kontrol**: `npm --version`

### Git
- **Download**: [git-scm.com](https://git-scm.com/)
- **Kontrol**: `git --version`

### Expo CLI
- Global olarak yüklenebilir: `npm install -g expo-cli`
- Veya `npx expo` kullanılabilir (önerilen)
- **Kontrol**: `npx expo --version`

## 🖥️ Platform-Specific Requirements

### iOS Development (macOS only)
- **Xcode**: 14.0 veya üzeri
- **iOS Simulator**: Xcode ile birlikte gelir
- **CocoaPods**: `sudo gem install cocoapods`

### Android Development
- **Android Studio**: En son sürüm
- **Android SDK**: Android Studio ile birlikte gelir
- **Android Emulator**: Android Studio ile kurulabilir
- **Java Development Kit (JDK)**: 11 veya üzeri

### Web Development
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)

## 🛠️ Recommended Tools

### Code Editor
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/)
- Önerilen eklentiler:
  - ESLint
  - Prettier
  - TypeScript
  - React Native Tools
  - Expo Tools

### Mobile Device (Optional)
- **Expo Go App**: iOS veya Android cihazınızda test etmek için
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## ☁️ Supabase Account

- **Supabase Account**: [supabase.com](https://supabase.com)
- Yeni bir proje oluşturulmalı
- API keys alınmalı (Settings → API)
  - Project URL
  - anon/public key

## ✅ Verification

Tüm gereksinimlerin kurulu olduğunu kontrol etmek için:

```bash
node --version      # v18.0.0 veya üzeri
npm --version       # v9.0.0 veya üzeri
git --version       # v2.30.0 veya üzeri
npx expo --version  # v0.0.0 veya üzeri
```

## 📦 Workspace Requirements

### MasterFabric Expo Workspace

Proje, MasterFabric Expo workspace içinde yer alır:

```
masterfabric-expo/
├── packages/
│   └── masterfabric-expo-core/    # Local package (gerekli)
└── project/
    └── recipio/                    # Application
```

**Önemli:** `@masterfabric-expo/core` paketi workspace içinde olmalıdır.

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
