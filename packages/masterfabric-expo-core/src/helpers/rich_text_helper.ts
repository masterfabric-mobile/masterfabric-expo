/**
 * Rich text processing utilities for MasterFabric Expo Core
 * 
 * This module provides comprehensive utilities for processing HTML, Markdown, and text formatting
 * in React Native applications. It includes functions for parsing, sanitization, extraction,
 * and formatting of rich text content.
 * 
 * @module rich_text_helper
 * @example
 * ```typescript
 * import { parseHtmlToText, extractUrls, sanitizeHtml } from 'masterfabric-expo-core';
 * 
 * // Parse HTML to React Native text components
 * const html = '<p>Hello <strong>World</strong>!</p>';
 * const parsed = parseHtmlToText(html);
 * // Returns: [{ text: 'Hello ', style: {} }, { text: 'World', style: { fontWeight: 'bold' } }, { text: '!', style: {} }]
 * 
 * // Extract URLs from text
 * const text = 'Visit https://example.com for more';
 * const urls = extractUrls(text);
 * // Returns: ['https://example.com']
 * 
 * // Sanitize HTML to prevent XSS
 * const unsafe = "<script>alert('xss')</script><p>Safe</p>";
 * const safe = sanitizeHtml(unsafe);
 * // Returns: "<p>Safe</p>"
 * ```
 */

/**
 * Represents a parsed text part with style information for React Native Text components.
 * 
 * @interface ParsedText
 * @property {string} text - The text content
 * @property {Record<string, any>} [style] - React Native style object (e.g., { fontWeight: 'bold', color: '#000' })
 * 
 * @example
 * ```typescript
 * const parsed: ParsedText = {
 *   text: 'Hello World',
 *   style: { fontWeight: 'bold', fontSize: 16 }
 * };
 * ```
 */
export interface ParsedText {
  text: string;
  style?: Record<string, any>;
}

/**
 * Options for HTML parsing operations.
 * 
 * @interface HtmlParseOptions
 * @property {boolean} [preserveWhitespace] - Whether to preserve whitespace in the output
 * @property {boolean} [includeLinks] - Whether to include link information in the parsed result
 */
export interface HtmlParseOptions {
  preserveWhitespace?: boolean;
  includeLinks?: boolean;
}

/**
 * Options for Markdown parsing operations.
 * 
 * @interface MarkdownParseOptions
 * @property {boolean} [includeHeaders] - Whether to parse and include header styles
 * @property {boolean} [includeCodeBlocks] - Whether to parse and include code block formatting
 */
export interface MarkdownParseOptions {
  includeHeaders?: boolean;
  includeCodeBlocks?: boolean;
}

/**
 * Represents an extracted link from HTML or Markdown.
 * 
 * @interface ExtractedLink
 * @property {string} url - The URL of the link
 * @property {string} text - The display text of the link
 * 
 * @example
 * ```typescript
 * const link: ExtractedLink = {
 *   url: 'https://example.com',
 *   text: 'Example'
 * };
 * ```
 */
export interface ExtractedLink {
  url: string;
  text: string;
}

/**
 * Parses HTML to React Native text elements.
 * 
 * Converts HTML strings into an array of text parts with React Native-compatible styles.
 * Supports common HTML tags: strong, b, em, i, u, h1-h6, p, br.
 * Automatically removes script and style tags for security.
 * 
 * @param html - The HTML string to parse
 * @param options - Optional parsing configuration
 * @returns Array of parsed text parts with styles, ready for React Native Text components
 * 
 * @example
 * ```typescript
 * const html = '<p>Hello <strong>World</strong>!</p>';
 * const parsed = parseHtmlToText(html);
 * // Returns: [
 * //   { text: 'Hello ', style: {} },
 * //   { text: 'World', style: { fontWeight: 'bold' } },
 * //   { text: '!', style: {} }
 * // ]
 * 
 * // Usage in React Native component:
 * <Text>
 *   {parsed.map((part, index) => (
 *     <Text key={index} style={part.style}>
 *       {part.text}
 *     </Text>
 *   ))}
 * </Text>
 * ```
 */
