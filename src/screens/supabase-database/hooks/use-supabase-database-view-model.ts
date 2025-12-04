import { supabaseIntegration } from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';

// Helper function to extract table names from Supabase REST API response
const extractTablesFromRestApi = (html: string): string[] => {
  const tables: string[] = [];
  // Parse HTML response to find table links
  const linkRegex = /<a[^>]*href="\/rest\/v1\/([^"]+)"[^>]*>/g;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const tableName = match[1];
    // Filter out non-table endpoints
    if (tableName && !tableName.includes('.') && tableName !== 'rpc' && !tableName.startsWith('_')) {
      tables.push(tableName);
    }
  }
  return [...new Set(tables)]; // Remove duplicates
};

export interface SupabaseDatabaseState {
  isReady: boolean;
  isConnected: boolean;
  tables: string[];
  selectedTable: string | null;
  query: string;
  queryResult: any;
  queryError: string | null;
  isLoading: boolean;
  isQueryLoading: boolean;
  tableData: any[];
  tableColumns: string[];
  crudMode: 'create' | 'read' | 'update' | 'delete' | null;
  formData: Record<string, any>;
  lastError: string | null;
}

export interface SupabaseDatabaseActions {
  refreshStatus: () => Promise<void>;
  fetchTables: () => Promise<void>;
  selectTable: (tableName: string) => void;
  setQuery: (query: string) => void;
  executeQuery: () => Promise<void>;
  fetchTableData: () => Promise<void>;
  setCrudMode: (mode: 'create' | 'read' | 'update' | 'delete' | null) => void;
  setFormData: (data: Record<string, any>) => void;
  createRecord: () => Promise<void>;
  updateRecord: (id: any) => Promise<void>;
  deleteRecord: (id: any) => Promise<void>;
  clearQueryResult: () => void;
}

