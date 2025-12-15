import { MasterViewConfig } from '../core/MasterViewCore';
import { defaultMasterViewConfig, developmentMasterViewConfig, productionMasterViewConfig } from '../constants/MasterViewConfig';
import { getEnvironment, isDevelopment } from './auto-detect';
import { detectIntegrations } from './integration-detector';

/**
 * Build MasterView config with auto-detection and sensible defaults
 */
export function buildMasterViewConfig(userConfig?: Partial<MasterViewConfig>): MasterViewConfig {
  const environment = getEnvironment();
  
  // Start with environment-specific defaults
  const baseConfig = isDevelopment() 
    ? developmentMasterViewConfig 
    : productionMasterViewConfig;

  // Auto-detect integrations from env vars
  const detectedIntegrations = detectIntegrations();

  // Merge: base config -> detected integrations -> user config
  const config: MasterViewConfig = {
    ...baseConfig,
    ...detectedIntegrations,
    ...userConfig,
    // Ensure debug mode and logging are set based on environment
    enableDebugMode: userConfig?.enableDebugMode ?? isDevelopment(),
    enableLogging: userConfig?.enableLogging ?? isDevelopment(),
    logLevel: userConfig?.logLevel ?? (isDevelopment() ? 'debug' : 'error'),
  };

  return config;
}