export function parseHtmlToText(html: string, options?: HtmlParseOptions): ParsedText[] {
  if (!html) return [{ text: '' }];

  try {
    // Remove script and style tags
    let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    const result: ParsedText[] = [];
    let currentText = '';
    let currentStyle: Record<string, any> = {};
    let inTag = false;
    let tagName = '';
    let inEntity = false;
    let entity = '';

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];

      if (inEntity) {
        if (char === ';') {
          inEntity = false;
          if (entity === 'nbsp') currentText += ' ';
          else if (entity === 'amp') currentText += '&';
          else if (entity === 'lt') currentText += '<';
          else if (entity === 'gt') currentText += '>';
          else if (entity === 'quot') currentText += '"';
          else if (entity === 'apos') currentText += "'";
          else if (entity.startsWith('#x')) {
            const code = parseInt(entity.substring(2), 16);
            currentText += String.fromCharCode(code);
          } else if (entity.startsWith('#')) {
            const code = parseInt(entity.substring(1), 10);
            currentText += String.fromCharCode(code);
          } else {
            currentText += `&${entity};`;
          }
          entity = '';
        } else {
          entity += char;
        }
        continue;
      }

      if (char === '&' && !inTag) {
        inEntity = true;
        entity = '';
        continue;
      }

      if (char === '<') {
        if (currentText.trim()) {
          result.push({ text: currentText, style: { ...currentStyle } });
          currentText = '';
        }
        inTag = true;
        tagName = '';
        continue;
      }

      if (inTag) {
        if (char === '>') {
          inTag = false;
          const lowerTag = tagName.toLowerCase().trim();
          
          if (lowerTag.startsWith('/')) {
            const closingTag = lowerTag.substring(1).split(' ')[0];
            if (closingTag === 'strong' || closingTag === 'b') {
              delete currentStyle.fontWeight;
            } else if (closingTag === 'em' || closingTag === 'i') {
              delete currentStyle.fontStyle;
            } else if (closingTag === 'u') {
              delete currentStyle.textDecorationLine;
            } else if (closingTag === 'h1' || closingTag === 'h2' || closingTag === 'h3' || 
                       closingTag === 'h4' || closingTag === 'h5' || closingTag === 'h6') {
              delete currentStyle.fontSize;
              delete currentStyle.fontWeight;
            }
          } else {
            const tagParts = lowerTag.split(' ');
            const tag = tagParts[0];
            
            if (tag === 'strong' || tag === 'b') {
              currentStyle.fontWeight = 'bold';
            } else if (tag === 'em' || tag === 'i') {
              currentStyle.fontStyle = 'italic';
            } else if (tag === 'u') {
              currentStyle.textDecorationLine = 'underline';
            } else if (tag === 'h1') {
              currentStyle.fontSize = 32;
              currentStyle.fontWeight = 'bold';
            } else if (tag === 'h2') {
              currentStyle.fontSize = 28;
              currentStyle.fontWeight = 'bold';
            } else if (tag === 'h3') {
              currentStyle.fontSize = 24;
              currentStyle.fontWeight = 'bold';
            } else if (tag === 'h4') {
              currentStyle.fontSize = 20;
              currentStyle.fontWeight = 'bold';
            } else if (tag === 'h5') {
              currentStyle.fontSize = 18;
              currentStyle.fontWeight = 'bold';
            } else if (tag === 'h6') {
              currentStyle.fontSize = 16;
              currentStyle.fontWeight = 'bold';
            } else if (tag === 'br') {
              currentText += '\n';
            } else if (tag === 'p') {
              if (currentText && !currentText.endsWith('\n')) {
                currentText += '\n';
              }
            }
          }
          tagName = '';
          continue;
        }
        tagName += char;
        continue;
      }

      if (!inTag) {
        currentText += char;
      }
    }

    if (currentText.trim()) {
      result.push({ text: currentText, style: { ...currentStyle } });
    }

    // Merge consecutive text parts with same style
    const merged: ParsedText[] = [];
    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      const last = merged[merged.length - 1];
      
      if (last && JSON.stringify(last.style) === JSON.stringify(current.style)) {
        last.text += current.text;
      } else {
        merged.push({ ...current });
      }
    }

    return merged.length > 0 ? merged : [{ text: '' }];
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return [{ text: html }];
  }
}

