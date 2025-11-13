import type { LogLevel } from 'masterfabric-expo-core';
import { loggerHelper } from 'masterfabric-expo-core';

// Hook for logging with automatic component name inclusion
// Component name is automatically added to all log entries from this hook
export function useLogger(component?: string) {
  // Helper to create metadata with component name and optional stack trace
  const meta = (extra?: Record<string, unknown>) => ({ component, includeStackTrace: (extra as any)?.includeStackTrace as boolean | undefined, data: extra });

  // Return logger methods with component name pre-filled
  return {
    log: (level: LogLevel, message: string, extra?: Record<string, unknown>) =>
      loggerHelper.log(level, message, meta(extra)),
    info: (message: string, extra?: Record<string, unknown>) => loggerHelper.info(message, meta(extra)),
    debug: (message: string, extra?: Record<string, unknown>) => loggerHelper.debug(message, meta(extra)),
    warning: (message: string, extra?: Record<string, unknown>) => loggerHelper.warning(message, meta(extra)),
    error: (message: string, extra?: Record<string, unknown>) => loggerHelper.error(message, meta(extra)),
    verbose: (message: string, extra?: Record<string, unknown>) => loggerHelper.verbose(message, meta(extra)),
  };
}
