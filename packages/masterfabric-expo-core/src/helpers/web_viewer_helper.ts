/**
 * Web Viewer Helper
 * 
 * Provides a unified interface for displaying HTML content and web URLs
 * within the app using WebView. Perfect for Terms of Conditions, Privacy Policy,
 * and other web content.
 * 
 * This helper provides convenient methods for common web viewing operations with 
 * consistent naming and behavior across iOS, Android, and Web platforms.
 * 
 * Features:
 * - Display HTML strings directly in WebView
 * - Open web URLs within the app
 * - Auto-detect HTML vs URL content
 * - URL validation and normalization
 * - Support for custom headers and base URLs
 * - Type-safe with TypeScript
 * 
 * @example
 * ```typescript
 * import { webViewerHelper } from 'masterfabric-expo-core';
 * import { WebView } from 'react-native-webview';
 * 
 * // Display HTML content
 * const htmlSource = webViewerHelper.html('<h1>Hello World!</h1>');
 * <WebView source={htmlSource} style={{ flex: 1 }} />
 * 
 * // Open a web URL
 * const urlSource = webViewerHelper.url('https://example.com');
 * <WebView source={urlSource} style={{ flex: 1 }} />
 * 
 * // Auto-detect HTML or URL
 * const source = webViewerHelper.open(content);
 * <WebView source={source} style={{ flex: 1 }} />
 * ```
 */

import { loggerHelper } from './logger_helper';
import { isUrl } from './string_helper';

// ---- Types ----

/**
 * WebView source object compatible with react-native-webview
 * 
 * This type matches the source prop expected by react-native-webview's WebView component.
 * It supports both HTML content and URL-based sources.
 */
export interface WebViewSource {
  /** URI to load (for URL-based sources) */
  uri?: string;
  /** HTML content to display (for HTML-based sources) */
  html?: string;
  /** Base URL for resolving relative URLs in HTML content */
  baseUrl?: string;
  /** HTTP headers to send with the request (URL sources only) */
  headers?: Record<string, string>;
  /** HTTP method (GET or POST) */
  method?: 'GET' | 'POST';
  /** Request body (for POST requests) */
  body?: string;
}

/**
 * Options for HTML content rendering
 */
export interface HtmlOptions {
  /** Base URL for resolving relative URLs in HTML content */
  baseUrl?: string;
  /** HTTP headers (not typically used for HTML content, but available for consistency) */
  headers?: Record<string, string>;
}

/**
 * Options for URL content loading
 */
export interface UrlOptions {
  /** HTTP headers to send with the request */
  headers?: Record<string, string>;
  /** HTTP method (GET or POST) */
  method?: 'GET' | 'POST';
  /** Request body (for POST requests) */
  body?: string;
}

/**
 * Unified options for both HTML and URL content
 */
export interface WebViewOptions extends HtmlOptions, UrlOptions {
  // Common options inherited from HtmlOptions and UrlOptions
}

// ---- Web Viewer Helper Class ----

/**
 * Web Viewer Helper Class
 * 
 * Provides convenient methods for creating WebView sources from HTML content
 * or URLs. All methods return WebViewSource objects that can be used directly
 * with react-native-webview's WebView component.
 * 
 * Platform Support:
 * - iOS: Full support via react-native-webview
 * - Android: Full support via react-native-webview
 * - Web: Limited support (WebView may not work on web platform)
 */
class WebViewerHelper {
  /**
   * Create WebView source from HTML content
   * 
   * Creates a WebViewSource object from an HTML string. This is useful for
   * displaying static HTML content like Terms of Conditions or Privacy Policy.
   * 
   * @param html - HTML string to display
   * @param options - Optional configuration (baseUrl, headers)
   * @returns WebViewSource object for use with WebView component
   * 
   * @example
   * ```typescript
   * const termsHtml = `
   *   <html>
   *     <head>
   *       <meta name="viewport" content="width=device-width, initial-scale=1.0">
   *       <style>
   *         body { font-family: -apple-system, sans-serif; padding: 20px; }
   *       </style>
   *     </head>
   *     <body>
   *       <h1>Terms of Conditions</h1>
   *       <p>By using this app, you agree to...</p>
   *     </body>
   *   </html>
   * `;
   * 
   * const source = webViewerHelper.html(termsHtml, {
   *   baseUrl: 'https://example.com'
   * });
   * 
   * <WebView source={source} style={{ flex: 1 }} />
   * ```
   */
  html(html: string, options?: HtmlOptions): WebViewSource {
    try {
      if (!html || !html.trim()) {
        try {
          loggerHelper.warning('Empty HTML content provided to webViewerHelper.html');
        } catch {
          console.warn('Empty HTML content provided to webViewerHelper.html');
        }
        return { html: '' };
      }

      const source: WebViewSource = {
        html: html.trim(),
      };

      if (options?.baseUrl) {
        source.baseUrl = options.baseUrl;
      }

      if (options?.headers && Object.keys(options.headers).length > 0) {
        source.headers = options.headers;
      }

      try {
        loggerHelper.debug('Created WebView source from HTML', {
          htmlLength: html.length,
          hasBaseUrl: !!options?.baseUrl,
          hasHeaders: !!options?.headers,
        });
      } catch {
        // Logger not initialized, skip logging
      }

      return source;
    } catch (error) {
      try {
        loggerHelper.error('Error creating HTML WebView source', {
          error: error instanceof Error ? error.message : String(error),
        });
      } catch {
        console.error('Error creating HTML WebView source:', error);
      }
      return { html: '' };
    }
  }

