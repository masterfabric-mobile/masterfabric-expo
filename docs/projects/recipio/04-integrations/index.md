# Integrations

Recipio uygulamasında kullanılan üçüncü taraf servisler ve entegrasyonlar.

## 📋 İçindekiler

- **[Supabase](./supabase.md)** - Backend ve veritabanı entegrasyonu

## 🔌 Ana Entegrasyonlar

### Supabase ✅

Supabase, uygulamanın backend altyapısını sağlar:

- **Veritabanı (PostgreSQL)**: Tarifler, kullanıcı aktiviteleri, profiller
- **Authentication** (opsiyonel, sonraki aşama): Kullanıcı girişi
- **Real-time subscriptions** (opsiyonel): Gerçek zamanlı güncellemeler
- **Storage** (opsiyonel): Tarif görselleri için
- **Edge Functions** (opsiyonel): Tarif öneri algoritması için

**Servis Yapısı:**
```
src/shared/services/
├── supabase-service.ts          # Temel Supabase client (TEMEL)
├── recipe-service.ts            # Recipe operations
├── user-service.ts              # User operations
└── recipe-search-service.ts     # Recipe search (sonraki aşama)
```

**Kullanım:**
```typescript
import { getSupabaseClient } from '@/shared/services/supabase-service';

const supabase = getSupabaseClient();
const { data, error } = await supabase.from('recipes').select('*');
```

Detaylar için [Supabase Integration](./supabase.md) sayfasına bakın.

## 🚫 Kullanılmayan Entegrasyonlar

### Firebase ❌

Firebase kullanılmıyor. Metro config'de stub edilmiş.

**Stub Dosyası:**
```javascript
// metro-stubs/firebase-stub.js
module.exports = {
  initializeApp: () => ({}),
  // ... mock functions
};
```

### Sentry ❌

Sentry kullanılmıyor. Metro config'de stub edilmiş.

**Stub Dosyası:**
```javascript
// metro-stubs/sentry-stub.js
module.exports = {
  init: () => {},
  // ... mock functions
};
```

## 🔧 Integration Setup

### Supabase Setup

1. Supabase Dashboard'dan credentials alın
2. `app.json` dosyasına ekleyin:
   ```json
   {
     "expo": {
       "extra": {
         "supabaseUrl": "https://your-project.supabase.co",
         "supabaseAnonKey": "your-anon-key"
       }
     }
   }
   ```
3. Migration dosyalarını çalıştırın (Supabase SQL Editor)

Detaylar için [Supabase Integration](./supabase.md) sayfasına bakın.

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
