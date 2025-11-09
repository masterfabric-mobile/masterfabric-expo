import type { LogEntryLike, LogLevel, LoggerServiceInterface } from 'masterfabric-expo-core';
import { loggerHelper, setLoggerService } from 'masterfabric-expo-core';

// Metadata for log entries including component name, stack trace option, and custom data
export interface LogMetadata {
  component?: string;
  includeStackTrace?: boolean;
  data?: Record<string, unknown>;
}

// Log entry structure stored in the service
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  component?: string;
  stackTrace?: string;
  metadata?: Record<string, unknown>;
  showTimestamp: boolean;
}

// Singleton logger service for managing and storing log entries
class LoggerService implements LoggerServiceInterface {
  private static instance: LoggerService;
  private logs: LogEntry[] = [];
  private listeners: Set<(logs: LogEntry[]) => void> = new Set();
  private minLevel: LogLevel = 'debug';
  private showTimestamp: boolean = true;

  // Get singleton instance
  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  // Main log method - creates entry, stores it (max 1000), outputs to console, and notifies listeners
  log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldInclude(level, this.minLevel)) return;

    // Handle metadata - support both direct Record and LogMetadata format
    const logMetadata = metadata as Record<string, unknown> | undefined;
    const component = logMetadata?.component as string | undefined;
    const includeStackTrace = logMetadata?.includeStackTrace as boolean | undefined;
    const data = (logMetadata?.data as Record<string, unknown> | undefined) || 
                 (logMetadata && typeof logMetadata === 'object' && !('component' in logMetadata) && !('includeStackTrace' in logMetadata) ? logMetadata : undefined);

    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      message,
      component,
      stackTrace: includeStackTrace ? this.getStackTrace() : undefined,
      metadata: data,
      showTimestamp: this.showTimestamp,
    };

    // Keep only last 1000 entries
    this.logs = [...this.logs, entry].slice(-1000);
    this.outputToConsole(entry);
    this.notifyListeners();
  }

  // Convenience methods for each log level
  info(message: string, metadata?: Record<string, unknown>): void { this.log('info', message, metadata); }
  debug(message: string, metadata?: Record<string, unknown>): void { this.log('debug', message, metadata); }
  warning(message: string, metadata?: Record<string, unknown>): void { this.log('warning', message, metadata); }
  error(message: string, metadata?: Record<string, unknown>): void { this.log('error', message, metadata); }
  verbose(message: string, metadata?: Record<string, unknown>): void { this.log('verbose', message, metadata); }

  // Get all stored logs as a new array - interface compatible version returns LogEntryLike[]
  getLogs(): LogEntryLike[];
  // Internal version returns full LogEntry[] with all properties
  getLogs(includeFullDetails: true): LogEntry[];
  // Implementation
  getLogs(includeFullDetails?: boolean): LogEntry[] | LogEntryLike[] {
    if (includeFullDetails) {
      return [...this.logs];
    }
    return this.logs.map(entry => ({
      id: entry.id,
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      component: entry.component,
    }));
  }

  // Clear all logs and notify listeners
  clear(): void {
    this.logs = [];
    this.notifyListeners();
  }

  // Subscribe to log updates - returns unsubscribe function
  // Internal listeners receive LogEntry[], but interface requires LogEntryLike[]
  subscribe(listener: (logs: LogEntryLike[]) => void): () => void {
    // Wrap listener to convert LogEntry[] to LogEntryLike[]
    const wrappedListener = (logs: LogEntry[]): void => {
      const convertedLogs: LogEntryLike[] = logs.map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        level: entry.level,
        message: entry.message,
        component: entry.component,
      }));
      listener(convertedLogs);
    };
    this.listeners.add(wrappedListener);
    return () => this.listeners.delete(wrappedListener);
  }
  
  // Internal subscribe method that provides full LogEntry details
  // This is used internally but not exposed through the interface
  subscribeFull(listener: (logs: LogEntry[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Toggle timestamp visibility in logs
  setShowTimestamp(show: boolean): void {
    this.showTimestamp = show;
  }

  getShowTimestamp(): boolean {
    return this.showTimestamp;
  }

  // Notify all subscribers about log changes
  private notifyListeners(): void {
    const logsCopy = [...this.logs];
    this.listeners.forEach(l => {
      // All internal listeners expect LogEntry[], but interface listeners need conversion
      // Since we wrapped interface listeners, we can pass LogEntry[] directly
      l(logsCopy);
    });
  }

  // Output log entry to console with ANSI colors and symbols
  private outputToConsole(entry: LogEntry): void {
    const time = entry.showTimestamp ? `${entry.timestamp.toLocaleTimeString()} ` : '';
    const component = entry.component ? `[${entry.component}] ` : '';
    const SYMBOL: Record<LogLevel, string> = {
      info: 'ℹ️',
      debug: '🐛',
      warning: '⚠️',
      error: '❌',
      verbose: '🔍',
    };
    const ANSI = {
      reset: '\x1b[0m',
      blue: '\x1b[34m',
      gray: '\x1b[90m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
    } as const;
    const colorByLevel: Record<LogLevel, string> = {
      info: ANSI.blue,
      debug: ANSI.gray,
      warning: ANSI.yellow,
      error: ANSI.red,
      verbose: ANSI.gray,
    };
    const color = colorByLevel[entry.level] || '';
    const symbol = SYMBOL[entry.level] || '';
    // eslint-disable-next-line no-console
    console.log(`${color}${symbol}  ${entry.level.toUpperCase()} ${time}${component}${ANSI.reset} ${entry.message}`, entry.metadata || '');
    if (entry.stackTrace) {
      // eslint-disable-next-line no-console
      console.log(entry.stackTrace);
    }
  }

  // Check if log level should be included based on minimum level
  private shouldInclude(level: LogLevel, min: LogLevel): boolean {
    const order: LogLevel[] = ['verbose', 'debug', 'info', 'warning', 'error'];
    return order.indexOf(level) >= order.indexOf(min);
  }

  // Generate unique ID for log entry
  private generateId(): string { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
  // Get stack trace, skipping first 3 lines (Error constructor and helper methods)
  private getStackTrace(): string { const s = new Error().stack; return s ? s.split('\n').slice(3).join('\n') : ''; }
}

// Initialize singleton instance and register with core logger helper
const loggerServiceInstance = LoggerService.getInstance();

export const loggerService = loggerServiceInstance;
export { loggerHelper };
export type { LogLevel };
