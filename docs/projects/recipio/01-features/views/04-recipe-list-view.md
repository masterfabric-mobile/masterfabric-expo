# 4. Recipe List View

The recipe list screen shows suggested recipes to the user, ordered by match score.

### Core Logic & Functionality

- **Recipe list**: Recipes sorted by match score
- **Filters**: Speed, practicality, difficulty
- **Search**: Search by recipe name
- **Sort**: By match, popularity, date
- **Suggest again**: Button for new suggestions
- **Match score**: Match percentage per recipe

### Architecture & Components

This view will live under `src/screens/recipe-list/`.

#### File structure

```
src/screens/recipe-list/
├── components/
│   ├── recipe-list-screen.tsx
│   ├── sections/
│   │   ├── filter-section.tsx        # Filters
│   │   ├── sort-section.tsx         # Sort options
│   │   └── recipe-grid.tsx           # Recipe grid
│   └── recipe-card.tsx               # Recipe card
├── hooks/
│   └── use-recipe-list-view-model.ts
├── models/
│   └── recipe-list-models.ts
├── store/
│   └── recipe-list-store.ts
└── ...
```

### Translation Keys

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
