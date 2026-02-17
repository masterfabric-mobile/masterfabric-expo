# Integrations

Third-party services and integrations used in the Recipio app.

## Contents

- **[Supabase](./supabase.md)** — Backend and database integration

## Main Integrations

### Supabase

Supabase provides the app backend:

- **Database (PostgreSQL)**: Recipes, user activities, profiles
- **Authentication** (optional, later phase): User sign-in
- **Real-time subscriptions** (optional): Live updates
- **Storage** (optional): Recipe images
- **Edge Functions** (optional): Recipe suggestion logic

**Service layout:**
```
src/shared/services/
├── supabase-service.ts          # Core Supabase client
├── recipe-service.ts            # Recipe operations
├── user-service.ts              # User operations
└── recipe-search-service.ts     # Recipe search (later phase)
```

**Usage:**
```typescript
import { getSupabaseClient } from '@/shared/services/supabase-service';

const supabase = getSupabaseClient();
const { data, error } = await supabase.from('recipes').select('*');
```

See [Supabase Integration](./supabase.md) for details.

## Unused Integrations (Stubbed)

### Firebase

Firebase is not used. It is stubbed in Metro config.

**Stub file:**
```javascript
// metro-stubs/firebase-stub.js
module.exports = {
  initializeApp: () => ({}),
  // ... mock functions
};
```

### Sentry

Sentry is not used. It is stubbed in Metro config.

**Stub file:**
```javascript
// metro-stubs/sentry-stub.js
module.exports = {
  init: () => {},
  // ... mock functions
};
```

## Integration Setup

### Supabase Setup

1. Get credentials from the Supabase Dashboard
2. Add them to `app.json`:
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
3. Run migration files (Supabase SQL Editor)

See [Supabase Integration](./supabase.md) for details.

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
