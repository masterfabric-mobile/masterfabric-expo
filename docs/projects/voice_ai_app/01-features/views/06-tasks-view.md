# 5. Tasks View

This view provides a centralized place to see all tasks that have been generated from all recordings. It acts as a lightweight project management tool.

### Mockup

```
+-----------------------------------------------------+
|  Tasks                                              |
+-----------------------------------------------------+
|  [ To-Do (12) ]  [ Completed (38) ]                 |
+-----------------------------------------------------+
|                                                     |
|  ▼ High Priority                                    |
|  +-----------------------------------------------+  |
|  | [ ] Finalize Q4 budget                        |  |
|  |     From: "Meeting Summary"                   |  |
|  +-----------------------------------------------+  |
|  | [ ] Schedule follow-up for next Tuesday       |  |
|  |     From: "Meeting Summary"                   |  |
|  +-----------------------------------------------+  |
|                                                     |
|  ▼ Medium Priority                                  |
|  +-----------------------------------------------+  |
|  | [ ] Draft initial marketing copy              |  |
|  |     From: "Brainstorming Session"             |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
| [Home]   [History]   [Tasks]   [Settings]           |
+-----------------------------------------------------+
```

### Core Logic & Functionality
- **Task Aggregation**: Fetches and displays tasks from *all* recordings.
- **Tabbed Interface**: Separates tasks into "To-Do" and "Completed" lists.
- **Task Interaction**: Users can mark tasks as complete. Tapping a task could navigate to the **Summary View** of the source recording.
- **Grouping/Sorting**: Tasks can be grouped by priority (as determined by the AI) or by the source recording.

### Architecture & Components

This view will be located at `src/features/tasks/TasksScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Text`, `Tabs`, `Card`, `Checkbox`.
  - **Helpers**: `StringHelper`.
- **`@tanstack/react-query`**: To fetch the lists of to-do and completed tasks. `useMutation` would be used to handle the "mark as complete" action.
- **`react-native-draggable-flatlist`**: Could be used to allow users to re-order and prioritize tasks manually.

#### View-Specific Components
- **`TaskList.tsx`**: A `FlatList` component that takes a list of tasks and renders them, likely grouped by priority or date.
- **`TaskListItem.tsx`**: A component for a single task, including a checkbox, the task description, and a link to the source recording.

### State Management
- **Server State**: Managed by **React Query**. Two separate queries could be used for the "To-Do" and "Completed" lists. A `useMutation` hook would be implemented to update a task's status. When the mutation is successful, React Query can automatically invalidate and refetch the task lists to ensure the UI is up-to-date.
- **UI State**: Any local state, like filter/sort options, would be managed with `useState`.

### Integrations
- **Supabase**: The database is the single source of truth for all tasks. A dedicated `tasks` table would be queried to populate this view. An RPC function like `get_tasks_by_status(user_id, 'to-do')` would be efficient for fetching the data. The "mark as complete" action would call another RPC function or directly update the row in the database.
