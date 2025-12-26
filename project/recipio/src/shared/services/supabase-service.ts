/**
 * Supabase Client Service
 * 
 * This service provides a singleton Supabase client instance
 * for database operations, authentication, and storage.
 * 
 * Configuration:
 * - Set EXPO_PUBLIC_SUPABASE_URL in .env file
 * - Set EXPO_PUBLIC_SUPABASE_ANON_KEY in .env file
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase configuration missing!\n' +
    'Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.\n' +
    'See .env.example for reference.'
  );
}

/**
 * Supabase client instance
 * Singleton pattern - use this instance throughout the app
 */
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

/**
 * Test Supabase connection
 * 
 * @returns Promise<boolean> - true if connection successful, false otherwise
 */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabase) {
    console.error('❌ Supabase client not initialized. Check your .env configuration.');
    return false;
  }

  try {
    // Simple connection test - try to get current user or make a simple query
    const { error } = await supabase.from('_test').select('count').limit(1);
    
    // If error is about table not existing, that's okay - connection works
    // If error is about connection/auth, that's a problem
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return false;
  }
}

/**
 * Get Supabase client instance
 * 
 * @returns SupabaseClient | null
 */
export function getSupabaseClient(): SupabaseClient | null {
  return supabase;
}

/**
 * Check if Supabase is configured
 * 
 * @returns boolean
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

