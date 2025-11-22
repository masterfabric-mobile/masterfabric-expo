/**
 * Utility functions for Rich Text Helper components
 */

import { t } from '@/src/shared/i18n';

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return `${t('helpers.richTextHelper.error')}: ${errorMessage}`;
};

/**
 * Format style information for display
 */
export const formatStyleInfo = (style: Record<string, any>): string => {
  if (!style || Object.keys(style).length === 0) {
    return '';
  }
  return ` [${Object.entries(style).map(([k, v]) => `${k}: ${v}`).join(', ')}]`;
};

/**
 * Format formatted text parts for display
 */
export const formatFormattedTextParts = (
  parts: { text: string; style?: Record<string, any> }[],
  includeIndex = false
): string => {
  return parts
    .map((part, index) => {
      const styleInfo = formatStyleInfo(part.style || {});
      const prefix = includeIndex ? `${index + 1}. ` : '';
      return `${prefix}"${part.text}"${styleInfo}`;
    })
    .join('\n');
};

/**
 * Format links array for display
 */
export const formatLinksForDisplay = (
  links: { url: string; text?: string }[]
): string => {
  if (links.length === 0) {
    return '';
  }
  return links
    .map((link, index) => `${index + 1}. ${link.text || '(no text)'} → ${link.url}`)
    .join('\n');
};