  /**
   * Create WebView source from URL
   * 
   * Creates a WebViewSource object from a URL string. This is useful for
   * loading external web pages within the app.
   * 
   * @param url - URL to load (must be a valid URL)
   * @param options - Optional configuration (headers, method, body)
   * @returns WebViewSource object for use with WebView component
   * @throws Error if URL is invalid
   * 
   * @example
   * ```typescript
   * // Simple URL
   * const source = webViewerHelper.url('https://example.com');
   * <WebView source={source} style={{ flex: 1 }} />
   * 
   * // URL with custom headers
   * const source = webViewerHelper.url('https://api.example.com/data', {
   *   headers: {
   *     'Authorization': 'Bearer token123',
   *     'Content-Type': 'application/json'
   *   }
   * });
   * 
   * // POST request with body
   * const source = webViewerHelper.url('https://api.example.com/submit', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ data: 'value' })
   * });
   * ```
   */
  url(urlString: string, options?: UrlOptions): WebViewSource {
    try {
      if (!urlString || !urlString.trim()) {
        const errorMsg = 'Empty URL provided to webViewerHelper.url';
        try {
          loggerHelper.warning(errorMsg);
        } catch {
          console.warn(errorMsg);
        }
        throw new Error(errorMsg);
      }

      const trimmedUrl = urlString.trim();

      // Validate URL
      if (!this.isValidUrl(trimmedUrl)) {
        const errorMsg = `Invalid URL: ${trimmedUrl}`;
        try {
          loggerHelper.error(errorMsg);
        } catch {
          console.error(errorMsg);
        }
        throw new Error(errorMsg);
      }

      const source: WebViewSource = {
        uri: trimmedUrl,
      };

      if (options?.headers && Object.keys(options.headers).length > 0) {
        source.headers = options.headers;
      }

      if (options?.method) {
        source.method = options.method;
      }

      if (options?.body) {
        source.body = options.body;
      }

      try {
        loggerHelper.debug('Created WebView source from URL', {
          url: trimmedUrl,
          method: options?.method || 'GET',
          hasHeaders: !!options?.headers,
          hasBody: !!options?.body,
        });
      } catch {
        // Logger not initialized, skip logging
      }

      return source;
    } catch (error) {
      try {
        loggerHelper.error('Error creating URL WebView source', {
          url: urlString,
          error: error instanceof Error ? error.message : String(error),
        });
      } catch {
        console.error('Error creating URL WebView source:', error);
      }
      throw error;
    }
  }

