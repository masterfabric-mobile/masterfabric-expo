import Constants from 'expo-constants';
import { initMasterView, MasterViewInitOptions } from './core/MasterViewCore';
import { getAppName, getAppVersion, getEnvironment } from './utils/auto-detect';
import { buildMasterViewConfig } from './utils/config-builder';

let isInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

/**
 * Auto-initialize MasterView with sensible defaults and auto-detection
 * 
 * This function automatically:
 * - Detects app name and version from Expo Constants
 * - Detects environment (development/production)
 * - Detects available integrations from environment variables
 * - Uses sensible defaults for all configuration
 * - Handles errors gracefully (warns but doesn't throw)
 * 
 * @param options Optional partial initialization options to override defaults
 * @returns Promise that resolves to true if initialization succeeded, false otherwise
 * 
 * @example
 * ```typescript
 * // Zero config - works immediately
 * await autoInitMasterView();
 * 
 * // With custom app name
 * await autoInitMasterView({ appName: 'My App' });
 * 
 * // With custom config
 * await autoInitMasterView({
 *   config: {
 *     enableSentry: true,
 *     sentryConfig: { dsn: 'your-dsn' }
 *   }
 * });
 * ```
 */
export async function autoInitMasterView(
  options?: Partial<MasterViewInitOptions>
): Promise<boolean> {
  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise;
  }

  // Return immediately if already initialized
  if (isInitialized) {
    return true;
  }

  // Create initialization promise
  initializationPromise = (async () => {
    try {
      // Auto-detect app information
      const appName = options?.appName || getAppName();
      const appVersion = options?.appVersion || getAppVersion();
      const environment = options?.environment || getEnvironment();

      // Build config with auto-detection
      const autoDetectedConfig = buildMasterViewConfig(options?.config);

      // Merge user options with auto-detected values
      const initOptions: MasterViewInitOptions = {
        ...options,
        appName: options?.appName || appName,
        appVersion: options?.appVersion || appVersion,
        environment: options?.environment || environment,
        // Override config with merged version
        config: {
          ...autoDetectedConfig,
          ...options?.config,
        },
      };

      // Initialize MasterView
      await initMasterView(initOptions);
      
      isInitialized = true;
      return true;
    } catch (error) {
      // Graceful degradation - log warning but don't throw
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(
        '[MasterView] Auto-initialization failed, continuing without initialization:',
        errorMessage
      );
      
      // Log helpful message
      if (__DEV__) {
        console.info(
          '[MasterView] To debug, call initMasterView() manually with your configuration.'
        );
      }
      
      return false;
    } finally {
      // Clear promise so it can be retried if needed
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

/**
 * Reset initialization state (useful for testing)
 */
export function resetAutoInit(): void {
  isInitialized = false;
  initializationPromise = null;
}