export function useSupabaseDatabaseViewModel() {
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [crudMode, setCrudMode] = useState<'create' | 'read' | 'update' | 'delete' | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [lastError, setLastError] = useState<string | null>(null);
  const cancelRequested = useRef(false);

  const refreshStatus = useCallback(async () => {
    try {
      const available = supabaseIntegration.isAvailable();
      setIsConnected(available);
      setIsReady(true);
    } catch (e: any) {
      console.error('[SupabaseDatabase] Error refreshing status:', e);
      setLastError(e?.message ?? String(e));
      setIsReady(true);
      setIsConnected(false);
    }
  }, []);

  const fetchTables = useCallback(async () => {
    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      return;
    }

    setIsLoading(true);
    setLastError(null);
    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      // Approach 1: Try RPC function (if available)
      try {
        const { data: rpcData, error: rpcError } = await client.rpc('get_table_names');
        if (!rpcError && rpcData && Array.isArray(rpcData)) {
          setTables(rpcData);
          return;
        }
      } catch (rpcErr) {
        // RPC not available, continue
      }

      // Approach 2: Use Supabase REST API to fetch metadata (most reliable)
      try {
        // Try to get config from integration, fallback to env vars
        let supabaseUrl: string | undefined;
        let anonKey: string | undefined;
        
        try {
          const config = supabaseIntegration.getConfig?.();
          if (config) {
            supabaseUrl = config.supabaseUrl;
            anonKey = config.supabaseAnonKey;
          }
        } catch (configErr) {
          // getConfig might not be available, use env vars
        }
        
        // Fallback to environment variables
        if (!supabaseUrl) supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
        if (!anonKey) anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
        
        if (supabaseUrl && anonKey) {
          // Fetch tables using Supabase REST API metadata endpoint
          const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
              'apikey': anonKey,
              'Authorization': `Bearer ${anonKey}`,
            },
          });
          
          if (response.ok) {
            const text = await response.text();
            const tableNames = extractTablesFromRestApi(text);
            
            if (tableNames.length > 0) {
              console.log('[SupabaseDatabase] Found tables via REST API:', tableNames);
              setTables(tableNames);
              return;
            }
          } else {
            console.warn('[SupabaseDatabase] REST API response not OK:', response.status);
          }
        } else {
          console.warn('[SupabaseDatabase] Missing URL or key for REST API');
        }
      } catch (restErr) {
        console.warn('[SupabaseDatabase] REST API approach failed:', restErr);
      }

      // Approach 3: Try querying pg_tables via RPC
      try {
        const { data: pgData, error: pgError } = await client.rpc('get_public_tables');
        if (!pgError && pgData && Array.isArray(pgData)) {
          setTables(pgData);
          return;
        }
      } catch (pgErr) {
        // Continue
      }

      // If all approaches fail, set empty array but don't show error
      // User can still manually enter table names
      console.warn('[SupabaseDatabase] Could not automatically fetch tables. Users can manually enter table names.');
      setTables([]);
    } catch (e: any) {
      console.error('[SupabaseDatabase] Error fetching tables:', e);
      setLastError(e?.message ?? String(e));
      setTables([]);
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, []);

  const selectTable = useCallback((tableName: string) => {
    if (tableName && tableName.trim()) {
      setSelectedTable(tableName.trim());
      setCrudMode('read');
      setFormData({});
      // Clear query results when selecting a table (but keep query text)
      setQueryResult(null);
      setQueryError(null);
    } else {
      setSelectedTable(null);
      setCrudMode(null);
      setFormData({});
      setTableData([]);
      setTableColumns([]);
    }
  }, []);

  const executeQuery = useCallback(async () => {
    if (!query.trim()) {
      setLastError('Please enter a query');
      return;
    }

    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      return;
    }

    setIsQueryLoading(true);
    setQueryError(null);
    setQueryResult(null);
    setLastError(null);

    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      // Try to execute as RPC function first (for custom SQL)
      // If that fails, try parsing as a simple SELECT query
      const queryLower = query.trim().toLowerCase();
      const queryTrimmed = query.trim();
      
      if (queryLower.startsWith('select')) {
        // Simple SELECT query - extract table name and columns
        const match = queryTrimmed.match(/from\s+['"]?(\w+)['"]?/i);
        if (match) {
          const tableName = match[1];
          
          // Parse WHERE clause if exists
          const whereMatch = queryTrimmed.match(/where\s+(.+?)(?:\s+order\s+by|\s+limit|$)/i);
          const orderByMatch = queryTrimmed.match(/order\s+by\s+(.+?)(?:\s+limit|$)/i);
          const limitMatch = queryTrimmed.match(/limit\s+(\d+)/i);
          
          let queryBuilder = client.from(tableName).select('*');
          
          // Apply WHERE clause if exists
          if (whereMatch) {
            const whereClause = whereMatch[1].trim();
            // Simple WHERE parsing - handle basic cases
            if (whereClause.includes('=')) {
              const [column, value] = whereClause.split('=').map(s => s.trim().replace(/['"]/g, ''));
              queryBuilder = queryBuilder.eq(column, value);
            } else if (whereClause.includes('LIKE') || whereClause.includes('like')) {
              const [column, pattern] = whereClause.split(/like/i).map(s => s.trim().replace(/['"]/g, ''));
              queryBuilder = queryBuilder.ilike(column, `%${pattern}%`);
            }
          }
          
          // Apply ORDER BY if exists
          if (orderByMatch) {
            const orderClause = orderByMatch[1].trim();
            const parts = orderClause.split(/\s+/);
            const column = parts[0];
            const direction = parts[1]?.toLowerCase() === 'desc' ? 'desc' : 'asc';
            queryBuilder = queryBuilder.order(column, { ascending: direction === 'asc' });
          }
          
          // Apply LIMIT if exists
          const limit = limitMatch ? parseInt(limitMatch[1], 10) : 100;
          queryBuilder = queryBuilder.limit(limit);
          
          const { data, error } = await queryBuilder;
          
          if (error) throw error;
          setQueryResult(data);
        } else {
          throw new Error('Could not parse SELECT query. Please use format: SELECT * FROM table_name');
        }
      } else if (queryLower.startsWith('count') || queryLower.includes('count(*)')) {
        // Handle COUNT queries
        const match = queryTrimmed.match(/from\s+['"]?(\w+)['"]?/i);
        if (match) {
          const tableName = match[1];
          const { count, error } = await client.from(tableName).select('*', { count: 'exact', head: true });
          if (error) throw error;
          setQueryResult({ total: count });
        } else {
          throw new Error('Could not parse COUNT query');
        }
      } else {
        // For other queries, try RPC
        throw new Error('Only SELECT and COUNT queries are supported. Use the table browser for other operations.');
      }
    } catch (e: any) {
      console.error('[SupabaseDatabase] Query error:', e);
      setQueryError(e?.message ?? String(e));
      setLastError(e?.message ?? String(e));
    } finally {
      if (!cancelRequested.current) setIsQueryLoading(false);
    }
  }, [query]);

  const fetchTableData = useCallback(async () => {
    if (!selectedTable) return;

    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      return;
    }

    setIsLoading(true);
    setLastError(null);

    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await client
        .from(selectedTable)
        .select('*')
        .limit(100);

      if (error) throw error;

      if (data && !cancelRequested.current) {
        setTableData(data);
        if (data.length > 0) {
          setTableColumns(Object.keys(data[0]));
        } else {
          setTableColumns([]);
        }
      }
    } catch (e: any) {
      console.error('[SupabaseDatabase] Error fetching table data:', e);
      setLastError(e?.message ?? String(e));
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, [selectedTable]);

  const createRecord = useCallback(async () => {
    if (!selectedTable) {
      setLastError('Please select a table first');
      return;
    }

    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      return;
    }

    setIsLoading(true);
    setLastError(null);

    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await client
        .from(selectedTable)
        .insert(formData)
        .select();

      if (error) throw error;

      setCrudMode(null);
      setFormData({});
      await fetchTableData();
    } catch (e: any) {
      console.error('[SupabaseDatabase] Error creating record:', e);
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, [selectedTable, formData, fetchTableData]);

  const updateRecord = useCallback(async (id: any) => {
    if (!selectedTable) {
      setLastError('Please select a table first');
      return;
    }

    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      return;
    }

    setIsLoading(true);
    setLastError(null);

    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await client
        .from(selectedTable)
        .update(formData)
        .eq('id', id)
        .select();

      if (error) throw error;

      setCrudMode(null);
      setFormData({});
      await fetchTableData();
    } catch (e: any) {
      console.error('[SupabaseDatabase] Error updating record:', e);
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, [selectedTable, formData, fetchTableData]);

  const deleteRecord = useCallback(async (id: any) => {
    if (!selectedTable) {
      setLastError('Please select a table first');
      return;
    }

    if (!supabaseIntegration.isAvailable()) {
      setLastError('Supabase is not available');
      return;
    }

    setIsLoading(true);
    setLastError(null);

    try {
      const client = supabaseIntegration.getClient();
      if (!client) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await client
        .from(selectedTable)
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTableData();
    } catch (e: any) {
      console.error('[SupabaseDatabase] Error deleting record:', e);
      setLastError(e?.message ?? String(e));
      throw e;
    } finally {
      if (!cancelRequested.current) setIsLoading(false);
    }
  }, [selectedTable, fetchTableData]);

  const clearQueryResult = useCallback(() => {
    setQueryResult(null);
    setQueryError(null);
    setQuery('');
  }, []);

  useEffect(() => {
    refreshStatus();
    fetchTables();
    return () => {
      cancelRequested.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTable && crudMode === 'read') {
      fetchTableData();
    }
  }, [selectedTable, crudMode, fetchTableData]);

  const state: SupabaseDatabaseState = {
    isReady,
    isConnected,
    tables,
    selectedTable,
    query,
    queryResult,
    queryError,
    isLoading,
    isQueryLoading,
    tableData,
    tableColumns,
    crudMode,
    formData,
    lastError,
  };

  const actions: SupabaseDatabaseActions = {
    refreshStatus,
    fetchTables,
    selectTable,
    setQuery,
    executeQuery,
    fetchTableData,
    setCrudMode,
    setFormData,
    createRecord,
    updateRecord,
    deleteRecord,
    clearQueryResult,
  };

  return { state, actions };
}

