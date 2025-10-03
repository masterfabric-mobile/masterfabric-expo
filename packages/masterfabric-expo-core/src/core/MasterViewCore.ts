import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { SentryConfig, SentryIntegration } from '../integrations/SentryIntegration';

/**
 * MasterView Core Configuration Interface
 */
export interface MasterViewConfig {
  // Core Features
  enableActivityTracking: boolean;
  enableErrorBoundary: boolean;
  enableThemeSupport: boolean;
  enableLocalization: boolean;
  enableLoadingStates: boolean;
  enableNavigationTracking: boolean;
  
  // Performance Settings
  maxActivityItems: number;
  errorRetryAttempts: number;
  loadingTimeout: number;
  
  // Storage Settings
  enablePersistence: boolean;
  storagePrefix: string;
  
  // Debug Settings
  enableDebugMode: boolean;
  enableLogging: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  
  // Platform Specific
  enablePlatformFeatures: boolean;
  enableAccessibility: boolean;
  enablePermissions: boolean;
  
  // Custom Settings
  customSettings?: Record<string, any>;
  
  // Integrations
  enableSentry?: boolean;
  sentryConfig?: SentryConfig;
}

/**
 * MasterView Initialization Options
 */
export interface MasterViewInitOptions {
  appName?: string;
  appVersion?: string;
  environment?: 'development' | 'staging' | 'production';
  config?: Partial<MasterViewConfig>;
  onError?: (error: Error) => void;
  onActivityTracked?: (activity: any) => void;
  onThemeChanged?: (theme: string) => void;
  onLocaleChanged?: (locale: string) => void;
  onSentryError?: (error: Error) => void;
}

/**
 * MasterView Core Class - Singleton pattern
 */
class MasterViewCore {
  private static instance: MasterViewCore;
  private isInitialized: boolean = false;
  private config: MasterViewConfig;
  private options: MasterViewInitOptions;
  private storagePrefix: string = 'masterview_';
  private sentryIntegration: SentryIntegration;

  // Default configuration
  private defaultConfig: MasterViewConfig = {
    enableActivityTracking: true,
    enableErrorBoundary: true,
    enableThemeSupport: true,
    enableLocalization: true,
    enableLoadingStates: true,
    enableNavigationTracking: true,
    maxActivityItems: 50,
    errorRetryAttempts: 3,
    loadingTimeout: 10000,
    enablePersistence: true,
    storagePrefix: 'masterview_',
    enableDebugMode: __DEV__,
    enableLogging: __DEV__,
    logLevel: __DEV__ ? 'debug' : 'error',
    enablePlatformFeatures: true,
    enableAccessibility: true,
    enablePermissions: true,
    customSettings: {},
    enableSentry: false,
    sentryConfig: undefined,
  };

  private constructor() {
    this.config = { ...this.defaultConfig };
    this.options = {};
    this.sentryIntegration = SentryIntegration.getInstance();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): MasterViewCore {
    if (!MasterViewCore.instance) {
      MasterViewCore.instance = new MasterViewCore();
    }
    return MasterViewCore.instance;
  }

  /**
   * Initialize MasterView with options
   */
  public static async init(options: MasterViewInitOptions = {}): Promise<MasterViewCore> {
    const instance = MasterViewCore.getInstance();
    await instance.initialize(options);
    return instance;
  }

