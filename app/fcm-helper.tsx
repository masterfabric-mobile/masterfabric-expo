import React from 'react';
import { FcmHelperScreen } from '@/src/screens/fcm-helper';
import { ThemeProvider } from '@/src/shared/contexts/theme-context';

export default function FcmHelperPage() {
  return (
    <ThemeProvider>
      <FcmHelperScreen />
    </ThemeProvider>
  );
}
