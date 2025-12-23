import { VideoPlayerHelperView, HapticHelperView } from 'masterfabric-expo-core';
import { ThemeProvider } from '../src/shared/contexts/theme-context';
import { View } from 'react-native';

export default function VideoPlayerHapticHelperPage() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <VideoPlayerHelperView />
      </View>
    </ThemeProvider>
  );
}
