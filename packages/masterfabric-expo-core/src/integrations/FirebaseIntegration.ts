import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * Firebase Configuration Interface
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

/**
 * Firebase Integration Class
 */
export class FirebaseIntegration {
  private static instance: FirebaseIntegration;
  private firebaseInitialized: boolean = false;
  private app: FirebaseApp | null = null;
  private config: FirebaseConfig | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): FirebaseIntegration {
    if (!FirebaseIntegration.instance) {
      FirebaseIntegration.instance = new FirebaseIntegration();
    }
    return FirebaseIntegration.instance;
  }

  /**
   * Resolve config from args or environment (.env via Expo public vars)
   */
  private resolveConfig(config?: Partial<FirebaseConfig>): FirebaseConfig | null {
    const resolved: FirebaseConfig = {
      apiKey: config?.apiKey || (process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string),
      authDomain: config?.authDomain || (process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string | undefined),
      projectId: config?.projectId || (process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string),
      storageBucket: config?.storageBucket || (process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string | undefined),
      messagingSenderId: config?.messagingSenderId || (process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string | undefined),
      appId: config?.appId || (process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string),
      measurementId: config?.measurementId || (process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID as string | undefined),
    };

    if (!resolved.apiKey || !resolved.projectId || !resolved.appId) {
      return null;
    }

    return resolved;
  }

  /**
   * Initialize Firebase with configuration or env values
   */
  public async initialize(config?: Partial<FirebaseConfig>): Promise<void> {
    if (this.firebaseInitialized) {
      console.warn('[Firebase] Already initialized');
      return;
    }

    try {
      const resolvedConfig = this.resolveConfig(config);
      if (!resolvedConfig) {
        console.warn('[Firebase] Missing required config/env. Skipping initialization.');
        return;
      }

      this.config = resolvedConfig;

      if (getApps().length === 0) {
        this.app = initializeApp(resolvedConfig);
      } else {
        // If already initialized elsewhere, treat as initialized
        this.app = (getApps()[0]);
      }

      this.firebaseInitialized = true;
      console.log('[Firebase] Initialized successfully', {
        projectId: resolvedConfig.projectId,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Firebase] Failed to initialize:', errorMessage);
      throw error;
    }
  }

  /**
   * Get Firebase app instance
   */
  public getApp(): FirebaseApp | null {
    if (!this.firebaseInitialized) {
      console.warn('[Firebase] Not initialized');
      return null;
    }
    return this.app;
  }

  /**
   * Check if Firebase is initialized
   */
  public isInitialized(): boolean {
    return this.firebaseInitialized;
  }

  /**
   * Get configuration
   */
  public getConfig(): FirebaseConfig | null {
    return this.config;
  }
}

// Export singleton instance
export const firebaseIntegration = FirebaseIntegration.getInstance();

// Export types
export type { FirebaseConfig as FirebaseConfigType };


