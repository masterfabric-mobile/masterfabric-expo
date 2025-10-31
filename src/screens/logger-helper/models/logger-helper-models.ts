import type { LogLevel } from 'masterfabric-expo-core';

// Re-export log level type for logger helper
export type LoggerLevel = LogLevel;

// Input model for creating test log entries
export interface LoggerTestInput {
  message: string;
  level: LoggerLevel;
  component?: string;
  includeStackTrace: boolean;
  showTimestamp: boolean;
}

// Result model for logger test execution
export interface LoggerTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  description: string;
}


