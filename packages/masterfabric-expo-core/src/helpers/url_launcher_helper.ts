/**
 * URL Launcher Helper (Core)
 * 
 * Provides a comprehensive API to open external URLs, phone numbers, emails, SMS,
 * maps, app stores, settings, and deep links with consistent error handling and
 * platform-specific optimizations.
 * 
 * This helper provides convenient methods for common URL launching operations with 
 * consistent naming and behavior across iOS, Android, and Web platforms.
 * 
 * Features:
 * - Open web URLs (http/https)
 * - Open email client with subject, body, CC, BCC
 * - Open phone dialer with number
 * - Open SMS app with recipients and message
 * - Open map apps with address or coordinates
 * - Open App Store / Play Store
 * - Open device settings
 * - Open deep links with fallback support
 * - Open URLs in in-app browser
 * - URL validation and normalization
 * - Security checks (scheme whitelisting)
 * 
 * Usage:
 *   import { urlLauncherHelper } from 'masterfabric-expo-core';
 * 
 *   // Open a web URL
 *   await urlLauncherHelper.openUrl('https://example.com');
 * 
 *   // Open email with subject and body
 *   await urlLauncherHelper.openEmail('support@example.com', {
 *     subject: 'Support Request',
 *     body: 'Hello...'
 *   });
 * 
 *   // Open phone dialer
 *   await urlLauncherHelper.openPhone('+1-800-123-4567');
 * 
 *   // Open map with coordinates
 *   await urlLauncherHelper.openMap(
 *     { latitude: 37.4220, longitude: -122.0841 },
 *     { label: 'Our Office', zoom: 15 }
 *   );
 */

import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import { loggerHelper } from './logger_helper';
import { isUrl } from './string_helper';

// ---- Types ----
export interface EmailOptions {
  subject?: string;
  body?: string;
  cc?: string[];
  bcc?: string[];
}

export interface PhoneOptions {
  prompt?: boolean; // iOS only
}

export interface SMSOptions {
  body?: string;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
}

export interface MapOptions {
  label?: string;
  zoom?: number;
  provider?: 'google' | 'apple' | 'default';
}

export interface BrowserOptions {
  toolbarColor?: string;
  enableBarCollapsing?: boolean;
  showTitle?: boolean;
  showInRecents?: boolean;
  controlsColor?: string;
}

export interface SettingsOptions {
  section?: 'general' | 'app' | 'privacy' | 'wifi' | 'bluetooth' | 'cellular';
  packageName?: string; // Android only
}

export interface DeepLinkOptions {
  fallbackUrl?: string;
}

export interface ParsedUrl {
  protocol: string;
  hostname: string;
  port?: string;
  pathname: string;
  search?: string;
  hash?: string;
  username?: string;
  password?: string;
}

// ---- URL Launcher Helper Class ----
/**
 * URL Launcher Helper Class
 * 
 * Provides convenient methods for launching URLs and external resources.
 * All methods return Promise<boolean> indicating success/failure.
 * 
 * Security:
 * - URL scheme whitelisting (prevents dangerous schemes)
 * - Input sanitization (removes potentially dangerous characters)
 * - URL validation before opening
 * 
 * Platform Support:
 * - iOS: Native URL schemes (tel:, mailto:, sms:, maps:, app-settings:)
 * - Android: Native URL schemes (tel:, mailto:, sms:, geo:, market:, android.settings.*)
 * - Web: Browser-based URL opening
 */
