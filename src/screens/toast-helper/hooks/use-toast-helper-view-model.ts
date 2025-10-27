import { t } from '@/src/shared/i18n';
import { useCallback } from 'react';
import { useToast } from '../../../shared/hooks/use-toast';
import { ToastInput, ToastResult, ToastType } from '../models/toast-helper.models';
import { useToastHelperStore } from '../store/toast-helper-store';

export function useToastHelperViewModel() {
  const { 
    input, 
    results, 
    isLoading, 
    setInput, 
    setResults, 
    setIsLoading 
  } = useToastHelperStore();

  const { show } = useToast();

  const runAllExamples = useCallback(() => {
    setIsLoading(true);
    
    const results: ToastResult[] = [];
    const { message, duration, position, type, animation } = input;

    try {
      // Different toast type examples
      const examples = [
        {
          id: 'success-example',
          operationName: 'showSuccess',
          input: `message: "${message}", type: success`,
          output: 'Toast displayed with success styling',
          description: t('helpers.toastHelper.examples.success'),
          type: 'success' as ToastType,
        },
        {
          id: 'error-example',
          operationName: 'showError',
          input: `message: "${message}", type: error`,
          output: 'Toast displayed with error styling',
          description: t('helpers.toastHelper.examples.error'),
          type: 'error' as ToastType,
        },
        {
          id: 'warning-example',
          operationName: 'showWarning',
          input: `message: "${message}", type: warning`,
          output: 'Toast displayed with warning styling',
          description: t('helpers.toastHelper.examples.warning'),
          type: 'warning' as ToastType,
        },
        {
          id: 'info-example',
          operationName: 'showInfo',
          input: `message: "${message}", type: info`,
          output: 'Toast displayed with info styling',
          description: t('helpers.toastHelper.examples.info'),
          type: 'info' as ToastType,
        },
        {
          id: 'custom-example',
          operationName: 'showCustom',
          input: `message: "${message}", type: custom, customConfig: { icon: "star.fill", backgroundColor: "#FF6B6B" }`,
          output: 'Toast displayed with custom styling',
          description: 'Custom toast message example',
          type: 'custom' as ToastType,
        },
      ];

      examples.forEach((example, index) => {
        results.push({
          id: example.id,
          operationName: example.operationName,
          input: example.input,
          output: example.output,
          description: example.description,
        });

        // Show actual toast with delay
        setTimeout(() => {
          show({
            message: `${example.type}: ${message}`,
            type: example.type,
            position: position,
            duration: duration,
            animation: animation,
          });
        }, index * 1000);
      });

    } catch (error) {
      console.error('Error running toast helper examples:', error);
    }

    setResults(results);
    setIsLoading(false);
  }, [input, setResults, setIsLoading, show]);

  const updateInput = useCallback((updates: Partial<ToastInput>) => {
    setInput({ ...input, ...updates });
  }, [input, setInput]);

  const showCustomToast = useCallback(() => {
    if (!input.message.trim()) {
      show({
        message: t('helpers.toastHelper.controls.messageRequired'),
        type: 'warning',
        position: 'top',
        duration: 3000,
      });
      return;
    }

    show({
      message: input.message,
      type: input.type,
      position: input.position,
      duration: input.duration,
      animation: input.animation,
      customConfig: input.customConfig,
    });
  }, [input, show]);

  return {
    input,
    results,
    isLoading,
    runAllExamples,
    updateInput,
    showCustomToast,
  };
}