/**
 * Extracts plain text from HTML, removing all tags and formatting.
 * 
 * Converts HTML content to plain text by removing all HTML tags, decoding entities,
 * and preserving line breaks from block elements (p, div, h1-h6, br).
 * 
 * @param html - The HTML string to convert
 * @returns Plain text string without any HTML tags or formatting
 * 
 * @example
 * ```typescript
 * const html = '<p>Hello <strong>World</strong>!</p>';
 * const plain = htmlToPlainText(html);
 * // Returns: 'Hello World!'
 * 
 * const complex = '<h1>Title</h1><p>Paragraph with <em>emphasis</em>.</p>';
 * const plain2 = htmlToPlainText(complex);
 * // Returns: 'Title\nParagraph with emphasis.'
 * ```
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  
  try {
    // Remove script and style tags
    let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Replace block elements with newlines
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    cleaned = cleaned.replace(/<\/p>/gi, '\n');
    cleaned = cleaned.replace(/<\/div>/gi, '\n');
    cleaned = cleaned.replace(/<\/h[1-6]>/gi, '\n');
    
    // Remove all HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    cleaned = unescapeHtmlEntities(cleaned);
    
    // Clean up whitespace
    cleaned = cleaned.replace(/\n\s*\n/g, '\n');
    cleaned = cleaned.trim();
    
    return cleaned;
  } catch (error) {
    console.error('Error converting HTML to plain text:', error);
    return html.replace(/<[^>]*>/g, '');
  }
}

/**
 * Sanitizes HTML to prevent XSS (Cross-Site Scripting) attacks.
 * 
 * Removes dangerous HTML tags (script, iframe, object, embed, link, meta) and
 * dangerous attributes (onclick, onerror, javascript:, data:text/html, etc.)
 * while preserving safe formatting tags.
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for display
 * 
 * @example
 * ```typescript
 * const unsafe = "<script>alert('xss')</script><p>Safe content</p>";
 * const safe = sanitizeHtml(unsafe);
 * // Returns: "<p>Safe content</p>"
 * 
 * const withEvents = '<p onclick="alert(1)">Click me</p>';
 * const sanitized = sanitizeHtml(withEvents);
 * // Returns: '<p>Click me</p>' (onclick removed)
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  try {
    // Remove dangerous tags
    let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
    cleaned = cleaned.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '');
    cleaned = cleaned.replace(/<embed[^>]*>/gi, '');
    cleaned = cleaned.replace(/<link[^>]*>/gi, '');
    cleaned = cleaned.replace(/<meta[^>]*>/gi, '');
    
    // Remove dangerous attributes
    cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    cleaned = cleaned.replace(/javascript:/gi, '');
    cleaned = cleaned.replace(/data:text\/html/gi, '');
    
    return cleaned;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return html;
  }
}

/**
 * Removes HTML tags from a string, optionally preserving text content.
 * 
 * This function can either strip tags completely or extract plain text while
 * preserving the content structure (line breaks, spacing).
 * 
 * @param html - The HTML string to process
 * @param preserveContent - If true, extracts plain text preserving structure; if false, removes tags only
 * @returns String with HTML tags removed
 * 
 * @example
 * ```typescript
 * const html = '<p>Hello <strong>World</strong>!</p>';
 * const stripped = stripHtmlTags(html, true);
 * // Returns: 'Hello World!'
 * 
 * const html2 = '<div>Text</div><p>More</p>';
 * const stripped2 = stripHtmlTags(html2, true);
 * // Returns: 'Text\nMore' (preserves line breaks)
 * ```
 */
