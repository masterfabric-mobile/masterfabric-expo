import { LocalNotificationHelperScreen } from '../src/screens/local-notification-helper';
import { ThemeProvider } from '../src/shared/contexts/theme-context';

export default function LocalNotificationHelperPage() {
  return (
    <ThemeProvider>
      <LocalNotificationHelperScreen />
    </ThemeProvider>
  );
}
