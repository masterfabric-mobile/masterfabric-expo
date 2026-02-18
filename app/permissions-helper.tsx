import { PermissionsHelperScreen } from '@/src/screens/permissions-helper';
import { ThemeProvider } from '../src/shared/contexts/theme-context';

export default function PermissionsHelperPage() {
  return (
    <ThemeProvider>
      <PermissionsHelperScreen />
    </ThemeProvider>
  );
}
