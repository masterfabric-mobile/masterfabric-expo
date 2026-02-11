# 8. History View

The history screen shows recipes the user has viewed or cooked before.

### Core Logic & Functionality

- **View history**: Recently viewed recipes
- **Cooked recipes**: Recipes the user has cooked
- **Date filter**: Today, this week, this month
- **Clear**: Clear history

### Architecture & Components

This view will live under `src/screens/history/`.

#### File structure

```
src/screens/history/
├── components/
│   ├── history-screen.tsx
│   ├── sections/
│   │   ├── filter-section.tsx
│   │   └── history-list.tsx
│   └── history-item.tsx
├── hooks/
│   └── use-history-view-model.ts
├── models/
│   └── history-models.ts
├── store/
│   └── history-store.ts
└── ...
```

### Translation Keys

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
