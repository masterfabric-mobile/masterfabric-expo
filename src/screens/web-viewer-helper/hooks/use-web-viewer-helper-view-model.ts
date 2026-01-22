/**
 * Web Viewer Helper View Model
 * 
 * Business logic and state management for Web Viewer Helper screen
 */

import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import { useCallback } from 'react';
// @ts-ignore - webViewerHelper export type issue
import { getThemeColors, useTheme, webViewerHelper } from 'masterfabric-expo-core';
import { WebViewTestResult } from '../models/models';
import { useWebViewerHelperStore } from '../store/web-viewer-helper-store';

export function useWebViewerHelperViewModel() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const {
    testInput,
    testResults,
    isLoading,
    currentSource,
    updateTestInput: updateTestInputStore,
    setTestResults,
    setIsLoading,
    setCurrentSource,
    clearResults,
  } = useWebViewerHelperStore();
  
  const { error: showError, warning: showWarning } = useSnackbar();

  // Parse headers helper function
  const parseHeaders = useCallback((headersString: string): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (!headersString || !headersString.trim()) {
      return headers;
    }

    // Parse headers in format: "Key: Value\nKey2: Value2"
    const lines = headersString.split('\n');
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (key && value) {
          headers[key] = value;
        }
      }
    }
    return headers;
  }, []);

  const runAllTests = useCallback(async () => {
    setIsLoading(true);

    const results: WebViewTestResult[] = [];

    try {
      // Validate inputs before running tests
      if (testInput.contentType === 'html' && (!testInput.htmlContent || !testInput.htmlContent.trim())) {
        showWarning(t('helpers.webViewerHelper.validation.emptyHtml'));
        setIsLoading(false);
        return;
      }
      
      if (testInput.contentType === 'url' && (!testInput.urlContent || !testInput.urlContent.trim())) {
        showWarning(t('helpers.webViewerHelper.validation.emptyUrl'));
        setIsLoading(false);
        return;
      }
      
      if (testInput.contentType === 'auto' && (!testInput.htmlContent?.trim() && !testInput.urlContent?.trim())) {
        showWarning(t('helpers.webViewerHelper.validation.emptyContent'));
        setIsLoading(false);
        return;
      }
      // Test isValidUrl - always runs
      try {
        const isValid = webViewerHelper.isValidUrl(testInput.urlContent);
        results.push({
          id: 'isValidUrl',
          functionName: 'isValidUrl',
          input: testInput.urlContent || t('helpers.webViewerHelper.messages.empty'),
          output: isValid ? t('helpers.webViewerHelper.messages.success') : t('helpers.webViewerHelper.messages.invalidUrl'),
          success: isValid,
          description: t('helpers.webViewerHelper.isValidUrl'),
        });
      } catch (error) {
        results.push({
          id: 'isValidUrl',
          functionName: 'isValidUrl',
          input: testInput.urlContent || t('helpers.webViewerHelper.messages.empty'),
          output: `${t('helpers.webViewerHelper.messages.error')}: ${error instanceof Error ? error.message : String(error)}`,
          success: false,
          description: t('helpers.webViewerHelper.isValidUrl'),
        });
      }

      // Test isHtmlContent - always runs
      try {
        const isHtml = webViewerHelper.isHtmlContent(testInput.htmlContent || '');
        const hasContent = testInput.htmlContent && testInput.htmlContent.trim().length > 0;
        results.push({
          id: 'isHtmlContent',
          functionName: 'isHtmlContent',
          input: testInput.htmlContent ? `${testInput.htmlContent.substring(0, 50)}...` : t('helpers.webViewerHelper.messages.empty'),
          output: !hasContent 
            ? t('helpers.webViewerHelper.messages.empty')
            : isHtml 
              ? t('helpers.webViewerHelper.messages.htmlDetected') 
              : t('helpers.webViewerHelper.messages.urlDetected'),
          success: hasContent ? isHtml : false,
          description: t('helpers.webViewerHelper.isHtmlContent'),
        });
      } catch (error) {
        results.push({
          id: 'isHtmlContent',
          functionName: 'isHtmlContent',
          input: testInput.htmlContent ? `${testInput.htmlContent.substring(0, 50)}...` : t('helpers.webViewerHelper.messages.empty'),
          output: `${t('helpers.webViewerHelper.messages.error')}: ${error instanceof Error ? error.message : String(error)}`,
          success: false,
          description: t('helpers.webViewerHelper.isHtmlContent'),
        });
      }

      // Test html() - only if HTML content is provided
      if (testInput.htmlContent && testInput.htmlContent.trim().length > 0) {
        try {
          const source = webViewerHelper.html(testInput.htmlContent, {
            baseUrl: testInput.baseUrl,
            headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
          });
          results.push({
            id: 'html',
            functionName: 'html',
            input: `${testInput.htmlContent.substring(0, 50)}...`,
            output: JSON.stringify(source, null, 2),
            success: true,
            description: t('helpers.webViewerHelper.html'),
            sourceType: 'html',
          });
        } catch (error) {
          results.push({
            id: 'html',
            functionName: 'html',
            input: testInput.htmlContent.substring(0, 50),
            output: `${t('helpers.webViewerHelper.messages.error')}: ${error instanceof Error ? error.message : String(error)}`,
            success: false,
            description: t('helpers.webViewerHelper.html'),
          });
        }
      } else {
        results.push({
          id: 'html',
          functionName: 'html',
          input: t('helpers.webViewerHelper.messages.empty'),
          output: t('helpers.webViewerHelper.messages.notProvided'),
          success: false,
          description: t('helpers.webViewerHelper.html'),
        });
      }

      // Test url() - only if URL content is provided
      if (testInput.urlContent && testInput.urlContent.trim().length > 0) {
        try {
          // React Native WebView doesn't support headers with POST method
          const parsedHeaders = testInput.headers ? parseHeaders(testInput.headers) : undefined;
          const hasHeaders = parsedHeaders && Object.keys(parsedHeaders).length > 0;
          const shouldIncludeHeaders = testInput.method !== 'POST';
          
          const source = webViewerHelper.url(testInput.urlContent, {
            headers: shouldIncludeHeaders ? parsedHeaders : undefined,
            method: testInput.method,
            body: testInput.method === 'POST' ? (testInput.body || undefined) : undefined,
          });
          
          // Create output with warnings if needed
          let output = JSON.stringify(source, null, 2);
          if (testInput.method === 'POST' && hasHeaders) {
            output = `⚠️ ${t('helpers.webViewerHelper.validation.postHeadersNotSupported')}\n\n` + output;
          }
          
          const inputDisplay = testInput.urlContent + 
            (testInput.method ? `\nMethod: ${testInput.method}` : '') +
            (testInput.method === 'POST' && testInput.body ? `\nBody: ${testInput.body.substring(0, 100)}${testInput.body.length > 100 ? '...' : ''}` : '') +
            (testInput.headers ? `\nHeaders: ${testInput.headers.substring(0, 50)}${testInput.headers.length > 50 ? '...' : ''}` : '');
          
          results.push({
            id: 'url',
            functionName: 'url',
            input: inputDisplay,
            output: output,
            success: true,
            description: t('helpers.webViewerHelper.url'),
            sourceType: 'uri',
          });
        } catch (error) {
          results.push({
            id: 'url',
            functionName: 'url',
            input: testInput.urlContent,
            output: `${t('helpers.webViewerHelper.messages.error')}: ${error instanceof Error ? error.message : String(error)}`,
            success: false,
            description: t('helpers.webViewerHelper.url'),
          });
        }
      } else {
        results.push({
          id: 'url',
          functionName: 'url',
          input: t('helpers.webViewerHelper.messages.empty'),
          output: t('helpers.webViewerHelper.messages.notProvided'),
          success: false,
          description: t('helpers.webViewerHelper.url'),
        });
      }

      // Test open() - auto-detect
      const contentToTest = testInput.contentType === 'html' 
        ? testInput.htmlContent 
        : testInput.contentType === 'url' 
        ? testInput.urlContent 
        : testInput.htmlContent || testInput.urlContent;

      if (contentToTest && contentToTest.trim().length > 0) {
        try {
          // React Native WebView doesn't support headers with POST method
          const parsedHeaders = testInput.headers ? parseHeaders(testInput.headers) : undefined;
          const hasHeaders = parsedHeaders && Object.keys(parsedHeaders).length > 0;
          const shouldIncludeHeaders = testInput.method !== 'POST';
          
          const source = webViewerHelper.open(contentToTest, {
            baseUrl: testInput.baseUrl,
            headers: shouldIncludeHeaders ? parsedHeaders : undefined,
            method: testInput.method,
            body: testInput.method === 'POST' ? (testInput.body || undefined) : undefined,
          });
          
          // Create output with warnings if needed
          let output = JSON.stringify(source, null, 2);
          if (testInput.method === 'POST' && hasHeaders) {
            output = `⚠️ ${t('helpers.webViewerHelper.validation.postHeadersNotSupported')}\n\n` + output;
          }
          
          const inputDisplay = contentToTest.substring(0, 100) + 
            (testInput.method ? `\nMethod: ${testInput.method}` : '') +
            (testInput.method === 'POST' && testInput.body ? `\nBody: ${testInput.body.substring(0, 50)}${testInput.body.length > 50 ? '...' : ''}` : '') +
            (testInput.baseUrl ? `\nBase URL: ${testInput.baseUrl}` : '') +
            (testInput.headers ? `\nHeaders: ${testInput.headers.substring(0, 50)}${testInput.headers.length > 50 ? '...' : ''}` : '');
          
          results.push({
            id: 'open',
            functionName: 'open',
            input: inputDisplay,
            output: output,
            success: true,
            description: t('helpers.webViewerHelper.open'),
            sourceType: source.html ? 'html' : 'uri',
          });
        } catch (error) {
          results.push({
            id: 'open',
            functionName: 'open',
            input: contentToTest.substring(0, 100),
            output: `${t('helpers.webViewerHelper.messages.error')}: ${error instanceof Error ? error.message : String(error)}`,
            success: false,
            description: t('helpers.webViewerHelper.open'),
          });
        }
      } else {
        results.push({
          id: 'open',
          functionName: 'open',
          input: t('helpers.webViewerHelper.messages.empty'),
          output: t('helpers.webViewerHelper.messages.notProvided'),
          success: false,
          description: t('helpers.webViewerHelper.open'),
        });
      }

    } catch (error) {
      console.error('Error running web viewer helper tests:', error);
    }

    setTestResults(results);
    setIsLoading(false);
  }, [testInput, setTestResults, setIsLoading, parseHeaders, showWarning]);

  const loadContent = useCallback(() => {
    try {
      // Validation based on content type
      if (testInput.contentType === 'html') {
        if (!testInput.htmlContent || !testInput.htmlContent.trim()) {
          showWarning(t('helpers.webViewerHelper.validation.emptyHtml'));
          setCurrentSource(undefined);
          return;
        }
      } else if (testInput.contentType === 'url') {
        if (!testInput.urlContent || !testInput.urlContent.trim()) {
          showWarning(t('helpers.webViewerHelper.validation.emptyUrl'));
          setCurrentSource(undefined);
          return;
        }
        
        const trimmedUrl = testInput.urlContent.trim();
        if (!webViewerHelper.isValidUrl(trimmedUrl)) {
          showError(t('helpers.webViewerHelper.validation.invalidUrl'));
          setCurrentSource(undefined);
          return;
        }
      } else {
        // Auto-detect
        const content = testInput.htmlContent || testInput.urlContent;
        if (!content || !content.trim()) {
          showWarning(t('helpers.webViewerHelper.validation.emptyContent'));
          setCurrentSource(undefined);
          return;
        }
        
        const trimmedContent = content.trim();
        
        // If it looks like a URL, validate it
        if (webViewerHelper.isValidUrl(trimmedContent)) {
          // POST body is optional - can be empty
        } else if (!webViewerHelper.isHtmlContent(trimmedContent)) {
          // Neither HTML nor URL - treat as HTML (fallback)
          // This allows single characters or plain text to be rendered as HTML
        }
      }

      let source: {
        uri?: string;
        html?: string;
        baseUrl?: string;
        headers?: Record<string, string>;
        method?: 'GET' | 'POST';
        body?: string;
      };

      if (testInput.contentType === 'html' && testInput.htmlContent) {
        source = webViewerHelper.html(testInput.htmlContent.trim(), {
          baseUrl: testInput.baseUrl?.trim() || undefined,
          headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
        });
      } else if (testInput.contentType === 'url' && testInput.urlContent) {
        // React Native WebView doesn't support headers with POST method
        const parsedHeaders = testInput.headers ? parseHeaders(testInput.headers) : undefined;
        const hasHeaders = parsedHeaders && Object.keys(parsedHeaders).length > 0;
        
        if (testInput.method === 'POST' && hasHeaders) {
          showWarning(t('helpers.webViewerHelper.validation.postHeadersNotSupported') || 'Headers are not supported with POST method. Headers will be ignored.');
        }
        
        source = webViewerHelper.url(testInput.urlContent.trim(), {
          // Only include headers for GET requests
          headers: testInput.method === 'POST' ? undefined : parsedHeaders,
          method: testInput.method,
          // Only include body for POST requests
          body: testInput.method === 'POST' ? (testInput.body?.trim() || undefined) : undefined,
        });
      } else {
        // Auto-detect - use htmlContent as primary (it's synced with urlContent in auto mode)
        const content = (testInput.htmlContent || testInput.urlContent)?.trim();
        if (content) {
          // Check if content is HTML or URL
          // If neither, treat as HTML (fallback) - same behavior as HTML content mode
          if (webViewerHelper.isHtmlContent(content)) {
            // It's HTML, use html() directly
            source = webViewerHelper.html(content, {
              baseUrl: testInput.baseUrl?.trim() || undefined,
              headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
            });
          } else if (webViewerHelper.isValidUrl(content)) {
            // It's a valid URL, use url() directly
            // React Native WebView doesn't support headers with POST method
            const parsedHeaders = testInput.headers ? parseHeaders(testInput.headers) : undefined;
            const hasHeaders = parsedHeaders && Object.keys(parsedHeaders).length > 0;
            
            if (testInput.method === 'POST' && hasHeaders) {
              showWarning(t('helpers.webViewerHelper.validation.postHeadersNotSupported') || 'Headers are not supported with POST method. Headers will be ignored.');
            }
            
            source = webViewerHelper.url(content, {
              // Only include headers for GET requests
              headers: testInput.method === 'POST' ? undefined : parsedHeaders,
              method: testInput.method,
              // Only include body for POST requests
              body: testInput.method === 'POST' ? (testInput.body?.trim() || undefined) : undefined,
            });
          } else {
            // Neither HTML nor URL - treat as HTML (fallback)
            // This allows single characters or plain text to be rendered as HTML
            source = webViewerHelper.html(content, {
              baseUrl: testInput.baseUrl?.trim() || undefined,
              headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
            });
          }
        } else {
          showWarning(t('helpers.webViewerHelper.validation.emptyContent'));
          return;
        }
      }

      if (source && (source.uri || source.html)) {
        setCurrentSource(source);
      } else {
        showError(t('helpers.webViewerHelper.validation.loadError') || 'Failed to create WebView source. Please check your input.');
        setCurrentSource(undefined);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error loading content:', error);
      showError(`${t('helpers.webViewerHelper.validation.loadError')}: ${errorMessage}`);
      setCurrentSource(undefined);
    }
  }, [testInput, setCurrentSource, parseHeaders, showError, showWarning]);

  return {
    testInput,
    testResults,
    isLoading,
    currentSource,
    colors,
    runAllTests,
    loadContent,
    updateTestInput: updateTestInputStore,
    clearResults,
  };
}
