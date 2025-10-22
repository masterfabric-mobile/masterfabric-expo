import { t } from '@/src/shared/i18n';
import * as StringHelpers from 'masterfabric-expo-core';
import { useCallback } from 'react';
import { StringTestInput, StringTestResult } from '../models/string-helper-models';
import { useStringHelperStore } from '../store/string-helper-store';

export function useStringHelperViewModel() {
  const { 
    testInput, 
    testResults, 
    isLoading, 
    setTestInput, 
    setTestResults, 
    setIsLoading 
  } = useStringHelperStore();

  const runAllTests = useCallback(() => {
    setIsLoading(true);
    
    const results: StringTestResult[] = [];
    const { text, length = 10, suffix = '...', currency = 'USD', decimals = 2, count = 1 } = testInput;

    try {
      // Basic string functions
      results.push({
        id: 'capitalize',
        functionName: 'capitalize',
        input: text,
        output: StringHelpers.capitalize(text),
        description: t('helpers.stringHelper.capitalize')
      });

      results.push({
        id: 'truncate',
        functionName: 'truncate',
        input: `${text} (length: ${length}, suffix: "${suffix}")`,
        output: StringHelpers.truncate(text, length, suffix),
        description: t('helpers.stringHelper.truncate')
      });

      // Validation functions
      results.push({
        id: 'isEmail',
        functionName: 'isEmail',
        input: text,
        output: StringHelpers.isEmail(text) ? 'true' : 'false',
        description: t('helpers.stringHelper.isEmail')
      });

      results.push({
        id: 'isUrl',
        functionName: 'isUrl',
        input: text,
        output: StringHelpers.isUrl(text) ? 'true' : 'false',
        description: t('helpers.stringHelper.isUrl')
      });

      // Formatting functions
      results.push({
        id: 'formatCurrency',
        functionName: 'formatCurrency',
        input: `123.45 (${currency})`,
        output: StringHelpers.formatCurrency(123.45, currency),
        description: t('helpers.stringHelper.formatCurrency')
      });

      results.push({
        id: 'formatNumber',
        functionName: 'formatNumber',
        input: `123.456789 (decimals: ${decimals})`,
        output: StringHelpers.formatNumber(123.456789, decimals),
        description: t('helpers.stringHelper.formatNumber')
      });

      // Case conversion functions
      results.push({
        id: 'kebabCase',
        functionName: 'kebabCase',
        input: text,
        output: StringHelpers.kebabCase(text),
        description: t('helpers.stringHelper.kebabCase')
      });

      results.push({
        id: 'snakeCase',
        functionName: 'snakeCase',
        input: text,
        output: StringHelpers.snakeCase(text),
        description: t('helpers.stringHelper.snakeCase')
      });

      results.push({
        id: 'camelCase',
        functionName: 'camelCase',
        input: text,
        output: StringHelpers.camelCase(text),
        description: t('helpers.stringHelper.camelCase')
      });

      results.push({
        id: 'pascalCase',
        functionName: 'pascalCase',
        input: text,
        output: StringHelpers.pascalCase(text),
        description: t('helpers.stringHelper.pascalCase')
      });

      // Other functions
      results.push({
        id: 'pluralize',
        functionName: 'pluralize',
        input: `${text} (count: ${count})`,
        output: StringHelpers.pluralize(text, count),
        description: t('helpers.stringHelper.pluralize')
      });

      const htmlText = '<p>Hello <strong>World</strong>!</p>';
      results.push({
        id: 'stripHtml',
        functionName: 'stripHtml',
        input: htmlText,
        output: StringHelpers.stripHtml(htmlText),
        description: t('helpers.stringHelper.stripHtml')
      });

      const htmlSpecialChars = 'Hello & "World" <test>';
      results.push({
        id: 'escapeHtml',
        functionName: 'escapeHtml',
        input: htmlSpecialChars,
        output: StringHelpers.escapeHtml(htmlSpecialChars),
        description: t('helpers.stringHelper.escapeHtml')
      });

      const escapedHtml = 'Hello &amp; &quot;World&quot; &lt;test&gt;';
      results.push({
        id: 'unescapeHtml',
        functionName: 'unescapeHtml',
        input: escapedHtml,
        output: StringHelpers.unescapeHtml(escapedHtml),
        description: t('helpers.stringHelper.unescapeHtml')
      });

    } catch (error) {
      console.error('Error running string helper tests:', error);
    }

    setTestResults(results);
    setIsLoading(false);
  }, [testInput, setTestResults, setIsLoading]);

  const updateTestInput = useCallback((updates: Partial<StringTestInput>) => {
    setTestInput({ ...testInput, ...updates });
  }, [testInput, setTestInput]);

  return {
    testInput,
    testResults,
    isLoading,
    runAllTests,
    updateTestInput,
  };
}
