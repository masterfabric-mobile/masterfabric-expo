import { MasterViewInitOptions, MasterViewConfig } from './core/MasterViewCore';
import { initMasterView } from './core/MasterViewCore';
import { getAppName, getAppVersion, getEnvironment } from './utils/auto-detect';
import { buildMasterViewConfig } from './utils/config-builder';

/**
 * Simplified setup function for MasterView with minimal required configuration
 * 
 * This function accepts only essential options and auto-detects everything else.
 * Perfect for quick setup with minimal boilerplate.
 * 
 * @param options Minimal initialization options (all optional)
 * @returns Promise that resolves when initialization is complete
 * 
 * @example
 * ```typescript
 * // Zero config - auto-detects everything
 * await setupMasterView();
 * 
 * // With just app name
 * await setupMasterView({ appName: 'My App' });
 * 
 * // With custom config
 * await setupMasterView({
 *   appName: 'My App',
 *   config: {
 *     enableSentry: true,
 *     sentryConfig: { dsn: 'your-dsn' }
 *   }
 * });
 * ```
 */
export async function setupMasterView(
  options?: {
    appName?: string;
    appVersion?: string;
    environment?: 'development' | 'staging' | 'production';
    config?: Partial<MasterViewConfig>;
  }
): Promise<void> {
  // Auto-detect app information if not provided
  const appName = options?.appName || getAppName();
  const appVersion = options?.appVersion || getAppVersion();
  const environment = options?.environment || getEnvironment();

  // Build config with auto-detection
  const config = buildMasterViewConfig(options?.config);

  // Initialize with merged options
  const initOptions: MasterViewInitOptions = {
    appName,
    appVersion,
    environment,
    config,
  };

  await initMasterView(initOptions);
}

