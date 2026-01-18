/**
 * Web Viewer Helper Utilities
 * 
 * Utility functions for WebView security, navigation, and preview
 */

import { isUrl, loggerHelper, ThemeColors } from 'masterfabric-expo-core';
import { Linking, Platform } from 'react-native';

// ===== Security & Navigation Utilities =====

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Check if URL is allowed based on domain whitelist
 */
export function isDomainAllowed(
  url: string,
  allowedDomains?: string[]
): boolean {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true; // No restrictions
  }

  const domain = extractDomain(url);
  if (!domain) {
    return false; // Invalid URL
  }

  // Check exact match or subdomain
  return allowedDomains.some((allowed) => {
    if (domain === allowed) {
      return true;
    }
    // Allow subdomains: example.com allows sub.example.com
    if (domain.endsWith(`.${allowed}`)) {
      return true;
    }
    return false;
  });
}

/**
 * Check if URL is safe to load
 */
export function isUrlSafe(url: string): boolean {
  if (!isUrl(url)) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.toLowerCase();

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.includes(protocol)) {
      return false;
    }

    // Allow http, https, and app-specific schemes
    return protocol === 'http:' || protocol === 'https:' || protocol.includes('://');
  } catch {
    return false;
  }
}

/**
 * Open URL in system browser
 */
