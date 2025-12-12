import { useCallback, useState } from 'react';

export interface HelloWorldResult {
  message: string;
  timestamp: string;
  method: string;
  url: string;
}

export interface ProcessDataResult {
  operation: string;
  result: number;
  count: number;
  timestamp: string;
  input: number[];
}

export interface EdgeFunctionsState {
  helloResult: HelloWorldResult | null;
  processResult: ProcessDataResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface EdgeFunctionsActions {
  callHelloFunction: (name?: string) => Promise<void>;
  callProcessFunction: (data: number[], operation: 'sum' | 'average' | 'max' | 'min') => Promise<void>;
}

export function useEdgeFunctionsViewModel(isConnected: boolean) {
  const [helloResult, setHelloResult] = useState<HelloWorldResult | null>(null);
  const [processResult, setProcessResult] = useState<ProcessDataResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callHelloFunction = useCallback(async (name?: string) => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHelloResult(null);

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

      const { data, error: invokeError } = await client.functions.invoke('hello-world', {
        body: name ? { name } : {},
      });

      if (invokeError) throw invokeError;

      setHelloResult(data as HelloWorldResult);
    } catch (e: any) {
      console.error('[EdgeFunctions] Error calling hello-world function:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const callProcessFunction = useCallback(async (
    inputData: number[],
    operation: 'sum' | 'average' | 'max' | 'min'
  ) => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessResult(null);

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

      const { data, error: invokeError } = await client.functions.invoke('process-data', {
        body: {
          data: inputData,
          operation,
        },
      });

      if (invokeError) throw invokeError;

      setProcessResult(data as ProcessDataResult);
    } catch (e: any) {
      console.error('[EdgeFunctions] Error calling process-data function:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const state: EdgeFunctionsState = {
    helloResult,
    processResult,
    isLoading,
    error,
  };

  const actions: EdgeFunctionsActions = {
    callHelloFunction,
    callProcessFunction,
  };

  return { state, actions };
}

