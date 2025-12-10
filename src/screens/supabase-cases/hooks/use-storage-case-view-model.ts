import { useCallback, useRef, useState } from 'react';

export interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
    cacheControl: string;
  };
}

export interface StorageCaseState {
  files: StorageFile[];
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export interface StorageCaseActions {
  listFiles: () => Promise<void>;
  uploadFile: (uri: string, fileName: string, mimeType: string) => Promise<void>;
  deleteFile: (fileName: string) => Promise<void>;
  downloadFile: (fileName: string) => Promise<string | null>;
}

export function useStorageCaseViewModel(isConnected: boolean) {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const listFiles = useCallback(async () => {
    if (!isConnected) {
      setError('Supabase is not connected');
      setIsLoading(false);
      isLoadingRef.current = false;
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log('[StorageCase] List files already in progress, skipping...');
      return;
    }

    isLoadingRef.current = true;
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

      const { data, error: listError } = await client.storage
        .from('case-files')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listError) {
        // Handle specific error cases
        if (listError.message?.includes('Bucket not found') || listError.message?.includes('not found')) {
          console.warn('[StorageCase] Bucket "case-files" not found. Please create it in Supabase Dashboard > Storage.');
          setError('Storage bucket "case-files" not found. Please create it in Supabase Dashboard.');
          setFiles([]);
          return;
        }
        throw listError;
      }

      // Transform the data to match our interface
      const transformedFiles = (data || []).map((file: any) => ({
        name: file.name,
        id: file.id || file.name,
        created_at: file.created_at || new Date().toISOString(),
        updated_at: file.updated_at || file.created_at || new Date().toISOString(),
        last_accessed_at: file.last_accessed_at || file.created_at || new Date().toISOString(),
        metadata: {
          size: file.metadata?.size || file.size || 0,
          mimetype: file.metadata?.mimetype || file.metadata?.contentType || 'application/octet-stream',
          cacheControl: file.metadata?.cacheControl || '3600',
        },
      }));

      setFiles(transformedFiles);
    } catch (e: any) {
      console.error('[StorageCase] Error listing files:', e);
      setError(e?.message ?? String(e) ?? 'Failed to load files');
      setFiles([]);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [isConnected]);

  const uploadFile = useCallback(async (uri: string, fileName: string, mimeType: string) => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
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

      // Read file as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      const { data, error: uploadError } = await client.storage
        .from('case-files')
        .upload(fileName, blob, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(100);
      
      // Refresh file list
      await listFiles();
    } catch (e: any) {
      console.error('[StorageCase] Error uploading file:', e);
      setError(e?.message ?? String(e));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [isConnected, listFiles]);

  const deleteFile = useCallback(async (fileName: string) => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return;
    }

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

      const { error: deleteError } = await client.storage
        .from('case-files')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      // Refresh file list
      await listFiles();
    } catch (e: any) {
      console.error('[StorageCase] Error deleting file:', e);
      setError(e?.message ?? String(e));
    }
  }, [isConnected, listFiles]);

  const downloadFile = useCallback(async (fileName: string): Promise<string | null> => {
    if (!isConnected) {
      setError('Supabase is not connected');
      return null;
    }

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

      const { data, error: downloadError } = await client.storage
        .from('case-files')
        .download(fileName);

      if (downloadError) throw downloadError;

      // Create object URL for the blob
      const url = URL.createObjectURL(data);
      return url;
    } catch (e: any) {
      console.error('[StorageCase] Error downloading file:', e);
      setError(e?.message ?? String(e));
      return null;
    }
  }, [isConnected]);

  const state: StorageCaseState = {
    files,
    isLoading,
    isUploading,
    uploadProgress,
    error,
  };

  const actions: StorageCaseActions = {
    listFiles,
    uploadFile,
    deleteFile,
    downloadFile,
  };

  return { state, actions };
}

