# 9. Profile View

The user profile screen shows user info and settings.

### Core Logic & Functionality

- **User info**: Name, email, profile photo
- **Stats**: Total recipes, favorites count
- **Settings**: Language, theme, notifications
- **Sign out**: Log out

### Architecture & Components

This view will live under `src/screens/profile/`.

#### File structure

```
src/screens/profile/
├── components/
│   ├── profile-screen.tsx
│   ├── sections/
│   │   ├── user-info-section.tsx    # User info
│   │   ├── stats-section.tsx        # Stats
│   │   └── settings-section.tsx     # Settings
│   └── stat-card.tsx                # Stat card
├── hooks/
│   └── use-profile-view-model.ts
├── models/
│   └── profile-models.ts
├── store/
│   └── profile-store.ts
└── ...
```

### Translation Keys

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
