import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { Platform } from 'react-native';

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
  // Cached modules (lazy)
  private _auth: any = null;
  private _firestore: any = null;
  private _storage: any = null;

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
   * Auth access (lazy load)
   */
  public getAuth(): any | null {
    const app = this.getApp();
    if (!app) return null;
    if (!this._auth) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getAuth } = require('firebase/auth');
        this._auth = getAuth(app);
      } catch (e) {
        console.warn('[Firebase] Auth module not available. Ensure firebase/auth is installed.');
        return null;
      }
    }
    return this._auth;
  }

  /**
   * Firestore access (lazy load)
   */
  public getFirestore(): any | null {
    const app = this.getApp();
    if (!app) return null;
    if (!this._firestore) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getFirestore } = require('firebase/firestore');
        this._firestore = getFirestore(app);
      } catch (e) {
        console.warn('[Firebase] Firestore module not available. Ensure firebase/firestore is installed.');
        return null;
      }
    }
    return this._firestore;
  }

  /**
   * Storage access (lazy load)
   */
  public getStorage(): any | null {
    const app = this.getApp();
    if (!app) return null;
    if (!this._storage) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getStorage } = require('firebase/storage');
        this._storage = getStorage(app);
      } catch (e) {
        console.warn('[Firebase] Storage module not available. Ensure firebase/storage is installed.');
        return null;
      }
    }
    return this._storage;
  }

  /**
   * Auth helpers (email/password)
   */
  public async signInWithEmail(email: string, password: string): Promise<any> {
    const auth = this.getAuth();
    if (!auth) throw new Error('Firebase Auth is not available');
    const { signInWithEmailAndPassword } = require('firebase/auth');
    return await signInWithEmailAndPassword(auth, email, password);
  }

  public async signOut(): Promise<void> {
    const auth = this.getAuth();
    if (!auth) throw new Error('Firebase Auth is not available');
    const { signOut } = require('firebase/auth');
    await signOut(auth);
  }

  public onAuthStateChanged(callback: (user: any | null) => void): () => void {
    const auth = this.getAuth();
    if (!auth) {
      console.warn('[Firebase] Auth is not available. onAuthStateChanged will be no-op.');
      return () => {};
    }
    const { onAuthStateChanged } = require('firebase/auth');
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Analytics helpers (web-only via Firebase Web SDK). On RN native, no-op.
   */
  private getAnalyticsInstance(): any | null {
    if (Platform.OS !== 'web') {
      return null;
    }
    try {
      const app = this.getApp();
      if (!app) return null;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getAnalytics } = require('firebase/analytics');
      return getAnalytics(app);
    } catch (e) {
      console.warn('[Firebase] Analytics module not available or unsupported in this environment.');
      return null;
    }
  }

  public logEvent(eventName: string, params?: Record<string, any>): void {
    const analytics = this.getAnalyticsInstance();
    if (!analytics) {
      console.warn('[Firebase] Analytics not available. logEvent skipped:', eventName);
      return;
    }
    const { logEvent } = require('firebase/analytics');
    logEvent(analytics, eventName, params);
  }

  public setUserId(userId: string): void {
    const analytics = this.getAnalyticsInstance();
    if (!analytics) {
      console.warn('[Firebase] Analytics not available. setUserId skipped');
      return;
    }
    const { setUserId } = require('firebase/analytics');
    setUserId(analytics, userId);
  }

  public setUserProperties(properties: Record<string, any>): void {
    const analytics = this.getAnalyticsInstance();
    if (!analytics) {
      console.warn('[Firebase] Analytics not available. setUserProperties skipped');
      return;
    }
    const { setUserProperties } = require('firebase/analytics');
    setUserProperties(analytics, properties);
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


