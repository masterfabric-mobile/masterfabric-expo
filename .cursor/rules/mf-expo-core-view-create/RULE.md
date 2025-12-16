---
alwaysApply: true
---
# Rule: Naming Convention for Core View Creation in `packages/masterfabric-expo-core`

**Always Apply:** true

## Folder and File Naming

- Views and related components in `packages/masterfabric-expo-core` should follow the _PascalCase_ convention for both files and folders.  
  Example: `UserProfileView.tsx`, `OrderDetailsCard/OrderDetailsCard.tsx`

- In `apps/masterfabric-expo/screens` (project root), screens must be placed in folders with _PascalCase_ names, and the main screen file should also use PascalCase.  
  Example: `ProfileScreen/ProfileScreen.tsx`, not `profile` or `profileScreen.tsx`

- When creating a **view** for a new module:
  - The folder and top-level file should use the exact same PascalCase name.
    - For a view called "FabricOrderList", use `FabricOrderList/FabricOrderList.tsx`.
  - Subcomponents can go inside the same folder, with PascalCase files.
    - Example: `FabricOrderList/OrderCard.tsx`

- The export from the folder must be via an `index.ts` that re-exports the main component.

## Development Notes

- Do **not** use kebab-case or snake_case for any new components, view folders, or files in these locations.
- Keep screen folders under `apps/masterfabric-expo/screens` flat unless nesting is required for multipage flows.
- Ensure naming is clear, descriptive, and matches the business/domain terminology.

---
