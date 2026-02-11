# 5. Recipe Detail View

The recipe detail screen shows all information for the selected recipe. **Opens when user taps a recipe** (e.g. from Cook Tonight or Recipe List). Uses **unified dark theme** (black + orange).

## Design (Reference Image)

### Layout Schematic

| Section | Content |
|---------|---------|
| **Header** | "Recipe Detail" title; overlay: back (←), heart (♡ favorite) buttons |
| **Hero image** | Full-width recipe photo |
| **Title** | Recipe name (large, bold, white) |
| **Meta row** | ⭐ rating (e.g. 4.8 (120)) • 🕐 time (e.g. 25 Mins) • 🍴 difficulty (Easy/Medium/Hard) |
| **Description** | Paragraph text (white) |
| **Nutrition cards** | 4 horizontal: Kcal, Prot, Carb, Fat (value white, label `#FF5722` primary-accent) |
| **Ingredients** | "Ingredients" + item count; list: ✅ Available (grey bg) / ❌ Missing (reddish-brown bg) |
| **Chef's Tip** | 💡 icon, "Chef's Tip", suggestion text (optional) |

### Ingredient Card Styles

- **Available:** Dark grey bg (`#1C1C1E`), green checkmark, white text, "Available" grey
- **Missing:** Reddish-brown bg, red X, white text, "Missing" red

### Core Logic & Functionality

- **Recipe info**: Title, description, image (from `v_recipe_detail`)
- **Ingredients list**: Required ingredients with Available/Missing state
- **Rating, time, difficulty**: From recipe stats
- **Nutrition**: Kcal, protein, carbs, fat
- **Add/remove favorite**: Heart button
- **Start cooking**: Button to open step-by-step guide (Cooking Guide screen)

### Architecture & Components

This view will live under `src/screens/recipe-detail/`.

#### File structure

```
src/screens/recipe-detail/
├── components/
│   ├── recipe-detail-screen.tsx
│   ├── sections/
│   │   ├── header-section.tsx        # Title and image
│   │   ├── info-section.tsx          # Time, servings, difficulty
│   │   ├── ingredients-section.tsx   # Ingredients
│   │   └── actions-section.tsx       # Buttons
│   └── ingredient-row.tsx            # Ingredient row
├── hooks/
│   └── use-recipe-detail-view-model.ts
├── models/
│   └── recipe-detail-models.ts
├── store/
│   └── recipe-detail-store.ts
└── ...
```

### Translation Keys

```json
{
  "recipeDetail": {
    "prepTime": "Prep",
    "cookTime": "Cook",
    "totalTime": "Total",
    "servings": "Servings",
    "difficulty": "Difficulty",
    "ingredients": "Ingredients",
    "startCooking": "Start Cooking",
    "addToFavorites": "Add to Favorites",
    "removeFromFavorites": "Remove from Favorites"
  }
}
```
