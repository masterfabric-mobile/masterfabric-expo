/**
 * Web Viewer Helper Models
 * 
 * Type definitions for Web Viewer Helper screen components and state management
 */

// WebViewSource is defined inline to avoid import issues
// It matches the WebViewSource from web_viewer_helper
export interface WebViewSource {
  uri?: string;
  html?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST';
  body?: string;
}

export interface WebViewTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  success: boolean;
  description: string;
  sourceType?: 'html' | 'uri';
}

export interface WebViewTestInput {
  contentType: 'html' | 'url' | 'auto';
  htmlContent: string;
  urlContent: string;
  baseUrl?: string;
  headers?: string;
  method?: 'GET' | 'POST';
  body?: string;
}

export interface WebViewerHelperState {
  testInput: WebViewTestInput;
  testResults: WebViewTestResult[];
  isLoading: boolean;
  currentSource?: WebViewSource;
}

export interface WebViewInputFieldProps {
  testInput: WebViewTestInput;
  onInputChange: (updates: Partial<WebViewTestInput>) => void;
  onRunTests: () => void;
  onLoadContent: () => void;
  isLoading: boolean;
}

export interface WebViewTestCardProps {
  result: WebViewTestResult;
}

export interface WebViewPreviewProps {
  source: WebViewSource;
}
