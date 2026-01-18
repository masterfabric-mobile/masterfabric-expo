/**
 * Web View Preview Hook
 * 
 * Custom hook for managing WebView preview state and logic
 */

import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
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
        const newHeight = calculateWebViewHeight(
          data.height,
          WEB_VIEW_PREVIEW.MIN_HEIGHT,
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
        setWebViewHeight(newHeight);
        heightMeasuredRef.current = true;
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
  }, []);

  // Handle load end
  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    heightMeasuredRef.current = false;
    
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
      // For URL content, measure directly
      setTimeout(() => {
        measureContentHeight();
      }, WEB_VIEW_PREVIEW.URL_CONTENT_MEASURE_DELAY);
    }
  }, [source, isDark, injectDarkTheme, measureContentHeight]);

  // Handle error
  const handleError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setError(nativeEvent.description || 'Failed to load content');
    setLoading(false);
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
  };
}
