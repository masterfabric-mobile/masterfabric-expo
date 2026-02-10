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
      // Add viewport meta tag if not exists
      var viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        document.head.appendChild(viewport);
      } else {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      }
      
      var style = document.getElementById('dark-theme-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'dark-theme-style';
        document.head.appendChild(style);
      }
      style.innerHTML = \`
        html {
          font-size: 16px !important;
          -webkit-text-size-adjust: 100% !important;
          text-size-adjust: 100% !important;
        }
        body {
          background-color: ${colors.surfaceBackground} !important;
          color: ${colors.bodyText} !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        /* Only normalize common text containers so we don't
           break "Raw" / code viewers inside WebView content. */
        body, p, div, span, li, td, th {
          font-size: 16px !important;
          line-height: 1.5 !important;
          margin: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        /* Keep monospace blocks but don't force colors or spacing,
           so sites can control how RAW / code panes look. */
        pre, code {
          font-family: monospace !important;
          max-width: 100% !important;
          overflow-x: auto !important;
        }
        img {
          max-width: 100% !important;
          height: auto !important;
        }
        table {
          width: 100% !important;
          max-width: 100% !important;
          table-layout: auto !important;
        }
        h1 {
          font-size: 24px !important;
          color: ${colors.titleText} !important;
          margin: 16px 0 !important;
        }
        h2 {
          font-size: 22px !important;
          color: ${colors.titleText} !important;
          margin: 14px 0 !important;
        }
        h3 {
          font-size: 20px !important;
          color: ${colors.titleText} !important;
          margin: 12px 0 !important;
        }
        h4, h5, h6 {
          font-size: 18px !important;
          color: ${colors.titleText} !important;
          margin: 10px 0 !important;
        }
        a {
          color: ${colors.primary} !important;
          font-size: 16px !important;
          word-wrap: break-word !important;
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
      // Add viewport meta tag if not exists
      var viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        document.head.appendChild(viewport);
      } else {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      }
      
      var style = document.getElementById('font-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'font-style';
        document.head.appendChild(style);
      }
      style.innerHTML = \`
        html {
          font-size: 16px !important;
          -webkit-text-size-adjust: 100% !important;
          text-size-adjust: 100% !important;
        }
        * {
          font-size: 16px !important;
          box-sizing: border-box !important;
        }
        body {
          font-size: 16px !important;
          line-height: 1.5 !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        p, div, span, li, td, th, pre, code, textarea, input {
          font-size: 16px !important;
          line-height: 1.5 !important;
          margin: 0 !important;
          max-width: 100% !important;
        }
        pre {
          font-size: 16px !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          margin: 0 !important;
          padding: 0 !important;
          max-width: 100% !important;
          overflow-x: auto !important;
        }
        code {
          font-size: 16px !important;
          font-family: monospace !important;
        }
        img {
          max-width: 100% !important;
          height: auto !important;
        }
        table {
          width: 100% !important;
          max-width: 100% !important;
          table-layout: auto !important;
        }
        h1 { font-size: 24px !important; margin: 16px 0 !important; }
        h2 { font-size: 22px !important; margin: 14px 0 !important; }
        h3 { font-size: 20px !important; margin: 12px 0 !important; }
        h4, h5, h6 { font-size: 18px !important; margin: 10px 0 !important; }
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
    const viewportScript = `
      // Add viewport meta tag if not exists
      var viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        document.head.appendChild(viewport);
      } else {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      }
    `;
    return `
      (function() {
        ${viewportScript}
        ${heightMeasurementScript}
      })();
      true;
    `;
  }
  
  // Combine dark theme script with height measurement
  const darkThemeScript = generateDarkThemeScript(colors);
  // Also add font styles for light theme HTML content
  const fontStylesScript = `
    // Add viewport meta tag if not exists
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(viewport);
    } else {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    }
    
    var fontStyle = document.getElementById('font-style');
    if (!fontStyle) {
      fontStyle = document.createElement('style');
      fontStyle.id = 'font-style';
      document.head.appendChild(fontStyle);
    }
    fontStyle.innerHTML = \`
      html {
        -webkit-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
      }
      * {
        font-size: 16px !important;
        box-sizing: border-box !important;
      }
      body {
        font-size: 16px !important;
        line-height: 1.5 !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      p, div, span, li, td, th, pre, code, textarea, input {
        font-size: 16px !important;
        line-height: 1.5 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }
      pre {
        font-size: 16px !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        overflow-x: auto !important;
      }
      code {
        font-size: 16px !important;
        font-family: monospace !important;
      }
      img {
        max-width: 100% !important;
        height: auto !important;
      }
      table {
        width: 100% !important;
        max-width: 100% !important;
        table-layout: auto !important;
      }
      h1 { font-size: 24px !important; margin: 16px 0 !important; }
      h2 { font-size: 22px !important; margin: 14px 0 !important; }
      h3 { font-size: 20px !important; margin: 12px 0 !important; }
      h4, h5, h6 { font-size: 18px !important; margin: 10px 0 !important; }
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
        // Get the actual content height without extra padding
        var bodyHeight = document.body.scrollHeight || document.body.offsetHeight;
        var htmlHeight = document.documentElement.scrollHeight || document.documentElement.offsetHeight;
        var height = Math.max(bodyHeight, htmlHeight);
        
        // Subtract body padding if exists (8px top + 8px bottom = 16px, but we use 4px so 8px total)
        var bodyStyle = window.getComputedStyle(document.body);
        var paddingTop = parseInt(bodyStyle.paddingTop) || 0;
        var paddingBottom = parseInt(bodyStyle.paddingBottom) || 0;
        height = height - paddingTop - paddingBottom;
        
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
        // Get the actual content height without extra padding
        var bodyHeight = document.body.scrollHeight || document.body.offsetHeight;
        var htmlHeight = document.documentElement.scrollHeight || document.documentElement.offsetHeight;
        var height = Math.max(bodyHeight, htmlHeight);
        
        // Subtract body padding if exists (8px top + 8px bottom = 16px, but we use 4px so 8px total)
        var bodyStyle = window.getComputedStyle(document.body);
        var paddingTop = parseInt(bodyStyle.paddingTop) || 0;
        var paddingBottom = parseInt(bodyStyle.paddingBottom) || 0;
        height = height - paddingTop - paddingBottom;
        
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
  paddings: { small: number; medium: number; large: number } = { small: 576, medium: 576, large: 576 }
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
 * @param maxHeight - Maximum height (for scrolling)
 * @param thresholds - Thresholds for padding calculation
 * @param paddings - Padding values
 * @returns Final height with padding (capped at maxHeight)
 */
export const calculateWebViewHeight = (
  contentHeight: number,
  minHeight: number = 200,
  maxHeight: number = 800,
  thresholds?: { small: number; medium: number },
  paddings?: { small: number; medium: number; large: number }
): number => {
  // Calculate padding based on content size
  let padding = 288; // Default: 3 lines padding
  
  if (thresholds && paddings) {
    if (contentHeight < thresholds.small) {
      padding = paddings.small;
    } else if (contentHeight < thresholds.medium) {
      padding = paddings.medium;
    } else {
      padding = paddings.large;
    }
  }
  
  // Calculate height with padding
  const calculatedHeight = Math.ceil(contentHeight) + padding;
  
  // Return height between min and max, allowing scroll for larger content
  return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
};
