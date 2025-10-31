/**
 * Logger Helper (Core)
 *
 * Provides static helper methods for level-based logging through
 * a LoggerService provided by the consuming application.
 *
 * Usage:
 *   import { loggerHelper, setLoggerService } from 'masterfabric-expo-core';
 *   setLoggerService(appLoggerServiceInstance);
 *   loggerHelper.info('Hello');
 */

// ---- Types ----
export type LogLevel = 'info' | 'debug' | 'warning' | 'error' | 'verbose';

export interface LogEntryLike {
  id: string;
  timestamp: Date | string | number;
  level: LogLevel;
  message: string;
  component?: string;
}

// ---- Service Interface (provided by the application) ----
export interface LoggerServiceInterface {
  log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  debug(message: string, metadata?: Record<string, unknown>): void;
  warning(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
  verbose(message: string, metadata?: Record<string, unknown>): void;
  getLogs(): LogEntryLike[];
  clear(): void;
  subscribe(listener: (logs: LogEntryLike[]) => void): () => void;
}

// ---- Global service instance ----
let globalLoggerService: LoggerServiceInterface | null = null;

export function setLoggerService(service: LoggerServiceInterface): void {
  globalLoggerService = service;
}

export function getLoggerService(): LoggerServiceInterface | null {
  return globalLoggerService;
}

// ---- Static helper ----
class LoggerHelper {
  private static ensureService(): LoggerServiceInterface {
    if (!globalLoggerService) {
      throw new Error(
        'Logger service not initialized. Please call setLoggerService() with a valid logger service instance.'
      );
    }
    return globalLoggerService;
  }

  static log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    return this.ensureService().log(level, message, metadata);
  }

  static info(message: string, metadata?: Record<string, unknown>): void {
    return this.ensureService().info(message, metadata);
  }

  static debug(message: string, metadata?: Record<string, unknown>): void {
    return this.ensureService().debug(message, metadata);
  }

  static warning(message: string, metadata?: Record<string, unknown>): void {
    return this.ensureService().warning(message, metadata);
  }

  static error(message: string, metadata?: Record<string, unknown>): void {
    return this.ensureService().error(message, metadata);
  }

  static verbose(message: string, metadata?: Record<string, unknown>): void {
    return this.ensureService().verbose(message, metadata);
  }
}

export const loggerHelper = LoggerHelper;


