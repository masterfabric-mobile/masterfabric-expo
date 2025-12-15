import { useEffect, useRef, useState } from 'react';
import { MasterViewInitOptions } from '../core/MasterViewCore';
import { autoInitMasterView } from '../auto-init';

/**
 * React hook that auto-initializes MasterView on component mount
 * 
 * This hook automatically initializes MasterView with sensible defaults
 * and auto-detection. It only initializes once (singleton pattern) and
 * handles async initialization properly.
 * 
 * @param options Optional partial initialization options to override defaults
 * @returns Object with initialization status
 * 
 * @example
 * ```typescript
 * // Zero config - works immediately
 * function App() {
 *   useAutoInitMasterView();
 *   return <YourApp />;
 * }
 * 
 * // With custom options
 * function App() {
 *   useAutoInitMasterView({
 *     appName: 'My App',
 *     config: { enableSentry: true }
 *   });
 *   return <YourApp />;
 * }
 * ```
 */
export function useAutoInitMasterView(
  options?: Partial<MasterViewInitOptions>
): { isInitialized: boolean } {
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (initRef.current) {
      return;
    }

    initRef.current = true;

    // Initialize asynchronously
    autoInitMasterView(options)
      .then((success) => {
        setIsInitialized(success);
      })
      .catch((error) => {
        // Should not happen as autoInitMasterView handles errors gracefully
        console.error('[MasterView] Hook initialization error:', error);
        setIsInitialized(false);
      });
  }, []); // Empty deps - only run once on mount

  return { isInitialized };
}

