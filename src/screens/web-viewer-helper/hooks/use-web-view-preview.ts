/**
 * Web View Preview Hook
 * 
 * Custom hook for managing WebView preview state and logic
 */

import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { t } from '@/src/shared/i18n';
import { WEB_VIEW_PREVIEW } from '../constants/web-viewer-helper.constants';
import { WebViewSource } from '../models/models';
import {
  calculateWebViewHeight,
  generateDarkThemeWithHeightScript,
  generateFontStylesScript,
  generateHeightMeasurementScript,
  getInjectedJavaScript,
} from '../utils/utils';

export function useWebViewPreview(source: WebViewSource) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewHeight, setWebViewHeight] = useState<number>(WEB_VIEW_PREVIEW.INITIAL_HEIGHT);
  
  const webViewRef = useRef<WebView>(null);
  const previousSourceRef = useRef<string>('');
  const heightMeasuredRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heightMeasurementTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset height when source changes
  useEffect(() => {
    const sourceKey = JSON.stringify(source);
    if (sourceKey !== previousSourceRef.current) {
      previousSourceRef.current = sourceKey;
      heightMeasuredRef.current = false;
      setWebViewHeight(WEB_VIEW_PREVIEW.INITIAL_HEIGHT);
      setLoading(true);
      setError(null);
    }
  }, [source]);

  // Inject dark theme CSS for HTML content and measure height
  const injectDarkTheme = useCallback(() => {
    if (!isDark || !webViewRef.current) return;
    const script = generateDarkThemeWithHeightScript(
      colors,
      WEB_VIEW_PREVIEW.MAX_ATTEMPTS_DARK_THEME,
      WEB_VIEW_PREVIEW.MEASURE_DELAY_DARK_THEME
    );
    webViewRef.current.injectJavaScript(script);
  }, [isDark, colors]);

  // Measure content height with retry mechanism
  const measureContentHeight = useCallback(() => {
    if (!webViewRef.current) return;
    const script = generateHeightMeasurementScript(
      WEB_VIEW_PREVIEW.MAX_ATTEMPTS_CONTENT,
      WEB_VIEW_PREVIEW.MEASURE_DELAY_CONTENT,
      WEB_VIEW_PREVIEW.INITIAL_MEASURE_DELAY
    );
    webViewRef.current.injectJavaScript(script);
  }, []);

  // Handle messages from WebView
  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'height' && data.height && data.height > 0 && !heightMeasuredRef.current) {
        // Ensure height is a valid number
        const measuredHeight = Number(data.height);
        if (isNaN(measuredHeight) || measuredHeight <= 0) {
          return;
        }
        
        const newHeight = calculateWebViewHeight(
          measuredHeight,
          WEB_VIEW_PREVIEW.MIN_HEIGHT,
          WEB_VIEW_PREVIEW.MAX_HEIGHT,
          {
            small: WEB_VIEW_PREVIEW.SMALL_CONTENT_THRESHOLD,
            medium: WEB_VIEW_PREVIEW.MEDIUM_CONTENT_THRESHOLD,
          },
          {
            small: WEB_VIEW_PREVIEW.SMALL_CONTENT_PADDING,
            medium: WEB_VIEW_PREVIEW.MEDIUM_CONTENT_PADDING,
            large: WEB_VIEW_PREVIEW.LARGE_CONTENT_PADDING,
          }
        );
        
        // Ensure calculated height is valid
        if (newHeight > 0 && isFinite(newHeight)) {
          setWebViewHeight(newHeight);
          heightMeasuredRef.current = true;
          
          // Clear height measurement timeout since we got a successful measurement
          if (heightMeasurementTimeoutRef.current) {
            clearTimeout(heightMeasurementTimeoutRef.current);
            heightMeasurementTimeoutRef.current = null;
          }
        }
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

  // Handle load start
  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
    heightMeasuredRef.current = false;
    setWebViewHeight(WEB_VIEW_PREVIEW.INITIAL_HEIGHT);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Validate URL before loading
    if (source?.uri) {
      try {
        // Basic URL validation
        const url = new URL(source.uri);
        if (!url.protocol || (!url.protocol.startsWith('http') && !url.protocol.startsWith('https'))) {
          setError(t('helpers.webViewerHelper.errors.invalidUrlProtocol'));
          setLoading(false);
          heightMeasuredRef.current = true;
          if (webViewRef.current) {
            webViewRef.current.stopLoading();
          }
          return;
        }
      } catch {
        setError(t('helpers.webViewerHelper.errors.invalidUrlFormat'));
        setLoading(false);
        heightMeasuredRef.current = true;
        if (webViewRef.current) {
          webViewRef.current.stopLoading();
        }
        return;
      }
    }
    
    // Set timeout for loading (15 seconds)
    timeoutRef.current = setTimeout(() => {
      setError(t('helpers.webViewerHelper.errors.timeout'));
      setLoading(false);
      heightMeasuredRef.current = true;
      // Stop WebView loading when timeout occurs
      if (webViewRef.current) {
        webViewRef.current.stopLoading();
      }
    }, 15000);
  }, [source]);

  // Handle load end
  const handleLoadEnd = useCallback(() => {
    // Clear timeout if content loaded successfully
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Clear any existing height measurement timeout
    if (heightMeasurementTimeoutRef.current) {
      clearTimeout(heightMeasurementTimeoutRef.current);
      heightMeasurementTimeoutRef.current = null;
    }
    
    setLoading(false);
    heightMeasuredRef.current = false;
    
    // Set a fallback timeout for height measurement (5 seconds)
    // If height is not measured within this time, use a default height
    heightMeasurementTimeoutRef.current = setTimeout(() => {
      if (!heightMeasuredRef.current && webViewRef.current) {
        // Use a reasonable default height if measurement fails
        const defaultHeight = calculateWebViewHeight(
          300, // Default content height
          WEB_VIEW_PREVIEW.MIN_HEIGHT,
          WEB_VIEW_PREVIEW.MAX_HEIGHT,
          {
            small: WEB_VIEW_PREVIEW.SMALL_CONTENT_THRESHOLD,
            medium: WEB_VIEW_PREVIEW.MEDIUM_CONTENT_THRESHOLD,
          },
          {
            small: WEB_VIEW_PREVIEW.SMALL_CONTENT_PADDING,
            medium: WEB_VIEW_PREVIEW.MEDIUM_CONTENT_PADDING,
            large: WEB_VIEW_PREVIEW.LARGE_CONTENT_PADDING,
          }
        );
        setWebViewHeight(defaultHeight);
        heightMeasuredRef.current = true;
      }
    }, 5000);
    
    // Measure height for both HTML and URL content
    if (source?.html) {
      // HTML content - inject styles and measure
      if (isDark) {
        setTimeout(() => {
          injectDarkTheme();
        }, WEB_VIEW_PREVIEW.DARK_THEME_INJECTION_DELAY);
        // Measure after dark theme injection
        setTimeout(() => {
          measureContentHeight();
        }, WEB_VIEW_PREVIEW.DARK_THEME_MEASURE_DELAY);
      } else {
        // HTML without dark theme - inject font styles and measure
        setTimeout(() => {
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(generateFontStylesScript());
          }
        }, WEB_VIEW_PREVIEW.FONT_STYLE_INJECTION_DELAY);
        setTimeout(() => {
          measureContentHeight();
        }, WEB_VIEW_PREVIEW.FONT_STYLE_MEASURE_DELAY);
      }
    } else {
      // For URL content, inject styles aggressively and measure
      // Inject font styles immediately for URL content
      setTimeout(() => {
        if (webViewRef.current) {
          // Inject font styles multiple times to ensure they apply
          webViewRef.current.injectJavaScript(generateFontStylesScript());
          // Also inject dark theme if needed
          if (isDark) {
            injectDarkTheme();
          }
        }
      }, 50);
      
      // Inject again after a short delay to override any default styles
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(generateFontStylesScript());
          if (isDark) {
            injectDarkTheme();
          }
        }
      }, 200);
      
      // Measure height after styles are applied
      setTimeout(() => {
        measureContentHeight();
      }, WEB_VIEW_PREVIEW.URL_CONTENT_MEASURE_DELAY);
    }
  }, [source, isDark, injectDarkTheme, measureContentHeight]);

  // Handle error
  const handleError = useCallback((syntheticEvent: any) => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Stop WebView loading
    if (webViewRef.current) {
      webViewRef.current.stopLoading();
    }
    
    const { nativeEvent } = syntheticEvent;
    const errorMessage = nativeEvent.description || nativeEvent.message || '';
    
    // Provide user-friendly error messages based on error type
    let userFriendlyError = t('helpers.webViewerHelper.errors.loadFailed');
    if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('connection')) {
      userFriendlyError = t('helpers.webViewerHelper.errors.networkError');
    } else if (errorMessage.toLowerCase().includes('dns') || errorMessage.toLowerCase().includes('host')) {
      userFriendlyError = t('helpers.webViewerHelper.errors.dnsError');
    } else {
      userFriendlyError = t('helpers.webViewerHelper.errors.genericError');
    }
    
    setError(userFriendlyError);
    setLoading(false);
    heightMeasuredRef.current = true;
  }, []);
  
  // Handle HTTP error
  const handleHttpError = useCallback((syntheticEvent: any) => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Stop WebView loading
    if (webViewRef.current) {
      webViewRef.current.stopLoading();
    }
    
    const { nativeEvent } = syntheticEvent;
    const statusCode = nativeEvent.statusCode || 'Unknown';
    
    // Provide user-friendly HTTP error messages
    let userFriendlyError = '';
    if (statusCode === 404) {
      userFriendlyError = t('helpers.webViewerHelper.errors.http404');
    } else if (statusCode === 403) {
      userFriendlyError = t('helpers.webViewerHelper.errors.http403');
    } else if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
      userFriendlyError = t('helpers.webViewerHelper.errors.httpServerError', { statusCode });
    } else if (statusCode === 522 || statusCode === 524) {
      userFriendlyError = t('helpers.webViewerHelper.errors.http522');
    } else {
      userFriendlyError = t('helpers.webViewerHelper.errors.httpGeneric', { statusCode });
    }
    
    setError(userFriendlyError);
    setLoading(false);
    heightMeasuredRef.current = true;
  }, []);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (heightMeasurementTimeoutRef.current) {
        clearTimeout(heightMeasurementTimeoutRef.current);
      }
    };
  }, []);

  const injectedJavaScript = getInjectedJavaScript(isDark, colors);

  return {
    webViewRef,
    loading,
    error,
    webViewHeight,
    colors,
    injectedJavaScript,
    handleMessage,
    handleLoadStart,
    handleLoadEnd,
    handleError,
    handleHttpError,
  };
}
