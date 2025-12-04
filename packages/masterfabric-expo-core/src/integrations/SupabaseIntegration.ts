import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type AuthChangeEvent, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/**
 * Supabase Configuration Interface
 */
export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Supabase Integration Class
 */
export class SupabaseIntegration {
  private static instance: SupabaseIntegration;
  private supabaseInitialized: boolean = false;
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig | null = null;
  private authStateSubscription: { data: { subscription: any } } | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): SupabaseIntegration {
    if (!SupabaseIntegration.instance) {
      SupabaseIntegration.instance = new SupabaseIntegration();
    }
    return SupabaseIntegration.instance;
  }

  /**
   * Resolve config from args or environment (.env via Expo public vars)
   */
  private resolveConfig(config?: Partial<SupabaseConfig>): SupabaseConfig | null {
    const envSource = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
    const resolved: SupabaseConfig = {
      supabaseUrl: config?.supabaseUrl || (process.env.EXPO_PUBLIC_SUPABASE_URL as string),
      supabaseAnonKey: config?.supabaseAnonKey || (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string),
    };

    // DEV ONLY: Print out what we're reading
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[Supabase] Attempting to resolve config for development');
      // eslint-disable-next-line no-console
      console.table({
        'envSource': envSource,
        'EXPO_PUBLIC_SUPABASE_URL': process.env.EXPO_PUBLIC_SUPABASE_URL,
        'EXPO_PUBLIC_SUPABASE_ANON_KEY': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '***' : undefined,
      });
      if (!resolved.supabaseUrl || !resolved.supabaseAnonKey) {
        // eslint-disable-next-line no-console
        console.warn('[Supabase] WARNING: One or more required Supabase config values are missing!\nCheck that your .env.development file exists AT THE PROJECT ROOT and contains these keys: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY. Then restart Metro.');
      }
    }

    if (!resolved.supabaseUrl || !resolved.supabaseAnonKey) {
      return null;
    }
    return resolved;
  }

  /**
   * Initialize Supabase with configuration or env values
   */
  public async initialize(config?: Partial<SupabaseConfig>): Promise<void> {
    if (this.supabaseInitialized) {
      console.warn('[Supabase] Already initialized');
      return;
    }

    try {
      const resolvedConfig = this.resolveConfig(config);
      if (!resolvedConfig) {
        console.warn('[Supabase] Missing required config/env. Skipping initialization.');
        return;
      }

      this.config = resolvedConfig;

      // Create Supabase client with AsyncStorage adapter for React Native
      this.client = createClient(resolvedConfig.supabaseUrl, resolvedConfig.supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });

      this.supabaseInitialized = true;
      console.log('[Supabase] Initialized successfully', {
        platform: Platform.OS,
        url: resolvedConfig.supabaseUrl,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Supabase] Failed to initialize:', errorMessage);
      throw error;
    }
  }

  /**
   * Get Supabase client instance
   */
  public getClient(): SupabaseClient | null {
    if (!this.supabaseInitialized) {
      console.warn('[Supabase] Not initialized');
      return null;
    }
    return this.client;
  }

  /**
   * Get Supabase configuration (URL and key)
   */
  public getConfig(): SupabaseConfig | null {
    if (!this.supabaseInitialized) {
      return null;
    }
    return this.config;
  }

  /**
   * Check if Supabase is available
   */
  public isAvailable(): boolean {
    return this.supabaseInitialized && this.client !== null;
  }

  /**
   * Sign in with email and password
   */
  public async signInWithEmail(email: string, password: string): Promise<any> {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const client = this.getClient();
    if (!client) {
      throw new Error('Supabase is not available. Ensure Supabase is initialized.');
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.warn('[Supabase] Email sign-in failed', { message: error.message });
        throw error;
      }

      console.log('[Supabase] Email sign-in success', { userId: data?.user?.id });
      return data;
    } catch (err: any) {
      const friendlyMessage = this.getSupabaseErrorMessage(err);
      console.warn('[Supabase] Email sign-in failed', { message: err?.message });
      
      const error = new Error(friendlyMessage);
      (error as any).code = err?.code || 'unknown';
      (error as any).originalError = err;
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  public async signUpWithEmail(email: string, password: string): Promise<any> {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const client = this.getClient();
    if (!client) {
      throw new Error('Supabase is not available. Ensure Supabase is initialized.');
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.warn('[Supabase] Email sign-up failed', { message: error.message });
        throw error;
      }

      console.log('[Supabase] Email sign-up success', { userId: data?.user?.id });
      return data;
    } catch (err: any) {
      const friendlyMessage = this.getSupabaseErrorMessage(err);
      console.warn('[Supabase] Email sign-up failed', { message: err?.message });
      
      const error = new Error(friendlyMessage);
      (error as any).code = err?.code || 'unknown';
      (error as any).originalError = err;
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  public async signOut(): Promise<void> {
    const client = this.getClient();
    if (!client) {
      throw new Error('Supabase is not available. Ensure Supabase is initialized.');
    }

    try {
      const { error } = await client.auth.signOut();
      if (error) {
        console.warn('[Supabase] Sign-out failed', { message: error.message });
        throw error;
      }
      console.log('[Supabase] Sign-out success');
    } catch (err: any) {
      console.warn('[Supabase] Sign-out failed', { message: err?.message });
      throw err;
    }
  }

  /**
   * Get current authenticated user
   */
  public async getCurrentUser(): Promise<any> {
    const client = this.getClient();
    if (!client) {
      return null;
    }

    try {
      const { data: { user }, error } = await client.auth.getUser();
      if (error) {
        console.warn('[Supabase] Get user failed', { message: error.message });
        return null;
      }
      return user;
    } catch (err: any) {
      console.warn('[Supabase] Get user failed', { message: err?.message });
      return null;
    }
  }

  /**
   * Get current session
   */
  public async getSession(): Promise<Session | null> {
    const client = this.getClient();
    if (!client) {
      return null;
    }

    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (error) {
        console.warn('[Supabase] Get session failed', { message: error.message });
        return null;
      }
      return session;
    } catch (err: any) {
      console.warn('[Supabase] Get session failed', { message: err?.message });
      return null;
    }
  }

  /**
   * Subscribe to auth state changes
   */
  public onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ): { data: { subscription: { unsubscribe: () => void } } } {
    const client = this.getClient();
    if (!client) {
      throw new Error('Supabase is not available. Ensure Supabase is initialized.');
    }

    const { data } = client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    this.authStateSubscription = data;
    return data;
  }

  /**
   * Get friendly error messages for Supabase errors
   */
  private getSupabaseErrorMessage(error: any): string {
    const errorCode = error?.code || error?.message || 'unknown';
    
    const errorMessages: Record<string, string> = {
      'invalid_credentials': 'Invalid email or password',
      'email_not_confirmed': 'Please confirm your email address before signing in',
      'user_not_found': 'No account found with this email address',
      'email_already_registered': 'An account with this email already exists',
      'weak_password': 'Password is too weak. Please use a stronger password',
      'invalid_email': 'Please enter a valid email address',
      'too_many_requests': 'Too many requests. Please try again later',
    };

    // Check if error message contains any of these codes
    for (const [code, message] of Object.entries(errorMessages)) {
      if (errorCode.toLowerCase().includes(code) || error?.message?.toLowerCase().includes(code)) {
        return message;
      }
    }

    // Return original message or generic error
    return error?.message || 'An error occurred. Please try again.';
  }
}

// Export singleton instance for convenience
export const supabaseIntegration = SupabaseIntegration.getInstance();

