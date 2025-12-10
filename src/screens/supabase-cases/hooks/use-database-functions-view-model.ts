import { useCallback, useState } from 'react';

export interface ProductStatistics {
  total_products: number;
  average_price: number;
  min_price: number;
  max_price: number;
  total_stock: number;
  low_stock_count: number;
  categories_count: number;
}

export interface UserOrderSummary {
  user_id: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  pending_orders: number;
  completed_orders: number;
  last_order_date: string | null;
}

export interface DatabaseFunctionsState {
  productStats: ProductStatistics | null;
  orderSummary: UserOrderSummary | null;
  calculationResult: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface DatabaseFunctionsActions {
  fetchProductStatistics: () => Promise<void>;
  fetchUserOrderSummary: (userId: string) => Promise<void>;
  calculateOrderTotal: (items: Array<{ quantity: number; price: number }>) => Promise<void>;
}

export function useDatabaseFunctionsViewModel(user: any | null, isConnected: boolean) {
  const [productStats, setProductStats] = useState<ProductStatistics | null>(null);
  const [orderSummary, setOrderSummary] = useState<UserOrderSummary | null>(null);
  const [calculationResult, setCalculationResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductStatistics = useCallback(async () => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error: rpcError } = await client.rpc('get_product_statistics');

      if (rpcError) throw rpcError;

      setProductStats(data as ProductStatistics);
    } catch (e: any) {
      console.error('[DatabaseFunctions] Error fetching product statistics:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const fetchUserOrderSummary = useCallback(async (userId: string) => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error: rpcError } = await client.rpc('get_user_order_summary', {
        p_user_id: userId,
      });

      if (rpcError) throw rpcError;

      setOrderSummary(data as UserOrderSummary);
    } catch (e: any) {
      console.error('[DatabaseFunctions] Error fetching user order summary:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const calculateOrderTotal = useCallback(async (items: Array<{ quantity: number; price: number }>) => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const masterfabricCore = await import('masterfabric-expo-core');
      const supabase = (masterfabricCore as any).supabaseIntegration;
      
      if (!supabase || !supabase.isAvailable()) {
        throw new Error('Supabase is not available');
      }

      const client = supabase.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const itemsJson = items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
      }));

      const { data, error: rpcError } = await client.rpc('calculate_order_total', {
        order_items: itemsJson,
      });

      if (rpcError) throw rpcError;

      setCalculationResult(data as number);
    } catch (e: any) {
      console.error('[DatabaseFunctions] Error calculating order total:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const state: DatabaseFunctionsState = {
    productStats,
    orderSummary,
    calculationResult,
    isLoading,
    error,
  };

  const actions: DatabaseFunctionsActions = {
    fetchProductStatistics,
    fetchUserOrderSummary,
    calculateOrderTotal,
  };

  return { state, actions };
}

