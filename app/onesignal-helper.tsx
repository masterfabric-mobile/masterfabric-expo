import { OneSignalHelperScreen } from '../src/screens/onesignal-helper';
import { ThemeProvider } from '../src/shared/contexts/theme-context';

export default function OneSignalHelperPage() {
  return (
    <ThemeProvider>
      <OneSignalHelperScreen />
    </ThemeProvider>
  );
}
