import { HapticHelperView } from 'masterfabric-expo-core';
import { ThemeProvider } from '../src/shared/contexts/theme-context';

export default function HapticHelperPage() {
  return (
    <ThemeProvider>
      <HapticHelperView />
    </ThemeProvider>
  );
}

