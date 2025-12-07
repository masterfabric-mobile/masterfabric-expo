import { t } from '@/src/shared/i18n';
import { toastHelper } from 'masterfabric-expo-core';
import { useCallback } from 'react';
import { ToastInput, ToastResult, ToastType } from '../models/toast-helper.models';
import { useToastHelperStore } from '../store/toast-helper-store';

/**
 * useToastHelperViewModel Hook
 * 
 * A view model hook that manages the state and business logic for the Toast Helper screen.
 * This hook coordinates between the UI components and the toast service, providing:
 * - Input state management
 * - Example execution logic
 * - Result tracking
 * - Custom toast creation
 * 
 * Features:
 * - Predefined toast examples for different types
 * - Real-time toast demonstration
 * - Input validation and error handling
 * - Loading state management
 * - Result collection and display
 */
export function useToastHelperViewModel() {
  // Get state and setters from the store
  const { 
    input, 
    results, 
    isLoading, 
    setInput, 
    setResults, 
    setIsLoading 
  } = useToastHelperStore();

  // Get toast service methods
  // Note: Using core package's toastHelper instead of local useToast hook

  /**
   * Run all predefined toast examples
   * 
   * Executes a series of toast demonstrations showing different types and configurations.
   * Each example is displayed with a delay to allow users to see the differences.
   * Results are collected and stored for display in the UI.
   */
  const runAllExamples = useCallback(() => {
    setIsLoading(true);
    
    const results: ToastResult[] = [];
    const { message, duration, position, type, animation } = input;

    try {
      // Define different toast type examples with their configurations
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

      // Process each example and add to results
      examples.forEach((example, index) => {
        results.push({
          id: example.id,
          operationName: example.operationName,
          input: example.input,
          output: example.output,
          description: example.description,
        });

        // Show actual toast with staggered timing for better UX
        setTimeout(() => {
          toastHelper.show({
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

    // Update results and loading state
    setResults(results);
    setIsLoading(false);
  }, [input, setResults, setIsLoading]);

  /**
   * Update toast input configuration
   * 
   * Merges the provided updates with the current input state.
   * This allows partial updates to specific input fields.
   * 
   * @param updates - Partial input updates to apply
   */
  const updateInput = useCallback((updates: Partial<ToastInput>) => {
    setInput({ ...input, ...updates });
  }, [input, setInput]);

  /**
   * Show a custom toast with current input configuration
   * 
   * Validates the input message and displays a toast with the current
   * configuration settings. Shows a warning if no message is provided.
   */
  const showCustomToast = useCallback(() => {
    // Validate that message is not empty
    if (!input.message.trim()) {
      toastHelper.showWarning(t('helpers.toastHelper.controls.messageRequired'), {
        position: 'top',
        duration: 3000,
      });
      return;
    }

    // Show toast with current input configuration
    toastHelper.show({
      message: input.message,
      type: input.type,
      position: input.position,
      duration: input.duration,
      animation: input.animation,
      customConfig: input.customConfig,
    });
  }, [input]);

  return {
    input,
    results,
    isLoading,
    runAllExamples,
    updateInput,
    showCustomToast,
  };
}
