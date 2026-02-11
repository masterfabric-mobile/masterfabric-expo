# 3a. Recipe Search View

The recipe search screen lets users **search by recipe name**. Opened via the **Search icon** in the Home header.

**Phase 1 scope.** Design per reference image. Dark theme.

### Design (Reference Image)

- **Header:** Back, "Search Recipes"
- **Search bar:** Magnifying glass, placeholder "Search by recipe name..."
- **Recent Searches:** "RECENT SEARCHES" + "Clear All" (primary-accent); tag chips with X to remove
- **Search Results:** Vertical list of recipe cards (image, title, tags e.g. "VEGAN", "15 MINS")
- **Bottom tabs:** Home, Search (active), Favorites, Profile

### Core Logic & Functionality

- **Search by name**: Input triggers search against `v_public_recipe_cards` or `recipe_translations`
- **Recent searches**: Persist recent queries; "Clear All" removes them
- **Recipe cards**: Tappable → Recipe Detail (`/recipe-detail/[id]`)
- **Data source**: Supabase `v_public_recipe_cards` or similar; no mock data
