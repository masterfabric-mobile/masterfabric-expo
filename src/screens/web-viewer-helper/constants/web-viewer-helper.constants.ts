/**
 * Web Viewer Helper Constants
 * 
 * Constants used across Web Viewer Helper components
 */

/**
 * Available content types for WebView
 */
export const CONTENT_TYPES = ['html', 'url', 'auto'] as const;

/**
 * Available HTTP methods
 */
export const HTTP_METHODS = ['GET', 'POST'] as const;

/**
 * Content type values
 */
export type ContentType = typeof CONTENT_TYPES[number];

/**
 * HTTP method values
 */
export type HttpMethod = typeof HTTP_METHODS[number];

/**
 * WebView Preview Constants
 */
export const WEB_VIEW_PREVIEW = {
  // Initial height
  INITIAL_HEIGHT: 100,
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 800, // Maximum height before scrolling
  
  // Height measurement
  MAX_ATTEMPTS_DARK_THEME: 10,
  MAX_ATTEMPTS_CONTENT: 15,
  MEASURE_DELAY_DARK_THEME: 50,
  MEASURE_DELAY_CONTENT: 100,
  INITIAL_MEASURE_DELAY: 100,
  
  // Timeouts for injection
  DARK_THEME_INJECTION_DELAY: 50,
  DARK_THEME_MEASURE_DELAY: 400,
  FONT_STYLE_INJECTION_DELAY: 50,
  FONT_STYLE_MEASURE_DELAY: 300,
  URL_CONTENT_MEASURE_DELAY: 200,
  
  // Padding calculation - exactly 3 lines of padding (96px font * 2 line-height * 3 = 576px)
  SMALL_CONTENT_THRESHOLD: 50,
  MEDIUM_CONTENT_THRESHOLD: 200,
  SMALL_CONTENT_PADDING: 96, // 1 line padding for small content
  MEDIUM_CONTENT_PADDING: 192, // 2 lines padding for medium content
  LARGE_CONTENT_PADDING: 288, // 3 lines padding for large content
} as const;
