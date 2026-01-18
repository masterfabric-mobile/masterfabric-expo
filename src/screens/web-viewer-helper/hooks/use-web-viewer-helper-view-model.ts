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
        const isHtml = webViewerHelper.isHtmlContent(testInput.htmlContent);
        results.push({
          id: 'isHtmlContent',
          functionName: 'isHtmlContent',
          input: testInput.htmlContent ? `${testInput.htmlContent.substring(0, 50)}...` : t('helpers.webViewerHelper.messages.empty'),
          output: isHtml ? t('helpers.webViewerHelper.messages.htmlDetected') : t('helpers.webViewerHelper.messages.urlDetected'),
          success: true,
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
          const source = webViewerHelper.url(testInput.urlContent, {
            headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
            method: testInput.method,
            body: testInput.body,
          });
          results.push({
            id: 'url',
            functionName: 'url',
            input: testInput.urlContent,
            output: JSON.stringify(source, null, 2),
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
          const source = webViewerHelper.open(contentToTest, {
            baseUrl: testInput.baseUrl,
            headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
            method: testInput.method,
            body: testInput.body,
          });
          results.push({
            id: 'open',
            functionName: 'open',
            input: contentToTest.substring(0, 100),
            output: JSON.stringify(source, null, 2),
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

      // Test various URL formats (http, https, relative)
      try {
        const urlFormats = [
          { input: 'https://example.com', expected: true, label: 'https format' },
          { input: 'http://example.com', expected: true, label: 'http format' },
          { input: 'https://example.com/path/to/page', expected: true, label: 'https with path' },
          { input: 'http://example.com:8080', expected: true, label: 'http with port' },
        ];
        
        urlFormats.forEach((testCase, index) => {
          const result = webViewerHelper.isValidUrl(testCase.input);
          results.push({
            id: `isValidUrl-format-${index}`,
            functionName: `isValidUrl (${testCase.label})`,
            input: testCase.input,
            output: result === testCase.expected 
              ? t('helpers.webViewerHelper.messages.success') 
              : `${t('helpers.webViewerHelper.messages.failure')}: Expected ${testCase.expected}, got ${result}`,
            success: result === testCase.expected,
            description: t('helpers.webViewerHelper.isValidUrl'),
          });
        });
      } catch {
        // Skip format tests on error
      }

      // Test various HTML content formats
      try {
        const htmlFormats = [
          { input: '<html><body>Test</body></html>', expected: true, label: 'full HTML document' },
          { input: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>', expected: true, label: 'HTML with DOCTYPE' },
          { input: '<div><p>Paragraph</p><h1>Title</h1></div>', expected: true, label: 'HTML with nested tags' },
          { input: '<p>Simple paragraph</p>', expected: true, label: 'simple HTML tag' },
        ];
        
        htmlFormats.forEach((testCase, index) => {
          const result = webViewerHelper.isHtmlContent(testCase.input);
          results.push({
            id: `isHtmlContent-format-${index}`,
            functionName: `isHtmlContent (${testCase.label})`,
            input: testCase.input.substring(0, 50) + '...',
            output: result === testCase.expected 
              ? t('helpers.webViewerHelper.messages.success') 
              : `${t('helpers.webViewerHelper.messages.failure')}: Expected ${testCase.expected}, got ${result}`,
            success: result === testCase.expected,
            description: t('helpers.webViewerHelper.isHtmlContent'),
          });
        });
      } catch {
        // Skip format tests on error
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
          return;
        }
      } else if (testInput.contentType === 'url') {
        if (!testInput.urlContent || !testInput.urlContent.trim()) {
          showWarning(t('helpers.webViewerHelper.validation.emptyUrl'));
          return;
        }
        if (!webViewerHelper.isValidUrl(testInput.urlContent.trim())) {
          showError(t('helpers.webViewerHelper.validation.invalidUrl'));
          return;
        }
      } else {
        // Auto-detect
        const content = testInput.htmlContent || testInput.urlContent;
        if (!content || !content.trim()) {
          showWarning(t('helpers.webViewerHelper.validation.emptyContent'));
          return;
        }
        // If it looks like a URL, validate it
        // If it's not HTML and not a valid URL, treat it as HTML (fallback)
        // This matches the behavior of HTML content mode where any content is accepted
        const trimmedContent = content.trim();
        if (!webViewerHelper.isHtmlContent(trimmedContent) && !webViewerHelper.isValidUrl(trimmedContent)) {
          // Treat as HTML content (fallback) - same behavior as HTML content mode
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
        source = webViewerHelper.url(testInput.urlContent.trim(), {
          headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
          method: testInput.method,
          body: testInput.body?.trim() || undefined,
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
            source = webViewerHelper.url(content, {
              headers: testInput.headers ? parseHeaders(testInput.headers) : undefined,
              method: testInput.method,
              body: testInput.body?.trim() || undefined,
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

      setCurrentSource(source);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error loading content:', error);
      showError(`${t('helpers.webViewerHelper.validation.loadError')}: ${errorMessage}`);
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
