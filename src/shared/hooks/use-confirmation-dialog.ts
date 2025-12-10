import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { ConfirmationDialogProps } from '../components/ConfirmationDialog';

export interface UseConfirmationDialogOptions {
  /**
   * Title of the dialog
   */
  title: string;
  
  /**
   * Message/content to display
   */
  message: string;
  
  /**
   * Label for the confirm button
   * @default 'Confirm'
   */
  confirmLabel?: string;
  
  /**
   * Label for the cancel button
   * @default 'Cancel'
   */
  cancelLabel?: string;
  
  /**
   * Whether the confirm action is destructive
   * @default false
   */
  destructive?: boolean;
  
  /**
   * Callback when confirmed
   */
  onConfirm: () => void;
}

export interface UseConfirmationDialogReturn {
  /**
   * Show the confirmation dialog
   */
  showDialog: () => void;
  
  /**
   * Hide the confirmation dialog
   */
  hideDialog: () => void;
  
  /**
   * Dialog props to pass to ConfirmationDialog component
   */
  dialogProps: Omit<ConfirmationDialogProps, 'visible'> & { visible: boolean };
  
  /**
   * Whether the dialog is currently visible
   */
  isVisible: boolean;
}

/**
 * Hook for managing confirmation dialog state
 * 
 * Provides a convenient way to show confirmation dialogs with consistent behavior
 * across web and native platforms.
 * 
 * @example
 * ```tsx
 * const { showDialog, dialogProps } = useConfirmationDialog({
 *   title: 'Delete File',
 *   message: 'Are you sure you want to delete this file?',
 *   confirmLabel: 'Delete',
 *   destructive: true,
 *   onConfirm: () => {
 *     // Handle delete
 *   },
 * });
 * 
 * // In your component:
 * <Button onPress={showDialog}>Delete</Button>
 * <ConfirmationDialog {...dialogProps} />
 * ```
 */
export function useConfirmationDialog(
  options: UseConfirmationDialogOptions
): UseConfirmationDialogReturn {
  const [isVisible, setIsVisible] = useState(false);

  const showDialog = useCallback(() => {
    // On web, use window.confirm for better compatibility
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `${options.title}\n\n${options.message}`
      );
      if (confirmed) {
        options.onConfirm();
      }
      return;
    }
    
    setIsVisible(true);
  }, [options]);

  const hideDialog = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleConfirm = useCallback(() => {
    options.onConfirm();
    hideDialog();
  }, [options, hideDialog]);

  const dialogProps: Omit<ConfirmationDialogProps, 'visible'> & { visible: boolean } = {
    visible: isVisible,
    title: options.title,
    message: options.message,
    confirmLabel: options.confirmLabel || 'Confirm',
    cancelLabel: options.cancelLabel || 'Cancel',
    destructive: options.destructive || false,
    onConfirm: handleConfirm,
    onCancel: hideDialog,
  };

  return {
    showDialog,
    hideDialog,
    dialogProps,
    isVisible,
  };
}

