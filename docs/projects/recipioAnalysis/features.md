# Features

All screens and views in the Recipio application.

## Core Views

### 1. Splash View

Initial loading screen shown when launching the application.

**Purpose:**
- Display app branding
- Initialize app services
- Check authentication status
- Navigate to onboarding or dashboard

**Navigation:**
- After initialization: Checks `shouldShowOnboarding()` from `masterfabric-expo-core`
  - **First-time users:** Navigates to Onboarding using `router.push('/onboarding')`
  - **Returning users:** Navigates to Home (Tabs) using `navigationUtils.replace('(tabs)')`
- Navigation logic: `src/screens/splash/hooks/use-splash-view-model.ts`
- Uses centralized navigation utilities from `src/navigation/utils.ts`

---

### 2. Onboarding View

Introduction screen for new users explaining app features.

**Purpose:**
- Welcome new users
- Explain key features
- Guide users through initial setup

**Components:**
- Welcome slides/carousel
- Feature highlights
- "Get Started" button
- Skip option

**Navigation:**
- After completion: Navigates to Home (Tabs) using `navigationUtils.replace('(tabs)')`
- Skip: Navigates directly to Home (Tabs) using `navigationUtils.replace('(tabs)')`
- Navigation logic: `src/screens/onboarding/hooks/use-onboarding-view-model.ts`
- Uses centralized navigation utilities from `src/navigation/utils.ts`

---

### 3. Dashboard View

Main dashboard providing quick access to all app features.

**Purpose:**
- Central hub for app navigation
- Quick access to recent recipes
- Display user statistics
- Show featured recipes

**Components:**
- Navigation tabs/bottom bar
- Quick action buttons
- Recent recipes carousel
- Featured recipes section
- User stats (cooked recipes, favorites count)

**Features:**
- Quick scan button (ingredient entry)
- Recent cooking history
- Favorite recipes preview
- Search bar
- Profile access

---

### 4. Ingredient Entry View

Allows users to manually enter their available ingredients.

**Purpose:**
- Manual ingredient entry
- Add/remove ingredients from list
- Prepare ingredients list for recipe suggestions

**Components:**
- Ingredient input field
- Ingredient list (added manually)
- Add/remove ingredient controls
- "Find Recipes" button

**Navigation:**
- After ingredient entry: Navigates to Recipe Suggestions using `navigationUtils.navigate('recipe-suggestions', { ingredients })`
- Back: Returns to previous screen using `navigationUtils.goBack()`
- Navigation logic: `src/screens/ingredient-entry/hooks/use-ingredient-entry-view-model.ts`

---

### 5. Recipe Suggestions View

Displays AI-powered recipe recommendations based on available ingredients.

**Purpose:**
- Show recipe matches
- Display match scores
- Indicate available/missing ingredients
- Allow recipe selection

**Components:**
- Recipe cards list
- Match score indicators
- Ingredient availability badges
- Filter/sort options

**Features:**
- Recipe matching algorithm
- Match score calculation
- Ingredient availability display
- Recipe filtering and sorting

**Navigation:**
- Recipe selection: Navigates to Recipe Detail using `navigationUtils.navigate('recipe-detail', { recipeId })`
- Back: Returns to Recipe Suggestions using `navigationUtils.goBack()`
- Navigation logic: `src/screens/recipe-suggestions/hooks/use-recipe-suggestions-view-model.ts`

---

### 6. Recipe Detail View

Shows comprehensive information about a selected recipe.

**Purpose:**
- Display full recipe details
- Show ingredient list with availability
- Display cooking instructions preview
- Provide action buttons

**Components:**
- Recipe header (image, name, metadata)
- Ingredient list (with availability indicators)
- Nutrition information
- Cooking time and difficulty
- "Start Cooking" button
- Favorite button
- Share button

**Features:**
- Recipe image gallery
- Ingredient checklist
- Nutrition facts
- Recipe metadata (servings, prep time, cook time)
- Social sharing
- Add to favorites

