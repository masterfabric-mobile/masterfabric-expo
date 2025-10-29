import { firebaseIntegration } from 'masterfabric-expo-core';
import { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';

export function useFirebaseHelperViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ id: string; [k: string]: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    state: { email, password, authUserId, items, isLoading, canUseAnalytics },
    actions: { setEmail, setPassword, signIn, signOut, logDemoEvent, loadItems, subscribeAuth },
  } as const;
}