export function stripHtmlTags(html: string, preserveContent: boolean = true): string {
  if (!html) return '';
  
  if (preserveContent) {
    return htmlToPlainText(html);
  }
  
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Unescapes HTML entities to their corresponding characters.
 * 
 * Converts HTML entities (e.g., `&amp;`, `&lt;`, `&nbsp;`) to their actual characters.
 * Supports named entities, numeric entities (decimal and hexadecimal), and common
 * special characters.
 * 
 * @param html - The HTML string containing entities
 * @returns String with all HTML entities decoded to their character equivalents
 * 
 * @example
 * ```typescript
 * const encoded = 'Hello &amp; World &lt;tag&gt;';
 * const decoded = unescapeHtmlEntities(encoded);
 * // Returns: 'Hello & World <tag>'
 * 
 * const withNbsp = 'Text&nbsp;with&nbsp;spaces';
 * const decoded2 = unescapeHtmlEntities(withNbsp);
 * // Returns: 'Text with spaces'
 * ```
 */
export function unescapeHtmlEntities(html: string): string {
  if (!html) return '';
  
  const entityMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
  };
  
  return html.replace(/&[#\w]+;/g, (entity) => {
    if (entityMap[entity]) {
      return entityMap[entity];
    }
    
    // Handle numeric entities
    const numericMatch = entity.match(/&#(\d+);/);
    if (numericMatch) {
      return String.fromCharCode(parseInt(numericMatch[1], 10));
    }
    
    // Handle hex entities
    const hexMatch = entity.match(/&#x([0-9a-fA-F]+);/);
    if (hexMatch) {
      return String.fromCharCode(parseInt(hexMatch[1], 16));
    }
    
    return entity;
  });
}

/**
 * Extracts all links from HTML anchor tags.
 * 
 * Parses HTML to find all `<a>` tags and extracts both the URL (from href attribute)
 * and the display text. The text content is cleaned of any nested HTML tags.
 * 
 * @param html - The HTML string to search for links
 * @returns Array of extracted links, each containing `url` and `text` properties
 * 
 * @example
 * ```typescript
 * const html = '<a href="https://example.com">Example</a> and <a href="/page">Page</a>';
 * const links = extractHtmlLinks(html);
 * // Returns: [
 * //   { url: 'https://example.com', text: 'Example' },
 * //   { url: '/page', text: 'Page' }
 * // ]
 * ```
 */
export function extractHtmlLinks(html: string): ExtractedLink[] {
  if (!html) return [];
  
  const links: ExtractedLink[] = [];
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const text = stripHtmlTags(match[2], true).trim();
    links.push({ url, text });
  }
  
  return links;
}

/**
 * Converts HTML list items to an array of plain text strings.
 * 
 * Extracts all `<li>` elements from HTML lists (both ordered `<ol>` and unordered `<ul>`)
 * and returns their text content as an array. Nested HTML within list items is removed.
 * 
 * @param html - The HTML string containing list elements
 * @returns Array of strings, each representing a list item's text content
 * 
 * @example
 * ```typescript
 * const html = '<ul><li>First item</li><li>Second <strong>item</strong></li></ul>';
 * const items = convertHtmlListToText(html);
 * // Returns: ['First item', 'Second item']
 * ```
 */
export function convertHtmlListToText(html: string): string[] {
  if (!html) return [];
  
  const items: string[] = [];
  const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  
  while ((match = itemRegex.exec(html)) !== null) {
    const text = stripHtmlTags(match[1], true).trim();
    if (text) {
      items.push(text);
    }
  }
  
  return items;
}

/**
 * Parses Markdown syntax to React Native text elements with styles.
 * 
 * Converts Markdown text into an array of text parts with React Native-compatible styles.
 * Supports headers (#, ##, ###), bold (**text**), italic (*text*), and line breaks.
 * The result can be directly used in React Native Text components.
 * 
 * @param markdown - The Markdown string to parse
 * @param options - Optional parsing configuration (includeHeaders, includeCodeBlocks)
 * @returns Array of parsed text parts with styles, ready for React Native Text components
 * 
 * @example
 * ```typescript
 * const markdown = '# Title\n\n**Bold** text and *italic* text';
 * const parsed = parseMarkdown(markdown);
 * // Returns: [
 * //   { text: 'Title', style: { fontSize: 32, fontWeight: 'bold' } },
 * //   { text: '\n' },
 * //   { text: 'Bold', style: { fontWeight: 'bold' } },
 * //   { text: ' text and ' },
 * //   { text: 'italic', style: { fontStyle: 'italic' } },
 * //   { text: ' text' }
 * // ]
 * 
 * // Usage in React Native:
 * <Text>
 *   {parsed.map((part, index) => (
 *     <Text key={index} style={part.style}>
 *       {part.text}
 *     </Text>
 *   ))}
 * </Text>
 * ```
 */
export function parseMarkdown(markdown: string, options?: MarkdownParseOptions): ParsedText[] {
  if (!markdown) return [{ text: '' }];
  
  try {
    const result: ParsedText[] = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) {
        result.push({ text: '\n' });
        continue;
      }
      
      // Headers
      if (line.startsWith('# ')) {
        result.push({ text: line.substring(2), style: { fontSize: 32, fontWeight: 'bold' } });
        result.push({ text: '\n' });
        continue;
      }
      if (line.startsWith('## ')) {
        result.push({ text: line.substring(3), style: { fontSize: 28, fontWeight: 'bold' } });
        result.push({ text: '\n' });
        continue;
      }
      if (line.startsWith('### ')) {
        result.push({ text: line.substring(4), style: { fontSize: 24, fontWeight: 'bold' } });
        result.push({ text: '\n' });
        continue;
      }
      
      // Bold and italic
      let processed = line;
      const parts: ParsedText[] = [];
      
      // Simple approach: process inline formatting
      let text = processed;
      text = text.replace(/\*\*([^*]+)\*\*/g, (match, content) => {
        return `__BOLD_START__${content}__BOLD_END__`;
      });
      text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (match, content) => {
        return `__ITALIC_START__${content}__ITALIC_END__`;
      });
      
      const textParts = text.split(/__(?:BOLD|ITALIC)_(?:START|END)__/);
      let isBold = false;
      let isItalic = false;
      
      for (const part of textParts) {
        if (part === 'BOLD_START') {
          isBold = true;
        } else if (part === 'BOLD_END') {
          isBold = false;
        } else if (part === 'ITALIC_START') {
          isItalic = true;
        } else if (part === 'ITALIC_END') {
          isItalic = false;
        } else if (part) {
          const style: Record<string, any> = {};
          if (isBold) style.fontWeight = 'bold';
          if (isItalic) style.fontStyle = 'italic';
          parts.push({ text: part, style });
        }
      }
      
      if (parts.length === 0) {
        parts.push({ text: processed });
      }
      
      result.push(...parts);
      result.push({ text: '\n' });
    }
    
    return result.length > 0 ? result : [{ text: '' }];
  } catch (error) {
    console.error('Error parsing Markdown:', error);
    return [{ text: markdown }];
  }
}

