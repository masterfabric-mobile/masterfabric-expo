import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import { useCallback, useState } from 'react';
import {
  SnackbarOptions,
  SnackbarTestInput,
  SnackbarTestResult,
} from '../models/snackbar-helper-models';

// Default test input values (from Issue #11)
const DEFAULT_TEST_INPUT: SnackbarTestInput = {
  message: 'Item deleted',
  duration: 5000,
  actionLabel: 'UNDO',
  actionType: 'primary',
  persistent: false,
};

export const useSnackbarHelperViewModel = () => {
  const { showSnackbar: show } = useSnackbar();
  const [testInput, setTestInput] = useState<SnackbarTestInput>(DEFAULT_TEST_INPUT);
  const [testResults, setTestResults] = useState<SnackbarTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showSnackbar = useCallback(
    (message: string, options?: SnackbarOptions) => {
      return show({
        message,
        ...options,
      });
    },
    [show]
  );

  // Test Single Snackbar (from Issue #11)
  const testSnackbar = useCallback(() => {
    const { message, duration, actionLabel, persistent } = testInput;

    // Auto-detect type based on message (Issue #11)
    let type: 'success' | 'error' | 'warning' | 'info' = 'success';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('failed') || lowerMessage.includes('error')) {
      type = 'error';
    } else if (lowerMessage.includes('unsaved') || lowerMessage.includes('warning')) {
      type = 'warning';
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('info') || lowerMessage.includes('new')) {
      type = 'info';
    } else if (lowerMessage.includes('deleted') || lowerMessage.includes('success')) {
      type = 'success';
    }

    const options: SnackbarOptions = {
      type,
      duration: persistent ? 0 : duration,
      position: 'bottom',
      persistent,
    };

    if (actionLabel.trim()) {
      options.action = {
        label: actionLabel,
        onPress: () => {
          showSnackbar(t('helpers.snackbarHelper.actionPerformed'), {
            type: 'success',
            duration: 2000,
          });
        },
      };
    }

    showSnackbar(message, options);
  }, [testInput, showSnackbar]);

  // Run All Tests (from Issue #11)
  const runAllTests = useCallback(() => {
    setIsLoading(true);
    setTestResults([]);

    try {
      const results: SnackbarTestResult[] = [];

      // Test 1: Success Snackbar
      results.push({
        id: 'success-snackbar',
        functionName: 'showSuccessSnackbar',
        input: '"Item deleted"',
        output: 'Green snackbar with Undo',
        description: 'Success notification snackbar',
      });
      showSnackbar('Item deleted', {
        type: 'success',
        duration: 5000,
        action: {
          label: 'UNDO',
          onPress: () => {},
        },
      });

      // Test 2: Error Snackbar
      results.push({
        id: 'error-snackbar',
        functionName: 'showErrorSnackbar',
        input: '"Failed to save"',
        output: 'Red snackbar with Retry',
        description: 'Error notification snackbar',
      });
      setTimeout(() => {
        showSnackbar('Failed to save', {
          type: 'error',
          duration: 5000,
          action: {
            label: 'RETRY',
            onPress: () => {},
          },
        });
      }, 300);

      // Test 3: Warning Snackbar
      results.push({
        id: 'warning-snackbar',
        functionName: 'showWarningSnackbar',
        input: '"Unsaved changes"',
        output: 'Orange snackbar with Save',
        description: 'Warning notification snackbar',
      });
      setTimeout(() => {
        showSnackbar('Unsaved changes', {
          type: 'warning',
          duration: 5000,
          action: {
            label: 'SAVE',
            onPress: () => {},
          },
        });
      }, 600);

      // Test 4: Info Snackbar
      results.push({
        id: 'info-snackbar',
        functionName: 'showInfoSnackbar',
        input: '"New feature available"',
        output: 'Blue snackbar with Learn More',
        description: 'Info notification snackbar',
      });
      setTimeout(() => {
        showSnackbar('New feature available', {
          type: 'info',
          duration: 5000,
          action: {
            label: 'LEARN MORE',
            onPress: () => {},
          },
        });
      }, 900);

      // Test 5: Action Snackbar
      results.push({
        id: 'action-snackbar',
        functionName: 'showActionSnackbar',
        input: '"Custom action"',
        output: 'Custom snackbar with action',
        description: 'Custom action notification snackbar',
      });
      setTimeout(() => {
        showSnackbar('Custom action', {
          type: 'info',
          duration: 5000,
          action: {
            label: 'ACTION',
            onPress: () => {},
          },
        });
      }, 1200);

      // Test 6: Persistent Snackbar
      results.push({
        id: 'persistent-snackbar',
        functionName: 'showPersistentSnackbar',
        input: '"Persistent message"',
        output: 'Non-dismissing snackbar',
        description: 'Persistent notification snackbar',
      });
      setTimeout(() => {
        showSnackbar('Persistent message', {
          type: 'warning',
          duration: 0,
          persistent: true,
          action: {
            label: 'DISMISS',
            onPress: () => {},
          },
        });
      }, 1500);

      setTestResults(results);
    } catch (error) {
      console.error('Error running snackbar tests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  const updateTestInput = useCallback(
    (input: Partial<SnackbarTestInput>) => {
      setTestInput({ ...testInput, ...input });
    },
    [testInput]
  );

  return {
    testInput,
    testResults,
    isLoading,
    showSnackbar,
    testSnackbar,
    runAllTests,
    updateTestInput,
  };
};