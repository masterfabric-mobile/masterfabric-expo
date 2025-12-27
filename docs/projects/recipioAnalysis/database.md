# Database Schema

Complete database schema documentation for the Recipio application using Supabase (PostgreSQL).

## Overview

The Recipio database is designed to support:
- Multi-language recipe content (English and Turkish)
- User profiles and authentication
- Recipe management with variants (different serving sizes)
- User engagements (favorites, saved, tried recipes)
- Recipe statistics and analytics
- Admin functionality with role-based access control
- Row Level Security (RLS) policies

## Table of Contents

- [Custom Types (Enums)](#custom-types-enums)
- [Core Tables](#core-tables)
- [Translation Tables](#translation-tables)
- [User Engagement Tables](#user-engagement-tables)
- [Analytics Tables](#analytics-tables)
- [Views](#views)
- [Functions](#functions)
- [Triggers](#triggers)
- [Row Level Security](#row-level-security)
- [Database Relationships](#database-relationships)

## Custom Types (Enums)

### `recipe_status`
Recipe publication status:
- `draft` - Recipe is being edited
- `pending` - Recipe submitted for review
- `published` - Recipe is live and visible
- `rejected` - Recipe was rejected and needs revision

### `user_role`
User role types:
- `user` - Regular user
- `admin` - Administrator with full access

### `recipe_event_type`
Types of recipe engagement events:
- `view` - Recipe was viewed
- `favorite` - Recipe was favorited
- `save` - Recipe was saved
- `try` - Recipe was tried/cooked
- `comment` - Comment was added to recipe

## Core Tables

### `profiles`
User profile information (extends Supabase auth.users).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) | User ID from auth system |
| `display_name` | TEXT | | User's display name |
| `avatar_url` | TEXT | | URL to user's avatar image |
| `locale` | VARCHAR(2) | DEFAULT 'en' | User's preferred locale |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Profile creation timestamp |

### `user_roles`
User role assignments (many-to-many relationship).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, REFERENCES profiles(id) | User ID |
| `role` | user_role | PRIMARY KEY, NOT NULL, DEFAULT 'user' | User role |

### `categories`
Recipe categories (language-agnostic).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Category ID |
| `slug` | TEXT | NOT NULL, UNIQUE | URL-friendly category identifier |
| `image_url` | TEXT | | URL to category image/icon |

### `recipes`
Main recipes table (core data only, no JSON fields).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Recipe ID |
| `user_id` | UUID | REFERENCES profiles(id) ON DELETE SET NULL | Recipe author (NULL for system recipes) |
| `status` | recipe_status | NOT NULL, DEFAULT 'draft' | Recipe publication status |
| `is_free` | BOOLEAN | NOT NULL, DEFAULT false | Whether recipe is free (true) or premium (false) |
| `cover_image_url` | TEXT | | URL to recipe cover image |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Recipe creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

**Indexes:**
- `recipes_user_id_idx` on `user_id`
- `recipes_status_idx` on `status`
- `recipes_status_is_free_idx` on `(status, is_free)`

### `ingredients`
Ingredient master table (language-agnostic).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Ingredient ID |
| `slug` | TEXT | NOT NULL, UNIQUE | URL-friendly ingredient identifier |
| `image_url` | TEXT | | URL to ingredient image |

### `units`
Measurement units.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Unit ID |
| `code` | TEXT | NOT NULL, UNIQUE | Unit code (e.g., 'g', 'kg', 'ml', 'tbsp') |

### `recipe_variants`
Recipe variants for different serving sizes (1, 2, 3, 4 servings).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Variant ID |
| `recipe_id` | INTEGER | NOT NULL, REFERENCES recipes(id) ON DELETE CASCADE, UNIQUE(recipe_id, servings) | Recipe ID |
| `servings` | INTEGER | NOT NULL, UNIQUE(recipe_id, servings) | Number of servings |
| `variant_image_url` | TEXT | | Optional variant-specific image |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Variant creation timestamp |

**Indexes:**
- `recipe_variants_recipe_id_idx` on `recipe_id`
- `recipe_variants_recipe_id_servings_idx` on `(recipe_id, servings)`

### `recipe_variant_ingredients`
Ingredients for each recipe variant.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `variant_id` | INTEGER | PRIMARY KEY, REFERENCES recipe_variants(id) ON DELETE CASCADE | Variant ID |
| `ingredient_id` | INTEGER | PRIMARY KEY, REFERENCES ingredients(id) ON DELETE CASCADE | Ingredient ID |
| `unit_id` | INTEGER | NOT NULL, REFERENCES units(id) ON DELETE CASCADE | Unit ID |
| `amount` | NUMERIC(10, 2) | NOT NULL | Ingredient amount |
| `note` | TEXT | | Optional note for this ingredient |

**Indexes:**
- `recipe_variant_ingredients_variant_id_idx` on `variant_id`
- `recipe_variant_ingredients_ingredient_id_idx` on `ingredient_id`

### `recipe_categories`
Many-to-many relationship between recipes and categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `recipe_id` | INTEGER | PRIMARY KEY, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `category_id` | INTEGER | PRIMARY KEY, REFERENCES categories(id) ON DELETE CASCADE | Category ID |

## Translation Tables

### `category_translations`
Category names and descriptions in different languages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `category_id` | INTEGER | PRIMARY KEY, REFERENCES categories(id) ON DELETE CASCADE | Category ID |
| `locale` | VARCHAR(2) | PRIMARY KEY, NOT NULL | Locale code ('en', 'tr') |
| `name` | TEXT | NOT NULL | Category name |
| `description` | TEXT | | Category description |

### `recipe_translations`
Recipe titles, descriptions, and SEO metadata in different languages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `recipe_id` | INTEGER | PRIMARY KEY, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `locale` | VARCHAR(2) | PRIMARY KEY, NOT NULL | Locale code ('en', 'tr') |
| `title` | TEXT | NOT NULL | Recipe title |
| `description` | TEXT | | Recipe description |
| `tips` | TEXT | | Cooking tips |
| `seo_title` | TEXT | | SEO title |
| `seo_description` | TEXT | | SEO description |

**Indexes:**
- `recipe_translations_recipe_id_idx` on `recipe_id`
- `recipe_translations_locale_idx` on `locale`

### `recipe_steps`
Step-by-step cooking instructions in different languages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Step ID |
| `recipe_id` | INTEGER | NOT NULL, REFERENCES recipes(id) ON DELETE CASCADE, UNIQUE(recipe_id, locale, step_number) | Recipe ID |
| `locale` | VARCHAR(2) | NOT NULL, UNIQUE(recipe_id, locale, step_number) | Locale code ('en', 'tr') |
| `step_number` | INTEGER | NOT NULL, UNIQUE(recipe_id, locale, step_number) | Step order number |
| `text` | TEXT | NOT NULL | Step instruction text |

**Indexes:**
- `recipe_steps_recipe_id_locale_idx` on `(recipe_id, locale)`

### `ingredient_translations`
Ingredient names in different languages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `ingredient_id` | INTEGER | PRIMARY KEY, REFERENCES ingredients(id) ON DELETE CASCADE | Ingredient ID |
| `locale` | VARCHAR(2) | PRIMARY KEY, NOT NULL | Locale code ('en', 'tr') |
| `name` | TEXT | NOT NULL | Ingredient name |

## User Engagement Tables

### `favorites`
User favorite recipes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, REFERENCES profiles(id) ON DELETE CASCADE | User ID |
| `recipe_id` | INTEGER | PRIMARY KEY, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | When recipe was favorited |

**Indexes:**
- `favorites_recipe_id_idx` on `recipe_id`
- `favorites_user_id_idx` on `user_id`

### `saved_recipes`
User saved recipes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, REFERENCES profiles(id) ON DELETE CASCADE | User ID |
| `recipe_id` | INTEGER | PRIMARY KEY, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | When recipe was saved |

**Indexes:**
- `saved_recipes_recipe_id_idx` on `recipe_id`
- `saved_recipes_user_id_idx` on `user_id`

### `tried_recipes`
Recipes that users have tried/cooked.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | PRIMARY KEY, REFERENCES profiles(id) ON DELETE CASCADE | User ID |
| `recipe_id` | INTEGER | PRIMARY KEY, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | When recipe was tried |

**Indexes:**
- `tried_recipes_recipe_id_idx` on `recipe_id`
- `tried_recipes_user_id_idx` on `user_id`

### `views`
Recipe view tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | View ID |
| `recipe_id` | INTEGER | NOT NULL, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `user_id` | UUID | REFERENCES profiles(id) ON DELETE SET NULL | User ID (NULL for anonymous views) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | View timestamp |

**Indexes:**
- `views_recipe_id_idx` on `recipe_id`
- `views_recipe_id_user_id_idx` on `(recipe_id, user_id)`

### `comments`
Recipe comments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Comment ID |
| `recipe_id` | INTEGER | NOT NULL, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `user_id` | UUID | NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE | User ID |
| `body` | TEXT | NOT NULL | Comment text |
| `is_hidden` | BOOLEAN | NOT NULL, DEFAULT false | Whether comment is hidden |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Comment timestamp |

**Indexes:**
- `comments_recipe_id_idx` on `recipe_id`
- `comments_user_id_idx` on `user_id`

## Analytics Tables

### `recipe_stats`
Aggregated recipe statistics (updated via triggers).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `recipe_id` | INTEGER | PRIMARY KEY, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `view_count` | INTEGER | NOT NULL, DEFAULT 0 | Total view count |
| `favorite_count` | INTEGER | NOT NULL, DEFAULT 0 | Total favorite count |
| `save_count` | INTEGER | NOT NULL, DEFAULT 0 | Total save count |
| `tried_count` | INTEGER | NOT NULL, DEFAULT 0 | Total tried count |
| `comment_count` | INTEGER | NOT NULL, DEFAULT 0 | Total comment count (excluding hidden) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last stats update timestamp |

### `recipe_events`
Event log for recipe engagements (used for analytics).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Event ID |
| `recipe_id` | INTEGER | NOT NULL, REFERENCES recipes(id) ON DELETE CASCADE | Recipe ID |
| `user_id` | UUID | REFERENCES profiles(id) ON DELETE SET NULL | User ID |
| `event_type` | recipe_event_type | NOT NULL | Event type |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Event timestamp |

**Indexes:**
- `recipe_events_recipe_id_event_type_idx` on `(recipe_id, event_type)`
- `recipe_events_created_at_idx` on `created_at`

## Views

### `v_recipe_stats`
Simple view of recipe statistics from `recipe_stats` table.

**Columns:** `recipe_id`, `view_count`, `favorite_count`, `save_count`, `tried_count`, `comment_count`, `updated_at`

### `v_public_recipe_cards`
Public recipe cards for listing pages with translations and stats.

**Columns:**
- Core: `recipe_id`, `status`, `is_free`, `user_id`, `cover_image_url`, `created_at`
- Translations: `title`, `description` (preferred locale with fallback)
- Metadata: `category_slug`
- Stats: `view_count`, `favorite_count`, `save_count`, `tried_count`, `comment_count`

**Filter:** Only `published` recipes

### `v_recipe_detail`
Complete recipe detail view with all translations, variants, and ingredients.

**Columns:**
- Core: `recipe_id`, `status`, `is_free`, `user_id`, `cover_image_url`, `created_at`, `updated_at`
- Translations (both locales): `title_en`, `title_tr`, `description_en`, `description_tr`, `tips_en`, `tips_tr`, `seo_title_en`, `seo_title_tr`, `seo_description_en`, `seo_description_tr`
- Categories: `category_names` (JSONB object with locale keys)
- Stats: `view_count`, `favorite_count`, `save_count`, `tried_count`, `comment_count`
- Steps: `steps_en_json`, `steps_tr_json` (JSONB arrays)
- Variants: `available_servings` (JSONB array), `variants_with_ingredients` (JSONB array with full ingredient details for each variant)

### `v_admin_pending_recipes`
Admin view for pending recipe reviews.

**Columns:**
- `recipe_id`, `status`, `user_id`, `cover_image_url`, `created_at`
- `title_en`, `title_tr`
- `author_name`
- `translation_count`, `step_count`, `variant_count`

**Filter:** Only `pending` status recipes

### `v_user_library`
User's library of engaged recipes (favorites, saved, tried).

**Columns:**
- Core: `recipe_id`, `status`, `is_free`, `cover_image_url`, `created_at`
- Translations: `title_en`, `title_tr`
- Engagement: `engagement_type` ('favorite', 'saved', 'tried'), `engaged_at`
- Stats: `view_count`, `favorite_count`, `save_count`, `tried_count`

**Filter:** Only `published` recipes with user engagement

## Functions

### `is_admin(user_id UUID)`
Returns `BOOLEAN` - Checks if a user has admin role.

**Usage:** `SELECT is_admin(auth.uid());`

### `is_recipe_accessible(recipe_id INTEGER)`
Returns `BOOLEAN` - Checks if a recipe is accessible to the current user based on:
- Recipe status is `published`
- Recipe is free OR user is authenticated
- User is the recipe author
- User is an admin

**Usage:** `SELECT is_recipe_accessible(123);`

### `update_recipe_stats()`
Trigger function that updates `recipe_stats` table when engagement tables change. Counts directly from source tables to avoid loops.

### `update_favorite_stats()`, `update_save_stats()`, `update_tried_stats()`, `update_comment_stats()`, `update_view_stats()`
Trigger functions that insert events into `recipe_events` table when engagements occur.

### `handle_new_user()`
Trigger function that automatically creates a profile and assigns 'user' role when a new user signs up.

### `update_updated_at()`
Trigger function that updates `updated_at` timestamp on `recipes` table.

## Triggers

### Authentication Triggers
- **`on_auth_user_created`** - After INSERT on `auth.users`
  - Creates profile in `profiles` table
  - Assigns 'user' role in `user_roles` table

### Recipe Update Triggers
- **`update_recipes_updated_at`** - Before UPDATE on `recipes`
  - Updates `updated_at` timestamp

### Stats Update Triggers
These triggers update `recipe_stats` directly from source tables:
- **`on_favorite_changed`** - After INSERT/DELETE on `favorites`
- **`on_saved_changed`** - After INSERT/DELETE on `saved_recipes`
- **`on_tried_changed`** - After INSERT/DELETE on `tried_recipes`
- **`on_comment_changed`** - After INSERT/UPDATE/DELETE on `comments`
- **`on_view_changed`** - After INSERT on `views`
- **`on_recipe_created`** - After INSERT on `recipes`

### Event Logging Triggers
These triggers log events to `recipe_events` table:
- **`on_favorite_engagement`** - After INSERT/DELETE on `favorites`
- **`on_saved_engagement`** - After INSERT/DELETE on `saved_recipes`
- **`on_tried_engagement`** - After INSERT/DELETE on `tried_recipes`
- **`on_comment_engagement`** - After INSERT on `comments`
- **`on_view_engagement`** - After INSERT on `views`

## Row Level Security

All tables have RLS enabled. Key security policies:

### Profiles
- ✅ Everyone can view profiles
- ✅ Users can insert/update their own profile

### User Roles
- ✅ Everyone can view user roles
- ✅ Admins can manage all roles

### Recipes
- ✅ Published free recipes are public
- ✅ Published non-free recipes require authentication
- ✅ Users can view their own non-published recipes
- ✅ Admins can view all recipes
- ✅ Authenticated users can create recipes (as draft/pending)
- ✅ Users can update their own draft/rejected recipes
- ✅ Admins can update any recipe

### Recipe Content (Translations, Steps, Categories, Variants)
- ✅ Visible if recipe is accessible (via `is_recipe_accessible()`)
- ✅ Users can manage content for their own recipes
- ✅ Admins can manage all content

### User Engagements (Favorites, Saved, Tried)
- ✅ Users can manage their own engagements
- ✅ Everyone can read engagements for accessible recipes

### Views
- ✅ Anyone can insert view events
- ✅ Everyone can read view counts for accessible recipes

### Comments
- ✅ Public comments are visible if recipe is accessible and not hidden
- ✅ Users can see their own hidden comments
- ✅ Admins can see all comments
- ✅ Authenticated users can post comments on accessible recipes
- ✅ Users can delete their own comments
- ✅ Admins can hide/unhide any comment

### Recipe Stats & Events
- ✅ Everyone can read stats/events for accessible recipes

## Database Relationships

```
auth.users (Supabase Auth)
    ↓
profiles
    ├── user_roles (many-to-many)
    ├── recipes (one-to-many)
    ├── favorites (many-to-many via recipes)
    ├── saved_recipes (many-to-many via recipes)
    ├── tried_recipes (many-to-many via recipes)
    ├── views (many-to-many via recipes)
    └── comments (many-to-many via recipes)

categories
    ├── category_translations (one-to-many)
    └── recipe_categories (many-to-many with recipes)

recipes
    ├── recipe_translations (one-to-many)
    ├── recipe_steps (one-to-many)
    ├── recipe_categories (many-to-many with categories)
    ├── recipe_variants (one-to-many)
    │   └── recipe_variant_ingredients (one-to-many)
    │       ├── ingredients (many-to-one)
    │       └── units (many-to-one)
    ├── favorites (many-to-many with profiles)
    ├── saved_recipes (many-to-many with profiles)
    ├── tried_recipes (many-to-many with profiles)
    ├── views (one-to-many)
    ├── comments (one-to-many)
    ├── recipe_stats (one-to-one)
    └── recipe_events (one-to-many)

ingredients
    └── ingredient_translations (one-to-many)
```

## Key Design Decisions

1. **No JSON Fields in Core Tables**: All data is normalized into separate tables for better query performance and indexing.

2. **Separate Translation Tables**: Multi-language support via separate translation tables rather than JSONB columns allows for:
   - Better indexing
   - Easier querying
   - Type safety
   - Independent updates per locale

3. **Recipe Variants**: Each recipe has variants for different serving sizes (1, 2, 3, 4 servings) with scaled ingredient amounts. This allows users to adjust recipes to their needs.

4. **Dual Stats System**: 
   - `recipe_stats` table for fast aggregated counts (updated via triggers)
   - `recipe_events` table for detailed event logging and analytics

5. **Access Control**: 
   - Free recipes are public
   - Premium recipes require authentication
   - Authors can always see their own recipes
   - Admins have full access

6. **Event-Driven Stats Updates**: Triggers automatically update stats when engagements change, ensuring data consistency.

7. **Row Level Security**: Comprehensive RLS policies ensure users can only access/modify data they're authorized for.

## Migrations

### Migration 0001: Initial Schema (`init.sql`)
Creates all tables, types, functions, triggers, and RLS policies.

### Migration 0002: Views (`views.sql`)
Creates database views for easier data access and querying.

### Migration 0003: Add Category Image (`add-category.sql`)
Adds `image_url` column to `categories` table.

## Seed Data

The `seed.sql` file includes:
- 9 measurement units (g, kg, ml, l, pcs, tbsp, tsp, cup, pinch)
- 6 categories with translations (Soups, Salads, Main Courses, Desserts, Breakfast, Appetizers)
- 20 ingredients with translations
- 10 sample recipes with variants and ingredients

