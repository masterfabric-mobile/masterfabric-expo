# Views Index

List of all screen views in the Recipio app.

## Screen List

1. **[Splash View](./00-splash-view.md)** — App launch screen
2. **[Onboarding View](./01-onboarding-view.md)** — First-time intro screens
3. **[Home View](./02-home-view.md)** — Main screen
4. **[Ingredient Input View](./03-ingredient-input-view.md)** — Enter Ingredients (Find Your Next Meal)
5. **[Recipe Search View](./03a-recipe-search-view.md)** — Search by recipe name (Search icon)
6. **[Recipe List View](./04-recipe-list-view.md)** — Recipe list (from ingredients)
7. **[Recipe Detail View](./05-recipe-detail-view.md)** — Recipe detail (opens when tapping a recipe)
8. **[Cooking Guide View](./06-cooking-guide-view.md)** — Step-by-step cooking guide
9. **[Favorites View](./07-favorites-view.md)** — Favorite recipes screen
10. **[History View](./08-history-view.md)** — Recipe history screen
11. **[Profile View](./09-profile-view.md)** — User profile screen

## Navigation Flow

```
Splash → Onboarding → Home
                          ↓
        ┌─────────────────┼────────────────────┐
        ↓                 ↓                    ↓
  Find Your Next Meal   Search icon      Recipe card tap
        ↓                 ↓                    ↓
  Enter Ingredients   Recipe Search      Recipe Detail
        ↓                 ↓
  Recipe Results      Recipe Detail
```
