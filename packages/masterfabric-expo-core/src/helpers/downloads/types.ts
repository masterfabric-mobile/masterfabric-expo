/**
 * File Download Helper – type definitions
 * Issue #31: https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 */

/** Expo storage type: documentDirectory (persistent) or cacheDirectory (can be cleared). */
export type StorageType = 'document' | 'cache';

export interface DownloadOptions {
  url: string;
  fileName?: string;
  directory?: string;
  /** Expo storage type: 'document' (default) or 'cache'. */
  storageType?: StorageType;
  /**
   * Android only (optional):
   * When true and supported by the host app, the helper MAY delegate the download
   * to Android DownloadManager for better system integration (notifications, etc.).
   *
   * Current implementation falls back to expo-file-system when DownloadManager
   * integration is not available, so this flag is always safe to enable.
   */
  useDownloadManager?: boolean;
  /**
   * Android only (optional):
   * If DownloadManager is used, whether to show a system notification
   * for the download. Ignored when DownloadManager is not available.
   */
  showNotification?: boolean;
  /**
   * Android only (optional):
   * Human‑readable description for the download entry when using DownloadManager.
   * Ignored when DownloadManager is not available.
   */
  description?: string;
  /** Custom headers (e.g. Authorization: 'Bearer <token>' for authenticated downloads). */
  headers?: Record<string, string>;
  resume?: boolean;
  validate?: boolean;
  expectedSize?: number;
  expectedType?: string;
  requestPermissionBeforeDownload?: boolean;
  /** If true, generate unique file name when target path already exists (e.g. file_1.pdf). */
  avoidOverwrite?: boolean;
  /** Called with downloadId as soon as download starts (for pause/cancel before completion). */
  onStart?: (downloadId: string) => void;
  onProgress?: (progress: DownloadProgress) => void;
  onComplete?: (result: DownloadResult) => void;
  onError?: (error: DownloadError) => void;
  retry?: RetryOptions;
  priority?: DownloadPriority;
}

export interface DownloadResult {
  downloadId: string;
  filePath: string;
  fileName: string;
  size: number;
  type: string;
  url: string;
  downloadedAt: Date;
}

export interface DownloadProgress {
  downloadId: string;
  bytesDownloaded: number;
  totalBytes: number;
  progress: number;
  speed: number;
  estimatedTimeRemaining: number;
  startTime: Date;
}

export type DownloadState =
  | 'pending'
  | 'downloading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface DownloadStatus {
  downloadId: string;
  state: DownloadState;
  progress: DownloadProgress | null;
  result: DownloadResult | null;
  error: DownloadError | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DownloadError {
  type: 'network' | 'storage' | 'permission' | 'validation' | 'unknown';
  message: string;
  code?: string;
  retryable: boolean;
}

export interface RetryOptions {
  maxAttempts?: number;
  retryDelay?: number;
  retryOnErrors?: string[];
  exponentialBackoff?: boolean;
}

export type DownloadPriority = 'low' | 'normal' | 'high';

export interface BatchDownloadOptions {
  maxConcurrent?: number;
  onProgress?: (downloadId: string, progress: DownloadProgress) => void;
  onComplete?: (results: DownloadResult[]) => void;
  onError?: (downloadId: string, error: DownloadError) => void;
}

export interface QueueItem {
  downloadId: string;
  options: DownloadOptions;
  priority: DownloadPriority;
  status: DownloadStatus;
  addedAt: Date;
}

export interface QueueOptions {
  maxConcurrent?: number;
  onProgress?: (downloadId: string, progress: DownloadProgress) => void;
  onComplete?: (downloadId: string, result: DownloadResult) => void;
  onError?: (downloadId: string, error: DownloadError) => void;
}

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  createdAt: Date;
  modifiedAt: Date;
  exists: boolean;
}

export interface StorageInfo {
  totalSpace: number;
  freeSpace: number;
  usedSpace: number;
  available: boolean;
}

export interface CachedFile {
  path: string;
  url: string;
  size: number;
  cachedAt: Date;
  lastAccessed: Date;
}

export type StatusCallback = (status: DownloadStatus) => void;
