import { ToastHelperProvider, ToastHelperScreen } from '@/src/screens/toast-helper';

export default function ToastHelperPage() {
  return (
    <ToastHelperProvider>
      <ToastHelperScreen />
    </ToastHelperProvider>
  );
}
