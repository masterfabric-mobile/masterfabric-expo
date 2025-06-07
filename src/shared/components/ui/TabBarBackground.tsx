import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();

  return (
    <BlurView
      tint={colorScheme}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}