/**
 * Converts Markdown to plain text by removing all formatting syntax.
 * 
 * Strips all Markdown syntax (headers, bold, italic, links, code blocks, lists, etc.)
 * while preserving the actual text content. Useful for extracting readable text
 * from Markdown documents.
 * 
 * @param markdown - The Markdown string to convert
 * @returns Plain text string without any Markdown formatting markers
 * 
 * @example
 * ```typescript
 * const markdown = '# Title\n\n**Bold** text and [link](url)';
 * const plain = markdownToPlainText(markdown);
 * // Returns: 'Title\n\nBold text and link'
 * ```
 */
export function markdownToPlainText(markdown: string): string {
  if (!markdown) return '';
  
  try {
    // Remove headers
    let text = markdown.replace(/^#+\s+/gm, '');
    
    // Remove bold and italic markers
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1');
    text = text.replace(/_([^_]+)_/g, '$1');
    
    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // Remove links but keep text
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    // Remove images
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
    
    // Remove list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');
    
    // Clean up whitespace
    text = text.replace(/\n\s*\n/g, '\n');
    text = text.trim();
    
    return text;
  } catch (error) {
    console.error('Error converting Markdown to plain text:', error);
    return markdown;
  }
}

/**
 * Converts Markdown syntax to HTML markup.
 * 
 * Transforms Markdown text into equivalent HTML, converting headers, bold, italic,
 * links, and code blocks to their HTML counterparts. Useful for rendering Markdown
 * in web contexts or further HTML processing.
 * 
 * @param markdown - The Markdown string to convert
 * @returns HTML string with Markdown syntax converted to HTML tags
 * 
 * @example
 * ```typescript
 * const markdown = '# Title\n\n**Bold** text';
 * const html = markdownToHtml(markdown);
 * // Returns: '<h1>Title</h1><br/>**Bold** text'
 * ```
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  try {
    let html = markdown;
    
    // Headers
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br/>');
    
    return html;
  } catch (error) {
    console.error('Error converting Markdown to HTML:', error);
    return markdown;
  }
}

/**
 * Extracts all links from Markdown syntax.
 * 
 * Parses Markdown text to find all link patterns in the format `[text](url)`
 * and extracts both the display text and the URL.
 * 
 * @param markdown - The Markdown string to search for links
 * @returns Array of extracted links, each containing `url` and `text` properties
 * 
 * @example
 * ```typescript
 * const markdown = 'Check [Example](https://example.com) and [Docs](/docs)';
 * const links = extractMarkdownLinks(markdown);
 * // Returns: [
 * //   { text: 'Example', url: 'https://example.com' },
 * //   { text: 'Docs', url: '/docs' }
 * // ]
 * ```
 */
export function extractMarkdownLinks(markdown: string): ExtractedLink[] {
  if (!markdown) return [];
  
  const links: ExtractedLink[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(markdown)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
    });
  }
  
  return links;
}

/**
 * Extracts all URLs from plain text.
 * 
 * Finds and extracts all HTTP/HTTPS URLs and www-prefixed URLs from text.
 * Returns an array of all matched URLs.
 * 
 * @param text - The text to search for URLs
 * @returns Array of found URL strings
 * 
 * @example
 * ```typescript
 * const text = 'Visit https://example.com and www.test.com for more';
 * const urls = extractUrls(text);
 * // Returns: ['https://example.com', 'www.test.com']
 * ```
 */
