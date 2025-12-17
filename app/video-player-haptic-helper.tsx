import { VideoPlayerHapticHelperView } from 'masterfabric-expo-core';
import { ThemeProvider } from '../src/shared/contexts/theme-context';

export default function VideoPlayerHapticHelperPage() {
  return (
    <ThemeProvider>
      <VideoPlayerHapticHelperView />
    </ThemeProvider>
  );
}