class UrlLauncherHelper {
  /**
   * Open a URL
   * 
   * Opens a URL using the device's default handler. Validates the URL format
   * and checks if the URL scheme is allowed before opening.
   * 
   * @param url - The URL to open (http, https, or custom scheme)
   * @returns Promise<boolean> - True if URL was opened successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Open a web URL
   * await urlLauncherHelper.openUrl('https://example.com');
   * 
   * // Open a custom deep link
   * await urlLauncherHelper.openUrl('myapp://screen/123');
   * ```
   */
  async openUrl(url: string): Promise<boolean> {
    try {
      if (!url || !url.trim()) {
        return false;
      }

      if (!this.validateUrl(url)) {
        return false;
      }

      const normalizedUrl = this.normalizeUrl(url);
      
      try {
        const canOpen = await Linking.canOpenURL(normalizedUrl);
        if (!canOpen) {
          return false;
        }
      } catch {
        // Some URLs might not pass canOpenURL but can still be opened
        // Continue to try opening anyway
      }

      // Security check: validate scheme
      if (!this.isSchemeAllowed(normalizedUrl)) {
        try {
          loggerHelper.warning('URL scheme not allowed', { url: normalizedUrl });
        } catch {
          // Logger not initialized, fallback to console
          console.warn('URL scheme not allowed:', normalizedUrl);
        }
        return false;
      }

      await Linking.openURL(normalizedUrl);
      
      try {
        loggerHelper.debug('URL opened successfully', { url: normalizedUrl });
      } catch {
        // Logger not initialized, skip logging
      }
      
      return true;
    } catch (error) {
      try {
        loggerHelper.error('Error opening URL', { 
          url: url, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        // Logger not initialized, fallback to console
        console.error('Error opening URL:', error);
      }
      return false;
    }
  }

  /**
   * Open email client
   * 
   * @param recipient - Email recipient (optional - can be empty if subject/body provided)
   * @param options - Email options (subject, body, cc, bcc)
   * @returns Promise<boolean> - True if email client opened successfully
   * 
   * @example
   * // Open email with recipient
   * await urlLauncherHelper.openEmail('user@example.com', { subject: 'Hello' });
   * 
   * // Open email without recipient (subject/body only)
   * await urlLauncherHelper.openEmail('', { subject: 'Hello', body: 'World' });
   */
  async openEmail(recipient: string, options?: EmailOptions): Promise<boolean> {
    try {
      // Allow empty recipient if subject or body is provided
      const hasSubject = options?.subject && options.subject.trim().length > 0;
      const hasBody = options?.body && options.body.trim().length > 0;
      const hasRecipient = recipient && recipient.trim().length > 0;
      
      if (!hasRecipient && !hasSubject && !hasBody) {
        try {
          loggerHelper.warning('Email requires at least recipient, subject, or body', { recipient });
        } catch {
          console.warn('Email requires at least recipient, subject, or body:', recipient);
        }
        return false;
      }

      // Sanitize recipient if provided
      const sanitizedRecipient = hasRecipient ? this.sanitizeInput(recipient) : '';
      
      // Validate recipient format if provided
      if (hasRecipient && !sanitizedRecipient.includes('@')) {
        try {
          loggerHelper.warning('Invalid email recipient format', { recipient });
        } catch {
          console.warn('Invalid email recipient format:', recipient);
        }
        return false;
      }

      // Build mailto URL
      let mailtoUrl = hasRecipient 
        ? `mailto:${encodeURIComponent(sanitizedRecipient)}`
        : 'mailto:';
      
      const params: string[] = [];

      if (hasSubject) {
        const sanitizedSubject = this.sanitizeInput(options!.subject!);
        params.push(`subject=${encodeURIComponent(sanitizedSubject)}`);
      }

      if (hasBody) {
        const sanitizedBody = this.sanitizeInput(options!.body!);
        params.push(`body=${encodeURIComponent(sanitizedBody)}`);
      }

      if (options?.cc && options.cc.length > 0) {
        const sanitizedCc = options.cc.map(email => this.sanitizeInput(email)).filter(Boolean);
        if (sanitizedCc.length > 0) {
          params.push(`cc=${encodeURIComponent(sanitizedCc.join(','))}`);
        }
      }

      if (options?.bcc && options.bcc.length > 0) {
        const sanitizedBcc = options.bcc.map(email => this.sanitizeInput(email)).filter(Boolean);
        if (sanitizedBcc.length > 0) {
          params.push(`bcc=${encodeURIComponent(sanitizedBcc.join(','))}`);
        }
      }

      if (params.length > 0) {
        mailtoUrl += `?${params.join('&')}`;
      }

      try {
        loggerHelper.debug('Opening email', { recipient: sanitizedRecipient || '(empty)', hasSubject, hasBody });
      } catch {
        // Logger not initialized
      }

      return await this.openUrl(mailtoUrl);
    } catch (error) {
      try {
        loggerHelper.error('Error opening email', { 
          recipient, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening email:', error);
      }
      return false;
    }
  }

  /**
   * Open phone dialer
   * 
   * Opens the device's phone dialer with the specified phone number.
   * Sanitizes the phone number and validates its format before opening.
   * 
   * @param phoneNumber - The phone number to dial (can include +, -, spaces)
   * @param options - Optional configuration (prompt on iOS)
   * @returns Promise<boolean> - True if dialer opened successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Open dialer with number
   * await urlLauncherHelper.openPhone('+1-800-123-4567');
   * 
   * // Open with prompt on iOS
   * await urlLauncherHelper.openPhone('1234567890', { prompt: true });
   * ```
   */
  async openPhone(phoneNumber: string, options?: PhoneOptions): Promise<boolean> {
    try {
      if (!phoneNumber || !phoneNumber.trim()) {
        return false;
      }

      // Sanitize phone number - remove potentially dangerous characters
      const sanitizedNumber = this.sanitizeInput(phoneNumber);
      
      // Remove all non-digit characters except +, -, and spaces
      const cleanedNumber = sanitizedNumber.replace(/[^\d+\- ]/g, '').trim();
      
      if (!cleanedNumber) {
        try {
          loggerHelper.warning('Invalid phone number', { phoneNumber });
        } catch {
          console.warn('Invalid phone number:', phoneNumber);
        }
        return false;
      }

      // Validate phone number format (basic check)
      if (cleanedNumber.length < 3) {
        try {
          loggerHelper.warning('Phone number too short', { phoneNumber: cleanedNumber });
        } catch {
          console.warn('Phone number too short:', cleanedNumber);
        }
        return false;
      }

      let telUrl = `tel:${cleanedNumber}`;

      // iOS supports prompt option
      if (Platform.OS === 'ios' && options?.prompt) {
        telUrl = `telprompt:${cleanedNumber}`;
      }

      try {
        loggerHelper.debug('Opening phone dialer', { phoneNumber: cleanedNumber });
      } catch {
        // Logger not initialized
      }

      // Directly open tel: URL without validation check
      // tel: URLs don't pass standard URL validation but they work
      try {
        const canOpen = await Linking.canOpenURL(telUrl);
        if (canOpen) {
          await Linking.openURL(telUrl);
          return true;
        }
      } catch {
        // Some devices might not pass canOpenURL for tel: but can still open it
        // Try opening anyway
      }

      // Try opening directly even if canOpenURL fails
      try {
        await Linking.openURL(telUrl);
        return true;
      } catch (openError) {
        try {
          loggerHelper.error('Error opening phone', { 
            phoneNumber: cleanedNumber,
            error: openError instanceof Error ? openError.message : String(openError)
          });
        } catch {
          console.error('Error opening phone:', openError);
        }
        return false;
      }
    } catch (error) {
      try {
        loggerHelper.error('Error opening phone', { 
          phoneNumber, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening phone:', error);
      }
      return false;
    }
  }

  /**
   * Open SMS app
   * 
   * Opens the device's SMS app with the specified recipients and optional message body.
   * Supports multiple recipients (comma-separated or array).
   * 
   * @param recipients - Single phone number, comma-separated string, or array of phone numbers
   * @param options - Optional configuration (message body)
   * @returns Promise<boolean> - True if SMS app opened successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Open SMS with single recipient
   * await urlLauncherHelper.openSMS('+1234567890', { body: 'Hello!' });
   * 
   * // Open SMS with multiple recipients
   * await urlLauncherHelper.openSMS(['+1234567890', '+0987654321'], { body: 'Group message' });
   * ```
   */
  async openSMS(recipients: string | string[], options?: SMSOptions): Promise<boolean> {
    try {
      const recipientList = Array.isArray(recipients) ? recipients : [recipients];
      
      // Sanitize recipients
      const sanitizedRecipients = recipientList
        .map(recipient => this.sanitizeInput(recipient))
        .filter(recipient => recipient && recipient.length > 0);
      
      if (sanitizedRecipients.length === 0) {
        try {
          loggerHelper.warning('No valid SMS recipients', { recipients });
        } catch {
          console.warn('No valid SMS recipients:', recipients);
        }
        return false;
      }

      const recipientString = sanitizedRecipients.join(',');
      let smsUrl = `sms:${recipientString}`;

      if (options?.body) {
        const sanitizedBody = this.sanitizeInput(options.body);
        smsUrl += `?body=${encodeURIComponent(sanitizedBody)}`;
      }

      try {
        loggerHelper.debug('Opening SMS', { recipients: sanitizedRecipients });
      } catch {
        // Logger not initialized
      }

      return await this.openUrl(smsUrl);
    } catch (error) {
      try {
        loggerHelper.error('Error opening SMS', { 
          recipients, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening SMS:', error);
      }
      return false;
    }
  }

  /**
   * Open map app
   * 
   * Opens the device's default map app with the specified location.
   * Supports both address strings and coordinate pairs (latitude/longitude).
   * 
   * @param location - Address string or coordinate object { latitude, longitude }
   * @param options - Optional configuration (label, zoom, provider)
   * @returns Promise<boolean> - True if map app opened successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Open map with address
   * await urlLauncherHelper.openMap('1600 Amphitheatre Parkway, Mountain View, CA');
   * 
   * // Open map with coordinates
   * await urlLauncherHelper.openMap(
   *   { latitude: 37.4220, longitude: -122.0841 },
   *   { label: 'Google HQ', zoom: 15 }
   * );
   * ```
   */
  async openMap(
    location: MapLocation | string,
    options?: MapOptions
  ): Promise<boolean> {
    try {
      let mapUrl: string;

      if (typeof location === 'string') {
        // Address string
        const encodedAddress = encodeURIComponent(location);
        if (Platform.OS === 'ios') {
          mapUrl = `maps://maps.apple.com/?q=${encodedAddress}`;
        } else {
          mapUrl = `geo:0,0?q=${encodedAddress}`;
        }
      } else {
        // Coordinates
        const { latitude, longitude } = location;
        const label = options?.label ? encodeURIComponent(options.label) : '';
        const zoom = options?.zoom || 15;

        if (Platform.OS === 'ios') {
          mapUrl = `maps://maps.apple.com/?ll=${latitude},${longitude}&z=${zoom}`;
          if (label) {
            mapUrl += `&q=${label}`;
          }
        } else {
          // Android
          if (options?.provider === 'google') {
            mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            if (label) {
              mapUrl += `&query_place_id=${label}`;
            }
          } else {
            mapUrl = `geo:${latitude},${longitude}?z=${zoom}`;
            if (label) {
              mapUrl += `&q=${latitude},${longitude}(${label})`;
            }
          }
        }
      }

      // Validate coordinates if provided
      if (typeof location !== 'string') {
        const { latitude, longitude } = location;
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          try {
            loggerHelper.warning('Invalid map coordinates', { latitude, longitude });
          } catch {
            console.warn('Invalid map coordinates:', latitude, longitude);
          }
          return false;
        }
      }

      try {
        loggerHelper.debug('Opening map', { 
          location: typeof location === 'string' ? location : `${location.latitude}, ${location.longitude}` 
        });
      } catch {
        // Logger not initialized
      }

      return await this.openUrl(mapUrl);
    } catch (error) {
      try {
        loggerHelper.error('Error opening map', { 
          location, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening map:', error);
      }
      return false;
    }
  }

  /**
   * Open App Store (iOS) or Play Store (Android)
   * 
   * Opens the platform's app store page for the specified app.
   * On iOS, opens App Store. On Android, opens Play Store.
   * 
   * @param appId - App Store ID (iOS) or package name (Android)
   * @param options - Optional configuration (open review page)
   * @returns Promise<boolean> - True if app store opened successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Open app store page
   * await urlLauncherHelper.openAppStore('123456789');
   * 
   * // Open review page
   * await urlLauncherHelper.openAppStore('com.example.app', { review: true });
   * ```
   */
  async openAppStore(
    appId: string,
    options?: { review?: boolean }
  ): Promise<boolean> {
    try {
      let storeUrl: string;

      if (Platform.OS === 'ios') {
        if (options?.review) {
          storeUrl = `itms-apps://itunes.apple.com/app/id${appId}?action=write-review`;
        } else {
          storeUrl = `itms-apps://itunes.apple.com/app/id${appId}`;
        }
      } else {
        // Android
        const packageName = appId;
        if (options?.review) {
          storeUrl = `market://details?id=${packageName}&showAllReviews=true`;
        } else {
          storeUrl = `market://details?id=${packageName}`;
        }
      }

      // Validate app ID
      if (!appId || appId.trim().length === 0) {
        try {
          loggerHelper.warning('Invalid app store ID', { appId });
        } catch {
          console.warn('Invalid app store ID:', appId);
        }
        return false;
      }

      try {
        loggerHelper.debug('Opening app store', { appId, review: options?.review });
      } catch {
        // Logger not initialized
      }

      return await this.openUrl(storeUrl);
    } catch (error) {
      try {
        loggerHelper.error('Error opening app store', { 
          appId, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening app store:', error);
      }
      return false;
    }
  }

  /**
   * Open device settings
   * 
   * Opens the device's settings app. On iOS, opens app-specific settings.
   * On Android, opens system settings or app settings based on options.
   * 
   * @param options - Optional configuration (section, packageName for Android)
   * @returns Promise<boolean> - True if settings opened successfully, false otherwise
   * 
   * @example
   * ```typescript
   * // Open general settings
   * await urlLauncherHelper.openSettings();
   * 
   * // Open specific section
   * await urlLauncherHelper.openSettings({ section: 'privacy' });
   * 
   * // Open app settings on Android
   * await urlLauncherHelper.openSettings({ 
   *   section: 'app', 
   *   packageName: 'com.example.app' 
   * });
   * ```
   */
  async openSettings(options?: SettingsOptions): Promise<boolean> {
    try {
      let settingsUrl: string;

      if (Platform.OS === 'ios') {
        const section = options?.section || 'general';
        settingsUrl = `app-settings:${section}`;
      } else {
        if (options?.section === 'app' && options?.packageName) {
          // Android requires Intent, handled differently
          // Note: This requires react-native IntentAndroid module
          // For Expo, use expo-intent-launcher or handle via native module
          try {
            // Dynamic import to avoid issues if module doesn't exist
            const ReactNative = await import('react-native');
            const Intent = ReactNative.NativeModules?.IntentAndroid;
            if (Intent && Intent.openSettings) {
              Intent.openSettings(options.packageName);
              return true;
            }
          } catch {
            try {
              loggerHelper.warning('IntentAndroid not available, falling back to default settings');
            } catch {
              console.warn('IntentAndroid not available, falling back to default settings');
            }
          }
        }
        settingsUrl = `android.settings.SETTINGS`;
      }

      try {
        loggerHelper.debug('Opening settings', { section: options?.section });
      } catch {
        // Logger not initialized
      }

      return await this.openUrl(settingsUrl);
    } catch (error) {
      try {
        loggerHelper.error('Error opening settings', { 
          options, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening settings:', error);
      }
      return false;
    }
  }

  /**
   * Check if URL can be opened
   * 
   * Checks if the device can handle the given URL scheme.
   * Performs security check before checking availability.
   * 
   * @param url - The URL to check
   * @returns Promise<boolean> - True if the URL can be opened, false otherwise
   * 
   * @example
   * ```typescript
   * const canOpen = await urlLauncherHelper.canOpenUrl('tel:+1234567890');
   * if (canOpen) {
   *   await urlLauncherHelper.openPhone('+1234567890');
   * }
   * ```
   */
  async canOpenUrl(url: string): Promise<boolean> {
    try {
      // Security check: validate scheme before checking
      if (!this.isSchemeAllowed(url)) {
        try {
          loggerHelper.warning('URL scheme not allowed for canOpenUrl check', { url });
        } catch {
          console.warn('URL scheme not allowed:', url);
        }
        return false;
      }
      return await Linking.canOpenURL(url);
    } catch (error) {
      try {
        loggerHelper.error('Error checking URL', { 
          url, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error checking URL:', error);
      }
      return false;
    }
  }

  /**
   * Get supported URL schemes
   * 
   * Returns a list of URL schemes that are supported by this helper.
   * This is useful for UI components that need to display available schemes.
   * 
   * @returns Array of supported URL scheme strings (without ://)
   */
  getSupportedSchemes(): string[] {
    return [
      'http',
      'https',
      'tel',
      'mailto',
      'sms',
      'geo',
      'maps',
      'market',
      'app-settings',
    ];
  }

  // ---- Private Helper Methods ----
  /**
   * Get allowed URL schemes (security whitelist)
   * 
   * Returns the list of URL schemes that are allowed to be opened.
   * This is a security measure to prevent opening dangerous schemes.
   */
  private getAllowedSchemes(): string[] {
    return [
      'http',
      'https',
      'tel',
      'telprompt',
      'mailto',
      'sms',
      'geo',
      'maps',
      'itms-apps',
      'market',
      'app-settings',
      'android.settings',
    ];
  }

  /**
   * Check if URL scheme is allowed (security check)
   * 
   * Validates that the URL scheme is in the whitelist of allowed schemes.
   * Prevents opening dangerous schemes like javascript:, data:, etc.
   * 
   * @param url - The URL to check
   * @returns True if the scheme is allowed, false otherwise
   */
  private isSchemeAllowed(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const scheme = urlObj.protocol.replace(':', '');
      const allowedSchemes = this.getAllowedSchemes();
      return allowedSchemes.includes(scheme);
    } catch {
      // For non-standard URLs (tel:, sms:, etc.), check manually
      const allowedSchemes = this.getAllowedSchemes();
      for (const allowedScheme of allowedSchemes) {
        if (url.toLowerCase().startsWith(`${allowedScheme}:`)) {
          return true;
        }
      }
      return false;
    }
  }

  /**
   * Sanitize user input for email, phone, SMS
   * 
   * Removes potentially dangerous characters from user input.
   * Used for email addresses, phone numbers, and SMS content.
   * 
   * @param input - The input string to sanitize
   * @returns The sanitized string
   */
  private sanitizeInput(input: string): string {
    if (!input) return '';
    // Remove potentially dangerous characters
    return input.trim().replace(/[<>\"']/g, '');
  }

  // ---- Public Utility Methods ----
  /**
   * Validate URL
   * 
   * Checks if a string is a valid URL format.
   * Uses the string_helper's isUrl function.
   * 
   * @param url - The URL string to validate
   * @returns True if the URL is valid, false otherwise
   */
  validateUrl(url: string): boolean {
    return isUrl(url);
  }

  /**
   * Normalize URL (add protocol if missing)
   * 
   * Adds https:// prefix if the URL doesn't have a protocol.
   * Preserves existing protocols (http://, https://, tel:, mailto:, etc.).
   * 
   * @param url - The URL to normalize
   * @returns The normalized URL
   */
  normalizeUrl(url: string): string {
    if (!url) return '';

    url = url.trim();

    // Check if URL already has a protocol
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
      return url;
    }

    // Add https:// if no protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }

    return url;
  }

  /**
   * Parse URL into components
   * 
   * Parses a URL string into its components (protocol, hostname, port, pathname, etc.).
   * Returns null if the URL cannot be parsed.
   * 
   * @param url - The URL to parse
   * @returns Parsed URL object or null if parsing fails
   */
  parseUrl(url: string): ParsedUrl | null {
    try {
      const urlObj = new URL(url);
      return {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || undefined,
        pathname: urlObj.pathname,
        search: urlObj.search || undefined,
        hash: urlObj.hash || undefined,
        username: urlObj.username || undefined,
        password: urlObj.password || undefined,
      };
    } catch {
      return null;
    }
  }

  /**
   * Build URL with query parameters
   * 
   * Appends query parameters to a base URL.
   * Automatically handles URL encoding of parameter values.
   * 
   * @param baseUrl - The base URL
   * @param params - Object with key-value pairs for query parameters
   * @returns The URL with query parameters appended
   * 
   * @example
   * ```typescript
   * const url = urlLauncherHelper.buildUrl('https://example.com', {
   *   q: 'search term',
   *   page: '1'
   * });
   * // Returns: https://example.com?q=search%20term&page=1
   * ```
   */
  buildUrl(baseUrl: string, params: Record<string, string>): string {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }

  /**
   * Open URL in in-app browser
   */
  async openInBrowser(url: string, options?: BrowserOptions): Promise<boolean> {
    try {
      if (!this.validateUrl(url)) {
        throw new Error('Invalid URL');
      }

      const normalizedUrl = this.normalizeUrl(url);
      
      await WebBrowser.openBrowserAsync(normalizedUrl, {
        toolbarColor: options?.toolbarColor,
        enableBarCollapsing: options?.enableBarCollapsing,
        showTitle: options?.showTitle,
        showInRecents: options?.showInRecents,
        controlsColor: options?.controlsColor,
      });

      try {
        loggerHelper.debug('Opening URL in browser', { url: normalizedUrl });
      } catch {
        // Logger not initialized
      }

      return true;
    } catch (error) {
      try {
        loggerHelper.error('Error opening browser', { 
          url, 
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening browser:', error);
      }
      return false;
    }
  }

  /**
   * Open deep link
   * 
   * Opens a deep link URL (custom scheme). If the deep link cannot be opened,
   * falls back to the fallbackUrl if provided.
   * 
   * @param url - The deep link URL to open (e.g., 'myapp://screen/123')
   * @param options - Optional configuration (fallbackUrl)
   * @returns Promise<boolean> - True if deep link or fallback opened successfully
   * 
   * @example
   * ```typescript
   * // Open deep link with fallback
   * await urlLauncherHelper.openDeepLink('myapp://screen/123', {
   *   fallbackUrl: 'https://example.com/screen/123'
   * });
   * ```
   */
  async openDeepLink(url: string, options?: DeepLinkOptions): Promise<boolean> {
    try {
      const canOpen = await this.canOpenUrl(url);
      
      if (canOpen) {
        return await this.openUrl(url);
      } else if (options?.fallbackUrl) {
        return await this.openUrl(options.fallbackUrl);
      } else {
        const errorMsg = 'Cannot open deep link and no fallback URL provided';
        try {
          loggerHelper.warning('Deep link cannot be opened', { url, fallbackUrl: options?.fallbackUrl });
        } catch {
          console.warn(errorMsg);
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      try {
        loggerHelper.error('Error opening deep link', { 
          url, 
          fallbackUrl: options?.fallbackUrl,
          error: error instanceof Error ? error.message : String(error) 
        });
      } catch {
        console.error('Error opening deep link:', error);
      }
      return false;
    }
  }
}

// ---- Export ----
/**
 * Singleton instance of UrlLauncherHelper
 * 
 * This is the main export for using the URL Launcher Helper.
 * All methods are available on this instance.
 * 
 * @example
 * ```typescript
 * import { urlLauncherHelper } from 'masterfabric-expo-core';
 * await urlLauncherHelper.openUrl('https://example.com');
 * ```
 */
export const urlLauncherHelper = new UrlLauncherHelper();

/**
 * UrlLauncherHelper class export
 * 
 * Exported for advanced usage, such as creating custom instances
 * or extending the class functionality.
 */
export { UrlLauncherHelper };