export function extractUrls(text: string): string[] {
  if (!text) return [];
  
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const matches = text.match(urlRegex);
  return matches ? matches : [];
}

/**
 * Extracts all user mentions (@username) from text.
 * 
 * Finds all mentions in the format @username and returns the usernames
 * without the @ symbol. Useful for social media or notification systems.
 * 
 * @param text - The text to search for mentions
 * @returns Array of found usernames (without @ prefix)
 * 
 * @example
 * ```typescript
 * const text = 'Hello @john and @jane!';
 * const mentions = extractMentions(text);
 * // Returns: ['john', 'jane']
 * ```
 */
export function extractMentions(text: string): string[] {
  if (!text) return [];
  
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  if (!matches) return [];
  
  return matches.map(match => match.substring(1));
}

/**
 * Extracts all hashtags (#tag) from text.
 * 
 * Finds all hashtags in the format #tag and returns the tags without the # symbol.
 * Useful for social media content analysis or tag extraction.
 * 
 * @param text - The text to search for hashtags
 * @returns Array of found hashtags (without # prefix)
 * 
 * @example
 * ```typescript
 * const text = 'Check out #reactnative and #typescript!';
 * const hashtags = extractHashtags(text);
 * // Returns: ['reactnative', 'typescript']
 * ```
 */
export function extractHashtags(text: string): string[] {
  if (!text) return [];
  
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  if (!matches) return [];
  
  return matches.map(match => match.substring(1));
}

/**
 * Extracts all email addresses from text.
 * 
 * Uses regex pattern matching to find all valid email addresses in the text.
 * Returns an array of all matched email addresses.
 * 
 * @param text - The text to search for email addresses
 * @returns Array of found email address strings
 * 
 * @example
 * ```typescript
 * const text = 'Contact us at info@example.com or support@test.org';
 * const emails = extractEmails(text);
 * // Returns: ['info@example.com', 'support@test.org']
 * ```
 */
export function extractEmails(text: string): string[] {
  if (!text) return [];
  
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? matches : [];
}

/**
 * Extracts phone numbers from text.
 * 
 * Finds phone numbers in various formats including international format (+country),
 * with or without parentheses, dashes, dots, or spaces. Returns all matched phone numbers.
 * 
 * @param text - The text to search for phone numbers
 * @returns Array of found phone number strings
 * 
 * @example
 * ```typescript
 * const text = 'Call +1-555-123-4567 or (555) 987-6543';
 * const phones = extractPhoneNumbers(text);
 * // Returns: ['+1-555-123-4567', '(555) 987-6543']
 * ```
 */
export function extractPhoneNumbers(text: string): string[] {
  if (!text) return [];
  
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? matches : [];
}

/**
 * Creates formatted text with multiple styles from an array of text parts.
 * 
 * Takes an array of text parts with associated styles and returns a normalized
 * array ready for use in React Native Text components. Ensures all parts have
 * valid text and style properties.
 * 
 * @param parts - Array of text parts, each with `text` and optional `style` properties
 * @returns Array of formatted text parts with validated text and style properties
 * 
 * @example
 * ```typescript
 * const parts = [
 *   { text: 'Hello ', style: {} },
 *   { text: 'World', style: { fontWeight: 'bold', color: 'red' } },
 *   { text: '!', style: {} }
 * ];
 * const formatted = createFormattedText(parts);
 * // Returns normalized array ready for React Native Text rendering
 * 
 * // Usage:
 * <Text>
 *   {formatted.map((part, index) => (
 *     <Text key={index} style={part.style}>
 *       {part.text}
 *     </Text>
 *   ))}
 * </Text>
 * ```
 */
export function createFormattedText(parts: ParsedText[]): ParsedText[] {
  if (!parts || parts.length === 0) return [{ text: '' }];
  
  return parts.map(part => ({
    text: part.text || '',
    style: part.style || {},
  }));
}

/**
 * Linkifies text by converting URLs to styled, clickable link parts.
 * 
 * Automatically detects URLs in text and converts them to styled text parts
 * with link styling (typically blue color and underline). Non-URL text remains
 * unstyled. Useful for creating clickable links in React Native Text components.
 * 
 * @param text - The text containing URLs to linkify
 * @returns Array of parsed text parts, with URLs styled as links
 * 
 * @example
 * ```typescript
 * const text = 'Visit https://example.com for more info';
 * const linkified = linkifyText(text);
 * // Returns: [
 * //   { text: 'Visit ' },
 * //   { text: 'https://example.com', style: { color: '#007AFF', textDecorationLine: 'underline' } },
 * //   { text: ' for more info' }
 * // ]
 * ```
 */
