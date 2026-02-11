# Features Overview

Overview of Recipio app core and advanced features.

## Contents

### Phase 1 Screens (Completed)

- **[Splash View](./views/00-splash-view.md)** — App launch screen
- **[Onboarding View](./views/01-onboarding-view.md)** — First-time intro screens
- **[Home View](./views/02-home-view.md)** — Main screen (Dashboard)

### Later Phase Screens

- **[Ingredient Input View](./views/03-ingredient-input-view.md)** — Ingredient input screen
- **[Recipe List View](./views/04-recipe-list-view.md)** — Recipe list
- **[Recipe Detail View](./views/05-recipe-detail-view.md)** — Recipe detail
- **[Cooking Guide View](./views/06-cooking-guide-view.md)** — Step-by-step cooking guide
- **[Favorites View](./views/07-favorites-view.md)** — Favorite recipes
- **[History View](./views/08-history-view.md)** — Recipe history
- **[Profile View](./views/09-profile-view.md)** — User profile

## Core Features

### 1. Smart Recipe Suggestions (Later Phase)

- Automatic recipe suggestions from entered ingredients
- Sorting by match score (100% down)
- Speed and practicality filters
- Suggestions based on missing ingredients
- AI-powered ingredient matching

### 2. Ingredient Management (Later Phase)

- Ingredient and quantity input
- Ingredient search and autocomplete
- Ingredient categories (vegetables, meat, spices, etc.)

### 3. Recipe Management

- **Cook Tonight**: Random recipes from Supabase
- **Recent Activity**: User activities
- Detailed recipe view (later phase)
- Add/remove favorites (later phase)
- Recipe history (later phase)
- Recipe search and filters (later phase)

### 4. Step-by-Step Cooking Guide (Later Phase)

- Visual step-by-step guide
- Timer support
- Progress tracking
- Note-taking

### 5. User Profile

- **Dashboard**: User greeting and plan info
- **Current Plan**: Plan status and progress
- Profile info (later phase)
- Favorite recipes (later phase)
- Cooking history (later phase)
- Settings (later phase)

## Architecture Notes

### MasterFabric Core Integration

- **ThemedView**: Theme-aware View component
- **ThemedText**: Theme-aware Text component
- **Colors**: MasterFabric color palette
- **ThemeProvider**: Theme context provider

### Supabase Integration

- **Recipe Service**: Recipe operations
- **User Service**: User operations
- **Recipe Search Service**: AI-powered search (later phase)

### State Management

- **Zustand**: Global state management
- **AsyncStorage**: Persistent storage
- **Local State**: Component-specific state

## Current Status

**Completed:**
- Splash Screen
- Onboarding Screen (multi-step)
- Home Screen (Dashboard)
- Supabase Integration
- Dark Theme Design

**Next phases:**
- Enter Ingredients Screen
- Recipe Results Screen
- Recipe Detail Screen
- Cooking Guide Screen
- Favorites Screen
- History Screen
- Profile Screen

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
