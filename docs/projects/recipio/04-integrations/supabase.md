# Supabase Integration

Supabase is the shared backend for both the **Recipio website (Next.js)** and the **Recipio mobile app (Expo)**. Same project, schema, views, and RLS.

## 📋 Overview

Supabase provides database, optional authentication, storage, and real-time for Recipio. The **canonical schema, views, and RLS** are documented in the [recipio/docs/DB_SCHEMA.md](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/DB_SCHEMA.md) repository. This doc describes app-side configuration and usage.

## 🔧 Setup & Configuration

### 1. Supabase Credentials

**`.env` dosyası (önerilen):** Recipio tüm veriyi Supabase'den çeker; mock veri kullanılmaz. `project/recipio/.env` içinde:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

`.env.example` şablon olarak projede bulunur; `.env` `.gitignore`'dadır.

**Alternatif — app.json extra:**
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

### 2. Supabase Service

**Core client:**
```typescript
// src/shared/services/supabase-service.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// .env öncelikli (EXPO_PUBLIC_*), yoksa app.json extra
const SUPABASE_URL = 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  Constants.expoConfig?.extra?.supabaseUrl;

const SUPABASE_ANON_KEY = 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  Constants.expoConfig?.extra?.supabaseAnonKey;

let supabaseClient: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL and Anon Key not found!');
  }

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}
```

## 🗄️ Database Schema

**Authoritative reference:** [recipio/docs/DB_SCHEMA.md](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/DB_SCHEMA.md) (same backend for website and app).

**Key views for the app:**
- **`v_public_recipe_cards`** — Recipe listing (title, description, stats, category).
- **`v_recipe_detail`** — Single recipe with all variants (1–4 servings), ingredients (TR/EN), steps, stats (one query).

### Tables (summary)

#### `recipes` — Recipes table

**Actual columns (from console logs):**
- `id` (UUID)
- `user_id` (UUID, nullable)
- `status` (TEXT) - 'published', vb.
- `is_free` (BOOLEAN)
- `cover_image_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Expected from GitHub migrations:**
- `title` (TEXT)
- `description` (TEXT)
- `cooking_time` (INTEGER) — minutes
- `difficulty` (TEXT) — 'Easy', 'Medium', 'Hard'
- `tags` (TEXT[]) - Array
- `ingredients` (JSONB) - Ingredient array
- `cooking_steps` (JSONB) - Step array
- `servings` (INTEGER)
- `calories` (INTEGER)
- `cuisine` (TEXT)

**Example schema:**
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  image_url TEXT,
  cooking_time INTEGER, -- minutes
  difficulty TEXT DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
  tags TEXT[] DEFAULT '{}',
  ingredients JSONB DEFAULT '[]'::jsonb,
  cooking_steps JSONB DEFAULT '[]'::jsonb,
  servings INTEGER DEFAULT 4,
  calories INTEGER,
  cuisine TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'published',
  is_free BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_activities` — User activities

```sql
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('saved', 'finished')),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `profiles` — User profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  plan_name TEXT DEFAULT 'Pro Chef',
  plan_active BOOLEAN DEFAULT true,
  recipes_limit INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔌 Service Layer

### Recipe Service

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

    // Mapping logic
    return mappedRecipes;
  } catch (error) {
    console.error('❌ Error in getCookTonightRecipes:', error);
    return [];
  }
}
```

### User Service

```typescript
// src/shared/services/user-service.ts
import { getSupabaseClient } from './supabase-service';

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return getDemoProfile();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return mapProfile(user, profile);
  } catch (error) {
    console.error('❌ Error in getCurrentUserProfile:', error);
    return getDemoProfile();
  }
}
```

## 📊 Data Queries

### Fetch Recipes

```typescript
const { data, error } = await supabase
  .from('recipes')
  .select('*')
  .limit(5);
```

### Fetch Recipe by ID

```typescript
const { data, error } = await supabase
  .from('recipes')
  .select('*')
  .eq('id', recipeId)
  .single();
```

### Search Recipes by Ingredients

```typescript
// src/shared/services/recipe-search-service.ts
export async function searchRecipesByIngredients(
  userIngredients: string[],
  filters?: RecipeSearchFilters
): Promise<RecipeSearchResult> {
  const supabase = getSupabaseClient();
  
  // Fetch all recipes
  const { data, error } = await supabase
    .from('recipes')
    .select('*');

  // Calculate match percentage
  const recipesWithMatch = data.map(recipe => {
    const { matchPercentage, missingIngredients } = 
      calculateMatchPercentage(userIngredients, recipe.ingredients);
    return { ...recipe, matchPercentage, missingIngredients };
  });

  // Filter and sort
  return {
    recipes: filteredRecipes,
    totalCount: filteredRecipes.length,
    filters,
  };
}
```

## 🔐 Row Level Security (RLS)

### Policies

```sql
-- Recipes: readable by everyone
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (true);

-- User activities: public read (for demo)
CREATE POLICY "Anyone can view activities"
  ON user_activities FOR SELECT
  USING (true);

-- Profiles: public read (for demo)
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);
```

## Migration Files

Migration files live in `supabase/migrations/`:

- `init.sql` - Initial schema
- `add-category.sql` - Category support
- `views.sql` - Database views

**Note:** Migrations are on GitHub: [recipio/supabase/migrations](https://github.com/NurhayatYurtaslan/recipio/tree/main/supabase/migrations)

## 🔄 Environment Variables

**app.json:**
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://uacixikhrppwwmpaiblp.supabase.co",
      "supabaseAnonKey": "your-anon-key"
    }
  }
}
```

**Priority order:**
1. `app.json` → `extra.supabaseUrl`
2. `process.env.EXPO_PUBLIC_SUPABASE_URL`
3. `.env` file (if used)

## 🛠️ Error Handling

```typescript
try {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('recipes').select('*');
  
  if (error) {
    if (error.code === 'PGRST205') {
      console.warn('⚠️ Table does not exist');
      return [];
    }
    console.error('❌ Error:', error);
    return [];
  }
  
  return data || [];
} catch (error) {
  console.error('❌ Exception:', error);
  return [];
}
```

## 📝 Data Mapping

**Column Mapping:**
```typescript
const mappedRecipe = {
  id: recipe.id,
  title: recipe.title || `Recipe #${recipe.id}`,
  imageUrl: recipe.cover_image_url || recipe.image_url || '',
  time: `${recipe.cooking_time || 30}m`,
  difficulty: recipe.difficulty || 'Medium',
  tags: Array.isArray(recipe.tags) ? recipe.tags : [],
  description: recipe.description || '',
};
```

## 🔗 Related Documentation

- [Implementation Analysis](../00-implementation-analysis.md) — Supabase integration details
- [Recipe Service](../../../project/recipio/src/shared/services/recipe-service.ts) - Recipe operations
- [User Service](../../../project/recipio/src/shared/services/user-service.ts) - User operations

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
