# Recipio — Implementation Analysis (English)

## 1. Overview

This document is the **implementation analysis** for **Recipio** in the MasterFabric Expo workspace. Recipio is built as **two clients** sharing the **same Supabase backend**.

### 1.1 Project Location (Important)

- The **Recipio project** is opened in the `project/recipio` folder within the workspace and all code is written there.
- The app is developed **only** under `project/recipio`.
- **No extra project folders are created.** No new projects are created under `project/`; all Recipio code stays within `project/recipio`.

| Client | Stack | Purpose |
|--------|--------|---------|
| **Website** | Next.js | Public and authenticated web experience (reference: [recipio/docs](https://github.com/NurhayatYurtaslan/recipio/tree/main/docs)) |
| **Mobile App** | Expo (React Native) | Native mobile experience; MasterFabric Expo ecosystem, `@masterfabric-expo/core` |

- **Backend:** Single Supabase project (same schema, views, RLS, auth).  
- **Data:** Recipes, profiles, engagement (favorites, saved, tried), comments, and admin flows use the same tables and views.  
- **Data policy:** All data comes **only from Supabase**. **Mock or manual test data is never used.**
- **UI/Package:** The MasterFabric package structure (`@masterfabric-expo/core`) is used.
- **Config:** Supabase credentials are defined in the `.env` file (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
- **This doc** focuses on the **Expo app** implementation; product and data model are aligned with the [Next.js analysis](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/ANALYSIS.md) and [DB schema](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/DB_SCHEMA.md).

---

## 2. Design System & Color Theme (All Screens)

### 2.1 Unified Color Theme

**All screens** (Splash, Onboarding, Home, Recipe Detail, etc.) use the **same color theme**. No screen has a different color scheme.

**Orange palette (CSS variables / tokens):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary-accent` | `#FF5722` | **Main accent** — use everywhere: tabs (active), icons, CTAs, buttons, badges, progress indicators |
| `--orange` | `#FF9800` | Use **sparingly** — only when shadows or subtle highlights are needed |
| `--light-orange` | `#FFB74D` | Use **sparingly** — only when softer shadows or glow effects are needed |

| Mode | Background | Primary Accent | Text | Secondary Text |
|------|------------|----------------|------|----------------|
| **Dark** | `#000000` (black) | `#FF5722` (primary-accent) | `#FFFFFF` (white) | `#8E8E93` (grey) |
| **Light** | `#FFFFFF` (white) | `#FF5722` (primary-accent) | `#000000` (black) | `#8E8E93` (grey) |

**Card/surface (dark):** `#1C1C1E`  
**Card/surface (light):** `#F2F2F7`  
**Border:** `#38383A` (dark) / `#E5E5E5` (light)

**Color usage rule:** Use `primaryAccent` (`#FF5722`) for all interactive elements — tabs (active state), icons, buttons, badges, progress indicators. Use `orange` and `lightOrange` only when shadows or highlights are explicitly needed (e.g. glow, soft shadow).

**Development order:** Start with **dark theme only**. Light theme comes later.

**Recipio theme constants:** `src/shared/constants/recipio-colors.ts` — `RecipioColors.primaryAccent`, `RecipioColors.orange`, `RecipioColors.lightOrange`. Prefer `primaryAccent` for all interactive elements (tabs, icons, buttons). Use `orange` and `lightOrange` only for shadows or highlights when needed.

### 2.2 i18n

Bilingual app: **English** and **Turkish**. All UI strings use translation keys.

---

## 3. Product & Feature Breakdown (Shared)

Recipio is a minimalist, bilingual (Turkish / English) recipe platform with **non-linear serving-size variants**.

### 3.1 User Segments

**No anonymous user concept.** Until the user signs in, there is no profile; "registration" is not relevant until Phase 1 when profile and auth screens are implemented. The app flow is: **Splash → Onboarding (first launch only) → Home**. If onboarding is already completed (persisted), onboarding is skipped and the user goes directly to Home.

- **Authenticated users (only user segment for the app)**
  - Browse recipes, search and filter, switch language (en/tr).
  - Bookmark/save recipes, mark as favorited, mark as tried.
  - Comment on recipes.
  - Submit recipes for moderation (UGC).
  - Manage profile (display name, avatar, locale).

### 3.2 Core Differentiator: Recipe Variants

- Recipes are **not** linearly scalable: e.g. “2 servings” has a **different ingredient list** than “4 servings” for the same recipe.
- UI uses a **servings stepper** (1, 2, 3, 4) and fetches the correct variant; steps can be shared across variants.
- Backend: `recipe_variants`, `recipe_variant_ingredients`; app and website both use the same **Supabase views** (e.g. `v_recipe_detail`) for variant data.

### 3.3 Platform Mapping

| Feature | Website (Next.js) | App (Expo) |
|--------|--------------------|------------|
| Public recipe list | ✅ `RecipeList` + `v_public_recipe_cards` | ✅ Home “Cook Tonight” + later Recipe List screen |
| Recipe detail + servings | ✅ `RecipeDetail` + `v_recipe_detail` | ⏳ Recipe Detail View (planned) |
| Auth (login/signup) | ✅ Supabase Auth | ⏳ Phase 1; use validator_helper for form validation |
| Favorites / saved / tried | ✅ `UserActions` + RLS | ⏳ Favorites / History views (planned) |
| Comments | ✅ `Comments` component | ⏳ Optional in app |
| Profile | ✅ `/profile` | ⏳ Profile View (planned) |
| Submit recipe (UGC) | ✅ `/submit-recipe` | ❌ Typically web-only |
| i18n (en/tr) | ✅ next-intl | ✅ App i18n keys (see 06-i18n-translation-keys.md) |

---

## 3. Shared Backend: Supabase

Both the **website** and the **Expo app** use the **same** Supabase project.

### 3.1 Schema & Views (Reference)

- **Full schema:** [recipio/docs/DB_SCHEMA.md](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/DB_SCHEMA.md).
- **Core tables:** `profiles`, `user_roles`, `categories`, `category_translations`, `recipes`, `recipe_translations`, `recipe_steps`, `recipe_categories`, `recipe_variants`, `ingredients`, `ingredient_translations`, `units`, `recipe_variant_ingredients`, `favorites`, `saved_recipes`, `tried_recipes`, `views`, `comments`, `recipe_stats`, `recipe_events`.
- **Key views for app:**
  - **`v_public_recipe_cards`** — List pages (home, recipe list): title, description, stats, category.
  - **`v_recipe_detail`** — Single recipe: translations, steps, all variants (1–4 servings) with ingredients (TR/EN), stats, categories (one query).
  - **`v_recipe_stats`** — Aggregated stats.
- **RLS:** Anonymous can read `published` + `is_free` recipes and insert `views`; authenticated users can read all published recipes and manage their engagement; admin via `user_roles`.

### 3.2 App-Side Supabase Usage

- **Client:** `@supabase/supabase-js`; one shared client (see `supabase-service.ts`).
- **Config:** `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are defined in the `.env` file. All data comes from Supabase; **mock/manual data is never used**.
- **Services:** `supabase-service.ts`, `recipe-service.ts`, `user-service.ts`; later `recipe-search-service.ts` (ingredient-based search).
- **Queries:** Same **views** as the website: `v_public_recipe_cards`, `v_recipe_detail`; RLS stays consistent.

---

## 4. Expo App: Implementation Scope

### 4.1 Entry Flow (Splash & Onboarding First)

**First launch:** Splash (min delay) → **Onboarding** (3 slides) → on completion → **Home**.  
**Subsequent launches:** If onboarding is already completed (persisted via Zustand + AsyncStorage), onboarding is **not** shown; app goes Splash → Home. There is no "anonymous user" mode; profile and auth are introduced in Phase 1 when those screens are built.

### 4.2 Phase 1 — Core entry & discovery (in progress)

Phase 1 is ordered so the user can open the app, complete onboarding, reach Home, then search and view recipes. Each item has a number (1.1–1.10) for easy reference.

| # | Item | Description | Status |
|---|------|-------------|--------|
| **1.1** | Splash | App entry; checks onboarding state; redirects to Onboarding or Home | ✅ |
| **1.2** | Onboarding | 3-slide flow; Zustand + AsyncStorage; dark theme; shown only on first launch | ✅ |
| **1.3** | Home (Dashboard) | Header with search icon, Current Plan, Find Your Next Meal card, Cook Tonight, Recent Activity (View All → History), bottom tabs | ✅ |
| **1.4** | Recipe Search | Search icon tap; search by recipe name; **matching recipes** from `v_public_recipe_cards`/recipe_translations; recent searches; results list → Recipe Detail | ⏳ |
| **1.5** | Enter Ingredients | "Find Your Next Meal" tap; add ingredients to pantry; CTA "Find Recipes with These Ingredients..." → recipe results | ⏳ |
| **1.6** | Recipe Detail | Recipe card tap (Cook Tonight, Recipe Search, etc.); hero image, meta, nutrition, ingredients (Available/Missing), Chef's Tip, servings stepper (1–4) | ⏳ |
| **1.7** | Cooking Start | Entry to cooking flow from Recipe Detail | ⏳ |
| **1.8** | Recent Activity | List on Home; **View All** → History tab/screen | ⏳ |
| **1.9** | Auth | Login/Sign up screens; use **validator_helper** from `@masterfabric-expo/core` (e.g. `validateEmail`, password validation) | ⏳ |
| **1.10** | Profile / Settings | User info, stats, language, theme, sign out (if time allows in Phase 1) | ⏳ |

**Navigation (Phase 1):**
- Find Your Next Meal card → `/enter-ingredients`
- Search icon (header) → `/recipe-search`
- Recipe card tap (any list) → `/recipe-detail/[id]`
- Recent Activity "View All" (on Home) → History screen (tab)

### 4.3 Phase 2 — Full recipe flow & tabs (planned)

Phase 2 adds the full recipe-results flow, cooking guide, and complete tab screens.

| # | Item | Description | Status |
|---|------|-------------|--------|
| **2.1** | Recipe results | List of matching recipes from Enter Ingredients flow | Planned |
| **2.2** | Cooking Guide | Step-by-step mode; progress, timer/tip, Previous/Next/Complete | Planned |
| **2.3** | Favorites tab | Full Favorites screen (list, remove) | Planned |
| **2.4** | History tab | Full History screen (saved/tried); already reachable via Home "View All" | Planned |
| **2.5** | Profile (full) | Full profile/settings if not completed in Phase 1 | Planned |
| **2.6** | Protected routes | Auth-guarded routes where needed; Supabase Auth + validator_helper | Planned |

---

### 4.4 Screen Schematics (Design Reference)

### Splash Screen

*Schematic to be added when image provided.*

- App logo, app name "Recipio", tagline, loader
- Dark theme: black background, white text, orange accent

### Onboarding — 3 Slides (Reference Image)

**Theme:** Dark (black background, white text, orange accents). **Skip** button top-right. Three-dot pagination (filled orange = current). Orange CTA button at bottom.

| Slide | Title | Description | Visual | Button |
|-------|-------|-------------|--------|--------|
| **1** | Enter Your Ingredients | Don't know what to cook? Just type in the ingredients you have, and discover delicious recipes instantly. | Tablet/screen mock with search bar ("Recipe") + basket of vegetables | Next |
| **2** | Get Perfect Recipe Matches | Tell us what you love, and our AI will find recipes tailored specifically to your taste buds and dietary needs. | Avocado Chicken Bowl with "98% Match" orange badge, heart icon, "HEALTHY CHOICE", time/calories | Next → |
| **3** | Cook with Confidence | Never miss a step. Our interactive cooking mode keeps your screen on and guides you from prep to plate. | "COOKING MODE" card: chef hat icon, timer "12:45 REMAINING", "STEP 3 OF 8", instruction text | Get Started |

**Layout per slide:**
```
+-----------------------------------------------------+
|                                    [Skip]           |
|                                                     |
|              [Central Illustration]                 |
|                                                     |
|              "Slide Title"                          |
|                                                     |
|    Description text paragraph.                      |
|                                                     |
|              [●] [○] [○]  (3 dots)                  |
|                                                     |
|              [    Next / Get Started    ]           |
|                     (orange)                        |
+-----------------------------------------------------+
```

### Home Screen (Current State)

- **Header:** Avatar, "GOOD MORNING/AFTERNOON/EVENING", "Welcome, {name}!", search icon (right)
- **Current Plan card:** "CURRENT PLAN", "Pro Chef", "Monthly Recipes Saved", progress bar 45/50, "Active" badge
- **Find Your Next Meal card:** Orange spoon/fork icon, "Find Your Next Meal", "Browse recipes by ingredients you have on hand", chevron
- **Cook Tonight:** Horizontal scroll of recipe cards (image, title, time, difficulty)
- **Recent Activity:** List of saved/finished recipes with thumbnails and timestamps; **View All** (right of section title) navigates to the **History** tab/screen
- **Bottom tabs:** Home, Saved, History, Profile (History is also reachable via Recent Activity → View All)

### Recipe Detail Screen (Reference Image — Opens When Tapping a Recipe)

**Theme:** Dark. Header "Recipe Detail" centered. Back and heart (favorite) buttons over image.

| Section | Content |
|---------|---------|
| **Header** | "Recipe Detail" title; overlay: back (←), heart (♡) buttons |
| **Hero image** | Full-width recipe photo |
| **Title** | "Spicy Thai Basil Chicken" (large, bold, white) |
| **Meta row** | ⭐ 4.8 (120) • 🕐 25 Mins • 🍴 Easy |
| **Description** | Paragraph text (white) |
| **Nutrition cards** | 4 horizontal: 450 Kcal, 32g Prot, 12g Carb, 18g Fat (value white, label orange) |
| **Ingredients** | "Ingredients" + "8 items"; list of cards: ✅ Available (grey bg) / ❌ Missing (reddish-brown bg) |
| **Chef's Tip** | 💡 icon, "Chef's Tip", suggestion text |

**Layout:**
```
+-----------------------------------------------------+
|  Recipe Detail                                      |
|  [←]                                    [♡]        |
|  +------------------------------------------------+ |
|  |              [Recipe Hero Image]                | |
|  +------------------------------------------------+ |
|  Spicy Thai Basil Chicken                           |
|  ⭐ 4.8 (120) • 25 Mins • Easy                      |
|  Description paragraph...                           |
|  +--------+ +--------+ +--------+ +--------+        |
|  |450 Kcal| |32g Prot| |12g Carb| |18g Fat |        |
|  +--------+ +--------+ +--------+ +--------+        |
|  Ingredients                           8 items      |
|  +-----------------------------------------------+  |
|  | ✓ 2 Chicken Breasts              Available    |  |
|  | ✓ 1 Cup Basil Leaves             Available    |  |
|  | ✗ 2tbsp Soy Sauce                Missing      |  |
|  +-----------------------------------------------+  |
|  +-----------------------------------------------+  |
|  | 💡 Chef's Tip                                  |  |
|  | For authentic flavor, use Holy Basil...        |  |
|  +-----------------------------------------------+  |
+-----------------------------------------------------+
```

**Available ingredient card:** Dark grey bg, green checkmark, white text, "Available" grey.  
**Missing ingredient card:** Reddish-brown bg, red X, white text, "Missing" red.

### Enter Ingredients Screen (Reference Image — "Find Your Next Meal" flow)

**Theme:** Dark. Header: back arrow, "Enter Ingredients" title, "Clear All" (primary-accent) right.

| Section | Content |
|---------|---------|
| **Header** | Back (←), "Enter Ingredients" (center), "Clear All" (primary-accent, right) |
| **Add items** | "Add items to your pantry" (bold white), "Start typing to add ingredients for your search." |
| **Input row** | Text input placeholder "Type ingredient name..."; orange "Add" button |
| **Your ingredients** | "YOUR INGREDIENTS (N)" — list of tag-style items (dark grey bg, white text, X to remove) |
| **CTA button** | Full-width orange "Find Recipes with These Ingredients..." at bottom |

**Layout:**
```
+-----------------------------------------------------+
|  [←]  Enter Ingredients              Clear All       |
|                                                     |
|  Add items to your pantry                           |
|  Start typing to add ingredients for your search.   |
|  +------------------------------------------+ [Add]  |
|  | Type ingredient name...                  |       |
|  +------------------------------------------+       |
|                                                     |
|  YOUR INGREDIENTS (5)                               |
|  [Tomato ×] [Basil ×] [Garlic ×]                    |
|  [Olive Oil ×] [Parmesan Cheese ×]                  |
|                                                     |
|  +------------------------------------------------+ |
|  | Find Recipes with These Ingredients...         | |
|  +------------------------------------------------+ |
+-----------------------------------------------------+
```

### Recipe Search Screen (Reference Image — Search by recipe name)

**Theme:** Dark. Search icon in bottom tabs is active (primary-accent). Header: back, "Search Recipes".

| Section | Content |
|---------|---------|
| **Header** | Back (←), "Search Recipes" (center) |
| **Search bar** | Magnifying glass icon, placeholder "Search by recipe name..." |
| **Recent Searches** | "RECENT SEARCHES" + "Clear All" (primary-accent); tag chips (e.g. "Spicy Tacos ×", "Pasta Carbonara ×", "Vegan Burger ×") |
| **Search Results** | "SEARCH RESULTS" — vertical list of recipe cards: image, title, tags (e.g. "VEGAN", "15 MINS") |
| **Bottom tabs** | Home, Search (active/orange), Favorites, Profile |

**Layout:**
```
+-----------------------------------------------------+
|  [←]  Search Recipes                                |
|  +------------------------------------------------+ |
|  | 🔍 Search by recipe name...                    | |
|  +------------------------------------------------+ |
|                                                     |
|  RECENT SEARCHES                      Clear All     |
|  [Spicy Tacos ×] [Pasta Carbonara ×] [Vegan Burger ×]|
|                                                     |
|  SEARCH RESULTS                                     |
|  +-----------------------------------------------+  |
|  | [img] Quinoa Avocado Power Bowl                |  |
|  |       [VEGAN] [15 MINS]                        |  |
|  +-----------------------------------------------+  |
|  | [img] Glazed Lemon Atlantic Salmon             |  |
|  |       [GLUTEN-FREE] [25 MINS]                  |  |
|  +-----------------------------------------------+  |
+-----------------------------------------------------+
|  [Home] [Search●] [Favorites] [Profile]             |
+-----------------------------------------------------+
```

---

## 5. System Architecture (Expo App)

### 5.1 MasterFabric Core

**Package:** `@masterfabric-expo/core` (local workspace package). The Recipio app **must use** the MasterFabric package structure. Use components, helpers, and utilities from `@masterfabric-expo/core` where applicable.

**Core imports:**

```typescript
// Components
import { ThemedView, ThemedText } from '@masterfabric-expo/core';
import { ScreenHeader, Spacer } from '@masterfabric-expo/core';

// Theme
import { ThemeProvider, useTheme, useIsDarkMode } from '@masterfabric-expo/core';
import { Colors } from '@masterfabric-expo/core';

// Utils
import { storage } from '@masterfabric-expo/core';
```

**Note:** Recipio uses `RecipioColors` for dark theme (black + primary-accent). MasterFabric Colors can be used where theme-agnostic defaults are needed.

### 5.1.1 MasterFabric Helpers (Use When Needed)

Helpers are available from `@masterfabric-expo/core`. Use them when the corresponding functionality is required.

| Helper | Import | Use when |
|--------|--------|----------|
| **connectivity** | `import { isOnline, ... } from '@masterfabric-expo/core'` | Checking network status before API calls |
| **platform** | `import { isIOS, isAndroid, ... } from '@masterfabric-expo/core'` | Platform-specific UI or logic |
| **permissions** | `import { requestCameraPermission, ... } from '@masterfabric-expo/core'` | Camera, location, or other permissions |
| **accessibility** | `import { ... } from '@masterfabric-expo/core'` | Accessibility labels and hints |
| **string_helper** | `import { capitalize, truncate, isEmail, ... } from '@masterfabric-expo/core'` | String formatting, validation (e.g. truncate recipe title) |
| **logger_helper** | `import { logger } from '@masterfabric-expo/core'` | Structured logging |
| **snackbar_helper** | `import { snackbarHelper } from '@masterfabric-expo/core'` | Showing snackbars (success, error, undo) |
| **toast_helper** | `import { toastHelper } from '@masterfabric-expo/core'` | Toast notifications |
| **rich_text_helper** | `import { ... } from '@masterfabric-expo/core'` | Rich text rendering |
| **validator_helper** | `import { validateEmail, validateField, ValidatorType, ... } from '@masterfabric-expo/core'` | Form validation; **use actively for auth screens** (login/signup: email, password) |
| **onboarding_helper** | `import { ... } from '@masterfabric-expo/core'` | App onboarding state (Recipio has its own; use if integrating) |
| **device-info** | `import { getDeviceInfo } from '@masterfabric-expo/core'` | Device info (model, OS) |
| **ui_size_helper** | `import { ... } from '@masterfabric-expo/core'` | Responsive sizing |
| **typography_helper** | `import { getTypographyStyleFromSizing } from '@masterfabric-expo/core'` | Typography styles from sizing tokens |
| **time_helper** | `import { formatDate, fromNow, formatDuration } from '@masterfabric-expo/core'` | Date/time formatting (e.g. "5 minutes ago", "25 Mins") |
| **url_launcher_helper** | `import { openUrl } from '@masterfabric-expo/core'` | Opening external links |
| **batteryHelper** | `import { ... } from '@masterfabric-expo/core'` | Battery status (e.g. cooking mode) |
| **app_icon_helper** | `import { ... } from '@masterfabric-expo/core'` | App icon utilities |
| **videoPlayerHapticHelper** | `import { ... } from '@masterfabric-expo/core'` | Video + haptics |
| **web_viewer_helper** | `import { webViewerHelper } from '@masterfabric-expo/core'` | In-app web views |

**Examples for Recipio:**
- `time_helper`: `formatDuration` for recipe prep time ("25 Mins"), `fromNow` for Recent Activity timestamps.
- `string_helper`: `truncate` for long recipe titles or descriptions.
- `snackbar_helper`: "Ingredient added", "Recipe saved", "Clear all" undo.
- `validator_helper`: Form validation on profile or auth screens.

### 5.2 Expo Router

**Structure (Phase 1):**

```
app/
├── _layout.tsx              # Root layout (ThemeProvider + Stack)
├── index.tsx                # Entry; redirects to onboarding or home
├── onboarding.tsx
├── enter-ingredients.tsx    # Enter Ingredients (Find Your Next Meal flow)
├── recipe-search.tsx        # Recipe Search (by name; Search icon)
├── recipe-results.tsx       # Recipe list from ingredients (later)
└── recipe-detail/
│   └── [id].tsx             # Recipe Detail (opens when tapping a recipe)
(tabs)/
├── _layout.tsx
├── index.tsx                # Home
├── favorites.tsx
├── history.tsx
└── profile.tsx
```

**Flow:**

```
App start → index.tsx → Splash (min delay)
  → Onboarding not completed? → /onboarding → (on complete) → / (home)
  → Onboarding already completed? → / (home)

Home:
  → Find Your Next Meal tap → /enter-ingredients
  → Search icon tap → /recipe-search (matching recipes)
  → Recipe card tap (Cook Tonight, etc.) → /recipe-detail/[id]
  → Recent Activity "View All" tap → History (tab)
```

There is no anonymous user path; onboarding is shown only on first launch until the user completes it, then Home is shown. Profile and auth screens are part of Phase 1 when implemented.

**Navigation types:**

```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  index: undefined;
  onboarding: undefined;
  'enter-ingredients': undefined;
  'recipe-search': undefined;
  'recipe-results': { ingredients?: string };
  'recipe-detail': { id: string };
};
```

### 5.3 Path Aliases

- **tsconfig:** `@/*` → `./src/*`, plus `@/screens/*`, `@/shared/*`, `@/navigation/*`.
- **Metro:** `config.resolver.alias['@']` → `src`.
- Prefer `@/...` over deep relative imports.

### 5.4 State Management

- **Splash:** Local state only.
- **Onboarding:** Zustand store with AsyncStorage persistence.
- **Home:** Local state + Supabase in view-model hook.
- **Server state:** Direct Supabase client (no react-query in app for now); same RLS as website.

**Onboarding store example:**

```typescript
// src/screens/onboarding/store/onboarding-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isCompleted: false,
      setCompleted: (value: boolean) => set({ isCompleted: value }),
    }),
    { name: 'onboarding-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

### 5.5 Styling

- **All screens** use the **same color theme** (Section 2.1): dark = black + primary-accent; light = white + primary-accent.
- **Tabs and interactive elements:** Use `RecipioColors.primaryAccent`; avoid orange/lightOrange unless shadows or highlights are needed.
- Shared palette: `#000000`, `#1C1C1E`, `#FF5722` (primary-accent), `#FF9800` (orange), `#FFB74D` (light-orange), `#FFFFFF`, `#8E8E93`.
- One styles file per screen; use StyleSheet.

### 5.6 Supabase Service (App)

- **Init:** Client is created with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from the `.env` file; `persistSession: true`, `detectSessionInUrl: false`.
- **Data source:** All data comes **only from Supabase**. Mock or manual test data is **never used**.
- **Recipe service:** `getCookTonightRecipes()` — from `v_public_recipe_cards` or `recipes` table; returns empty array on error.
- **User service:** `getCurrentUserProfile()` — Returns profile from Supabase `profiles` table when authenticated; until auth is implemented, no anonymous/guest concept — profile UI can be minimal or placeholder.
- **Future:** Recipe detail uses `v_recipe_detail` view for variant + steps + translations in a single query.

### 5.7 Metro & Optional Dependencies

- **Stubs** for optional packages: Firebase, Sentry, Slider, expo-haptics, expo-battery, expo-av, expo-web-browser (so the app runs without them).
- **Supabase is not stubbed** — real `@supabase/supabase-js` is used.
- Path alias and `@masterfabric-expo/core` resolution in Metro (e.g. `watchFolders`, `extraNodeModules`) as in the existing setup.
- When you need a stubbed package: install it, remove its stub from Metro config and from `extraNodeModules`, then use the real package; restart with `npx expo start --clear`.

---

## 6. File Structure & Naming (Expo App)

### 6.1 Directory Layout

**Project root:** All development is done within `project/recipio`; no extra projects are created.

```
project/recipio/
├── .env                          # Supabase: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
├── .env.example                  # Template (.env is in .gitignore)
├── app/                          # Expo Router
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── onboarding.tsx
│   ├── enter-ingredients.tsx     # Enter Ingredients (Find Your Next Meal)
│   ├── recipe-search.tsx         # Recipe Search (by name)
│   ├── recipe-results.tsx        # Recipe list from ingredients
│   ├── recipe-detail/
│   │   └── [id].tsx              # Recipe Detail
│   └── (tabs)/                   # Tab screens
├── src/
│   ├── navigation/types.ts
│   ├── screens/
│   │   ├── splash/
│   │   ├── onboarding/
│   │   ├── home/
│   │   ├── enter-ingredients/    # Phase 1
│   │   ├── recipe-search/        # Phase 1
│   │   └── recipe-detail/        # Phase 1
│   └── shared/
│       ├── constants/            # recipio-colors.ts
│       ├── services/
│       └── utils/
├── metro-stubs/
├── package.json
├── tsconfig.json
├── metro.config.js
└── app.json
```

### 6.2 Naming Conventions

- **Files:** kebab-case (`splash-screen.tsx`, `use-splash-navigation.ts`).
- **Components:** `component-name.tsx`; hooks: `use-hook-name.ts`; models: `*-models.ts`; styles: `*.styles.ts`; stores: `*-store.ts`.
- **Folders:** kebab-case; each screen: `components/`, `hooks/`, `models/`, `styles/`, optional `store/`.
- **Exports:** `index.ts` per screen; central exports from `shared/services/index.ts`.

---

## 7. Required Packages (Expo App)

- **Core:** expo, expo-router, expo-splash-screen, expo-constants, react, react-native, react-native-safe-area-context, react-native-screens, react-native-gesture-handler.
- **UI/theme:** `@masterfabric-expo/core` (workspace).
- **Data:** `@supabase/supabase-js`.
- **State/storage:** zustand, `@react-native-async-storage/async-storage`.
- **Icons:** `@expo/vector-icons`.

(Exact versions should match the project’s `package.json` and Expo SDK.)

---

## 8. Error Prevention & Best Practices

- **Navigation:** Use typed `RootStackParamList` and `router.replace()` / `router.push()` (no `as any`).
- **Imports:** Prefer `@/` aliases; each screen folder has an `index.ts`.
- **MasterFabric:** Only use documented exports; ensure Metro resolves the local package.
- **Supabase:** Validate URL/anon key at startup; handle errors in services and show fallback UI where appropriate.
- **Types:** Define models and navigation types; avoid `any`.

---

## 9. Implementation Checklist (Expo App)

Same order as Section 4.2 / 4.3: **Phase 1** items **1.1–1.10**, **Phase 2** items **2.1–2.6**.

### Phase 1 (1.1–1.10)

- [x] **Setup:** MasterFabric core linked; Expo Router and path aliases; navigation types; Metro (stubs, aliases).
- [x] **Setup:** Supabase config; `supabase-service.ts`, `recipe-service.ts`, `user-service.ts`.
- [x] **1.1** Splash — component, navigation, styles; entry checks onboarding state.
- [x] **1.2** Onboarding — 3 slides, Zustand + AsyncStorage, dark theme; completion persisted.
- [x] **1.3** Home — Dashboard, Find Your Next Meal card, Cook Tonight, Recent Activity (View All → History), search icon, dark theme; root layout with ThemeProvider and Stack.
- [ ] **1.4** Recipe Search — search by recipe name; matching recipes from backend; recent searches; → Recipe Detail.
- [ ] **1.5** Enter Ingredients — layout per reference; add/remove ingredients; CTA "Find Recipes with These Ingredients...".
- [ ] **1.6** Recipe Detail — hero image, meta, nutrition, ingredients (Available/Missing), Chef's Tip; opens when tapping a recipe.
- [ ] **1.7** Cooking Start — entry to cooking flow from Recipe Detail.
- [ ] **1.8** Recent Activity — list on Home; View All → History tab/screen.
- [ ] **1.9** Auth screens (login/signup) — validator_helper for email/password validation.
- [ ] **1.10** Profile / Settings — if time allows in Phase 1.
- [ ] **Navigation:** Find Your Next Meal → `/enter-ingredients`; Search icon → `/recipe-search`; Recipe card → `/recipe-detail/[id]`; Recent Activity View All → History tab.

### Phase 2 (2.1–2.6)

- [ ] **2.1** Recipe results — list of matching recipes from Enter Ingredients flow.
- [ ] **2.2** Cooking Guide — step-by-step mode with timer/tip.
- [ ] **2.3** Favorites tab — full screen.
- [ ] **2.4** History tab — full screen (already reachable via Home View All).
- [ ] **2.5** Profile (full) — if not done in Phase 1.
- [ ] **2.6** Protected routes — Supabase Auth + validator_helper where needed.

---

## 10. References

- **Next.js (website) analysis & schema:** [recipio/docs](https://github.com/NurhayatYurtaslan/recipio/tree/main/docs) — [ANALYSIS.md](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/ANALYSIS.md), [DB_SCHEMA.md](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/DB_SCHEMA.md), [SESSION_PLAN.md](https://github.com/NurhayatYurtaslan/recipio/blob/main/docs/SESSION_PLAN.md).
- **This repo:** [Features](./01-features/), [Architecture](./02-architecture/), [Tech stack](./03-tech-stack/), [Integrations (Supabase)](./04-integrations/), [Getting started](./05-getting-started/), [i18n keys](./06-i18n-translation-keys.md).
- **MasterFabric Core:** workspace package README.
- **Expo Router:** [docs.expo.dev/router](https://docs.expo.dev/router/introduction/).
- **Supabase JS:** [supabase.com/docs/reference/javascript](https://supabase.com/docs/reference/javascript/introduction).

---

**Last updated:** 2026-02-12  
**Version:** 2.1.0  
**Status:** Phase 1 in progress (onboarding first, then Recipe Search with matching recipes, Cooking Start, Recent, Profile if time; auth with validator_helper). Analysis aligned with Next.js docs and shared Supabase. Language: English only.