export function linkifyText(text: string): ParsedText[] {
  if (!text) return [{ text: '' }];
  
  const urls = extractUrls(text);
  if (urls.length === 0) {
    return [{ text }];
  }
  
  const result: ParsedText[] = [];
  let lastIndex = 0;
  
  for (const url of urls) {
    const urlIndex = text.indexOf(url, lastIndex);
    
    if (urlIndex > lastIndex) {
      result.push({ text: text.substring(lastIndex, urlIndex) });
    }
    
    result.push({
      text: url,
      style: { color: '#007AFF', textDecorationLine: 'underline' },
    });
    
    lastIndex = urlIndex + url.length;
  }
  
  if (lastIndex < text.length) {
    result.push({ text: text.substring(lastIndex) });
  }
  
  return result.length > 0 ? result : [{ text }];
}

/**
 * Applies a style object to text, creating a ParsedText object.
 * 
 * Wraps text with a style object to create a formatted text part ready for
 * React Native Text rendering. This is a utility function for creating styled
 * text parts programmatically.
 * 
 * @param text - The text content to style
 * @param style - React Native style object to apply (e.g., { fontWeight: 'bold', color: '#000' })
 * @returns ParsedText object with text and style properties
 * 
 * @example
 * ```typescript
 * const styled = applyTextStyle('Hello', { fontWeight: 'bold', fontSize: 18 });
 * // Returns: { text: 'Hello', style: { fontWeight: 'bold', fontSize: 18 } }
 * ```
 */
export function applyTextStyle(text: string, style: Record<string, any>): ParsedText {
  return {
    text,
    style,
  };
}

/**
 * Highlights matching search terms in text with custom styling.
 * 
 * Finds all occurrences of specified search terms in text and applies highlight
 * styling to them. Non-matching text remains unstyled. Handles overlapping matches
 * intelligently by keeping the first match. Useful for search result highlighting
 * or text emphasis features.
 * 
 * @param text - The text to search and highlight
 * @param searchTerms - Array of terms to highlight (case-insensitive)
 * @param highlightStyle - Optional custom style for highlighted text (defaults to yellow background, bold, black text)
 * @returns Array of parsed text parts, with matching terms styled according to highlightStyle
 * 
 * @example
 * ```typescript
 * const text = 'Hello World! This is a test message.';
 * const highlighted = highlightText(text, ['World', 'test'], {
 *   backgroundColor: '#FFFF00',
 *   color: '#000000',
 *   fontWeight: 'bold'
 * });
 * // Returns array with 'World' and 'test' highlighted
 * 
 * // Usage in React Native:
 * <Text>
 *   {highlighted.map((part, index) => (
 *     <Text key={index} style={part.style}>
 *       {part.text}
 *     </Text>
 *   ))}
 * </Text>
 * ```
 */
export function highlightText(
  text: string,
  searchTerms: string[],
  highlightStyle?: Record<string, any>
): ParsedText[] {
  if (!text || !searchTerms || searchTerms.length === 0) {
    return [{ text }];
  }

  const defaultHighlightStyle: Record<string, any> = {
    backgroundColor: '#FFFF00',
    color: '#000000',
    fontWeight: 'bold',
    ...highlightStyle,
  };

  const result: ParsedText[] = [];
  let lastIndex = 0;
  const matches: { start: number; end: number; term: string }[] = [];

  // Find all matches
  for (const term of searchTerms) {
    if (!term) continue;
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        term: match[0],
      });
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep first)
  const nonOverlapping: { start: number; end: number; term: string }[] = [];
  for (const match of matches) {
    if (nonOverlapping.length === 0 || match.start >= nonOverlapping[nonOverlapping.length - 1].end) {
      nonOverlapping.push(match);
    }
  }

  // Build result with highlights
  for (const match of nonOverlapping) {
    if (match.start > lastIndex) {
      result.push({ text: text.substring(lastIndex, match.start) });
    }
    result.push({
      text: match.term,
      style: defaultHighlightStyle,
    });
    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    result.push({ text: text.substring(lastIndex) });
  }

  return result.length > 0 ? result : [{ text }];
}

