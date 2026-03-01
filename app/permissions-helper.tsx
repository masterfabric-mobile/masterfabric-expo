import { PermissionsHelperScreen } from '@/src/screens/permissions-helper';
import { ThemeProvider } from 'masterfabric-expo-core';

export default function PermissionsHelperPage() {
  return (
    <ThemeProvider>
      <PermissionsHelperScreen />
    </ThemeProvider>
  );
}
