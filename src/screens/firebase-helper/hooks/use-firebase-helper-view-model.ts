import { firebaseIntegration } from 'masterfabric-expo-core';
import { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export function useFirebaseHelperViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ id: string; [k: string]: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [googleIdToken, setGoogleIdToken] = useState('');
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [appleIdToken, setAppleIdToken] = useState('');

  const canUseAnalytics = useMemo(() => Platform.OS === 'web', []);

  const subscribeAuth = useCallback(() => {
    return firebaseIntegration.onAuthStateChanged((user) => {
      setAuthUserId(user?.uid ?? null);
    });
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseIntegration.signInWithEmail(email.trim(), password);
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseIntegration.signOut();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUpWithEmail = useCallback(async () => {
    setIsLoading(true);
    try {
      const auth = firebaseIntegration.getAuth();
      if (!auth) return;
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  const signInAnonymously = useCallback(async () => {
    setIsLoading(true);
    try {
      const auth = firebaseIntegration.getAuth();
      if (!auth) return;
      const { signInAnonymously } = require('firebase/auth');
      await signInAnonymously(auth);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogleWeb = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseIntegration.signInWithGoogleWebPopup();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogleTokens = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseIntegration.signInWithGoogleIdToken(googleIdToken.trim(), googleAccessToken.trim() || undefined);
    } finally {
      setIsLoading(false);
    }
  }, [googleIdToken, googleAccessToken]);

  const signInWithAppleToken = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseIntegration.signInWithAppleIdToken(appleIdToken.trim());
    } finally {
      setIsLoading(false);
    }
  }, [appleIdToken]);

  const logDemoEvent = useCallback(() => {
    firebaseIntegration.logEvent('demo_event', { env: Platform.OS });
  }, []);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const db = firebaseIntegration.getFirestore();
      if (!db) return;
      const { collection, getDocs } = require('firebase/firestore');
      const snap = await getDocs(collection(db, 'items'));
      setItems(snap.docs.map((d: any) => ({ id: d.id, ...d.data() })));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSampleItem = useCallback(async () => {
    setIsLoading(true);
    try {
      const db = firebaseIntegration.getFirestore();
      if (!db) return;
      const { collection, addDoc, serverTimestamp } = require('firebase/firestore');
      await addDoc(collection(db, 'items'), { createdAt: serverTimestamp(), source: 'helper', value: Math.random() });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    state: { email, password, authUserId, items, isLoading, canUseAnalytics, googleIdToken, googleAccessToken, appleIdToken },
    actions: { setEmail, setPassword, signIn, signOut, signUpWithEmail, signInAnonymously, logDemoEvent, loadItems, createSampleItem, subscribeAuth, signInWithGoogleWeb, signInWithGoogleTokens, signInWithAppleToken, setGoogleIdToken, setGoogleAccessToken, setAppleIdToken },
  } as const;
}