**Navigation:**
- Start Cooking: Navigates to Cooking Mode using `navigationUtils.navigate('cooking-mode', { recipeId })`
- Back: Returns to previous screen using `navigationUtils.goBack()`
- Navigation logic: `src/screens/recipe-detail/hooks/use-recipe-detail-view-model.ts`

---

### 7. Cooking Mode View

Provides step-by-step cooking guidance with detailed instructions.

**Purpose:**
- Guide users through cooking steps
- Track progress
- Show step-by-step instructions

**Components:**
- Step indicator/progress bar
- Current step card
- Step instructions
- Navigation buttons (previous/next)
- Complete step button

**Features:**
- Step-by-step instructions
- Step completion tracking
- Progress saving

**Navigation:**
- Next/Previous: Navigates between steps (internal state, no navigation)
- Complete: Marks step as done (internal state)
- Finish: Returns to Recipe Detail or Home using `navigationUtils.navigate('recipe-detail', { recipeId })` or `navigationUtils.goToHome()`
- Back: Exits cooking mode with confirmation, returns to Recipe Detail using `navigationUtils.goBack()`
- Navigation logic: `src/screens/cooking-mode/hooks/use-cooking-mode-view-model.ts`

---

### 8. Favorites View

Displays saved favorite recipes.

**Purpose:**
- Show user's favorite recipes
- Allow quick access to saved recipes
- Manage favorites list

**Components:**
- Favorite recipes list
- Recipe cards
- Filter/search options
- Empty state

**Features:**
- View all favorites
- Remove from favorites
- Filter and search favorites

**Navigation:**
- Recipe selection: Navigates to Recipe Detail using `navigationUtils.navigate('recipe-detail', { recipeId })`
- Back: Returns to Favorites tab (tab navigation, no back needed)
- Navigation logic: `src/screens/favorites/hooks/use-favorites-view-model.ts`

---

### 9. History View

Shows cooking history and previously cooked recipes.

**Purpose:**
- Display cooking history
- Show previously cooked recipes
- Track cooking statistics

**Components:**
- History list
- Recipe cards with dates
- Statistics section
- Filter options

**Features:**
- View cooking history
- Filter by date
- View recipe ratings
- Statistics (total cooked, favorite recipes)

**Navigation:**
- Recipe selection: Navigates to Recipe Detail using `navigationUtils.navigate('recipe-detail', { recipeId })`
- Back: Returns to History tab (tab navigation, no back needed)
- Navigation logic: `src/screens/history/hooks/use-history-view-model.ts`

---

### 10. Profile View

User profile and settings screen.

**Purpose:**
- Display user information
- Manage app settings
- Access account features
- View subscription status

**Components:**
- User profile header
- Settings list
- Subscription info
- Statistics section
- Logout button

**Features:**
- Profile information display
- App settings (notifications, language, theme)
- Subscription management (Bronze, Gold, Diamond tiers)
- Account settings
- Data export/import

**Navigation:**
- Settings items: Navigates to specific settings screens using `navigationUtils.navigate('settings')`
- Back: Returns to Profile tab (tab navigation, no back needed)
- Navigation logic: `src/screens/profile/hooks/use-profile-view-model.ts`

---

### 11. Search View

Recipe search functionality.

**Purpose:**
- Search for recipes
- Filter search results
- Browse recipe categories

**Components:**
- Search input
- Search results list
- Filter options
- Category filters

**Features:**
- Recipe search
- Filter by category, difficulty, time
- Recent searches
- Popular searches

**Navigation:**
- Recipe selection: Navigates to Recipe Detail using `navigationUtils.navigate('recipe-detail', { recipeId })`
- Back: Returns to Home using `navigationUtils.goBack()` or `navigationUtils.goToHome()`
- Navigation logic: `src/screens/search/hooks/use-search-view-model.ts`

