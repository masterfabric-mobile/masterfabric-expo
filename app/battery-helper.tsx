import { BatteryHelperScreen } from '../src/screens/battery-helper';
import { ThemeProvider } from '../src/shared/contexts/theme-context';

export default function BatteryHelperPage() {
  return (
    <ThemeProvider>
      <BatteryHelperScreen />
    </ThemeProvider>
  );
}

