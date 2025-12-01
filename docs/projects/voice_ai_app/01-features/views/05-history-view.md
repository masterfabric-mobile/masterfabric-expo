# 3. History View

This screen displays a chronological, searchable, and filterable list of all the user's past recordings.

### Mockup

```
+-----------------------------------------------------+
|  History                                            |
+-----------------------------------------------------+
|  [ Search recordings... (🔍) ] [Filter 🔽]           |
+-----------------------------------------------------+
|                                                     |
|  ▼ Today                                            |
|  +-----------------------------------------------+  |
|  | Meeting Summary          15 min >              |  |
|  | 28 Nov 2025, 2:30 PM                          |  |
|  +-----------------------------------------------+  |
|  | Brainstorming Session    45 min >              |  |
|  | 28 Nov 2025, 10:15 AM                         |  |
|  +-----------------------------------------------+  |
|                                                     |
|  ▼ Yesterday                                        |
|  +-----------------------------------------------+  |
|  | Project Update           5 min >               |  |
|  | 27 Nov 2025, 4:00 PM                          |  |
|  +-----------------------------------------------+  |
|  |                                               |  |
|  (Spinner: Loading more...)                     |  |
+-----------------------------------------------------+
| [Home]   [History]   [Tasks]   [Settings]           |
+-----------------------------------------------------+
```

### Core Logic & Functionality
- The view fetches and displays a paginated list of all recordings.
- Recordings are grouped by date (e.g., Today, Yesterday, Nov 2025).
- A search bar allows users to find recordings by title or content.
- A filter button could open a modal to filter by date range, duration, or tags.
- Tapping on any item navigates the user to the **Summary View** for that recording.
- The list supports infinite scrolling to load older recordings as the user scrolls down.

### Architecture & Components

This view will be located at `src/screens/history/HistoryScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Text`, `Input`, `Card`, `Icon`, `Spinner`.
  - **Helpers**: `TimeHelper` for formatting dates, `StringHelper` for formatting duration.
- **`@tanstack/react-query`**: Recommended for managing the server state, including fetching, caching, and pagination of the recordings list.
- **`zustand`**: Can be used to store search/filter criteria.

#### View-Specific Components
- **`SearchBar.tsx`**: The search input component.
- **`FilterModal.tsx`**: A modal component for advanced filtering options.
- **`RecordingsList.tsx`**: A `FlatList` component configured for pagination, rendering `RecordingListItem`s and section headers for dates.
- **`RecordingListItem.tsx`**: A reusable component that displays a single recording's title, date, and duration.

### State Management
- **Server State**: Managed by **React Query**. The `useInfiniteQuery` hook is ideal for fetching the paginated list of recordings. It will handle caching, `isLoading`, `isFetchingMore`, and `error` states automatically.
- **UI State**: The `searchQuery` and `filterOptions` will be stored in a local state (`useState`) or a dedicated Zustand store if they need to be persisted across the app.

### Integrations
- **Supabase**: The primary data source. The React Query fetch function will call a Supabase RPC function (e.g., `get_user_recordings_paginated`) to get the data. The RPC function can also handle the search and filtering logic on the database side for better performance.
