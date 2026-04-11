## PR Description

This PR strengthens the **Recipio** home data flow and **recipe service**, adds **Expo Router** generated types (and optional local device metadata), and introduces a persistent **Cursor** naming rule for core views and screens.

### Recipio — `useHomeViewModel`

- Home data loads in parallel via `Promise.all`: current user profile, “Cook tonight” recipes (limit 6), monthly saved count / limit, and recent activity.
- **Dietary preferences** are read from the profile store and passed into `getCookTonightRecipes` and `loadRecentActivities` (via `getRecipesByIds`) so lists and activity rows respect user preferences.
- **Time-of-day greeting** via i18n keys (`morning` / `afternoon` / `evening`).
- **Recent activity**: dated favorites are merged, sorted by date, deduplicated recipe IDs, then hydrated through `getRecipesByIds`; relative time strings use `getRelativeTimeKey` and `t()`.
- `useFocusEffect` refetches when the screen gains focus; pull-to-refresh uses `setRefreshing` plus `loadHomeData`.
- Navigation handlers cover search, recipe detail, profile/plan, enter ingredients, category results, and “find next meal” section params.

### Recipio — `recipe-service`

- Card data from **`v_public_recipe_cards`** with clear handling when the schema or view is missing (warnings, safe empty results, or fallback to the `recipes` table where applicable).
- **`recipe_translations`** for title/description in the requested **locale**; time/difficulty hydration selects only `recipe_id` first to avoid 400s when prep/difficulty columns migrations are not applied, using sensible default time/difficulty constants.
- **Dietary filtering**: allergen keywords and diet slugs, using `recipes.diet_slugs` and ingredient name data (`en` / `tr`) when needed.
- Consistent card/detail flows for **by category**, **by ingredients (match %)**, **search**, **fetch by ids**, and **recipe detail** (steps, ingredients, serving scaling, stats).

### Other

- **`.cursor/rules/.../RULE.md`**: PascalCase folders/files and `index.ts` re-exports for `packages/masterfabric-expo-core` views and root app screens (`alwaysApply: true`).
- **`.expo/types/router.d.ts`**: Expo Router–generated route typings.
- **`.expo/devices.json`**: Local dev device registration (often gitignored — see note below).

> **Note:** `.expo/devices.json` and sometimes `router.d.ts` are environment-generated. If your repo does not track `.expo/`, exclude these from the PR or align with `.gitignore`.

---

## Checklist

- [ ] Code follows the project standards and guidelines.
- [ ] Relevant unit tests are written and all tests are passing.
- [ ] Test coverage is adequate for the changes.
- [ ] Any unnecessary files or debug statements have been removed.
- [ ] Documentation is updated where necessary.
- [ ] The PR has been reviewed by at least one team member before merging.

---

## Steps to Test

1. Run the app against a Supabase project where Recipio migrations are applied (`v_public_recipe_cards`, `recipe_translations`, etc.).
2. Open the Recipio home screen and verify profile summary, greeting, plan summary, “Cook tonight” list, and recent activity load without errors.
3. Set **diet / allergen** preferences in profile; leave and return to home or pull to refresh — lists and activity rows should respect filtering.
4. Pull to refresh and confirm loading/refresh state completes and data updates.
5. Tap an item in recent activity to open recipe detail; smoke-test search, category navigation, and profile/plan routes.
6. (Optional) With a missing view or migration: confirm console warnings are actionable and the app degrades gracefully (no hard crash).

---

## Related Links

- Issue:
- Documentation: `docs/projects/recipio/supabase/migrations/` (migration order and Recipio schema notes)

---

### Screenshots (Optional)

<!-- Add home screen screenshots if UI changed: plan summary, Cook tonight, recent activity. -->
