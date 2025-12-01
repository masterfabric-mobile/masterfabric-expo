# 4. Summary View

This view is the destination after finishing a recording or tapping on a past recording. It displays the full details of a single recording, including the audio player, transcription, AI summary, and generated tasks.

### Mockup

```
+-----------------------------------------------------+
| < Back | Meeting Summary                     [Share] |
+-----------------------------------------------------+
|  +-----------------------------------------------+  |
|  | [▶ Play] --(●)----------  3:45 / 15:00    [🔊]  |  |
|  +-----------------------------------------------+  |
|                                                     |
|  [ Summary ]  [ Transcription ]  [ Tasks ]          |
|  +-----------------------------------------------+  |
|  | Key Takeaways:                                |  |
|  | - Finalize Q4 budget by Friday.               |  |
|  | - Alice to lead the new marketing campaign.   |  |
|  | - Schedule follow-up for next Tuesday.        |  |
|  |                                               |  |
|  | (Spinner: AI is generating summary...)        |  |
|  +-----------------------------------------------+  |
|                                                     |
+-----------------------------------------------------+
|                                                     |
+-----------------------------------------------------+
```

### Core Logic & Functionality
- **Audio Player**: Allows the user to play back the original recording.
- **Tabbed Interface**: Separates the **Summary**, full **Transcription**, and related **Tasks** into different tabs for clarity.
- **Dynamic Content**: If the AI processing is not yet complete when the user lands here, a loading state is shown. The view should update in real-time or via polling as the transcription and summary become available.
- **Actions**: Users can edit the title, share the summary, or delete the recording.

### Architecture & Components

This view will be located at `src/features/summarization/SummaryScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Text`, `Card`, `Icon`, `Spinner`, `Button`, `Tabs`.
  - **Helpers**: `TimeHelper` to format timestamps.
- **`expo-av`**: Used for the audio playback functionality.
- **`@tanstack/react-query`**: To fetch the details of a specific recording, including its summary and tasks.

#### View-Specific Components
- **`AudioPlayer.tsx`**: A component wrapping `expo-av`'s `Audio.Sound` object to provide play/pause controls, a seek bar, and volume control.
- **`SummaryTab.tsx`**: Displays the formatted AI-generated summary.
- **`TranscriptionTab.tsx`**: Displays the full, word-for-word transcription, potentially with timestamps.
- **`TasksTab.tsx`**: Displays the list of tasks generated from the summary.

### State Management
- **Server State**: The recording's data (metadata, transcription, summary, tasks) is fetched using `useQuery` from React Query. The query can be set up to poll the backend until the AI processing status is "complete".
- **Player State**: The state of the audio player (e.g., `isPlaying`, `positionMillis`, `durationMillis`) is managed locally within the `AudioPlayer.tsx` component using `useState` and `useRef`.

### Integrations
- **Supabase**: The source for all data related to the recording. This includes the audio file URL (for the player), title, and the text content for the summary and transcription.
- **Backend AI Service**: This view indirectly depends on the AI service. The data it fetches from Supabase is populated by that backend service. A real-time subscription (via Supabase Realtime) could be used to listen for changes to the recording's status, providing a better UX than polling.
