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
}

export type ProductSearchResult = Product[];

export interface OrderStatistics {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  min_order_value: number;
  max_order_value: number;
  pending_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_unique_users: number;
}

export interface CategoryStatistic {
  category: string;
  product_count: number;
  average_price: number;
  min_price: number;
  max_price: number;
  total_stock: number;
  low_stock_count: number;
}

export type CategoryStatistics = CategoryStatistic[];

export interface DatabaseFunctionsState {
  productStats: ProductStatistics | null;
  orderSummary: UserOrderSummary | null;
  calculationResult: number | null;
  searchResults: ProductSearchResult | null;
  orderStats: OrderStatistics | null;
  categoryStats: CategoryStatistics | null;
  isLoading: boolean;
  error: string | null;
}

export interface DatabaseFunctionsActions {
  fetchProductStatistics: () => Promise<void>;
  fetchUserOrderSummary: (userId: string) => Promise<void>;
  calculateOrderTotal: (items: Array<{ quantity: number; price: number }>) => Promise<void>;
  searchProducts: (filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => Promise<void>;
  fetchOrderStatistics: () => Promise<void>;
  fetchCategoryStatistics: () => Promise<void>;
}

export function useDatabaseFunctionsViewModel(user: any | null, isConnected: boolean) {
  const [productStats, setProductStats] = useState<ProductStatistics | null>(null);
  const [orderSummary, setOrderSummary] = useState<UserOrderSummary | null>(null);
  const [calculationResult, setCalculationResult] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<ProductSearchResult | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStatistics | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStatistics | null>(null);
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

  const searchProducts = useCallback(
    async (filters: {
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
    }) => {
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

        const { data, error: rpcError } = await client.rpc('search_products', {
          p_category: filters.category || null,
          p_brand: filters.brand || null,
          p_min_price: filters.minPrice || null,
          p_max_price: filters.maxPrice || null,
        });

        if (rpcError) throw rpcError;

        setSearchResults(data as ProductSearchResult);
      } catch (e: any) {
        console.error('[DatabaseFunctions] Error searching products:', e);
        setError(e?.message ?? String(e));
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected]
  );

  const fetchOrderStatistics = useCallback(async () => {
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

      const { data, error: rpcError } = await client.rpc('get_order_statistics');

      if (rpcError) throw rpcError;

      setOrderStats(data as OrderStatistics);
    } catch (e: any) {
      console.error('[DatabaseFunctions] Error fetching order statistics:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const fetchCategoryStatistics = useCallback(async () => {
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

      const { data, error: rpcError } = await client.rpc('get_category_statistics');

      if (rpcError) throw rpcError;

      setCategoryStats(data as CategoryStatistics);
    } catch (e: any) {
      console.error('[DatabaseFunctions] Error fetching category statistics:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const state: DatabaseFunctionsState = {
    productStats,
    orderSummary,
    calculationResult,
    searchResults,
    orderStats,
    categoryStats,
    isLoading,
    error,
  };

  const actions: DatabaseFunctionsActions = {
    fetchProductStatistics,
    fetchUserOrderSummary,
    calculateOrderTotal,
    searchProducts,
    fetchOrderStatistics,
    fetchCategoryStatistics,
  };

  return { state, actions };
}

