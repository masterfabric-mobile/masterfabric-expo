# Configuration

Recipio app configuration and environment variables.

## Environment Variables

### Supabase Configuration

**Method 1: .env dosyası (Önerilen)**

`project/recipio/.env` oluşturun (veya `.env.example`'ı kopyalayın):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Önemli:** `.env` `.gitignore`'da olmalı; commit edilmez. Tüm veriler Supabase'den gelir; mock/manuel veri kullanılmaz.

**Method 2: app.json extra**

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

### How to Get Supabase Credentials

1. Go to your project in the [Supabase Dashboard](https://app.supabase.com)
2. Open **Settings** → **API**
3. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## app.json Configuration

`app.json` holds the Expo configuration:

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

## TypeScript Configuration

`tsconfig.json` holds TypeScript settings:

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

## Metro Configuration

`metro.config.js` configures the Metro bundler:

**Main features:**
- Path alias support (`@/`)
- Local package resolution (`@masterfabric-expo/core`)
- Optional dependency stubs (Firebase, Sentry, etc.)
- Watch folders configuration

**Stub configuration:**
```javascript
// Stub files in metro-stubs/
const firebaseStub = path.resolve(projectRoot, 'metro-stubs/firebase-stub.js');
const sentryStub = path.resolve(projectRoot, 'metro-stubs/sentry-stub.js');
// ... other stubs
```

## Supabase Setup

### Database Migrations

Supabase migration files are on GitHub:
- [recipio/supabase/migrations](https://github.com/NurhayatYurtaslan/recipio/tree/main/supabase/migrations)

**Running migrations:**

1. Open the Supabase Dashboard
2. Go to **SQL Editor**
3. Run migration files in order:
   - `init.sql`
   - `add-category.sql`
   - `views.sql`

**Or with Supabase CLI:**
```bash
supabase db push
```

### Storage Buckets (Optional)

Create storage buckets as needed, e.g.:
- `recipe-images`: For recipe images

## MasterFabric Core

The `@masterfabric-expo/core` package is installed automatically. No extra configuration is required.

**Package configuration:**
```json
{
  "dependencies": {
    "@masterfabric-expo/core": "file:../../packages/masterfabric-expo-core"
  }
}
```

**Metro config:**
```javascript
config.watchFolders = [
  path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
];

config.resolver.extraNodeModules = {
  '@masterfabric-expo/core': path.resolve(workspaceRoot, 'packages/masterfabric-expo-core'),
};
```

## Configuration Checklist

- [ ] Supabase URL and Anon Key added to `app.json`
- [ ] TypeScript path aliases configured
- [ ] Metro config set up correctly
- [ ] Supabase migrations run
- [ ] MasterFabric Core package linked
- [ ] Environment variables checked

## Verification

To check that configuration is correct:

```bash
# Test Supabase connection
npm start
# You should see in the console:
# ✅ Supabase client initialized
```

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