  /**
   * Auto-detect content type (HTML or URL) and create WebView source
   * 
   * Automatically detects whether the provided content is HTML or a URL,
   * then creates the appropriate WebViewSource object.
   * 
   * Detection logic:
   * - If content starts with `<html`, `<!DOCTYPE`, or `<body`, it's treated as HTML
   * - If content contains HTML tags (`<` and `>`), it's treated as HTML
   * - Otherwise, it's treated as a URL
   * 
   * @param content - HTML string or URL
   * @param options - Optional configuration (applied based on detected type)
   * @returns WebViewSource object for use with WebView component
   * 
   * @example
   * ```typescript
   * // Auto-detects as HTML
   * const source1 = webViewerHelper.open('<html><body>Hello</body></html>');
   * 
   * // Auto-detects as URL
   * const source2 = webViewerHelper.open('https://example.com');
   * 
   * // With options
   * const source3 = webViewerHelper.open(content, {
   *   baseUrl: 'https://example.com',
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   * ```
   */
  open(content: string, options?: WebViewOptions): WebViewSource {
    try {
      if (!content || !content.trim()) {
        const errorMsg = 'Empty content provided to webViewerHelper.open';
        try {
          loggerHelper.warning(errorMsg);
        } catch {
          console.warn(errorMsg);
        }
        throw new Error(errorMsg);
      }

      if (this.isHtmlContent(content)) {
        try {
          loggerHelper.debug('Auto-detected content as HTML', {
            contentLength: content.length,
          });
        } catch {
          // Logger not initialized
        }
        return this.html(content, options);
      } else {
        try {
          loggerHelper.debug('Auto-detected content as URL', {
            url: content.trim(),
          });
        } catch {
          // Logger not initialized
        }
        return this.url(content, options);
      }
    } catch (error) {
      try {
        loggerHelper.error('Error in webViewerHelper.open', {
          contentLength: content?.length || 0,
          error: error instanceof Error ? error.message : String(error),
        });
      } catch {
        console.error('Error in webViewerHelper.open:', error);
      }
      throw error;
    }
  }

  // ---- Utility Methods ----

  /**
   * Check if string is a valid URL for WebView usage
   * 
   * Validates whether a string is a valid URL format suitable for WebView.
   * Uses the string_helper's isUrl function as base validation, then adds
   * WebView-specific checks (e.g., stricter protocol validation).
   * 
   * @param urlString - The URL string to validate
   * @returns True if the URL is valid for WebView, false otherwise
   * 
   * @example
   * ```typescript
   * webViewerHelper.isValidUrl('https://example.com'); // true
   * webViewerHelper.isValidUrl('https:google.com'); // false (missing //)
   * webViewerHelper.isValidUrl('not-a-url'); // false
   * ```
   */
  isValidUrl(urlString: string): boolean {
    if (!urlString) return false;
    
    const trimmed = urlString.trim();
    if (!trimmed) return false;
    
    // Basic format check: must start with http:// or https://
    if (!trimmed.match(/^https?:\/\//i)) {
      return false;
    }
    
    try {
      const url = new URL(trimmed);
      // Additional validation: must have a valid hostname
      if (!url.hostname || url.hostname.length === 0) {
        return false;
      }
      // Hostname should contain at least one dot (for domain) or be localhost
      if (url.hostname !== 'localhost' && !url.hostname.includes('.')) {
        return false;
      }
      // Ensure protocol is http or https (WebView requirement)
      const protocol = url.protocol.toLowerCase();
      if (protocol !== 'http:' && protocol !== 'https:') {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Detect if content is HTML
   * 
   * Checks if the provided content appears to be HTML by looking for
   * common HTML patterns.
   * 
   * Detection criteria:
   * - Content starts with `<html`, `<!DOCTYPE`, or `<body`
   * - Content contains HTML tags (contains both `<` and `>`)
   * 
   * @param content - The content to check
   * @returns True if content appears to be HTML, false otherwise
   * 
   * @example
   * ```typescript
   * webViewerHelper.isHtmlContent('<html><body>Hello</body></html>'); // true
   * webViewerHelper.isHtmlContent('https://example.com'); // false
   * ```
   */
  isHtmlContent(content: string): boolean {
    if (!content || !content.trim()) {
      return false;
    }

    const trimmed = content.trim();

    // Check for HTML document structure
    if (
      trimmed.startsWith('<html') ||
      trimmed.startsWith('<!DOCTYPE') ||
      trimmed.startsWith('<!doctype') ||
      trimmed.startsWith('<body') ||
      trimmed.startsWith('<Body')
    ) {
      return true;
    }

    // Check for HTML tags (contains both < and >)
    if (trimmed.includes('<') && trimmed.includes('>')) {
      // Additional check: ensure it's not just a URL with query parameters
      // URLs with query params might contain < and > but aren't HTML
      if (!trimmed.match(/^https?:\/\//)) {
        return true;
      }
    }

    return false;
  }
}

// ---- Export ----

/**
 * Singleton instance of WebViewerHelper
 * 
 * This is the main export for using the Web Viewer Helper.
 * All methods are available on this instance.
 * 
 * @example
 * ```typescript
 * import { webViewerHelper } from 'masterfabric-expo-core';
 * 
 * const source = webViewerHelper.html('<h1>Hello</h1>');
 * ```
 */
export const webViewerHelper = new WebViewerHelper();

/**
 * WebViewerHelper class export
 * 
 * Exported for advanced usage, such as creating custom instances
 * or extending the class functionality.
 */
export { WebViewerHelper };
