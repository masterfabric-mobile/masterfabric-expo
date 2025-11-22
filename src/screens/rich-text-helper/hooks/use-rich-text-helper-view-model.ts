import { t } from '@/src/shared/i18n';
import {
  convertHtmlListToText,
  createFormattedText,
  extractEmails,
  extractHashtags,
  extractHtmlLinks,
  extractMentions,
  extractPhoneNumbers,
  extractUrls,
  htmlToPlainText,
  linkifyText,
  parseHtmlToText,
  parseMarkdown,
  sanitizeHtml,
  stripHtmlTags,
  unescapeHtmlEntities,
} from 'masterfabric-expo-core';
import { useCallback } from 'react';
import { RichTextTestInput, RichTextTestResult } from '../models/rich-text-helper-models';
import { useRichTextHelperStore } from '../store/rich-text-helper-store';

export function useRichTextHelperViewModel() {
  const {
    testInput,
    testResults,
    isLoading,
    setTestInput,
    setTestResults,
    setIsLoading,
  } = useRichTextHelperStore();

  const runAllTests = useCallback(() => {
    setIsLoading(true);

    const results: RichTextTestResult[] = [];
    const { htmlInput, markdownInput, textInput } = testInput;

    try {
      // HTML Processing Functions
      if (htmlInput) {
        const parsedHtml = parseHtmlToText(htmlInput);
        results.push({
          id: 'parseHtmlToText',
          functionName: 'parseHtmlToText',
          input: htmlInput,
          output: JSON.stringify(parsedHtml, null, 2),
          description: t('helpers.richTextHelper.parseHtmlToText'),
        });

        results.push({
          id: 'htmlToPlainText',
          functionName: 'htmlToPlainText',
          input: htmlInput,
          output: htmlToPlainText(htmlInput),
          description: t('helpers.richTextHelper.htmlToPlainText'),
        });

        results.push({
          id: 'sanitizeHtml',
          functionName: 'sanitizeHtml',
          input: htmlInput,
          output: sanitizeHtml(htmlInput),
          description: t('helpers.richTextHelper.sanitizeHtml'),
        });

        results.push({
          id: 'stripHtmlTags',
          functionName: 'stripHtmlTags',
          input: htmlInput,
          output: stripHtmlTags(htmlInput, true),
          description: t('helpers.richTextHelper.stripHtmlTags'),
        });

        results.push({
          id: 'unescapeHtmlEntities',
          functionName: 'unescapeHtmlEntities',
          input: 'Hello &amp; &quot;World&quot; &lt;test&gt;',
          output: unescapeHtmlEntities('Hello &amp; &quot;World&quot; &lt;test&gt;'),
          description: t('helpers.richTextHelper.unescapeHtmlEntities'),
        });

        const links = extractHtmlLinks(htmlInput);
        results.push({
          id: 'extractHtmlLinks',
          functionName: 'extractHtmlLinks',
          input: htmlInput,
          output: JSON.stringify(links, null, 2),
          description: t('helpers.richTextHelper.extractHtmlLinks'),
        });

        const listHtml = '<ul><li>Item 1</li><li>Item 2</li></ul>';
        const listItems = convertHtmlListToText(listHtml);
        results.push({
          id: 'convertHtmlListToText',
          functionName: 'convertHtmlListToText',
          input: listHtml,
          output: JSON.stringify(listItems, null, 2),
          description: t('helpers.richTextHelper.convertHtmlListToText'),
        });
      }

      // Markdown Processing Functions
      if (markdownInput) {
        const parsedMarkdown = parseMarkdown(markdownInput);
        results.push({
          id: 'parseMarkdown',
          functionName: 'parseMarkdown',
          input: markdownInput,
          output: JSON.stringify(parsedMarkdown, null, 2),
          description: t('helpers.richTextHelper.parseMarkdown'),
        });
      }

      // Text Pattern Extraction Functions
      if (textInput) {
        const urls = extractUrls(textInput);
        results.push({
          id: 'extractUrls',
          functionName: 'extractUrls',
          input: textInput,
          output: JSON.stringify(urls, null, 2),
          description: t('helpers.richTextHelper.extractUrls'),
        });

        const mentions = extractMentions(textInput);
        results.push({
          id: 'extractMentions',
          functionName: 'extractMentions',
          input: textInput,
          output: JSON.stringify(mentions, null, 2),
          description: t('helpers.richTextHelper.extractMentions'),
        });

        const hashtags = extractHashtags(textInput);
        results.push({
          id: 'extractHashtags',
          functionName: 'extractHashtags',
          input: textInput,
          output: JSON.stringify(hashtags, null, 2),
          description: t('helpers.richTextHelper.extractHashtags'),
        });

        const emailText = 'Contact us at info@example.com or support@test.com';
        const emails = extractEmails(emailText);
        results.push({
          id: 'extractEmails',
          functionName: 'extractEmails',
          input: emailText,
          output: JSON.stringify(emails, null, 2),
          description: t('helpers.richTextHelper.extractEmails'),
        });

        const phoneText = 'Call us at +1-555-123-4567 or (555) 987-6543';
        const phones = extractPhoneNumbers(phoneText);
        results.push({
          id: 'extractPhoneNumbers',
          functionName: 'extractPhoneNumbers',
          input: phoneText,
          output: JSON.stringify(phones, null, 2),
          description: t('helpers.richTextHelper.extractPhoneNumbers'),
        });
      }

      // Text Formatting Functions
      const formattedParts = [
        { text: 'Hello ', style: {} },
        { text: 'World', style: { fontWeight: 'bold', color: 'red' } },
        { text: '!', style: {} },
      ];
      const formatted = createFormattedText(formattedParts);
      results.push({
        id: 'createFormattedText',
        functionName: 'createFormattedText',
        input: JSON.stringify(formattedParts, null, 2),
        output: JSON.stringify(formatted, null, 2),
        description: t('helpers.richTextHelper.createFormattedText'),
      });

      const linkifyInput = 'Visit https://example.com for more info';
      const linkified = linkifyText(linkifyInput);
      results.push({
        id: 'linkifyText',
        functionName: 'linkifyText',
        input: linkifyInput,
        output: JSON.stringify(linkified, null, 2),
        description: t('helpers.richTextHelper.linkifyText'),
      });
    } catch {
      // Error handled silently, results will be empty
    }

    setTestResults(results);
    setIsLoading(false);
  }, [testInput, setTestResults, setIsLoading]);

  const updateTestInput = useCallback((updates: Partial<RichTextTestInput>) => {
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

