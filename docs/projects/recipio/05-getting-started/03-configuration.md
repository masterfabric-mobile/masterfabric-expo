# Configuration

Recipio uygulamasının yapılandırması ve ortam değişkenleri.

## 🔧 Environment Variables

### Supabase Configuration

**Yöntem 1: app.json (Önerilen)**

`app.json` dosyasını açın ve `extra` bölümünü güncelleyin:

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

**Yöntem 2: .env Dosyası**

`project/recipio/.env` dosyası oluşturun:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Önemli:** `.env` dosyasını `.gitignore`'a ekleyin!

### Supabase Credentials Nasıl Alınır?

1. [Supabase Dashboard](https://app.supabase.com) üzerinden projenize gidin
2. **Settings** → **API** bölümüne gidin
3. Şu bilgileri kopyalayın:
   - **Project URL**: `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 📱 app.json Configuration

`app.json` dosyası Expo yapılandırmasını içerir:

```json
{
  "expo": {
    "name": "Recipio",
    "slug": "recipio",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "recipio",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#ffffff"
    },
    "plugins": [
      "expo-router"
    ],
    "extra": {
      "supabaseUrl": "https://uacixikhrppwwmpaiblp.supabase.co",
      "supabaseAnonKey": "your-anon-key-here"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.recipio.app"
    },
    "android": {
      "package": "com.recipio.app"
    }
  }
}
```

## 📝 TypeScript Configuration

`tsconfig.json` dosyası TypeScript yapılandırmasını içerir:

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

## 🚇 Metro Configuration

`metro.config.js` dosyası Metro bundler yapılandırmasını içerir:

**Önemli Özellikler:**
- Path alias support (`@/`)
- Local package resolution (`@masterfabric-expo/core`)
- Optional dependency stubs (Firebase, Sentry, vb.)
- Watch folders configuration

**Stub Yapılandırması:**
```javascript
// metro-stubs/ klasöründeki stub dosyaları
const firebaseStub = path.resolve(projectRoot, 'metro-stubs/firebase-stub.js');
const sentryStub = path.resolve(projectRoot, 'metro-stubs/sentry-stub.js');
// ... diğer stubs
```

## 🗄️ Supabase Setup

### Database Migrations

Supabase migration dosyaları GitHub'da mevcut:
- `https://github.com/NurhayatYurtaslan/recipio/tree/main/supabase/migrations`

**Migration'ları Çalıştırma:**

1. Supabase Dashboard'a gidin
2. **SQL Editor** bölümüne gidin
3. Migration dosyalarını sırayla çalıştırın:
   - `init.sql`
   - `add-category.sql`
   - `views.sql`

**Veya Supabase CLI ile:**
```bash
supabase db push
```

### Storage Buckets (Opsiyonel)

Storage bucket'ları oluşturun:
- `recipe-images`: Tarif görselleri için

## 🎨 MasterFabric Core

`@masterfabric-expo/core` paketi otomatik olarak yüklenir. Ek yapılandırma gerekmez.

**Package Yapılandırması:**
```json
{
  "dependencies": {
    "@masterfabric-expo/core": "file:../../packages/masterfabric-expo-core"
  }
}
```

**Metro Config:**
```javascript
config.watchFolders = [
  path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
];

config.resolver.extraNodeModules = {
  '@masterfabric-expo/core': path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
};
```

## ✅ Configuration Checklist

- [ ] Supabase URL ve Anon Key `app.json`'a eklendi
- [ ] TypeScript path aliases yapılandırıldı
- [ ] Metro config doğru yapılandırıldı
- [ ] Supabase migration'ları çalıştırıldı
- [ ] MasterFabric Core package link edildi
- [ ] Environment variables kontrol edildi

## 🔍 Verification

Yapılandırmanın doğru olduğunu kontrol etmek için:

```bash
# Supabase bağlantısını test et
npm start
# Console'da şunu görmelisiniz:
# ✅ Supabase client başlatıldı
```

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
