import { useLogger } from '@/src/shared/hooks/use-logger';
import { loggerService } from '@/src/shared/services/logger-service';
import { useCallback } from 'react';
import { LoggerLevel, LoggerTestInput } from '../models/logger-helper-models';
import { useLoggerHelperStore } from '../store/logger-helper-store';

// View model hook for logger helper screen - manages state and test execution
export function useLoggerHelperViewModel() {
  const { input, isLoading, setInput, setIsLoading } = useLoggerHelperStore();
  const logger = useLogger(input.component);

  // Update logger service timestamp setting before running tests
  const updateLoggerServiceTimestamp = useCallback(() => {
    loggerService.setShowTimestamp(input.showTimestamp);
  }, [input.showTimestamp]);

  // Run tests for all log levels with current input values
  const runAllTests = useCallback(() => {
    setIsLoading(true);
    try {
      updateLoggerServiceTimestamp();
      const { message, includeStackTrace, component } = input;
      const levels: LoggerLevel[] = ['info', 'debug', 'warning', 'error', 'verbose'];

      levels.forEach((lvl) => {
        logger[lvl](message, { includeStackTrace, requestedBy: 'LoggerHelperScreen' });
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, setIsLoading, logger, updateLoggerServiceTimestamp]);

  // Run test for single selected log level
  const runSingleTest = useCallback(() => {
    setIsLoading(true);
    try {
      updateLoggerServiceTimestamp();
      const { message, includeStackTrace, level } = input;
      logger[level](message, { includeStackTrace, requestedBy: 'LoggerHelperScreen' });
    } finally {
      setIsLoading(false);
    }
  }, [input, setIsLoading, logger, updateLoggerServiceTimestamp]);

  // Update input state with partial changes
  const updateInput = useCallback((partial: Partial<LoggerTestInput>) => {
    setInput({ ...input, ...partial });
  }, [input, setInput]);

  return { input, isLoading, runAllTests, runSingleTest, updateInput };
}
