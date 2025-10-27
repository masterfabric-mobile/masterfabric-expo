import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import { useCallback, useState } from 'react';
import { SNACKBAR_HELPER_COLORS } from '../constants/snackbar-colors';
import {
    SnackbarOptions,
    SnackbarTestInput,
    SnackbarTestResult,
} from '../models/snackbar-helper-models';

// Default test input values (from Issue #11)
const DEFAULT_TEST_INPUT: SnackbarTestInput = {
  message: '',
  duration: 5000,
  actionLabel: '',
  type: 'success',
  position: 'bottom',
  persistent: false,
  customColor: SNACKBAR_HELPER_COLORS.customDefault,
  customIcon: '✅',
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
    const { message, duration, actionLabel, type, position, persistent, customColor, customIcon } = testInput;

    // Use placeholder if message is empty
    const finalMessage = message.trim() || t('helpers.snackbarHelper.messagePlaceholder');

    const options: any = {
      type: type === 'custom' ? 'info' : type,
      duration: persistent ? 0 : duration,
      position,
      persistent,
    };

    // Add custom color and icon if custom type selected
    if (type === 'custom' && customColor) {
      options.customColor = customColor;
    }
    if (type === 'custom' && customIcon) {
      options.customIcon = customIcon;
    }

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

    showSnackbar(finalMessage, options);
  }, [testInput, showSnackbar]);

  // Run All Tests (from Issue #11)
  const runAllTests = useCallback(() => {
    setIsLoading(true);
    setTestResults([]);

    try {
      const results: SnackbarTestResult[] = [];
      const { position } = testInput;

      // Test 1: Success Snackbar
      results.push({
        id: 'success-snackbar',
        functionName: `✅ ${t('helpers.snackbarHelper.testResults.successSnackbar.functionName')}`,
        input: t('helpers.snackbarHelper.testResults.successSnackbar.input'),
        output: t('helpers.snackbarHelper.testResults.successSnackbar.output'),
        description: t('helpers.snackbarHelper.testResults.successSnackbar.description'),
      });
      showSnackbar(t('helpers.snackbarHelper.testResults.successSnackbar.input').replace(/"/g, ''), {
        type: 'success',
        duration: 5000,
        position,
        action: {
          label: t('helpers.snackbarHelper.actionUndo'),
          onPress: () => {},
        },
      });

      // Test 2: Error Snackbar
      results.push({
        id: 'error-snackbar',
        functionName: `❌ ${t('helpers.snackbarHelper.testResults.errorSnackbar.functionName')}`,
        input: t('helpers.snackbarHelper.testResults.errorSnackbar.input'),
        output: t('helpers.snackbarHelper.testResults.errorSnackbar.output'),
        description: t('helpers.snackbarHelper.testResults.errorSnackbar.description'),
      });
      setTimeout(() => {
        showSnackbar(t('helpers.snackbarHelper.testResults.errorSnackbar.input').replace(/"/g, ''), {
          type: 'error',
          duration: 5000,
          position,
          action: {
            label: t('helpers.snackbarHelper.actionRetry'),
            onPress: () => {},
          },
        });
      }, 300);

      // Test 3: Warning Snackbar
      results.push({
        id: 'warning-snackbar',
        functionName: `⚠️ ${t('helpers.snackbarHelper.testResults.warningSnackbar.functionName')}`,
        input: t('helpers.snackbarHelper.testResults.warningSnackbar.input'),
        output: t('helpers.snackbarHelper.testResults.warningSnackbar.output'),
        description: t('helpers.snackbarHelper.testResults.warningSnackbar.description'),
      });
      setTimeout(() => {
        showSnackbar(t('helpers.snackbarHelper.testResults.warningSnackbar.input').replace(/"/g, ''), {
          type: 'warning',
          duration: 5000,
          position,
          action: {
            label: t('helpers.snackbarHelper.actionSave'),
            onPress: () => {},
          },
        });
      }, 600);

      // Test 4: Info Snackbar
      results.push({
        id: 'info-snackbar',
        functionName: `ℹ️ ${t('helpers.snackbarHelper.testResults.infoSnackbar.functionName')}`,
        input: t('helpers.snackbarHelper.testResults.infoSnackbar.input'),
        output: t('helpers.snackbarHelper.testResults.infoSnackbar.output'),
        description: t('helpers.snackbarHelper.testResults.infoSnackbar.description'),
      });
      setTimeout(() => {
        showSnackbar(t('helpers.snackbarHelper.testResults.infoSnackbar.input').replace(/"/g, ''), {
          type: 'info',
          duration: 5000,
          position,
          action: {
            label: t('helpers.snackbarHelper.actionLearnMore'),
            onPress: () => {},
          },
        });
      }, 900);

      // Test 5: Custom Snackbar
      results.push({
        id: 'custom-snackbar',
        functionName: `🎨 ${t('helpers.snackbarHelper.testResults.customSnackbar.functionName')}`,
        input: t('helpers.snackbarHelper.testResults.customSnackbar.input'),
        output: t('helpers.snackbarHelper.testResults.customSnackbar.output'),
        description: t('helpers.snackbarHelper.testResults.customSnackbar.description'),
      });
      setTimeout(() => {
        showSnackbar(t('helpers.snackbarHelper.testResults.customSnackbar.input').replace(/"/g, ''), {
          type: 'info',
          duration: 5000,
          position,
          action: {
            label: 'ACTION',
            onPress: () => {},
          },
        });
      }, 1200);

      // Test 6: Persistent Snackbar
      results.push({
        id: 'persistent-snackbar',
        functionName: `📌 ${t('helpers.snackbarHelper.testResults.persistentSnackbar.functionName')}`,
        input: t('helpers.snackbarHelper.testResults.persistentSnackbar.input'),
        output: t('helpers.snackbarHelper.testResults.persistentSnackbar.output'),
        description: t('helpers.snackbarHelper.testResults.persistentSnackbar.description'),
      });
      setTimeout(() => {
        showSnackbar(t('helpers.snackbarHelper.testResults.persistentSnackbar.input').replace(/"/g, ''), {
          type: 'warning',
          duration: 0,
          position,
          persistent: true,
        });
      }, 1500);

      setTestResults(results);
    } catch (error) {
      console.error('Error running snackbar tests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar, testInput]);

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