  /**
   * Initialize the core
   */
  private async initialize(options: MasterViewInitOptions): Promise<void> {
    if (this.isInitialized) {
      this.log('warn', 'MasterView already initialized');
      return;
    }

    try {
      this.options = options;
      
      // Merge configuration
      this.config = {
        ...this.defaultConfig,
        ...options.config,
      };

      // Set storage prefix
      this.storagePrefix = this.config.storagePrefix;

      // Load persisted settings
      if (this.config.enablePersistence) {
        await this.loadPersistedSettings();
      }

      // Initialize platform features
      if (this.config.enablePlatformFeatures) {
        await this.initializePlatformFeatures();
      }

      // Initialize accessibility
      if (this.config.enableAccessibility) {
        await this.initializeAccessibility();
      }

      // Initialize permissions
      if (this.config.enablePermissions) {
        await this.initializePermissions();
      }

      // Initialize Sentry
      if (this.config.enableSentry && this.config.sentryConfig) {
        await this.initializeSentry();
      }

      this.isInitialized = true;
      
      this.log('info', 'MasterView initialized successfully', {
        appName: this.getAppName(),
        appVersion: this.getAppVersion(),
        environment: this.getEnvironment(),
        platform: Platform.OS,
      });

      // Track initialization activity
      if (this.config.enableActivityTracking) {
        this.trackActivity('masterview_initialized', {
          timestamp: new Date().toISOString(),
          config: this.config,
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', 'Failed to initialize MasterView', { error: errorMessage });
      
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
      
      throw error;
    }
  }

  /**
   * Load persisted settings from storage
   */
  private async loadPersistedSettings(): Promise<void> {
    try {
      const persistedConfig = await AsyncStorage.getItem(`${this.storagePrefix}config`);
      if (persistedConfig) {
        const parsedConfig = JSON.parse(persistedConfig);
        this.config = { ...this.config, ...parsedConfig };
        this.log('debug', 'Loaded persisted settings', parsedConfig);
      }
    } catch (error) {
      this.log('warn', 'Failed to load persisted settings', { error });
    }
  }

  /**
   * Save settings to storage
   */
  public async saveSettings(): Promise<void> {
    if (!this.config.enablePersistence) {
      return;
    }

    try {
      await AsyncStorage.setItem(
        `${this.storagePrefix}config`,
        JSON.stringify(this.config)
      );
      this.log('debug', 'Settings saved to storage');
    } catch (error) {
      this.log('error', 'Failed to save settings', { error });
    }
  }

  /**
   * Initialize platform features
   */
  private async initializePlatformFeatures(): Promise<void> {
    // Platform-specific initialization
    this.log('debug', 'Initializing platform features', {
      platform: Platform.OS,
      version: Platform.Version,
    });
  }

  /**
   * Initialize accessibility features
   */
  private async initializeAccessibility(): Promise<void> {
    this.log('debug', 'Initializing accessibility features');
  }

  /**
   * Initialize permissions
   */
  private async initializePermissions(): Promise<void> {
    this.log('debug', 'Initializing permissions');
  }

  /**
   * Initialize Sentry
   */
  private async initializeSentry(): Promise<void> {
    try {
      await this.sentryIntegration.initialize(this.config.sentryConfig!);
      
      // Set error handler
      if (this.options.onSentryError) {
        // Sentry will automatically capture errors, but we can also call our handler
        this.sentryIntegration.captureMessage('MasterView Sentry integration initialized', 'info');
      }
      
      this.log('info', 'Sentry initialized successfully');
    } catch (error) {
      this.log('error', 'Failed to initialize Sentry', { error });
      if (this.options.onSentryError) {
        this.options.onSentryError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): MasterViewConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<MasterViewConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (this.config.enablePersistence) {
      this.saveSettings();
    }
    
    this.log('info', 'Configuration updated', updates);
  }

  /**
   * Get app name
   */
  public getAppName(): string {
    return this.options.appName || Constants.expoConfig?.name || 'MasterFabric App';
  }

  /**
   * Get app version
   */
  public getAppVersion(): string {
    return this.options.appVersion || Constants.expoConfig?.version || '1.0.0';
  }

  /**
   * Get environment
   */
  public getEnvironment(): string {
    return this.options.environment || (__DEV__ ? 'development' : 'production');
  }

  /**
   * Check if feature is enabled
   */
  public isFeatureEnabled(feature: keyof MasterViewConfig): boolean {
    return Boolean(this.config[feature]);
  }

  /**
   * Track activity
   */
  public trackActivity(action: string, details?: any): void {
    if (!this.config.enableActivityTracking) {
      return;
    }

    const activity = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString(),
      appName: this.getAppName(),
      appVersion: this.getAppVersion(),
    };

    this.log('debug', 'Activity tracked', activity);

    if (this.options.onActivityTracked) {
      this.options.onActivityTracked(activity);
    }
  }

  /**
   * Logging system
   */
  public log(level: 'error' | 'warn' | 'info' | 'debug', message: string, data?: any): void {
    if (!this.config.enableLogging) {
      return;
    }

    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = levels[this.config.logLevel];
    const messageLevel = levels[level];

    if (messageLevel <= currentLevel) {
      const timestamp = new Date().toISOString();
      const logMessage = `[MasterView] ${timestamp} [${level.toUpperCase()}] ${message}`;
      
      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  /**
   * Reset to defaults
   */
  public async reset(): Promise<void> {
    this.config = { ...this.defaultConfig };
    
    if (this.config.enablePersistence) {
      await AsyncStorage.removeItem(`${this.storagePrefix}config`);
    }
    
    this.log('info', 'MasterView reset to defaults');
  }

  /**
   * Get initialization status
   */
  public getInitializationStatus(): boolean {
    return this.isInitialized;
  }

  /**
   * Get storage prefix
   */
  public getStoragePrefix(): string {
    return this.storagePrefix;
  }

  /**
   * Set custom setting
   */
  public setCustomSetting(key: string, value: any): void {
    this.config.customSettings = {
      ...this.config.customSettings,
      [key]: value,
    };
    
    if (this.config.enablePersistence) {
      this.saveSettings();
    }
  }

  /**
   * Get custom setting
   */
  public getCustomSetting(key: string): any {
    return this.config.customSettings?.[key];
  }

  /**
   * Get Sentry integration
   */
  public getSentryIntegration(): SentryIntegration {
    return this.sentryIntegration;
  }

  /**
   * Capture exception with Sentry
   */
  public captureException(error: Error, context?: Record<string, any>): void {
    if (this.config.enableSentry) {
      this.sentryIntegration.captureException(error, context);
    }
    this.log('error', 'Exception captured', { error: error.message, context });
  }

  /**
   * Capture message with Sentry
   */
  public captureMessage(message: string, level: 'debug' | 'info' | 'warning' | 'error' | 'fatal' = 'info', context?: Record<string, any>): void {
    if (this.config.enableSentry) {
      this.sentryIntegration.captureMessage(message, level, context);
    }
    this.log(level === 'fatal' ? 'error' : level === 'warning' ? 'warn' : level, message, context);
  }

  /**
   * Add breadcrumb to Sentry
   */
  public addBreadcrumb(breadcrumb: {
    message?: string;
    category?: string;
    level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
    data?: Record<string, any>;
  }): void {
    if (this.config.enableSentry) {
      this.sentryIntegration.addBreadcrumb(breadcrumb);
    }
    this.log('debug', 'Breadcrumb added', breadcrumb);
  }

  /**
   * Set Sentry user context
   */
  public setSentryUser(user?: {
    id?: string;
    username?: string;
    email?: string;
    extra?: Record<string, any>;
  }): void {
    if (this.config.enableSentry) {
      this.sentryIntegration.setUserContext(user);
    }
    this.log('debug', 'Sentry user context set', { userId: user?.id });
  }

  /**
   * Set Sentry context
   */
  public setSentryContext(key: string, context: Record<string, any>): void {
    if (this.config.enableSentry) {
      this.sentryIntegration.setContext(key, context);
    }
    this.log('debug', 'Sentry context set', { key, context });
  }

  /**
   * Set Sentry tag
   */
  public setSentryTag(key: string, value: string): void {
    if (this.config.enableSentry) {
      this.sentryIntegration.setTag(key, value);
    }
    this.log('debug', 'Sentry tag set', { key, value });
  }

  /**
   * Start Sentry transaction
   */
  public startSentryTransaction(name: string, op: string = 'navigation'): any {
    if (this.config.enableSentry) {
      return this.sentryIntegration.startTransaction(name, op);
    }
    return null;
  }
}

// Export singleton instance and init function
export const MasterView = MasterViewCore.getInstance();
export const initMasterView = MasterViewCore.init;

// Export types
export type { MasterViewConfig as MasterViewConfigType, MasterViewInitOptions as MasterViewInitOptionsType };
