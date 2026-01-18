# Supabase Integration

Recipio uygulamasında Supabase entegrasyonu ve kullanımı.

## 📋 Overview

Supabase, Recipio uygulamasının backend altyapısını sağlar. Veritabanı, authentication (opsiyonel), storage ve real-time özellikler için kullanılır.

## 🔧 Setup & Configuration

### 1. Supabase Credentials

**app.json Yapılandırması:**
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

**Alternatif: .env Dosyası**
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Supabase Service

**Temel Client:**
```typescript
// src/shared/services/supabase-service.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL = 
  Constants.expoConfig?.extra?.supabaseUrl || 
  process.env.EXPO_PUBLIC_SUPABASE_URL;

const SUPABASE_ANON_KEY = 
  Constants.expoConfig?.extra?.supabaseAnonKey || 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL ve Anon Key bulunamadı!');
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

### Mevcut Tablolar

#### `recipes` - Tarifler Tablosu

**Gerçek Column'lar (Console log'larından):**
- `id` (UUID)
- `user_id` (UUID, nullable)
- `status` (TEXT) - 'published', vb.
- `is_free` (BOOLEAN)
- `cover_image_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**GitHub Migrations'a Göre Olması Gerekenler:**
- `title` (TEXT)
- `description` (TEXT)
- `cooking_time` (INTEGER) - dakika cinsinden
- `difficulty` (TEXT) - 'Easy', 'Medium', 'Hard'
- `tags` (TEXT[]) - Array
- `ingredients` (JSONB) - Ingredient array
- `cooking_steps` (JSONB) - Step array
- `servings` (INTEGER)
- `calories` (INTEGER)
- `cuisine` (TEXT)

**Örnek Schema:**
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  image_url TEXT,
  cooking_time INTEGER, -- dakika cinsinden
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

#### `user_activities` - Kullanıcı Aktiviteleri

```sql
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('saved', 'finished')),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `profiles` - Kullanıcı Profilleri

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
-- Recipes: Herkes okuyabilir
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (true);

-- User activities: Public read access (demo için)
CREATE POLICY "Anyone can view activities"
  ON user_activities FOR SELECT
  USING (true);

-- Profiles: Public read access (demo için)
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);
```

## 📁 Migration Files

Migration dosyaları `supabase/migrations/` klasöründe saklanır:

- `init.sql` - Initial schema
- `add-category.sql` - Category support
- `views.sql` - Database views

**Not:** Migration dosyaları GitHub'da mevcut: `https://github.com/NurhayatYurtaslan/recipio/tree/main/supabase/migrations`

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

**Öncelik Sırası:**
1. `app.json` → `extra.supabaseUrl`
2. `process.env.EXPO_PUBLIC_SUPABASE_URL`
3. `.env` dosyası (eğer kullanılıyorsa)

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

- [Implementation Analysis](../00-implementation-analysis.md) - Supabase entegrasyonu detayları
- [Recipe Service](../../../project/recipio/src/shared/services/recipe-service.ts) - Recipe operations
- [User Service](../../../project/recipio/src/shared/services/user-service.ts) - User operations

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0
