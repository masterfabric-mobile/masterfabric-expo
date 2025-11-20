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
    const envSource = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
    const resolved: FirebaseConfig = {
      apiKey: config?.apiKey || (process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string),
      authDomain: config?.authDomain || (process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string | undefined),
      projectId: config?.projectId || (process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string),
      storageBucket: config?.storageBucket || (process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string | undefined),
      messagingSenderId: config?.messagingSenderId || (process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string | undefined),
      appId: config?.appId || (process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string),
      measurementId: config?.measurementId || (process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID as string | undefined),
    };

    // DEV ONLY: Print out what we're reading
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Firebase] Attempting to resolve config for development');
      // eslint-disable-next-line no-console
      console.table({
        'envSource': envSource,
        'EXPO_PUBLIC_FIREBASE_API_KEY': process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        'EXPO_PUBLIC_FIREBASE_PROJECT_ID': process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        'EXPO_PUBLIC_FIREBASE_APP_ID': process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      });
      if (!resolved.apiKey || !resolved.projectId || !resolved.appId) {
        // eslint-disable-next-line no-console
        console.warn('[Firebase] WARNING: One or more required Firebase config values are missing!\nCheck that your .env.development file exists AT THE PROJECT ROOT and contains these keys: EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_PROJECT_ID, EXPO_PUBLIC_FIREBASE_APP_ID. Then restart Metro.');
      }
    }

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
        console.log('[Firebase] App initialized', {
          platform: Platform.OS,
          projectId: resolvedConfig.projectId,
          authDomain: resolvedConfig.authDomain,
          storageBucket: resolvedConfig.storageBucket,
          measurementId: resolvedConfig.measurementId,
        });
      } else {
        // If already initialized elsewhere, treat as initialized
        this.app = (getApps()[0]);
        console.log('[Firebase] Using existing app', {
          platform: Platform.OS,
          name: this.app.name,
        });
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
   * Check if auth module is available
   */
  public isAuthAvailable(): boolean {
    try {
      // Just check if firebase/auth module exists
      require('firebase/auth');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Auth access (lazy load)
   */
  public getAuth(): any | null {
    // Check if Firebase app is initialized first
    if (!this.firebaseInitialized || !this.app) {
      console.warn('[Firebase] Cannot get Auth: Firebase app not initialized');
      return null;
    }
    
    const app = this.getApp();
    if (!app) return null;
    if (this._auth) return this._auth;
    try {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { getAuth } = require('firebase/auth');
        this._auth = getAuth(app);
        console.log('[Firebase] Auth initialized (web)');
      } else {
        // Native (iOS/Android): Use initializeAuth with AsyncStorage persistence
        try {
          // Import auth functions from firebase/auth
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const authModule = require('firebase/auth');
          const { initializeAuth, getAuth } = authModule;
          
          // Try to get getReactNativePersistence - it may not be available in all Firebase versions
          const getReactNativePersistence = authModule.getReactNativePersistence;
          
          // Get AsyncStorage
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
          
          // Try initializeAuth with persistence if available
          try {
            if (getReactNativePersistence && ReactNativeAsyncStorage) {
              this._auth = initializeAuth(app, {
                persistence: getReactNativePersistence(ReactNativeAsyncStorage),
              });
              console.log('[Firebase] Auth initialized (native) with AsyncStorage persistence');
            } else {
              // Fall back to basic initializeAuth without persistence
              console.warn('[Firebase] getReactNativePersistence not available, using basic auth');
              this._auth = initializeAuth(app, {});
              console.log('[Firebase] Auth initialized (native) without persistence');
            }
          } catch (initError: any) {
            // If initializeAuth fails, check if it's because auth is already initialized
            const errorMsg = initError?.message || '';
            const errorCode = initError?.code || '';
            
            if (
              errorCode === 'auth/already-initialized' ||
              errorMsg.toLowerCase().includes('already initialized') ||
              errorMsg.toLowerCase().includes('already-initialized')
            ) {
              // Auth already initialized, use getAuth
              this._auth = getAuth(app);
              console.log('[Firebase] Auth already initialized, using existing instance');
            } else {
              // Other error - try getAuth as fallback
              console.warn('[Firebase] initializeAuth failed, attempting getAuth:', errorMsg);
              try {
                this._auth = getAuth(app);
                console.warn('[Firebase] Using getAuth (persistence may not be configured)');
              } catch (getAuthError: any) {
                console.error('[Firebase] Both initializeAuth and getAuth failed');
                throw initError;
              }
            }
          }
        } catch (err: any) {
          const msg = err instanceof Error ? err.message : 'unknown error';
          console.error('[Firebase] Failed to obtain Auth on native:', msg);
          return null;
        }
      }
      return this._auth;
    } catch (e) {
      const msg = e instanceof Error ? `${e.message}` : 'unknown error';
      console.warn('[Firebase] Auth module not available. Ensure firebase/auth is installed.', msg);
      return null;
    }
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
        console.log('[Firebase] Firestore instance obtained');
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        console.warn('[Firebase] Firestore module not available. Ensure firebase/firestore is installed.', msg);
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
    if (!auth) {
      throw new Error('Firebase Auth is not available. Ensure Firebase is initialized and auth module is properly configured.');
    }
    
    // Validate auth instance is properly initialized
    if (typeof auth !== 'object' || auth === null) {
      throw new Error('Firebase Auth instance is invalid');
    }
    
    const { signInWithEmailAndPassword } = require('firebase/auth');
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log('[Firebase] Email sign-in success', { uid: res?.user?.uid });
      return res;
    } catch (err: any) {
      const errorCode = err?.code || 'unknown';
      const friendlyMessage = this.getFirebaseErrorMessage(errorCode);
      console.warn('[Firebase] Email sign-in failed', { code: errorCode, message: err?.message });
      
      // Create a new error with friendly message but preserve the code
      const error = new Error(friendlyMessage);
      (error as any).code = errorCode;
      (error as any).originalError = err;
      throw error;
    }
  }

  /**
   * Get user-friendly error message from Firebase error code
   */
  private getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }

  public async signUpWithEmail(email: string, password: string): Promise<any> {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    const auth = this.getAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not available. Ensure Firebase is initialized and auth module is properly configured.');
    }
    
    // Validate auth instance is properly initialized
    if (typeof auth !== 'object' || auth === null) {
      throw new Error('Firebase Auth instance is invalid');
    }
    
    const { createUserWithEmailAndPassword } = require('firebase/auth');
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('[Firebase] Email sign-up success', { uid: res?.user?.uid });
      return res;
    } catch (err: any) {
      const errorCode = err?.code || 'unknown';
      const friendlyMessage = this.getFirebaseErrorMessage(errorCode);
      console.warn('[Firebase] Email sign-up failed', { code: errorCode, message: err?.message });
      
      // Create a new error with friendly message but preserve the code
      const error = new Error(friendlyMessage);
      (error as any).code = errorCode;
      (error as any).originalError = err;
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    const auth = this.getAuth();
    if (!auth) throw new Error('Firebase Auth is not available');
    const { signOut } = require('firebase/auth');
    await signOut(auth);
    console.log('[Firebase] Signed out');
  }

  public onAuthStateChanged(callback: (user: any | null) => void): () => void {
    const auth = this.getAuth();
    if (!auth) {
      console.warn('[Firebase] Auth is not available. onAuthStateChanged will be no-op.');
      return () => {};
    }
    const { onAuthStateChanged } = require('firebase/auth');
    
    // Track if this is the first call to reduce log spam
    let isFirstCall = true;
    
    return onAuthStateChanged(auth, (user: any) => {
      // Only log on first call or when auth state actually changes
      if (isFirstCall) {
        console.log('[Firebase] Auth listener initialized', user?.uid ? `(user: ${user.uid})` : '(no user)');
        isFirstCall = false;
      }
      callback(user);
    });
  }

  /**
   * Social auth helpers
   */
  public async signInWithGoogleWebPopup(): Promise<any> {
    if (Platform.OS !== 'web') {
      console.warn('[Firebase] signInWithGoogleWebPopup is only available on web.');
      return null;
    }
    const auth = this.getAuth();
    if (!auth) throw new Error('Firebase Auth is not available');
    const { GoogleAuthProvider, signInWithPopup } = require('firebase/auth');
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  }

  public async signInWithCredential(provider: 'google' | 'apple', tokens: { idToken: string; accessToken?: string }): Promise<any> {
    try {
      const auth = this.getAuth();
      if (!auth) throw new Error('Firebase Auth is not available');
      const { OAuthProvider, signInWithCredential } = require('firebase/auth');
      const providerId = provider === 'google' ? 'google.com' : 'apple.com';
      const oauthProvider = new OAuthProvider(providerId);
      const credential = tokens.accessToken
        ? oauthProvider.credential({ idToken: tokens.idToken, accessToken: tokens.accessToken })
        : oauthProvider.credential({ idToken: tokens.idToken });
      return await signInWithCredential(auth, credential);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Firebase] Error during signInWithCredential for provider: ${provider}:`, errorMessage);
      throw new Error(`Failed to sign in with ${provider}: ${errorMessage}`);
    }
  }

  public async signInWithGoogleIdToken(idToken: string, accessToken?: string): Promise<any> {
    return this.signInWithCredential('google', { idToken, accessToken });
  }

  public async signInWithAppleIdToken(idToken: string): Promise<any> {
    return this.signInWithCredential('apple', { idToken });
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


