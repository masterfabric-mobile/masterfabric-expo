import { MasterViewConfig } from '../core/MasterViewCore';

/**
 * Detect which integrations are available based on environment variables
 */
export function detectIntegrations(): Partial<MasterViewConfig> {
  const config: Partial<MasterViewConfig> = {};

  const normalizeEnvironment = (
    value: string | undefined
  ): 'development' | 'production' | 'staging' | undefined => {
    if (!value) return undefined;
    const v = value.toLowerCase();
    if (v === 'development' || v === 'production' || v === 'staging') return v;
    return undefined;
  };

  // Detect Sentry
  const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (sentryDsn) {
    config.enableSentry = true;
    config.sentryConfig = {
      dsn: sentryDsn,
      environment:
        normalizeEnvironment(process.env.EXPO_PUBLIC_ENVIRONMENT) ?? (__DEV__ ? 'development' : 'production'),
      debug: __DEV__,
      enableAutoSessionTracking: true,
      enableNativeCrashHandling: true,
      enableAutoPerformanceTracking: true,
      tracesSampleRate: __DEV__ ? 1.0 : 0.1,
      maxBreadcrumbs: 100,
    };
  }

  // Detect Firebase
  const firebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  if (firebaseApiKey) {
    config.enableFirebase = true;
    config.enableFirebaseAuth = !!process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
    config.enableFirebaseAnalytics = !!process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;
    config.firebaseConfig = {
      apiKey: firebaseApiKey,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
  }

  // Detect Supabase
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    config.enableSupabase = true;
    config.enableSupabaseAuth = !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    config.supabaseConfig = {
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    };
  }

  return config;
}

/**
 * Check if a specific integration is available
 */
export function hasIntegration(integration: 'sentry' | 'firebase' | 'supabase'): boolean {
  switch (integration) {
    case 'sentry':
      return !!process.env.EXPO_PUBLIC_SENTRY_DSN;
    case 'firebase':
      return !!process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    case 'supabase':
      return !!process.env.EXPO_PUBLIC_SUPABASE_URL;
    default:
      return false;
  }
}

