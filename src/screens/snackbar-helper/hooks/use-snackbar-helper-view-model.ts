import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import { useCallback, useState } from 'react';
import { SNACKBAR_HELPER_COLORS } from '../constants/snackbar-colors';
import {
    SnackbarOptions,
    SnackbarScenarioInput,
    SnackbarScenarioResult,
} from '../models/snackbar-helper-models';

// Default scenario input values (from Issue #11)
const DEFAULT_SCENARIO_INPUT: SnackbarScenarioInput = {
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
  const [scenarioInput, setScenarioInput] = useState<SnackbarScenarioInput>(DEFAULT_SCENARIO_INPUT);
  const [scenarioResults, setScenarioResults] = useState<SnackbarScenarioResult[]>([]);
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

  // Show Snackbar Preview (from Issue #11)
  const showSnackbarPreview = useCallback(() => {
    const { message, duration, actionLabel, type, position, persistent, customColor, customIcon } = scenarioInput;

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
  }, [scenarioInput, showSnackbar]);

  // Run All Scenarios (from Issue #11)
  const runAllScenarios = useCallback(() => {
    setIsLoading(true);
    setScenarioResults([]);

    try {
      const results: SnackbarScenarioResult[] = [];
      const { position } = scenarioInput;

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

      setScenarioResults(results);
    } catch (error) {
      console.error('Error running snackbar scenarios:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar, scenarioInput]);

  const updateScenarioInput = useCallback(
    (input: Partial<SnackbarScenarioInput>) => {
      setScenarioInput({ ...scenarioInput, ...input });
    },
    [scenarioInput]
  );

  return {
    scenarioInput,
    scenarioResults,
    isLoading,
    showSnackbar,
    showSnackbarPreview,
    runAllScenarios,
    updateScenarioInput,
  };
};