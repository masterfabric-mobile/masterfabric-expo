import * as Sentry from '@sentry/react-native';

/**
 * Sentry Configuration Interface
 */
export interface SentryConfig {
  dsn: string;
  environment?: 'development' | 'staging' | 'production';
  debug?: boolean;
  enableAutoSessionTracking?: boolean;
  enableNativeCrashHandling?: boolean;
  enableAutoPerformanceTracking?: boolean;
  tracesSampleRate?: number;
  maxBreadcrumbs?: number;
  beforeSend?: (event: any) => any;
  beforeBreadcrumb?: (breadcrumb: any) => any;
  customOptions?: Record<string, any>;
}

/**
 * Sentry Integration Class
 */
export class SentryIntegration {
  private static instance: SentryIntegration;
  private sentryInitialized: boolean = false;
  private config: SentryConfig | null = null;

  private constructor() {
    // No initialization needed
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SentryIntegration {
    if (!SentryIntegration.instance) {
      SentryIntegration.instance = new SentryIntegration();
    }
    return SentryIntegration.instance;
  }

  /**
   * Initialize Sentry with configuration
   */
  public async initialize(config: SentryConfig): Promise<void> {
    if (this.sentryInitialized) {
      console.warn('[Sentry] Already initialized');
      return;
    }

    try {
      this.config = config;

      // Initialize Sentry
      Sentry.init({
        dsn: config.dsn,
        environment: config.environment || 'production',
        debug: config.debug || false,
        enableAutoSessionTracking: config.enableAutoSessionTracking ?? true,
        enableNativeCrashHandling: config.enableNativeCrashHandling ?? true,
        enableAutoPerformanceTracing: config.enableAutoPerformanceTracking ?? true,
        tracesSampleRate: config.tracesSampleRate || 1.0,
        maxBreadcrumbs: config.maxBreadcrumbs || 100,
        beforeSend: config.beforeSend,
        beforeBreadcrumb: config.beforeBreadcrumb,
        ...config.customOptions,
      });

      // Set user context
      this.setUserContext();

      // Set custom tags
      this.setCustomTags();

      this.sentryInitialized = true;
      console.log('[Sentry] Initialized successfully', {
        environment: config.environment,
        debug: config.debug,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Sentry] Failed to initialize:', errorMessage);
      throw error;
    }
  }

  /**
   * Set user context
   */
  public setUserContext(user?: {
    id?: string;
    username?: string;
    email?: string;
    extra?: Record<string, any>;
  }): void {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized, cannot set user context');
      return;
    }

    try {
      Sentry.setUser(user || null);
      console.log('[Sentry] User context set', { userId: user?.id });
    } catch (error) {
      console.error('[Sentry] Failed to set user context:', error);
    }
  }

  /**
   * Set custom tags
   */
  private setCustomTags(): void {
    if (!this.sentryInitialized) return;

    try {
      // Set custom tags from config
      if (this.config?.customOptions?.tags) {
        Object.entries(this.config.customOptions.tags).forEach(([key, value]) => {
          Sentry.setTag(key, String(value));
        });
      }
    } catch (error) {
      console.error('[Sentry] Failed to set custom tags:', error);
    }
  }

  /**
   * Capture exception
   */
  public captureException(error: Error, context?: Record<string, any>): void {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized, cannot capture exception');
      return;
    }

    try {
      Sentry.captureException(error, {
        tags: context?.tags,
        extra: context?.extra,
        level: context?.level || 'error',
      });

      console.log('[Sentry] Exception captured', {
        error: error.message,
        context,
      });
    } catch (sentryError) {
      console.error('[Sentry] Failed to capture exception:', sentryError);
    }
  }

  /**
   * Capture message
   */
  public captureMessage(message: string, level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info', context?: Record<string, any>): void {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized, cannot capture message');
      return;
    }

    try {
      Sentry.captureMessage(message, {
        level,
        tags: context?.tags,
        extra: context?.extra,
      });

      console.log('[Sentry] Message captured', {
        message,
        level,
        context,
      });
    } catch (error) {
      console.error('[Sentry] Failed to capture message:', error);
    }
  }

  /**
   * Add breadcrumb
   */
  public addBreadcrumb(breadcrumb: {
    message?: string;
    category?: string;
    level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
    data?: Record<string, any>;
  }): void {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized, cannot add breadcrumb');
      return;
    }

    try {
      Sentry.addBreadcrumb({
        message: breadcrumb.message,
        category: breadcrumb.category || 'masterview',
        level: breadcrumb.level || 'info',
        data: breadcrumb.data,
      });

      console.log('[Sentry] Breadcrumb added', breadcrumb);
    } catch (error) {
      console.error('[Sentry] Failed to add breadcrumb:', error);
    }
  }

  /**
   * Set context
   */
  public setContext(key: string, context: Record<string, any>): void {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized, cannot set context');
      return;
    }

    try {
      Sentry.setContext(key, context);
      console.log('[Sentry] Context set', { key, context });
    } catch (error) {
      console.error('[Sentry] Failed to set context:', error);
    }
  }

  /**
   * Set tag
   */
  public setTag(key: string, value: string): void {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized, cannot set tag');
      return;
    }

    try {
      Sentry.setTag(key, value);
      console.log('[Sentry] Tag set', { key, value });
    } catch (error) {
      console.error('[Sentry] Failed to set tag:', error);
    }
  }

  /**
   * Track performance
   */
  public startTransaction(name: string, op: string = 'navigation'): any {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized, cannot start transaction');
      return null;
    }

    try {
      // Note: startTransaction is deprecated in newer Sentry versions
      // This is a simplified implementation
      console.log('[Sentry] Transaction started', { name, op });
      return { name, op, finish: () => {} };
    } catch (error) {
      console.error('[Sentry] Failed to start transaction:', error);
      return null;
    }
  }

  /**
   * Get Sentry client
   */
  public getClient(): any {
    if (!this.sentryInitialized) {
      console.warn('[Sentry] Not initialized');
      return null;
    }
    return Sentry.getCurrentScope();
  }

  /**
   * Check if Sentry is initialized
   */
  public isInitialized(): boolean {
    return this.sentryInitialized;
  }

  /**
   * Get configuration
   */
  public getConfig(): SentryConfig | null {
    return this.config;
  }

  /**
   * Close Sentry
   */
  public async close(): Promise<void> {
    if (!this.sentryInitialized) {
      return;
    }

    try {
      await Sentry.close();
      this.sentryInitialized = false;
      console.log('[Sentry] Closed');
    } catch (error) {
      console.error('[Sentry] Failed to close:', error);
    }
  }
}

// Export singleton instance
export const sentryIntegration = SentryIntegration.getInstance();

// Export types
export type { SentryConfig as SentryConfigType };
