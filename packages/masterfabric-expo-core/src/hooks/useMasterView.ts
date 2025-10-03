import { useCallback, useEffect, useRef, useState } from 'react';
import { defaultMasterViewConfig } from '../constants/MasterViewConfig';
import { useTheme } from '../contexts/ThemeContext';
import {
    MasterViewConfig,
    MasterViewEvent,
    MasterViewEventHandler,
    MasterViewHook,
    MasterViewState
} from '../types/MasterView';

export function useMasterView<TState = any, TActions = any>(
  initialState?: TState,
  config?: Partial<MasterViewConfig>
): MasterViewHook<TState, TActions> {
  // Get theme information from ThemeContext
  const { currentTheme, isDark, setTheme } = useTheme();
  
  const [state, setState] = useState<MasterViewState & TState>({
    isInitialized: false,
    isDestroyed: false,
    isLoading: false,
    error: null,
    errorCount: 0,
    retryCount: 0,
    ...initialState,
  } as MasterViewState & TState);

  const [actions, setActions] = useState<TActions>({} as TActions);
  const eventHandlersRef = useRef<Set<MasterViewEventHandler>>(new Set());
  const configRef = useRef({ ...defaultMasterViewConfig, ...config });
  const isInitializedRef = useRef(false);
  const isDestroyedRef = useRef(false);

  // Emit events
  const emitEvent = useCallback((type: MasterViewEvent['type'], data?: any) => {
    const event: MasterViewEvent = {
      type,
      viewId: 'useMasterView',
      viewName: 'useMasterView',
      timestamp: new Date().toISOString(),
      data,
    };

    eventHandlersRef.current.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ 
      ...prev, 
      error, 
      errorCount: error ? prev.errorCount + 1 : prev.errorCount 
    }));
  }, []);

  // Handle errors
  const handleError = useCallback((error: any) => {
    const errorMessage = error.message || 'Unknown error occurred';
    setError(errorMessage);
    emitEvent('ERROR', { error: errorMessage, timestamp: new Date().toISOString() });
  }, [setError, emitEvent]);

  // Initialize the MasterView
  const initialize = useCallback(async () => {
    if (isInitializedRef.current) {
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Emit initialization event
      emitEvent('INITIALIZED');
      
      // Set as initialized
      isInitializedRef.current = true;
      setState(prev => ({ 
        ...prev, 
        isInitialized: true, 
        isLoading: false,
        error: null 
      }));
      
    } catch (error) {
      handleError(error);
    }
  }, [emitEvent, handleError]);

  // Destroy the MasterView
  const destroy = useCallback(() => {
    if (isDestroyedRef.current) {
      return;
    }

    try {
      isDestroyedRef.current = true;
      setState(prev => ({ ...prev, isDestroyed: true }));
      
      // Emit destruction event
      emitEvent('DESTROYED');
      
    } catch (error) {
      console.error('Error destroying MasterView:', error);
    }
  }, [emitEvent]);

  // Reset the MasterView state
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isInitialized: false,
      isDestroyed: false,
      isLoading: false,
      error: null,
      errorCount: 0,
      retryCount: 0,
      ...initialState,
    }));
    
    isInitializedRef.current = false;
    isDestroyedRef.current = false;
  }, [initialState]);

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  // Track activity
  const trackActivity = useCallback((action: string, details?: any) => {
    if (!configRef.current.enableActivityTracking) {
      return;
    }

    try {
      const activity = {
        id: Date.now().toString(),
        action,
        details,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({ ...prev, lastActivity: action }));
      emitEvent('ACTIVITY_TRACKED', activity);
      
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [emitEvent]);

  // Add event listener
  const addEventListener = useCallback((handler: MasterViewEventHandler) => {
    eventHandlersRef.current.add(handler);
    
    return () => {
      eventHandlersRef.current.delete(handler);
    };
  }, []);

  // Update state helper
  const updateState = useCallback((newState: Partial<TState & MasterViewState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  // Update actions helper
  const updateActions = useCallback((newActions: Partial<TActions>) => {
    setActions(prev => ({ ...prev, ...newActions }));
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
    
    return () => {
      destroy();
    };
  }, [initialize, destroy]);

  // Return the hook interface
  return {
    state,
    actions,
    isLoading: state.isLoading,
    error: state.error,
    initialize,
    destroy,
    reset,
    // Additional utilities
    setLoading,
    setError,
    trackActivity,
    updateState,
    updateActions,
    addEventListener,
    // Theme utilities
    currentTheme,
    isDark,
    setTheme,
  };
}
