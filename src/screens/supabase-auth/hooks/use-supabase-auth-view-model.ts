import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabaseIntegration } from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface SupabaseAuthState {
  email: string;
  password: string;
  isLoading: boolean;
  lastError: string | null;
  user: any | null;
  isReady: boolean;
  authAvailable: boolean;
}

export interface SupabaseAuthActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  subscribeAuth: () => () => void;
}

export function useSupabaseAuthViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authAvailable, setAuthAvailable] = useState(false);
  const cancelRequested = useRef(false);

  const beginOperation = useCallback(() => {
    cancelRequested.current = false;
    setIsLoading(true);
    setLastError(null);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const available = supabaseIntegration.isAvailable();
      setAuthAvailable(available);
      
      if (available) {
        const currentUser = await supabaseIntegration.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      
      setIsReady(true);
    } catch (e: any) {
      console.error('[SupabaseAuth] Error refreshing status:', e);
      setLastError(e?.message ?? String(e));
      setIsReady(true);
    }
  }, []);

  const subscribeAuth = useCallback(() => {
    if (!supabaseIntegration.isAvailable()) {
      console.warn('[SupabaseAuth] Supabase not available, skipping auth subscription');
      return () => {};
    }

    try {
      const { subscription } = supabaseIntegration.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        console.log('[SupabaseAuth] Auth state changed:', event, session?.user?.id);
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        await refreshStatus();
      });

      return () => {
        subscription?.unsubscribe?.();
      };
    } catch (e: any) {
      console.error('[SupabaseAuth] Error subscribing to auth:', e);
      return () => {};
    }
  }, [refreshStatus]);

  const signIn = useCallback(async () => {
    beginOperation();
    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }
      if (!password.trim()) {
        throw new Error('Please enter your password');
      }
      await supabaseIntegration.signInWithEmail(email.trim(), password);
      await refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, [email, password, refreshStatus, beginOperation]);

  const signUp = useCallback(async () => {
    beginOperation();
    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }
      if (!password.trim()) {
        throw new Error('Please enter your password');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      await supabaseIntegration.signUpWithEmail(email.trim(), password);
      await refreshStatus();
    } catch (e: any) {
      const errorMsg = e?.message || e?.toString() || 'Unknown error';
      setLastError(errorMsg);
      console.error('[SupabaseAuth] Sign-up error:', errorMsg);
      throw e;
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, [email, password, refreshStatus, beginOperation]);

  const signOut = useCallback(async () => {
    beginOperation();
    try {
      await supabaseIntegration.signOut();
      await refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, [refreshStatus, beginOperation]);

  useEffect(() => {
    return () => {
      cancelRequested.current = true;
    };
  }, []);

  const state: SupabaseAuthState = {
    email,
    password,
    isLoading,
    lastError,
    user,
    isReady,
    authAvailable,
  };

  const actions: SupabaseAuthActions = {
    setEmail,
    setPassword,
    signIn,
    signUp,
    signOut,
    refreshStatus,
    subscribeAuth,
  };

  return { state, actions };
}

