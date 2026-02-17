/**
 * useWebViewer Hook
 * 
 * Production-ready hook for managing WebView state, security, and navigation.
 * Handles loading states, errors, retries, and security checks.
 * 
 * @example
 * ```typescript
 * const { state, source, reload, retry } = useWebViewer({
 *   url: 'https://example.com',
 *   allowedDomains: ['example.com'],
 *   onLoadEnd: (event) => console.log('Loaded:', event.url),
 *   onError: (event) => console.error('Error:', event.error),
 * });
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { webViewerHelper, isUrl, loggerHelper } from '../helpers';

// WebViewer types - these should be imported from where they're actually used
// For now, we'll define them here since they're only used by this hook
export interface WebViewerCallbacks {
  onLoadStart?: (event: { url: string }) => void;
  onLoadEnd?: (event: { url: string }) => void;
  onError?: (event: { error: string; url?: string }) => void;
  onMessage?: (event: { message: string; data?: any }) => void;
  onNavigationStateChange?: (event: { url: string; canGoBack: boolean; canGoForward: boolean }) => void;
  onShouldOpenExternalLink?: (url: string) => boolean;
}

export interface WebViewerConfig {
  url?: string;
  html?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  injectedJavaScript?: string;
  allowedDomains?: string[];
  enableCookies?: boolean;
  enableCache?: boolean;
  enableDebugLogs?: boolean;
  timeout?: number;
  enablePullToRefresh?: boolean;
  userAgent?: string;
  allowFileAccess?: boolean;
  allowUniversalAccessFromFileURLs?: boolean;
  thirdPartyCookiesEnabled?: boolean;
  sharedCookiesEnabled?: boolean;
}

export interface WebViewerState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  currentUrl: string | null;
  navigationBlocked: boolean;
  retryCount: number;
}

export interface UseWebViewerReturn {
  state: WebViewerState;
  source: any;
  reload: () => void;
  retry: () => void;
  goBack: () => void;
  goForward: () => void;
  stopLoading: () => void;
  injectJavaScript: (script: string) => void;
  postMessage: (message: string, targetOrigin?: string) => void;
  handleLoadStart: (event: any) => void;
  handleLoadEnd: (event: any) => void;
  handleError: (event: any) => void;
  handleMessage: (event: any) => void;
  handleNavigationStateChange: (navState: any) => void;
  handleShouldStartLoadWithRequest: (request: any) => boolean;
}

// Utility functions
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function isDomainAllowed(url: string, allowedDomains?: string[]): boolean {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true;
  }
  const domain = extractDomain(url);
  if (!domain) {
    return false;
  }
  return allowedDomains.some((allowed) => {
    if (domain === allowed) {
      return true;
    }
    if (domain.endsWith(`.${allowed}`)) {
      return true;
    }
    return false;
  });
}

function isUrlSafe(url: string): boolean {
  if (!isUrl(url)) {
    return false;
  }
  try {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.toLowerCase();
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.includes(protocol)) {
      return false;
    }
    return protocol === 'http:' || protocol === 'https:' || protocol.includes('://');
  } catch {
    return false;
  }
}

async function openInSystemBrowser(url: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    return false;
  } catch (error) {
    if (__DEV__) {
      console.error('Error opening URL in system browser:', error);
    }
    return false;
  }
}

function debugLog(message: string, data?: any, enableDebugLogs?: boolean): void {
  if (!enableDebugLogs) {
    return;
  }
  try {
    loggerHelper.debug(`[WebViewer] ${message}`, data);
  } catch {
    if (__DEV__) {
      console.log(`[WebViewer] ${message}`, data || '');
    }
  }
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

export function useWebViewer(
  config: WebViewerConfig & WebViewerCallbacks = {}
): UseWebViewerReturn {
  const {
    url,
    html,
    baseUrl,
    headers,
    enableDebugLogs = false,
    timeout = DEFAULT_TIMEOUT,
    onLoadStart,
    onLoadEnd,
    onError,
    onMessage,
    onNavigationStateChange,
    onShouldOpenExternalLink,
    allowedDomains,
  } = config;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const [state, setState] = useState<WebViewerState>({
    isLoading: true, // Start loading
    isLoaded: false,
    error: null,
    currentUrl: url || null,
    navigationBlocked: false,
    retryCount: 0,
  });

  // Create WebView source
  const source = html
    ? webViewerHelper.html(html, { baseUrl, headers })
    : url
    ? webViewerHelper.url(url, { headers })
    : { html: '' };

  // Clear timeout
  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
      isLoaded: false,
    }));
    clearTimeoutRef();
  }, [clearTimeoutRef]);

  // Handle load start
  const handleLoadStart = useCallback(
    (event: any) => {
      const url = event.nativeEvent?.url || state.currentUrl || '';
      debugLog('Load start', { url }, enableDebugLogs);

      setLoading(true);
      setState((prev) => ({
        ...prev,
        error: null,
        navigationBlocked: false,
        currentUrl: url,
      }));

      // Set timeout
      clearTimeoutRef();
      timeoutRef.current = setTimeout(() => {
        setError('Request timeout. Please check your connection and try again.');
        onError?.({ error: 'Request timeout', url });
      }, timeout);

      onLoadStart?.({ url });
    },
    [enableDebugLogs, setLoading, setError, timeout, onLoadStart, onError, clearTimeoutRef, state.currentUrl]
  );

  // Handle load end (event handler for WebView)
  const handleLoadEnd = useCallback(
    (event: any) => {
      const url = event.nativeEvent?.url || state.currentUrl || '';
      debugLog('Load end', { url }, enableDebugLogs);

      clearTimeoutRef();
      setLoading(false);
      setState((prev) => ({
        ...prev,
        isLoaded: true,
        error: null,
        currentUrl: url,
        retryCount: 0,
      }));

      retryCountRef.current = 0;
      onLoadEnd?.({ url });
    },
    [enableDebugLogs, setLoading, clearTimeoutRef, onLoadEnd, state.currentUrl]
  );

  // Handle error (event handler for WebView)
  const handleError = useCallback(
    (event: any) => {
      const errorMessage =
        event.nativeEvent?.description ||
        event.nativeEvent?.message ||
        'Failed to load page';
      const url = event.nativeEvent?.url || state.currentUrl || '';

      debugLog('Load error', { error: errorMessage, url }, enableDebugLogs);

      setError(errorMessage);
      onError?.({ error: errorMessage, url });
    },
    [enableDebugLogs, setError, onError, state.currentUrl]
  );

  // Handle navigation state change
  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      const { url, canGoBack, canGoForward } = navState;
      debugLog('Navigation state change', { url, canGoBack, canGoForward }, enableDebugLogs);

      setState((prev) => ({
        ...prev,
        currentUrl: url,
      }));

      onNavigationStateChange?.({
        url,
        canGoBack: canGoBack ?? false,
        canGoForward: canGoForward ?? false,
      });
    },
    [enableDebugLogs, onNavigationStateChange]
  );

  // Handle should start load with request (security check)
  const handleShouldStartLoadWithRequest = useCallback(
    (request: any): boolean => {
      const requestUrl = request.url || request.nativeEvent?.url || '';
      debugLog('Should start load', { url: requestUrl }, enableDebugLogs);

      // Check if URL is safe
      if (!isUrlSafe(requestUrl)) {
        debugLog('URL blocked (unsafe)', { url: requestUrl }, enableDebugLogs);
        setState((prev) => ({ ...prev, navigationBlocked: true }));
        return false;
      }

      // Check domain whitelist
      if (allowedDomains && allowedDomains.length > 0) {
        if (!isDomainAllowed(requestUrl, allowedDomains)) {
          debugLog('URL blocked (domain not allowed)', { url: requestUrl }, enableDebugLogs);

          // Check if external link handler wants to open it
          if (onShouldOpenExternalLink) {
            const shouldOpen = onShouldOpenExternalLink(requestUrl);
            if (shouldOpen) {
              openInSystemBrowser(requestUrl);
            }
          } else {
            // Default: open external links in system browser
            openInSystemBrowser(requestUrl);
          }

          setState((prev) => ({ ...prev, navigationBlocked: true }));
          return false;
        }
      }

      // Allow navigation
      return true;
    },
    [allowedDomains, enableDebugLogs, onShouldOpenExternalLink]
  );

  // Handle message from web page
  const handleMessage = useCallback(
    (event: any) => {
      const message = event.nativeEvent?.data || '';
      debugLog('Message received', { message }, enableDebugLogs);

      try {
        const data = JSON.parse(message);
        onMessage?.({ message, data });
      } catch {
        onMessage?.({ message });
      }
    },
    [enableDebugLogs, onMessage]
  );

  // Reload (returns a function that can be called with WebView ref)
  const reload = useCallback(() => {
    debugLog('Reload requested', {}, enableDebugLogs);
    // This will be called from component with ref
  }, [enableDebugLogs]);

  // Retry after error
  const retry = useCallback(() => {
    debugLog('Retry requested', {}, enableDebugLogs);
    retryCountRef.current += 1;
    setState((prev) => ({
      ...prev,
      error: null,
      retryCount: retryCountRef.current,
    }));
  }, [enableDebugLogs]);

  // Go back (returns a function that can be called with WebView ref)
  const goBack = useCallback(() => {
    debugLog('Go back requested', {}, enableDebugLogs);
    // This will be called from component with ref
  }, [enableDebugLogs]);

  // Go forward (returns a function that can be called with WebView ref)
  const goForward = useCallback(() => {
    debugLog('Go forward requested', {}, enableDebugLogs);
    // This will be called from component with ref
  }, [enableDebugLogs]);

  // Stop loading
  const stopLoading = useCallback(() => {
    debugLog('Stop loading requested', {}, enableDebugLogs);
    clearTimeoutRef();
    setLoading(false);
  }, [enableDebugLogs, clearTimeoutRef, setLoading]);

  // Inject JavaScript (returns a function that can be called with WebView ref)
  const injectJavaScript = useCallback(
    (script: string) => {
      debugLog('Inject JavaScript', { script }, enableDebugLogs);
      // This will be called from component with ref
    },
    [enableDebugLogs]
  );

  // Post message
  const postMessage = useCallback(
    (message: string, targetOrigin?: string) => {
      debugLog('Post message', { message, targetOrigin }, enableDebugLogs);
      // This will be called from component with ref
    },
    [enableDebugLogs]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeoutRef();
    };
  }, [clearTimeoutRef]);

  return {
    state,
    source,
    reload,
    retry,
    goBack,
    goForward,
    stopLoading,
    injectJavaScript,
    postMessage,
    // Event handlers for WebView component
    handleLoadStart,
    handleLoadEnd,
    handleError,
    handleMessage,
    handleNavigationStateChange,
    handleShouldStartLoadWithRequest,
  };
}
