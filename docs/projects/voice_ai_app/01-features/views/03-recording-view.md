# 2. Recording View

This is the active screen for when a voice note is being recorded. The UI should be minimal to reduce distraction, while providing clear feedback and control to the user.

### Mockup

```
+-----------------------------------------------------+
|                     Recording...                    |
|                      [X] Close                      |
+-----------------------------------------------------+
|                                                     |
|                                                     |
|                                                     |
|                  00:01:23.45                        |
|                                                     |
|            (   Sound Wave Visualization   )         |
|                                                     |
|                                                     |
|                                                     |
|           [  ||  ]              [ Stop ]            |
|            Pause                Finish              |
|                                                     |
+-----------------------------------------------------+
|                                                     |
+-----------------------------------------------------+
```

### Core Logic & Functionality

- The screen displays a live timer of the recording duration.
- A sound wave visualization provides real-time feedback that the microphone is capturing audio.
- Users can `Pause` and `Resume` the recording.
- Pressing `Finish` stops the recording, saves the file, and navigates the user to the **Summary View** for the new recording, likely showing a loading state while the AI processing happens.
- The `Close` button allows the user to discard the recording (after a confirmation prompt).

### Architecture & Components

This view will be implemented as a modal screen, likely located at `src/features/recording/RecordingScreen.tsx`.

#### Core Packages & Helpers
- **`@masterfabric-expo/core`**:
  - **Components**: `Screen`, `Text`, `Button`, `Icon`.
  - **Helpers**: `TimeHelper` to format the timer display.
- **`expo-av`**: The core package for handling audio recording, including starting, stopping, pausing, and getting status updates.
- **`react-native-canvas`** or a similar library could be used for the sound wave visualization.

#### View-Specific Components
- **`LiveTimer.tsx`**: A component that takes a start time and updates every 100ms to show the elapsed time.
- **`WaveformVisualizer.tsx`**: A component that uses `expo-av`'s audio metering data to draw a live waveform.
- **`RecordingControls.tsx`**: A component containing the `Pause`/`Resume` and `Finish` buttons, which will manage the recording state.

### State Management
- **Recording State**: Managed locally using `useState`. An object or enum could represent the state: `'IDLE'`, `'RECORDING'`, `'PAUSED'`.
- **Recording Instance**: The `Audio.Recording` object from `expo-av` will be stored in a `useRef` to persist it across re-renders without triggering them.
- **Duration**: A local state variable (`duration`) updated by a `setInterval`.

### Integrations
- **`expo-av`**: The primary integration for this screen, used for all microphone and recording functionalities.
- **Supabase Storage**: After the recording is finished, the local file URI (from `expo-av`) will be used to upload the audio file to Supabase Storage.
- **Backend AI Service**: Once the file is uploaded, a request is made to our backend API, passing the file's storage path to begin the transcription and summarization process.
