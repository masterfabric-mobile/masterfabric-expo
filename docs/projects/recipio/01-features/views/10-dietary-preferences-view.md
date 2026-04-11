# 10. Dietary Preferences View

The Dietary Preferences screen lets users set their diet types (e.g. vegan, keto) and allergies. Data is stored in Supabase and can be used to personalize recipe recommendations and meal plans.

## Core logic and functionality

- **Diets**: Multi-select pills — Vegan, Vegetarian, Keto, Paleo, Low Carb, Gluten-Free.
- **Allergies**: Multi-select pills (Dairy, Nuts, Shellfish, Soy, Wheat, Eggs) plus a free-text input to add custom allergies (e.g. "Add other allergy…") with an orange "+" button.
- **Info text**: Short copy explaining that preferences are used to personalize recommendations and meal plans.
- **Save**: "Save Preferences" persists `diet_slugs`, `allergy_slugs`, and `custom_allergies` to the current user’s profile in Supabase, then navigates back.
- **Back**: Header back button returns to the previous screen (e.g. Profile).

## Design

- **Theme**: Dark (RecipioColors.background, cardBackground, primaryAccent).
- **Header**: Back (chevron-left), center title "Dietary Preferences", no right action.
- **Sections**:
  - **DIETS**: Section title with restaurant icon; row of selectable pills (selected = orange, unselected = dark card).
  - **ALLERGIES**: Section title with warning icon; text input + add button; row of allergy pills + any custom allergies as pills (selected state; tap to remove).
- **Info box**: Dark card with secondary text.
- **Save button**: Full-width orange CTA at bottom.

## Layout structure (ASCII)

```
+-----------------------------------------------------+
|  [<]     Dietary Preferences                        |
+-----------------------------------------------------+
|  [🍴] DIETS                                         |
|  [Vegan] [Vegetarian] [Keto] [Paleo] [Low Carb]    |
|  [Gluten-Free]                                      |
+-----------------------------------------------------+
|  [⚠] ALLERGIES                                     |
|  [ Add other allergy...                    ] [+]    |
|  [Dairy] [Nuts] [Shellfish] [Soy] [Wheat] [Eggs]   |
|  (custom pills if any)                              |
+-----------------------------------------------------+
|  +-----------------------------------------------+  |
|  | We'll use these preferences to personalize   |  |
|  | your recipe recommendations and meal plans.    |  |
|  +-----------------------------------------------+  |
+-----------------------------------------------------+
|  [        Save Preferences        ]                 |
+-----------------------------------------------------+
```

## Architecture and components

This view lives under `src/screens/dietary-preferences/`.

### File structure

```
src/screens/dietary-preferences/
├── components/
│   └── dietary-preferences-screen.tsx   # Main screen (header, sections, save)
├── hooks/
│   └── use-dietary-preferences-view-model.ts
├── models/
│   └── dietary-preferences-models.ts     # DIET_SLUGS, ALLERGY_SLUGS, DietaryPreferences
├── styles/
│   └── dietary-preferences.styles.ts
└── index.ts
```

### Shared service

- **`src/shared/services/dietary-preferences-service.ts`**
  - `getDietaryPreferences()`: Loads `diet_slugs`, `allergy_slugs`, `custom_allergies` from `profiles` for the current user.
  - `updateDietaryPreferences(prefs)`: Updates the current user’s profile with the given preferences.

### Route

- **`app/dietary-preferences.tsx`**: Renders `DietaryPreferencesScreen`; route name `dietary-preferences`, header hidden in stack.

### Navigation

- **Entry**: Profile → Account Settings → "Dietary Preferences" row.
- **Exit**: Back button or after successful Save (router.back()).

## Data model

- **Diet slugs**: `vegan` | `vegetarian` | `keto` | `paleo` | `low_carb` | `gluten_free`
- **Allergy slugs**: `dairy` | `nuts` | `shellfish` | `soy` | `wheat` | `eggs`
- **Custom allergies**: User-defined strings (e.g. from "Add other allergy" input).

```ts
interface DietaryPreferences {
  dietSlugs: string[];
  allergySlugs: string[];
  customAllergies: string[];
}
```

## Supabase integration

- **Table**: `public.profiles`
- **Columns** (see migration `0014_add_profiles_dietary_preferences.sql`):
  - `diet_slugs` — `TEXT[]` (default `'{}'`)
  - `allergy_slugs` — `TEXT[]` (default `'{}'`)
  - `custom_allergies` — `TEXT[]` (default `'{}'`)
- **Access**: Authenticated user can read/update own profile (RLS). Load on screen open; update on "Save Preferences".

## Translation keys (i18n)

All keys live under `dietaryPreferences.*` (e.g. in `en.json` / `tr.json`):

| Key | Description |
|-----|-------------|
| `dietaryPreferences.title` | Screen title (e.g. "Dietary Preferences") |
| `dietaryPreferences.diets` | Diets section label (e.g. "DIETS") |
| `dietaryPreferences.allergies` | Allergies section label (e.g. "ALLERGIES") |
| `dietaryPreferences.addOtherAllergy` | Input placeholder (e.g. "Add other allergy…") |
| `dietaryPreferences.infoText` | Info box body text |
| `dietaryPreferences.save` | Save button label (e.g. "Save Preferences") |
| `dietaryPreferences.vegan` … `dietaryPreferences.eggs` | Labels for each diet and allergy pill |

## Relation to recipe filtering

- **Recipe tags**: Migration `0015_add_recipes_diet_slugs.sql` adds `recipes.diet_slugs` (e.g. vegan, vegetarian). Recipes can be filtered by overlap with the user’s `profiles.diet_slugs` (and optionally allergy handling in the app layer).
- **Usage**: When showing recipe lists or recommendations, the app can filter or rank by `diet_slugs` and user dietary preferences; allergies can be used to exclude or warn.
