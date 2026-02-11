# i18n Translation Keys

i18n translation key structure for the Recipio app.

## Translation Structure

Translation files live in `src/shared/i18n/translations/`:
- `en.json`: English
- `tr.json`: Turkish

## Translation Keys (English examples)

### app.json

```json
{
  "app": {
    "name": "Recipio",
    "tagline": "Smart Recipe Suggestions"
  }
}
```

### common.json

```json
{
  "common": {
    "ok": "OK",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading...",
    "error": "Error",
    "retry": "Retry",
    "success": "Success",
    "previous": "Previous",
    "next": "Next",
    "skip": "Skip",
    "getStarted": "Get Started",
    "close": "Close",
    "search": "Search...",
    "filter": "Filter",
    "sort": "Sort"
  }
}
```

### splash.json

```json
{
  "splash": {
    "appName": "Recipio",
    "tagline": "Smart Recipe Suggestions",
    "loading": {
      "fonts": "Loading fonts",
      "services": "Starting services",
      "auth": "Checking authentication",
      "preferences": "Loading user preferences",
      "finalize": "Finishing setup"
    }
  }
}
```

### onboarding.json

```json
{
  "onboarding": {
    "welcome": {
      "title": "Welcome!",
      "description": "Get smart recipe suggestions based on the ingredients you have"
    },
    "step1": {
      "title": "Ingredient Input",
      "description": "Enter your ingredients and quantities"
    },
    "step2": {
      "title": "Smart Suggestions",
      "description": "Find the best matching recipes by score"
    },
    "step3": {
      "title": "Step-by-Step Guide",
      "description": "Follow the cooking process easily"
    },
    "step4": {
      "title": "Favorites",
      "description": "Save recipes you like and access them easily"
    },
    "controls": {
      "back": "Back",
      "next": "Next",
      "skip": "Skip",
      "getStarted": "Get Started"
    }
  }
}
```

### home.json

```json
{
  "home": {
    "title": "Home",
    "greeting": {
      "hello": "Hello",
      "goodMorning": "Good morning",
      "goodAfternoon": "Good afternoon",
      "goodEvening": "Good evening"
    },
    "quickActions": {
      "addIngredients": "Add Ingredients",
      "quickRecipe": "Quick Recipe",
      "favorites": "Favorites"
    },
    "sections": {
      "recommended": "Recommended Recipes",
      "recent": "Recently Viewed",
      "categories": "Popular Categories"
    },
    "empty": {
      "noRecipes": "No recipes yet",
      "noRecent": "No recently viewed recipes"
    }
  }
}
```

### ingredientInput.json

```json
{
  "ingredientInput": {
    "title": "Add Ingredients",
    "searchPlaceholder": "Search ingredients...",
    "addButton": "Add",
    "suggestRecipe": "Suggest Recipes",
    "empty": "No ingredients added yet",
    "categories": {
      "all": "All",
      "vegetable": "Vegetable",
      "meat": "Meat",
      "spice": "Spice",
      "dairy": "Dairy"
    }
  }
}
```

### recipeList.json

```json
{
  "recipeList": {
    "title": "Recipe Suggestions",
    "suggestAgain": "Suggest Again",
    "filters": {
      "speed": "Speed",
      "practicality": "Practicality",
      "difficulty": "Difficulty"
    },
    "sort": {
      "match": "Match",
      "popularity": "Popularity",
      "date": "Date"
    },
    "empty": "No recipes found"
  }
}
```

### recipeDetail.json

```json
{
  "recipeDetail": {
    "prepTime": "Prep",
    "cookTime": "Cook",
    "totalTime": "Total",
    "servings": "Servings",
    "difficulty": {
      "title": "Difficulty",
      "easy": "Easy",
      "medium": "Medium",
      "hard": "Hard"
    },
    "ingredients": "Ingredients",
    "startCooking": "Start Cooking",
    "addToFavorites": "Add to Favorites",
    "removeFromFavorites": "Remove from Favorites"
  }
}
```

### cookingGuide.json

```json
{
  "cookingGuide": {
    "title": "Cooking Guide",
    "step": "Step",
    "of": "/",
    "next": "Next",
    "previous": "Previous",
    "complete": "Complete",
    "timer": "Timer",
    "addNote": "Add Note",
    "notes": "Notes",
    "congratulations": "Congratulations! Your dish is ready!"
  }
}
```

### favorites.json

```json
{
  "favorites": {
    "title": "Favorites",
    "empty": "No favorite recipes yet",
    "remove": "Remove from Favorites"
  }
}
```

### history.json

```json
{
  "history": {
    "title": "History",
    "viewed": "Viewed",
    "cooked": "Cooked",
    "today": "Today",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "clear": "Clear",
    "empty": "No history"
  }
}
```

### profile.json

```json
{
  "profile": {
    "title": "Profile",
    "stats": {
      "totalRecipes": "Total Recipes",
      "favorites": "Favorites",
      "cooked": "Cooked"
    },
    "settings": {
      "language": "Language",
      "theme": "Theme",
      "notifications": "Notifications"
    },
    "signOut": "Sign Out"
  }
}
```

## Usage Example

```typescript
import { t } from '@/src/shared/i18n';

// Basic usage
const title = t('home.title');

// With interpolation
const greeting = t('home.greeting.hello', { name: 'John' });

// In component
<ThemedText>{t('common.loading')}</ThemedText>
```

**Note:** For Turkish locale, keep the same keys in `tr.json` with Turkish values.
