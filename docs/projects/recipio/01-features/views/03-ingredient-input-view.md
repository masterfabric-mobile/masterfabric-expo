# 3. Ingredient Input View (Enter Ingredients)

The ingredient input screen is the **"Find Your Next Meal"** destination. User adds ingredients to their pantry, then taps "Find Recipes with These Ingredients...".

**Phase 1 scope.** Design per reference image. Dark theme.

### Design (Reference Image)

- **Header:** Back, "Enter Ingredients", "Clear All" (primary-accent)
- **Add items:** "Add items to your pantry", "Start typing to add ingredients for your search."
- **Input:** Text field "Type ingredient name...", orange "Add" button
- **Your ingredients:** Tag-style list (dark grey bg, X to remove); "YOUR INGREDIENTS (N)"
- **CTA:** Full-width orange "Find Recipes with These Ingredients..."

### Core Logic & Functionality

- **Add ingredients**: User types name, taps "Add" to add to list
- **Remove ingredient**: X on each tag
- **Clear all**: "Clear All" in header clears the list
- **Find recipes**: CTA navigates to recipe results (list of matching recipes)

### Architecture & Components

This view will live under `src/screens/ingredient-input/`.

#### File structure

```
src/screens/ingredient-input/
├── components/
│   ├── ingredient-input-screen.tsx
│   ├── sections/
│   │   ├── search-section.tsx        # Ingredient search
│   │   ├── category-filter.tsx       # Category filter
│   │   └── ingredient-list.tsx       # Added ingredients list
│   └── ingredient-item.tsx           # Ingredient item
├── hooks/
│   └── use-ingredient-input-view-model.ts
├── models/
│   └── ingredient-input-models.ts
├── store/
│   └── ingredient-input-store.ts
├── styles/
│   └── ...
└── index.ts
```

### Translation Keys

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
