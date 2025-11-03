import { firebaseIntegration } from 'masterfabric-expo-core';
import { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { useFirebaseHelperStore } from '../store/firebase-helper-store';

export function useFirebaseHelperViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ id: string; [k: string]: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [googleIdToken, setGoogleIdToken] = useState('');
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [appleIdToken, setAppleIdToken] = useState('');
  const [lastError, setLastError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [authAvailable, setAuthAvailable] = useState<boolean>(false);
  const { writeCount, incrementWriteCount } = useFirebaseHelperStore();
  const [cancelRequested, setCancelRequested] = useState<boolean>(false);

  const beginOperation = useCallback(() => {
    setCancelRequested(false);
    setIsLoading(true);
    setLastError(null);
  }, []);

  const cancelCurrentOperation = useCallback(() => {
    setCancelRequested(true);
    setIsLoading(false);
  }, []);

  const canUseAnalytics = useMemo(() => Platform.OS === 'web', []);

  const refreshStatus = useCallback(() => {
    try {
      const ready = typeof firebaseIntegration.isInitialized === 'function' && firebaseIntegration.isInitialized();
      setIsReady(!!ready);
      const hasAuth = typeof (firebaseIntegration as any).isAuthAvailable === 'function'
        ? (firebaseIntegration as any).isAuthAvailable()
        : false;
      setAuthAvailable(!!hasAuth);
      if (!hasAuth) {
        console.warn('[FirebaseHelper] Auth module is not available. Some features will be disabled.');
      }
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      setIsReady(false);
      setAuthAvailable(false);
    }
  }, []);

  const subscribeAuth = useCallback(() => {
    const auth = firebaseIntegration.getAuth();
    if (!auth) return () => {};
    return firebaseIntegration.onAuthStateChanged((user) => {
      setAuthUserId(user?.uid ?? null);
    });
  }, []);

  const signIn = useCallback(async () => {
    beginOperation();
    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }
      if (!password.trim()) {
        throw new Error('Please enter your password');
      }
      await firebaseIntegration.signInWithEmail(email.trim(), password);
      refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [email, password, refreshStatus, beginOperation, cancelRequested]);

  const signOut = useCallback(async () => {
    beginOperation();
    try {
      await firebaseIntegration.signOut();
      refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [refreshStatus, beginOperation, cancelRequested]);

  const signUpWithEmail = useCallback(async () => {
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
      await firebaseIntegration.signUpWithEmail(email.trim(), password);
      refreshStatus();
    } catch (e: any) {
      const errorMsg = e?.message || e?.toString() || 'Unknown error';
      setLastError(errorMsg);
      console.error('[FirebaseHelper] Sign-up error:', errorMsg);
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [email, password, refreshStatus, beginOperation, cancelRequested]);

  const signInAnonymously = useCallback(async () => {
    beginOperation();
    try {
      const auth = firebaseIntegration.getAuth();
      if (!auth) return;
      const { signInAnonymously } = require('firebase/auth');
      await signInAnonymously(auth);
      refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [refreshStatus, beginOperation, cancelRequested]);

  const signInWithGoogleWeb = useCallback(async () => {
    beginOperation();
    try {
      await firebaseIntegration.signInWithGoogleWebPopup();
      refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [refreshStatus, beginOperation, cancelRequested]);

  const signInWithGoogleTokens = useCallback(async () => {
    beginOperation();
    try {
      await firebaseIntegration.signInWithGoogleIdToken(googleIdToken.trim(), googleAccessToken.trim() || undefined);
      refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [googleIdToken, googleAccessToken, refreshStatus, beginOperation, cancelRequested]);

  const signInWithAppleToken = useCallback(async () => {
    beginOperation();
    try {
      await firebaseIntegration.signInWithAppleIdToken(appleIdToken.trim());
      refreshStatus();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [appleIdToken, refreshStatus, beginOperation, cancelRequested]);

  const sendPasswordReset = useCallback(async (email: string) => {
    beginOperation();
    try {
      const auth = firebaseIntegration.getAuth();
      if (!auth) return;
      const { sendPasswordResetEmail } = require('firebase/auth');
      await sendPasswordResetEmail(auth, email);
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [beginOperation, cancelRequested]);

  const logDemoEvent = useCallback(() => {
    firebaseIntegration.logEvent('demo_event', { env: Platform.OS });
  }, []);

  const loadItems = useCallback(async () => {
    beginOperation();
    try {
      const auth = firebaseIntegration.getAuth();
      if (auth && !auth.currentUser) {
        const { signInAnonymously } = require('firebase/auth');
        try { await signInAnonymously(auth); } catch {}
      }
      const db = firebaseIntegration.getFirestore();
      if (!db) return;
      const { collection, getDocs } = require('firebase/firestore');
      const snap = await Promise.race([
        getDocs(collection(db, 'items')),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout loading items')), 10000)),
      ]);
      if (!cancelRequested) setItems(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [beginOperation, cancelRequested]);

  const createSampleItem = useCallback(async () => {
    beginOperation();
    try {
      const auth = firebaseIntegration.getAuth();
      if (auth && !auth.currentUser) {
        const { signInAnonymously } = require('firebase/auth');
        try { await signInAnonymously(auth); } catch {}
      }
      const db = firebaseIntegration.getFirestore();
      if (!db) return;
      const { collection, addDoc, serverTimestamp } = require('firebase/firestore');
      await Promise.race([
        addDoc(collection(db, 'items'), { createdAt: serverTimestamp(), source: 'helper', value: Math.random() }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout writing item')), 10000)),
      ]);
      if (!cancelRequested) incrementWriteCount();
    } catch (e: any) {
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested) setIsLoading(false);
    }
  }, [beginOperation, cancelRequested, incrementWriteCount]);

  return {
    state: { email, password, authUserId, items, isLoading, canUseAnalytics, googleIdToken, googleAccessToken, appleIdToken, lastError, isReady, authAvailable, writeCount, cancelRequested },
    actions: { setEmail, setPassword, signIn, signOut, signUpWithEmail, signInAnonymously, logDemoEvent, loadItems, createSampleItem, subscribeAuth, signInWithGoogleWeb, signInWithGoogleTokens, signInWithAppleToken, setGoogleIdToken, setGoogleAccessToken, setAppleIdToken, refreshStatus, cancelCurrentOperation, sendPasswordReset },
  } as const;
}