export async function openInSystemBrowser(url: string): Promise<boolean> {
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

/**
 * Log debug message if debug is enabled
 */
export function debugLog(
  message: string,
  data?: any,
  enableDebugLogs?: boolean
): void {
  if (!enableDebugLogs) {
    return;
  }

  try {
    loggerHelper.debug(`[WebViewer] ${message}`, data);
  } catch {
    // Logger not initialized, fallback to console
    if (__DEV__) {
      console.log(`[WebViewer] ${message}`, data || '');
    }
  }
}

/**
 * Get platform-specific WebView props
 */
export function getPlatformWebViewProps(config: {
  allowFileAccess?: boolean;
  allowUniversalAccessFromFileURLs?: boolean;
  thirdPartyCookiesEnabled?: boolean;
  sharedCookiesEnabled?: boolean;
}): Record<string, any> {
  const props: Record<string, any> = {};

  if (Platform.OS === 'android') {
    props.allowFileAccess = config.allowFileAccess ?? false;
    props.allowUniversalAccessFromFileURLs =
      config.allowUniversalAccessFromFileURLs ?? false;
    props.thirdPartyCookiesEnabled = config.thirdPartyCookiesEnabled ?? true;
    props.sharedCookiesEnabled = config.sharedCookiesEnabled ?? true;
  } else if (Platform.OS === 'ios') {
    props.allowsInlineMediaPlayback = true;
    props.mediaPlaybackRequiresUserAction = false;
  }

  return props;
}

// ===== Preview Utilities =====

/**
 * Generate dark theme CSS injection script for WebView
 * 
 * @param colors - Theme colors object
 * @returns JavaScript code to inject dark theme styles
 */
export const generateDarkThemeScript = (colors: ThemeColors): string => {
  return `
    (function() {
      var style = document.getElementById('dark-theme-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'dark-theme-style';
        document.head.appendChild(style);
      }
      style.innerHTML = \`
        body {
          background-color: ${colors.surfaceBackground} !important;
          color: ${colors.bodyText} !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
          padding: 16px !important;
        }
        * {
          color: ${colors.bodyText} !important;
        }
        p, div, span, li, td, th {
          font-size: 16px !important;
          line-height: 1.5 !important;
        }
        h1 {
          font-size: 32px !important;
          color: ${colors.titleText} !important;
          margin: 16px 0 !important;
        }
        h2 {
          font-size: 28px !important;
          color: ${colors.titleText} !important;
          margin: 14px 0 !important;
        }
        h3 {
          font-size: 24px !important;
          color: ${colors.titleText} !important;
          margin: 12px 0 !important;
        }
        h4, h5, h6 {
          font-size: 20px !important;
          color: ${colors.titleText} !important;
          margin: 10px 0 !important;
        }
        a {
          color: ${colors.primary} !important;
          font-size: 16px !important;
        }
      \`;
    })();
    true;
  `;
};

/**
 * Generate font styles injection script for HTML content
 * 
 * @returns JavaScript code to inject font styles
 */
export const generateFontStylesScript = (): string => {
  return `
    (function() {
      var style = document.getElementById('font-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'font-style';
        document.head.appendChild(style);
      }
      style.innerHTML = \`
        body {
          font-size: 16px !important;
          line-height: 1.5 !important;
          padding: 16px !important;
        }
        p, div, span, li, td, th {
          font-size: 16px !important;
          line-height: 1.5 !important;
        }
        h1 { font-size: 32px !important; margin: 16px 0 !important; }
        h2 { font-size: 28px !important; margin: 14px 0 !important; }
        h3 { font-size: 24px !important; margin: 12px 0 !important; }
        h4, h5, h6 { font-size: 20px !important; margin: 10px 0 !important; }
      \`;
    })();
    true;
  `;
};

/**
 * Generate injected JavaScript for dark theme and height measurement
 * 
 * @param isDark - Whether dark theme is active
 * @param colors - Theme colors object
 * @returns JavaScript code to inject
 */
export const getInjectedJavaScript = (
  isDark: boolean,
  colors: ThemeColors
): string => {
  const heightMeasurementScript = `
    setTimeout(function() {
      // Wait for content to render
      var attempts = 0;
      var maxAttempts = 10;
      function measureHeight() {
        var height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        if (height > 0 && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(measureHeight, 50);
        }
      }
      measureHeight();
    }, 100);
  `;
  
  if (!isDark) {
    return `
      (function() {
        ${heightMeasurementScript}
      })();
      true;
    `;
  }
  
  // Combine dark theme script with height measurement
  const darkThemeScript = generateDarkThemeScript(colors);
  // Also add font styles for light theme HTML content
  const fontStylesScript = `
    var fontStyle = document.getElementById('font-style');
    if (!fontStyle) {
      fontStyle = document.createElement('style');
      fontStyle.id = 'font-style';
      document.head.appendChild(fontStyle);
    }
    fontStyle.innerHTML = \`
      body {
        font-size: 16px !important;
        line-height: 1.5 !important;
        padding: 16px !important;
      }
      p, div, span, li, td, th {
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
      h1 { font-size: 32px !important; margin: 16px 0 !important; }
      h2 { font-size: 28px !important; margin: 14px 0 !important; }
      h3 { font-size: 24px !important; margin: 12px 0 !important; }
      h4, h5, h6 { font-size: 20px !important; margin: 10px 0 !important; }
    \`;
  `;
  return `
    (function() {
      ${darkThemeScript}
      ${fontStylesScript}
      ${heightMeasurementScript}
    })();
    true;
  `;
};

/**
 * Generate script for injecting dark theme and measuring height
 * 
 * @param colors - Theme colors object
 * @param maxAttempts - Maximum retry attempts
 * @param measureDelay - Delay between measurement attempts
 * @returns JavaScript code to inject
 */
export const generateDarkThemeWithHeightScript = (
  colors: ThemeColors,
  maxAttempts: number = 10,
  measureDelay: number = 50
): string => {
  return `
    ${generateDarkThemeScript(colors)}
    setTimeout(function() {
      var attempts = 0;
      function measureHeight() {
        var height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        if (height > 0 && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
        } else if (attempts < ${maxAttempts}) {
          attempts++;
          setTimeout(measureHeight, ${measureDelay});
        }
      }
      measureHeight();
    }, 100);
  `;
};

/**
 * Generate script for measuring content height
 * 
 * @param maxAttempts - Maximum retry attempts
 * @param measureDelay - Delay between measurement attempts
 * @param initialDelay - Initial delay before starting measurement
 * @returns JavaScript code to inject
 */
export const generateHeightMeasurementScript = (
  maxAttempts: number = 15,
  measureDelay: number = 100,
  initialDelay: number = 100
): string => {
  return `
    (function() {
      var attempts = 0;
      function measureHeight() {
        var height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        if (height > 0 && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height: height }));
        } else if (attempts < ${maxAttempts}) {
          attempts++;
          setTimeout(measureHeight, ${measureDelay});
        }
      }
      setTimeout(measureHeight, ${initialDelay});
    })();
    true;
  `;
};

/**
 * Calculate padding based on content height
 * 
 * @param contentHeight - Height of the content
 * @param thresholds - Thresholds for small/medium content
 * @param paddings - Padding values for each size category
 * @returns Calculated padding value
 */
export const calculateContentPadding = (
  contentHeight: number,
  thresholds: { small: number; medium: number } = { small: 50, medium: 200 },
  paddings: { small: number; medium: number; large: number } = { small: 10, medium: 20, large: 30 }
): number => {
  if (contentHeight < thresholds.small) {
    return paddings.small;
  }
  if (contentHeight < thresholds.medium) {
    return paddings.medium;
  }
  return paddings.large;
};

/**
 * Calculate final WebView height with padding
 * 
 * @param contentHeight - Height of the content
 * @param minHeight - Minimum height
 * @param thresholds - Thresholds for padding calculation
 * @param paddings - Padding values
 * @returns Final height with padding
 */
export const calculateWebViewHeight = (
  contentHeight: number,
  minHeight: number = 50,
  thresholds?: { small: number; medium: number },
  paddings?: { small: number; medium: number; large: number }
): number => {
  const padding = calculateContentPadding(contentHeight, thresholds, paddings);
  return Math.max(minHeight, Math.ceil(contentHeight) + padding);
};
