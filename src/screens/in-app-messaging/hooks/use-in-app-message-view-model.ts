import { supabaseIntegration } from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InAppMessage } from '../models/in-app-message-models';
import { inAppMessageService } from '../services/in-app-message-service';
import {
  useInAppMessageStore,
} from '../store/in-app-message-store';

const DEVICE_ID_KEY = '@in_app_message_device_id';

/**
 * Generate or retrieve a persistent device ID for anonymous users
 */
async function getOrCreateDeviceId(): Promise<string> {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      // Generate a unique device ID
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 15);
      deviceId = `device_${timestamp}_${randomStr}`;
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch (error) {
    // Fallback to session-based ID if storage fails
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${randomStr}`;
  }
}

export function useInAppMessageViewModel() {
  const {
    currentMessage,
    isVisible,
    isLoading,
    setCurrentMessage,
    showMessage,
    hideMessage,
    setLoading,
  } = useInAppMessageStore();

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const messageQueueRef = useRef<InAppMessage[]>([]);
  const isProcessingRef = useRef(false);

  /**
   * Process the next message in the queue
   */
  const processNextMessage = useCallback(() => {
    if (isProcessingRef.current || messageQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    const nextMessage = messageQueueRef.current.shift();
    
    if (nextMessage) {
      setCurrentMessage(nextMessage);
      showMessage();
    }
    
    isProcessingRef.current = false;
  }, [setCurrentMessage, showMessage]);

  /**
   * Add message to queue and process if no message is currently showing
   */
  const queueMessage = useCallback(
    (message: InAppMessage) => {
      // Check if message is already in queue or currently displayed
      const isDuplicate =
        currentMessage?.id === message.id ||
        messageQueueRef.current.some((m) => m.id === message.id);

      if (isDuplicate) {
        return;
      }

      messageQueueRef.current.push(message);
      
      // Process immediately if no message is currently visible
      if (!isVisible && !isProcessingRef.current) {
        processNextMessage();
      }
    },
    [currentMessage, isVisible, processNextMessage]
  );

  /**
   * Load active messages from Supabase
   */
  const loadActiveMessages = useCallback(async () => {
    if (!deviceId) {
      return;
    }

    setLoading(true);

    try {
      let userId: string | null = null;
      if (supabaseIntegration.isAvailable()) {
        try {
          const user = await supabaseIntegration.getCurrentUser();
          userId = user?.id || null;
        } catch (err) {
          // User not authenticated, continue with anonymous
          userId = null;
        }
      }

      const messages = await inAppMessageService.fetchActiveMessages(
        userId,
        deviceId
      );

      if (messages.length > 0) {
        // Sort by priority and add to queue
        const sortedMessages = messages.sort((a, b) => b.priority - a.priority);
        sortedMessages.forEach((msg) => queueMessage(msg));
      }
    } catch (error: any) {
      console.error('[InAppMessageViewModel] Error loading active messages:', error);
    } finally {
      setLoading(false);
    }
  }, [deviceId, setLoading, queueMessage]);

  /**
   * Handle message dismissal
   */
  const handleDismiss = useCallback(async () => {
    if (!currentMessage || !deviceId) {
      return;
    }

    try {
      let userId: string | null = null;
      if (supabaseIntegration.isAvailable()) {
        try {
          const user = await supabaseIntegration.getCurrentUser();
          userId = user?.id || null;
        } catch (err) {
          // User not authenticated
          userId = null;
        }
      }

      await inAppMessageService.markAsDismissed(
        parseInt(currentMessage.id, 10),
        userId,
        deviceId
      );
    } catch (error: any) {
      // Handle unique constraint violation (23505) or conflict (42P10) - message already dismissed
      // This is not a critical error, just a race condition
      if (error?.code === '23505' || error?.code === '42P10') {
        console.log('[InAppMessageViewModel] Message already dismissed (race condition), continuing');
      } else {
        console.error('[InAppMessageViewModel] Error marking message as dismissed:', error);
      }
    }

    hideMessage();
    setCurrentMessage(null);

    // Process next message in queue after a short delay
    setTimeout(() => {
      processNextMessage();
    }, 300);
  }, [currentMessage, deviceId, hideMessage, setCurrentMessage, processNextMessage]);

  /**
   * Handle action button press (button 1)
   */
  const handleAction = useCallback(async () => {
    if (!currentMessage) {
      return;
    }

    const { buttonAction, buttonActionType } = currentMessage;

    if (buttonActionType === 'url' && buttonAction) {
      // Open external URL
      try {
        const canOpen = await Linking.canOpenURL(buttonAction);
        if (canOpen) {
          await Linking.openURL(buttonAction);
        }
      } catch (error) {
        console.error('[InAppMessageViewModel] Error opening URL:', error);
      }
    } else if (buttonActionType === 'deep_link' && buttonAction) {
      // Handle deep link - check if it's an internal route or external URL
      try {
        // Check if it's an internal route (starts with /)
        if (buttonAction.startsWith('/')) {
          // Internal route - use router.push
          router.push(buttonAction as any);
        } else {
          // External URL - use Linking
          const canOpen = await Linking.canOpenURL(buttonAction);
          if (canOpen) {
            await Linking.openURL(buttonAction);
          }
        }
      } catch (error) {
        console.error('[InAppMessageViewModel] Error opening deep link:', error);
      }
    }

    // Dismiss message after action (unless it's dismiss type)
    if (buttonActionType !== 'dismiss') {
      await handleDismiss();
    }
  }, [currentMessage, handleDismiss]);

  /**
   * Handle second action button press
   */
  const handleAction2 = useCallback(async () => {
    if (!currentMessage) {
      return;
    }

    const { button2Action, button2ActionType } = currentMessage;

    if (button2ActionType === 'url' && button2Action) {
      // Open external URL
      try {
        const canOpen = await Linking.canOpenURL(button2Action);
        if (canOpen) {
          await Linking.openURL(button2Action);
        }
      } catch (error) {
        console.error('[InAppMessageViewModel] Error opening URL:', error);
      }
    } else if (button2ActionType === 'deep_link' && button2Action) {
      // Handle deep link - check if it's an internal route or external URL
      try {
        // Check if it's an internal route (starts with /)
        if (button2Action.startsWith('/')) {
          // Internal route - use router.push
          router.push(button2Action as any);
        } else {
          // External URL - use Linking
          const canOpen = await Linking.canOpenURL(button2Action);
          if (canOpen) {
            await Linking.openURL(button2Action);
          }
        }
      } catch (error) {
        console.error('[InAppMessageViewModel] Error opening deep link:', error);
      }
    }

    // Dismiss message after action (unless it's dismiss type)
    if (button2ActionType !== 'dismiss') {
      await handleDismiss();
    }
  }, [currentMessage, handleDismiss]);

  // Initialize device ID on mount
  useEffect(() => {
    getOrCreateDeviceId().then((id) => {
      setDeviceId(id);
    });
  }, []);

  // Load messages when device ID is ready
  useEffect(() => {
    if (deviceId) {
      loadActiveMessages();
    }
  }, [deviceId, loadActiveMessages]);

  // Set up real-time subscription
  useEffect(() => {
    if (!deviceId) {
      return;
    }

    const setupRealtimeSubscription = async () => {
      if (!supabaseIntegration.isAvailable()) {
        return;
      }

      try {
        const user = await supabaseIntegration.getCurrentUser();
        const userId = user?.id || null;

        // Clean up existing subscription
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }

        // Subscribe to new messages
        unsubscribeRef.current = inAppMessageService.subscribeToMessages(
          (newMessage) => {
            queueMessage(newMessage);
          },
          userId
        );
      } catch (error: any) {
        console.error('[InAppMessageViewModel] Error setting up real-time subscription:', error);
      }
    };

    setupRealtimeSubscription();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      inAppMessageService.cleanup();
    };
  }, [deviceId, queueMessage]);

  return {
    currentMessage,
    isVisible,
    isLoading,
    handleDismiss,
    handleAction,
    handleAction2,
  };
}

