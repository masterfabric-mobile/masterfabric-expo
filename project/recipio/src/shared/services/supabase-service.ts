/**
 * Supabase Client Service
 * Configuration from app.json extra or EXPO_PUBLIC_* env vars
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// .env öncelikli (EXPO_PUBLIC_*), yoksa app.json extra
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.supabaseUrl;

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  Constants.expoConfig?.extra?.supabaseAnonKey;

let supabaseClient: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      '⚠️ Supabase configuration missing! Set supabaseUrl and supabaseAnonKey in app.json extra or .env'
    );
    throw new Error('Supabase URL and Anon Key not found!');
  }

  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
}

export function getSupabaseClient(): SupabaseClient | null {
  try {
    if (supabaseClient) return supabaseClient;
    if (SUPABASE_URL && SUPABASE_ANON_KEY) return initSupabase();
  } catch {
    // Config missing or invalid
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}
