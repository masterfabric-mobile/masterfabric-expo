import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { InAppMessageModal } from './in-app-message-modal';
import { useInAppMessageViewModel } from '../hooks/use-in-app-message-view-model';

interface InAppMessageProviderProps {
  children: React.ReactNode;
}

export function InAppMessageProvider({ children }: InAppMessageProviderProps) {
  const {
    currentMessage,
    isVisible,
    isLoading,
    handleDismiss,
    handleAction,
    handleAction2,
  } = useInAppMessageViewModel();

  const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);

  // Handle app state changes (foreground/background)
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        // The view model will automatically reload messages
        console.log('[InAppMessageProvider] App came to foreground');
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      {children}
      {currentMessage && (
        <InAppMessageModal
          message={currentMessage}
          visible={isVisible}
          onDismiss={handleDismiss}
          onAction={handleAction}
          onAction2={handleAction2}
        />
      )}
    </>
  );
}