/**
 * Validates HTML structure by checking for balanced tags.
 * 
 * Performs basic HTML validation by ensuring all opening tags have corresponding
 * closing tags (or are self-closing). Does not validate HTML semantics or
 * attribute correctness, only tag balance.
 * 
 * @param html - The HTML string to validate
 * @returns true if HTML tags are properly balanced, false otherwise
 * 
 * @example
 * ```typescript
 * const valid = '<p>Hello</p>';
 * isValidHtml(valid); // Returns: true
 * 
 * const invalid = '<p>Hello<div>World</p>';
 * isValidHtml(invalid); // Returns: false (unbalanced tags)
 * ```
 */
export function isValidHtml(html: string): boolean {
  if (!html) return false;

  try {
    // Basic validation: check for balanced tags
    const tagStack: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      const tagName = match[1].toLowerCase();
      const isClosing = match[0].startsWith('</');

      if (isClosing) {
        if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
          return false;
        }
        tagStack.pop();
      } else {
        // Self-closing tags don't need closing
        if (!match[0].endsWith('/>') && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName)) {
          tagStack.push(tagName);
        }
      }
    }

    return tagStack.length === 0;
  } catch {
    return false;
  }
}

/**
 * Validates Markdown syntax by checking for common Markdown patterns.
 * 
 * Performs basic validation by checking if the text contains common Markdown
 * syntax patterns (headers, bold, italic, links, lists, code blocks). Returns
 * true if any Markdown patterns are found or if the text is non-empty.
 * 
 * @param markdown - The Markdown string to validate
 * @returns true if Markdown syntax patterns are detected or text is non-empty
 * 
 * @example
 * ```typescript
 * const markdown = '# Title\n**Bold** text';
 * isValidMarkdown(markdown); // Returns: true
 * 
 * const plain = 'Just plain text';
 * isValidMarkdown(plain); // Returns: true (non-empty text)
 * ```
 */
export function isValidMarkdown(markdown: string): boolean {
  if (!markdown) return false;

  try {
    // Basic validation: check for common Markdown patterns
    const hasValidPatterns =
      /^#+\s/.test(markdown) || // Headers
      /\*\*.*\*\*/.test(markdown) || // Bold
      /(?<!\*)\*[^*]+\*(?!\*)/.test(markdown) || // Italic
      /\[.*\]\(.*\)/.test(markdown) || // Links
      /^[-*+]\s/.test(markdown) || // Lists
      /^\d+\.\s/.test(markdown) || // Numbered lists
      /`.*`/.test(markdown) || // Inline code
      /```[\s\S]*```/.test(markdown); // Code blocks

    return hasValidPatterns || markdown.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Checks if text contains HTML tags.
 * 
 * Uses regex pattern matching to detect if the text contains any HTML tags
 * (content between < and >). Useful for determining if text needs HTML processing.
 * 
 * @param text - The text to check for HTML tags
 * @returns true if HTML tags are found, false otherwise
 * 
 * @example
 * ```typescript
 * const html = '<p>Hello</p>';
 * containsHtml(html); // Returns: true
 * 
 * const plain = 'Just text';
 * containsHtml(plain); // Returns: false
 * ```
 */
export function containsHtml(text: string): boolean {
  if (!text) return false;
  return /<[^>]+>/.test(text);
}

/**
 * Checks if text contains Markdown syntax patterns.
 * 
 * Detects common Markdown syntax patterns including headers (#), bold (**text**),
 * italic (*text*), links ([text](url)), lists (-, *, 1.), and code blocks (`code`).
 * Useful for determining if text needs Markdown processing.
 * 
 * @param text - The text to check for Markdown syntax
 * @returns true if any Markdown patterns are detected, false otherwise
 * 
 * @example
 * ```typescript
 * const markdown = '# Title\n**Bold** text';
 * containsMarkdown(markdown); // Returns: true
 * 
 * const plain = 'Just plain text';
 * containsMarkdown(plain); // Returns: false
 * ```
 */
export function containsMarkdown(text: string): boolean {
  if (!text) return false;

  const markdownPatterns = [
    /^#+\s/, // Headers
    /\*\*.*\*\*/, // Bold
    /(?<!\*)\*[^*]+\*(?!\*)/, // Italic
    /\[.*\]\(.*\)/, // Links
    /^[-*+]\s/, // Lists
    /^\d+\.\s/, // Numbered lists
    /`.*`/, // Inline code
    /```[\s\S]*```/, // Code blocks
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}

