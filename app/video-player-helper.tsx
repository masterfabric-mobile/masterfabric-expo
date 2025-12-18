import { VideoPlayerHelperView } from 'masterfabric-expo-core';
import { ThemeProvider } from '../src/shared/contexts/theme-context';

export default function VideoPlayerHelperPage() {
  return (
    <ThemeProvider>
      <VideoPlayerHelperView />
    </ThemeProvider>
  );
}

