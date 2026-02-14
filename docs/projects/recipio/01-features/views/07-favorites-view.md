# 7. Favorites View

The favorites screen shows recipes the user has added to favorites.

### Core Logic & Functionality

- **Favorites list**: Recipes the user has favorited
- **Search**: Search within favorites
- **Filters**: Category, difficulty
- **Sort**: By date, alphabetical
- **Remove from favorites**: Unfavorite action

### Architecture & Components

This view will live under `src/screens/favorites/`.

#### File structure

```
src/screens/favorites/
├── components/
│   ├── favorites-screen.tsx
│   ├── sections/
│   │   ├── search-section.tsx
│   │   └── favorites-grid.tsx
│   └── favorite-card.tsx
├── hooks/
│   └── use-favorites-view-model.ts
├── models/
│   └── favorites-models.ts
├── store/
│   └── favorites-store.ts
└── ...
```

### Translation Keys

```json
{
  "favorites": {
    "title": "Favorites",
    "empty": "No favorite recipes yet",
    "remove": "Remove from Favorites"
  }
}
```
