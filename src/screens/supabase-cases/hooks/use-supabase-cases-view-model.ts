import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabaseIntegration } from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  brand: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: string | null;
  items: OrderItem[];
  total_price: number;
  status: string;
  shipping_address: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface SupabaseCasesState {
  isReady: boolean;
  isConnected: boolean;
  user: any | null;
  selectedCase: string | null;
  products: Product[];
  isLoadingProducts: boolean;
  orders: Order[];
  isLoadingOrders: boolean;
  lastError: string | null;
}

export interface SupabaseCasesActions {
  refreshStatus: () => Promise<void>;
  selectCase: (caseId: string | null) => void;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useSupabaseCasesViewModel() {
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const cancelRequested = useRef(false);
  const isLoadingRef = useRef(false);
  const isLoadingOrdersRef = useRef(false);

  const refreshStatus = useCallback(async () => {
    try {
      const available = supabaseIntegration.isAvailable();
      setIsConnected(available);
      
      if (available) {
        try {
          const currentUser = await supabaseIntegration.getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setIsReady(true);
    } catch (e: any) {
      console.error('[SupabaseCases] Error refreshing status:', e);
      setLastError(e?.message ?? String(e));
      setIsReady(true);
      setIsConnected(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!supabaseIntegration.isAvailable()) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await supabaseIntegration.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    }
  }, []);

  const selectCase = useCallback((caseId: string | null) => {
    setSelectedCase(caseId);
  }, []);

  const fetchProducts = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isLoadingRef.current) {
      console.log('[SupabaseCases] Fetch already in progress, skipping...');
      return;
    }

    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      setIsLoadingProducts(false);
      isLoadingRef.current = false;
      return;
    }

    // Reset error state before fetching
    setLastError(null);
    setIsLoadingProducts(true);
    isLoadingRef.current = true;

    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (!cancelRequested.current) {
        setProducts(data as Product[] || []);
        setLastError(null);
      }
    } catch (e: any) {
      console.error('[SupabaseCases] Error fetching products:', e);
      if (!cancelRequested.current) {
        setLastError(e?.message ?? String(e));
        // Don't clear products on error, keep existing data
      }
    } finally {
      if (!cancelRequested.current) {
        setIsLoadingProducts(false);
        isLoadingRef.current = false;
      }
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isLoadingOrdersRef.current) {
      console.log('[SupabaseCases] Orders fetch already in progress, skipping...');
      return;
    }

    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      setIsLoadingOrders(false);
      isLoadingOrdersRef.current = false;
      return;
    }

    // Reset error state before fetching
    setLastError(null);
    setIsLoadingOrders(true);
    isLoadingOrdersRef.current = true;

    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (!cancelRequested.current) {
        setOrders(data as Order[] || []);
        setLastError(null);
      }
    } catch (e: any) {
      console.error('[SupabaseCases] Error fetching orders:', e);
      if (!cancelRequested.current) {
        setLastError(e?.message ?? String(e));
        // Don't clear orders on error, keep existing data
      }
    } finally {
      if (!cancelRequested.current) {
        setIsLoadingOrders(false);
        isLoadingOrdersRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    return () => {
      cancelRequested.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Subscribe to auth changes
    if (!supabaseIntegration.isAvailable()) {
      return;
    }

    try {
      const { data } = supabaseIntegration.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      });

      return () => {
        if (data?.subscription) {
          data.subscription.unsubscribe();
        }
      };
    } catch (e) {
      console.error('[SupabaseCases] Error subscribing to auth:', e);
      return () => {};
    }
  }, []);

  const state: SupabaseCasesState = {
    isReady,
    isConnected,
    user,
    selectedCase,
    products,
    isLoadingProducts,
    orders,
    isLoadingOrders,
    lastError,
  };

  const actions: SupabaseCasesActions = {
    refreshStatus,
    selectCase,
    fetchProducts,
    fetchOrders,
    refreshUser,
  };

  return { state, actions };
}

