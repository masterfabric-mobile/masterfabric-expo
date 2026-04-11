/**
 * File Download Helper (Core)
 *
 * Single module for file downloads with permission integration, progress, batch, queue,
 * cache, and error recovery. Aligns with the File Download Helper spec:
 *
 * - Permission: uses permissions helper (requestStorage/checkStorage). Request before download.
 * - Download: single (download), batch (downloadMultiple), custom headers/auth, progress, pause/resume.
 * - Progress: real-time progress, speed, ETA, bytes, percentage, status listeners.
 * - File management: save to directories, unique names, validate, fileExists, getFileInfo, delete, clear cache.
 * - Status: pending|downloading|paused|completed|failed|cancelled, getQueue, pause, resume, cancel, retry.
 * - Errors: network/storage/permission/validation, retry with exponential backoff, onError callbacks.
 * - Cache: setCacheLimit, getCacheSize, getCachedFiles, clearCache.
 * - Utils: validateUrl, getFileExtension, generateFilePath, generateUniqueFilePath, checkStorageSpace, formatFileSize, getMimeType.
 * - Platform: uses app-specific directories (iOS/Android); no Android DownloadManager (expo-file-system HTTP).
 *
 * Implements: https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 *
 * File structure (Issue #31):
 *   file_download_helper.ts (this file – public API)
 *   downloads/types.ts, downloads/queue.ts, downloads/cache.ts,
 *   downloads/ios-config.ts, downloads/android-config.ts
 *
 * ---------------------------------------------------------------------------
 * Önerilen fonksiyonlar (Recommended functions) – permissionsHandler kullanır
 * ---------------------------------------------------------------------------
 * İzin: requestStoragePermission(options?), checkStoragePermission(), isStoragePermissionGranted()
 * İndir: download(options), downloadMultiple(files, options?), addToQueue(options, priority?), processQueue(options?)
 * Kontrol: pause(downloadId), resume(downloadId), cancel(downloadId), retry(downloadId)
 * Durum: getStatus(downloadId), getAllStatuses(), getQueue(), addStatusListener(downloadId, callback)
 * Dosya: fileExists(path), getFileInfo(path), deleteFile(path), deleteDirectory(dir), getFileSize(path), getFileType(path)
 * Önbellek: clearCache(), getCacheSize(), setCacheLimit(limit), getCachedFiles()
 * Yardımcı: validateUrl(url), getFileExtension(url), generateFilePath(fileName, dir?), checkStorageSpace(), formatFileSize(bytes), getMimeType(fileName)
 *
 * @platform iOS
 * @platform Android
 *
 * @configuration iOS (Info.plist)
 * No specific Info.plist entries needed for basic downloads.
 * For background downloads, add to Info.plist:
 * ```xml
 * <key>UIBackgroundModes</key>
 * <array>
 *   <string>fetch</string>
 *   <string>processing</string>
 * </array>
 * ```
 *
 * @configuration Android (AndroidManifest.xml)
 * Required permissions (expo-file-system handles most, but ensure these are present):
 * ```xml
 * <!-- Internet Permission (required for downloads) -->
 * <uses-permission android:name="android.permission.INTERNET" />
 *
 * <!-- Storage Permissions (Android 13+) -->
 * <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
 * <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
 * <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
 *
 * <!-- Storage Permissions (Legacy) -->
 * <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
 * <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
 * ```
 *
 * @security
 * - URL validation: Prevents dangerous protocols (javascript:, data:, file://)
 * - File name sanitization: Prevents path traversal attacks (../, ..\)
 * - Path validation: Ensures files are saved to app-specific directories
 * - Storage space check: Validates available space before download
 * - File validation: Optional size/type validation after download
 *
 * @compatibility
 * - Expo SDK 50+
 * - React Native 0.72+
 * - iOS 13+
 * - Android API 23+ (Android 6.0+)
 * - Handles Android 13+ (API 33+) granular storage permissions
 * - Works with both managed and bare Expo workflows
 *
 * @example Basic download with permission (Issue #31 Example 1 – permissionsHandler API)
 * ```typescript
 * import { fileDownloadHelper, permissionsHandler } from 'masterfabric-expo-core';
 *
 * const permission = await permissionsHandler.requestStorage({ rationale: 'We need storage access to download files' });
 * if (permission.granted) {
 *   const result = await fileDownloadHelper.download({
 *     url: 'https://example.com/document.pdf',
 *     fileName: 'document.pdf',
 *     directory: 'Downloads',
 *   });
 *   console.log('File downloaded to:', result.filePath);
 * } else if (permission.blocked) {
 *   permissionsHandler.showSettingsAlert({ permission: 'storage', title: 'Storage Permission Required', message: 'Please enable storage in Settings to download files', openSettings: true });
 * }
 * ```
 *
 * @example Download with progress tracking
 * ```typescript
 * const result = await fileDownloadHelper.download({
 *   url: 'https://example.com/large-video.mp4',
 *   fileName: 'video.mp4',
 *   onProgress: (progress) => {
 *     console.log(`Progress: ${progress.progress}%`);
 *     console.log(`Speed: ${progress.speed} bytes/s`);
 *     console.log(`ETA: ${progress.estimatedTimeRemaining} seconds`);
 *   },
 *   onComplete: (result) => console.log('Completed:', result.filePath),
 *   onError: (error) => console.error('Failed:', error),
 * });
 * ```
 *
 * @example Pause and resume (Issue #31 Example 4 – use onStart to get downloadId before completion)
 * ```typescript
 * let downloadId: string;
 * const result = await fileDownloadHelper.download({
 *   url: 'https://example.com/file.pdf',
 *   fileName: 'file.pdf',
 *   resume: true,
 *   onStart: (id) => { downloadId = id; },
 * });
 * await fileDownloadHelper.pause(downloadId);
 * await fileDownloadHelper.resume(downloadId);
 * await fileDownloadHelper.cancel(downloadId);
 * ```
 *
 * @example Batch downloads
 * ```typescript
 * const results = await fileDownloadHelper.downloadMultiple([
 *   { url: 'https://example.com/file1.pdf', fileName: 'file1.pdf' },
 *   { url: 'https://example.com/file2.jpg', fileName: 'file2.jpg' },
 * ], {
 *   maxConcurrent: 2,
 *   onProgress: (downloadId, progress) => console.log(`${downloadId}: ${progress.progress}%`),
 * });
 * ```
 *
 * @example Download with authentication (custom headers)
 * ```typescript
 * await fileDownloadHelper.download({
 *   url: 'https://api.example.com/secure/file.pdf',
 *   headers: { Authorization: 'Bearer <token>' },
 *   fileName: 'file.pdf',
 * });
 * ```
 *
 * @example Permission denial handling
 * ```typescript
 * try {
 *   await fileDownloadHelper.download({ url: '...', requestPermissionBeforeDownload: true });
 * } catch (e) {
 *   if (e.type === 'permission') fileDownloadHelper.handlePermissionDenied();
 * }
 * ```
 *
 * ---------------------------------------------------------------------------
 * Usage scenarios (Kullanım senaryoları)
 * ---------------------------------------------------------------------------
 *
 * @example Scenario: Document viewer – PDF/image/document download with progress
 * ```typescript
 * // Belge görüntüleyici: PDF, resim veya belge indirme ve ilerleme takibi
 * const result = await fileDownloadHelper.download({
 *   url: 'https://example.com/document.pdf',
 *   fileName: 'document.pdf',
 *   directory: 'Documents',
 *   onProgress: (progress) => {
 *     console.log(progress);
 *     // progress.progress (%), progress.bytesDownloaded, progress.totalBytes, progress.speed, progress.estimatedTimeRemaining
 *   },
 *   onComplete: (r) => openDocumentViewer(r.filePath),
 *   onError: (e) => showError(e.message),
 * });
 * ```
 *
 * @example Scenario: Media app – large file download with resume and progress bar
 * ```typescript
 * // Medya uygulaması: Resim/video/ses indirme, büyük dosyada kaldığı yerden devam
 * const result = await fileDownloadHelper.download({
 *   url: 'https://example.com/video.mp4',
 *   fileName: 'video.mp4',
 *   directory: 'Media',
 *   resume: true,
 *   onProgress: (progress) => updateProgressBar(progress.progress, progress.bytesDownloaded, progress.totalBytes),
 * });
 * // Pause/resume: fileDownloadHelper.pause(result.downloadId); fileDownloadHelper.resume(result.downloadId);
 * ```
 *
 * @example Scenario: Offline content – batch download for offline access
 * ```typescript
 * // Çevrimdışı içerik: Toplu indirme, tamamlanınca bildirim
 * const results = await fileDownloadHelper.downloadMultiple(
 *   [
 *     { url: 'https://example.com/file1.jpg', fileName: 'file1.jpg', directory: 'Offline' },
 *     { url: 'https://example.com/file2.jpg', fileName: 'file2.jpg', directory: 'Offline' },
 *   ],
 *   {
 *     maxConcurrent: 2,
 *     onProgress: (downloadId, progress) => updateOfflineProgress(downloadId, progress.progress),
 *     onComplete: () => console.log('All downloaded'),
 *     onError: (id, err) => console.warn('Download failed:', id, err.message),
 *   }
 * );
 * // Offline erişim: fileDownloadHelper.getCachedFilePathByFileName('file1.jpg')
 * ```
 *
 * @example Scenario: File manager – custom name and directory organization
 * ```typescript
 * // Dosya yöneticisi: Özel isimli dosya, dizin organizasyonu
 * await fileDownloadHelper.download({
 *   url: 'https://example.com/file.pdf',
 *   fileName: 'MyDocument.pdf',
 *   directory: 'Documents',
 *   avoidOverwrite: true, // Benzersiz isim (MyDocument_1.pdf) çakışmada
 * });
 * ```
 *
 * @example Scenario: Content sync – download queue with priority
 * ```typescript
 * // İçerik senkronizasyonu: Güncellemeleri kuyruğa ekle, öncelikle işle
 * const downloadId = await fileDownloadHelper.addToQueue(
 *   { url: 'https://example.com/update.zip', fileName: 'update.zip', directory: 'Updates' },
 *   'high'
 * );
 * await fileDownloadHelper.processQueue({
 *   maxConcurrent: 1,
 *   onProgress: (id, progress) => setSyncProgress(id, progress),
 *   onComplete: (id, result) => applyUpdate(result.filePath),
 *   onError: (id, err) => retryOrNotify(id, err),
 * });
 * // Kuyruk: fileDownloadHelper.getQueue(); fileDownloadHelper.pause(id); fileDownloadHelper.resume(id);
 * ```
 *
 * @example Scenario: Backup/restore – authenticated secure download
 * ```typescript
 * // Yedekleme/geri yükleme: Kimlik doğrulama ile güvenli indirme
 * await fileDownloadHelper.download({
 *   url: 'https://api.example.com/backup',
 *   headers: { Authorization: 'Bearer <token>' },
 *   fileName: 'backup.zip',
 *   directory: 'Backups',
 *   validate: true,
 *   expectedSize: 1024000,
 *   onProgress: (p) => setBackupProgress(p.progress),
 *   onError: (e) => {
 *     if (e.type === 'permission') fileDownloadHelper.handlePermissionDenied();
 *   },
 * });
 * ```
 */

import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import { DEFAULT_CACHE_LIMIT_BYTES } from './downloads/cache';
import { createQueueItem, sortQueueByPriority } from './downloads/queue';
import type {
  BatchDownloadOptions,
  CachedFile,
  DownloadError,
  DownloadOptions,
  DownloadPriority,
  DownloadProgress,
  DownloadResult,
  DownloadStatus,
  FileInfo,
  QueueItem,
  QueueOptions,
  RetryOptions,
  StorageInfo,
  StatusCallback,
  StorageType,
} from './downloads/types';
export type {
  BatchDownloadOptions,
  CachedFile,
  DownloadError,
  DownloadOptions,
  DownloadProgress,
  DownloadPriority,
  DownloadResult,
  DownloadState,
  DownloadStatus,
  FileInfo,
  QueueItem,
  QueueOptions,
  RetryOptions,
  StorageInfo,
  StorageType,
  StatusCallback,
} from './downloads/types';
import { loggerHelper } from './logger_helper';
import {
  checkStorage,
  requestStorage,
  showPermissionSettingsAlert,
  type PermissionStatus,
  type StoragePermissionOptions,
} from './permissions';
import { isUrl } from './string_helper';

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

const DEFAULT_DIRECTORY = 'Downloads';
const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  zip: 'application/zip',
  json: 'application/json',
  txt: 'text/plain',
  html: 'text/html',
};

function safeLog(level: 'debug' | 'info' | 'warning' | 'error', message: string, meta?: Record<string, unknown>) {
  try {
    loggerHelper[level](message, meta);
  } catch {
    // Logger not initialized
  }
}

function createDownloadError(
  message: string,
  type: DownloadError['type'],
  retryable = false,
  code?: string
): DownloadError {
  return { type, message, retryable, code };
}

/** Whether the error is an SSL/certificate validation error (e.g. CertPathValidatorException on Android). */
function isCertificateOrSslError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('certpath') ||
    lower.includes('certpathvalidatorexception') ||
    lower.includes('ssl') ||
    lower.includes('certificate') ||
    lower.includes('handshake') ||
    lower.includes('trust anchor') ||
    lower.includes('unable to find valid certification path')
  );
}

/** Infer error type from message for consistent error handling (permission, storage, network, validation). */
function inferErrorType(message: string, code?: string): DownloadError['type'] {
  const lower = message.toLowerCase();
  if (lower.includes('permission') || lower.includes('denied') || code === 'EACCES') return 'permission';
  if (lower.includes('storage') || lower.includes('enospc') || lower.includes('disk') || lower.includes('space')) return 'storage';
  if (lower.includes('invalid') || lower.includes('validation') || lower.includes('mismatch')) return 'validation';
  if (isCertificateOrSslError(message)) return 'network';
  if (lower.includes('network') || lower.includes('econn') || lower.includes('fetch') || lower.includes('timeout')) return 'network';
  return 'unknown';
}

function generateId(): string {
  return `dl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Sanitize file name to prevent path traversal and invalid characters.
 * Security: Prevents directory traversal attacks (../, ..\, etc.).
 */
function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '').replace(/[\/\\]/g, '_');
  // Remove invalid characters for file names
  sanitized = sanitized.replace(/[/\\?%*:|"<>]/g, '_');
  // Remove leading/trailing dots and spaces (Windows issue)
  sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');
  // Ensure not empty
  return sanitized || 'download';
}

/**
 * Validate and sanitize URL to prevent security issues.
 * Security: Validates URL format and prevents dangerous protocols.
 */
function validateAndSanitizeUrl(url: string): { valid: boolean; sanitized?: string; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string' };
  }
  
  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, error: 'URL cannot be empty' };
  }
  
  // Check for dangerous protocols
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file://')) {
    return { valid: false, error: 'Unsupported URL protocol' };
  }
  
  // Validate URL format
  if (!isUrl(trimmed)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  
  return { valid: true, sanitized: trimmed };
}

/** Default cache directory (expo cacheDirectory). */
function getCacheDir(): string {
  return FileSystem.cacheDirectory ?? '';
}

/** Base directory for app documents (expo documentDirectory). */
function getDocumentsDir(): string {
  return FileSystem.documentDirectory ?? '';
}

/** Base directory for storage type (Expo documentDirectory vs cacheDirectory). */
function getBaseDirForStorageType(storageType: StorageType): string {
  return storageType === 'cache' ? getCacheDir() : getDocumentsDir();
}

/**
 * Get platform-specific download directory.
 * iOS: Uses app-specific directory (no permission needed).
 * Android: Uses app-specific directory by default (no permission needed for API 29+).
 */
function getPlatformDownloadDir(directory?: string, storageType: StorageType = 'document'): string {
  const base = getBaseDirForStorageType(storageType);
  const dir = directory ?? DEFAULT_DIRECTORY;
  const safeDir = sanitizeFileName(dir);
  return `${base}${safeDir}/`;
}

/** Ensure parent directory exists (required by expo-file-system on Android). Expects filePath as file:// URI. */
async function ensureDirectoryFor(filePath: string): Promise<void> {
  const normalized = filePath.replace(/^file:\/\//, '').replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length < 2) return;
  const dirPath = 'file:///' + parts.slice(0, -1).join('/') + '/';
  try {
    const info = await FileSystem.getInfoAsync(dirPath);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
  } catch {
    await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
  }
}

class FileDownloadHelper {
  private statusMap = new Map<string, DownloadStatus>();
  private statusListeners = new Map<string, Set<StatusCallback>>();
  private queue: QueueItem[] = [];
  private activeDownloads = new Map<string, { abort: () => void; resumable?: FileSystem.DownloadResumable }>();
  private cacheLimitBytes: number = DEFAULT_CACHE_LIMIT_BYTES;
  private progressStarts = new Map<string, number>();
  private resumeStates = new Map<string, FileSystem.DownloadResumable>();

  private notifyStatus(downloadId: string, status: DownloadStatus) {
    this.statusMap.set(downloadId, status);
    this.statusListeners.get(downloadId)?.forEach((cb) => cb(status));
  }

  /**
   * Platform-specific permission check.
   * iOS: No permission needed for app-specific directories.
   * Android: App-specific directories don't need permission (scoped storage).
   * Permission is only needed for shared storage (Downloads folder) which we don't use by default.
   */
  private async ensureStoragePermission(downloadLocation: 'app' | 'shared' = 'app'): Promise<void> {
    // iOS: No permission needed for app directories
    if (Platform.OS === 'ios') {
      return;
    }
    
    // Android: App-specific directory doesn't need permission (all versions use scoped storage)
    // expo-file-system uses app-specific directories by default, no permission needed
    if (Platform.OS === 'android' && downloadLocation === 'app') {
      return; // App-specific directory - no permission needed
    }
    
    // Only check permission for shared storage (not used by default)
    if (downloadLocation === 'shared') {
      const status = await checkStorage();
      if (!status.granted) {
        throw createDownloadError(
          'Storage permission not granted. Please grant storage permission to download files.',
          'permission',
          true,
          'PERMISSION_DENIED'
        );
      }
    }
  }

  // ---- İzin entegrasyonu (permissionsHandler kullanır) ----
  /** Depolama iznini permissionsHandler (requestStorage) aracılığıyla isteyin. */
  async requestStoragePermission(options?: StoragePermissionOptions): Promise<PermissionStatus> {
    return requestStorage({
      read: options?.read ?? true,
      write: options?.write ?? true,
      rationale: options?.rationale,
    });
  }

  /** Depolama iznini permissionsHandler (checkStorage) aracılığıyla kontrol edin. */
  async checkStoragePermission(): Promise<PermissionStatus> {
    return checkStorage();
  }

  /** Depolama izninin verilip verilmediğini kontrol edin. */
  async isStoragePermissionGranted(): Promise<boolean> {
    const status = await checkStorage();
    return status.granted;
  }

  /**
   * Handle permission denial: shows system alert to open app settings.
   * Call this when download fails with error.type === 'permission' or when requestStorage returns blocked.
   */
  handlePermissionDenied(): void {
    showPermissionSettingsAlert('storage');
  }

  /** Type guard: true if the error is a permission-related download error. */
  isPermissionError(err: unknown): err is DownloadError {
    return (err as DownloadError)?.type === 'permission';
  }

  // ---- Yardımcı fonksiyonlar ----
  /** İndirme URL'sini doğrulayın. */
  validateUrl(url: string): boolean {
    return isUrl(url);
  }

  /** URL'den dosya uzantısını al. */
  getFileExtension(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const match = pathname.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      return match ? match[1].toLowerCase() : '';
    } catch {
      return '';
    }
  }

  /** Dosya yolunu oluştur (fileName + directory). */
  generateFilePath(fileName: string, directory?: string, storageType: StorageType = 'document'): string {
    const safeDir = getPlatformDownloadDir(directory, storageType);
    const safeName = sanitizeFileName(fileName);
    return `${safeDir}${safeName}`;
  }

  /**
   * Get full path preview for a file (Expo dev tool: show where file will be saved).
   * Uses documentDirectory or cacheDirectory per storageType.
   */
  getStoragePathPreview(storageType: StorageType, directory?: string, fileName?: string): string {
    const dir = directory ?? DEFAULT_DIRECTORY;
    const name = fileName?.trim() ? sanitizeFileName(fileName) : 'example.pdf';
    return this.generateFilePath(name, dir, storageType);
  }

  /**
   * Generate a unique file path when the target already exists (e.g. document.pdf -> document_1.pdf).
   * Handles file name conflicts for safe saving without overwriting.
   */
  async generateUniqueFilePath(fileName: string, directory?: string, storageType: StorageType = 'document'): Promise<string> {
    const basePath = this.generateFilePath(fileName, directory, storageType);
    if (!(await this.fileExists(basePath))) return basePath;
    const ext = fileName.includes('.') ? fileName.split('.').pop() ?? '' : '';
    const baseName = ext ? fileName.slice(0, -(ext.length + 1)) : fileName;
    const safeBase = sanitizeFileName(baseName);
    const safeExt = ext ? `.${sanitizeFileName(ext)}` : '';
    let n = 1;
    while (true) {
      const candidate = this.generateFilePath(`${safeBase}_${n}${safeExt}`, directory, storageType);
      if (!(await this.fileExists(candidate))) return candidate;
      n += 1;
    }
  }

  /** Dosya boyutu formatı (B, KB, MB, GB). */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /** Dosya adından MIME türünü al. */
  getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
    return MIME_TYPES[ext] ?? 'application/octet-stream';
  }

  getFileNameFromUrl(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const segment = pathname.split('/').filter(Boolean).pop() ?? 'download';
      return decodeURIComponent(segment) || 'download';
    } catch {
      return 'download';
    }
  }

  /** Mevcut depolama alanını kontrol edin. */
  async checkStorageSpace(): Promise<StorageInfo> {
    try {
      const total = await FileSystem.getTotalDiskCapacityAsync() ?? 0;
      const free = await FileSystem.getFreeDiskStorageAsync() ?? 0;
      return {
        totalSpace: total,
        freeSpace: free,
        usedSpace: total - free,
        available: free > 0,
      };
    } catch {
      return {
        totalSpace: 0,
        freeSpace: 0,
        usedSpace: 0,
        available: false,
      };
    }
  }

  // ---- Dosya yönetimi ----
  /** Dosyanın var olup olmadığını kontrol et. */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const info = await FileSystem.getInfoAsync(filePath);
      return info.exists;
    } catch {
      return false;
    }
  }

  /** Dosya bilgilerini al (path, name, size, type, extension, exists). */
  async getFileInfo(filePath: string): Promise<FileInfo> {
    try {
      const info = await FileSystem.getInfoAsync(filePath);
      const name = filePath.split('/').filter(Boolean).pop() ?? '';
      const extension = name.includes('.') ? name.split('.').pop() ?? '' : '';
      const withSize = info as { exists: boolean; size?: number; modificationTime?: number };
      return {
        path: filePath,
        name,
        size: withSize.exists && typeof withSize.size === 'number' ? withSize.size : 0,
        type: this.getMimeType(name),
        extension,
        createdAt: withSize.modificationTime ? new Date(withSize.modificationTime * 1000) : new Date(0),
        modifiedAt: withSize.modificationTime ? new Date(withSize.modificationTime * 1000) : new Date(0),
        exists: withSize.exists,
      };
    } catch {
      return {
        path: filePath,
        name: '',
        size: 0,
        type: 'application/octet-stream',
        extension: '',
        createdAt: new Date(0),
        modifiedAt: new Date(0),
        exists: false,
      };
    }
  }

  /** Dosyayı sil. */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      safeLog('debug', 'File deleted', { filePath });
    } catch (e) {
      safeLog('error', 'Delete file failed', { filePath, error: String(e) });
      throw e;
    }
  }

  /** Dizini sil. */
  async deleteDirectory(directory: string): Promise<void> {
    try {
      const fullPath = directory.startsWith('/') ? directory : `${getDocumentsDir()}${directory}`;
      await FileSystem.deleteAsync(fullPath, { idempotent: true });
      safeLog('debug', 'Directory deleted', { directory: fullPath });
    } catch (e) {
      safeLog('error', 'Delete directory failed', { directory, error: String(e) });
      throw e;
    }
  }

  /** Dosya boyutunu al (bytes). */
  async getFileSize(filePath: string): Promise<number> {
    try {
      const info = await FileSystem.getInfoAsync(filePath) as {
        exists: boolean;
        size?: number;
      };
      return info.exists && typeof info.size === 'number' ? info.size : 0;
    } catch {
      return 0;
    }
  }

  /** Dosyanın MIME türünü al. */
  async getFileType(filePath: string): Promise<string> {
    const name = filePath.split('/').filter(Boolean).pop() ?? '';
    return this.getMimeType(name);
  }

  // ---- Önbellek yönetimi ----
  /** İndirme önbelleğini temizle (tüm cache dizinini siler; uygulama cache’i sıfırlanır). */
  async clearCache(): Promise<void> {
    const cacheDir = getCacheDir();
    if (!cacheDir) return;
    try {
      await FileSystem.deleteAsync(cacheDir, { idempotent: true });
      safeLog('info', 'Download cache cleared');
    } catch (e) {
      safeLog('warning', 'Clear cache failed', { error: String(e) });
    }
  }

  /** Önbellek boyutunu alın (bytes). Önbellekteki dosya boyutları toplanır. */
  async getCacheSize(): Promise<number> {
    try {
      const files = await this.getCachedFiles();
      return files.reduce((sum, f) => sum + f.size, 0);
    } catch {
      return 0;
    }
  }

  /** Önbellek boyutu sınırını ayarlayın (bytes). Set cache size limit. */
  setCacheLimit(limit: number): void {
    this.cacheLimitBytes = Math.max(0, limit);
  }

  /** Önbellek boyutu sınırını alın (bytes). */
  getCacheLimit(): number {
    return this.cacheLimitBytes;
  }

  /** Önbelleğe alınmış dosyaları alın. */
  async getCachedFiles(): Promise<CachedFile[]> {
    const cacheDir = getCacheDir();
    if (!cacheDir) return [];
    try {
      const listing = await FileSystem.readDirectoryAsync(cacheDir);
      const files: CachedFile[] = [];
      for (const name of listing) {
        const path = `${cacheDir}${name}`;
        const info = await FileSystem.getInfoAsync(path) as {
          exists: boolean;
          isDirectory?: boolean;
          size?: number;
          modificationTime?: number;
        };
        if (info.exists && !info.isDirectory) {
          const mtime = info.modificationTime;
          files.push({
            path,
            url: '',
            size: typeof info.size === 'number' ? info.size : 0,
            cachedAt: mtime ? new Date(mtime * 1000) : new Date(),
            lastAccessed: mtime ? new Date(mtime * 1000) : new Date(),
          });
        }
      }
      return files;
    } catch {
      return [];
    }
  }

  /**
   * Get local file path for a cached file by name (for offline file access).
   * Returns the first matching file path in cache, or null if not found.
   */
  async getCachedFilePathByFileName(fileName: string): Promise<string | null> {
    const files = await this.getCachedFiles();
    const safeName = sanitizeFileName(fileName);
    const found = files.find((f) => f.path.endsWith(safeName) || f.path.split('/').pop() === safeName);
    return found?.path ?? null;
  }

  /**
   * Validate cache: remove entries that no longer exist, optionally enforce cache size limit.
   * Returns number of removed files.
   */
  async validateCache(enforceLimit = true): Promise<{ removed: number; currentSize: number }> {
    let removed = 0;
    const files = await this.getCachedFiles();
    const valid: CachedFile[] = [];
    for (const f of files) {
      try {
        const info = await FileSystem.getInfoAsync(f.path);
        if (info.exists) valid.push(f);
        else {
          await FileSystem.deleteAsync(f.path, { idempotent: true });
          removed += 1;
        }
      } catch {
        removed += 1;
      }
    }
    if (enforceLimit && this.cacheLimitBytes > 0) {
      const byAge = [...valid].sort(
        (a, b) => a.lastAccessed.getTime() - b.lastAccessed.getTime()
      );
      let total = byAge.reduce((s, f) => s + f.size, 0);
      for (const f of byAge) {
        if (total <= this.cacheLimitBytes) break;
        try {
          await FileSystem.deleteAsync(f.path, { idempotent: true });
          total -= f.size;
          removed += 1;
        } catch {
          // ignore
        }
      }
    }
    const currentSize = await this.getCacheSize();
    return { removed, currentSize };
  }

  // ---- İndirme durumu ----
  /** İndirme durumunu al. */
  async getStatus(downloadId: string): Promise<DownloadStatus | null> {
    return this.statusMap.get(downloadId) ?? null;
  }

  /** Tüm indirme durumlarını alın. */
  async getAllStatuses(): Promise<Record<string, DownloadStatus>> {
    const out: Record<string, DownloadStatus> = {};
    this.statusMap.forEach((s, id) => (out[id] = s));
    return out;
  }

  /** Durum değişikliklerini dinleyin; unsubscribe için dönen fonksiyonu çağırın. */
  addStatusListener(downloadId: string, callback: StatusCallback): () => void {
    if (!this.statusListeners.has(downloadId)) {
      this.statusListeners.set(downloadId, new Set());
    }
    this.statusListeners.get(downloadId)!.add(callback);
    return () => {
      this.statusListeners.get(downloadId)?.delete(callback);
    };
  }

  // ---- İndirme kontrolü ----
  /** İndirmeyi duraklat. */
  async pause(downloadId: string): Promise<void> {
    const active = this.activeDownloads.get(downloadId);
    if (active?.resumable) {
      try {
        const state = await active.resumable.pauseAsync();
        if (state) {
          this.resumeStates.set(downloadId, active.resumable);
        }
      } catch (e) {
        safeLog('warning', 'Pause failed', { downloadId, error: String(e) });
      }
    } else if (active?.abort) {
      active.abort();
    }
    const status = this.statusMap.get(downloadId);
    if (status && status.state === 'downloading') {
      this.notifyStatus(downloadId, {
        ...status,
        state: 'paused',
        updatedAt: new Date(),
      });
    }
  }

  /** İndirmeye devam et; döner downloadId. */
  async resume(downloadId: string): Promise<string> {
    // Try to resume from saved state
    const savedResumable = this.resumeStates.get(downloadId);
    if (savedResumable) {
      try {
        const result = await savedResumable.resumeAsync();
        if (result?.uri) {
          const status = this.statusMap.get(downloadId);
          if (status) {
            const size = await this.getFileSize(result.uri);
            const fileName = status.result?.fileName ?? this.getFileNameFromUrl(status.result?.url ?? '');
            const downloadResult: DownloadResult = {
              downloadId,
              filePath: result.uri,
              fileName,
              size,
              type: this.getMimeType(fileName),
              url: status.result?.url ?? '',
              downloadedAt: new Date(),
            };
            this.notifyStatus(downloadId, {
              downloadId,
              state: 'completed',
              progress: null,
              result: downloadResult,
              error: null,
              createdAt: status.createdAt,
              updatedAt: new Date(),
            });
            this.resumeStates.delete(downloadId);
            return downloadId;
          }
        }
      } catch (e) {
        safeLog('warning', 'Resume failed, falling back to re-download', { downloadId, error: String(e) });
        this.resumeStates.delete(downloadId);
      }
    }
    // Fallback: re-download from queue
    const item = this.queue.find((q) => q.downloadId === downloadId);
    if (item) {
      const result = await this.download(item.options);
      return result.downloadId;
    }
    throw createDownloadError('Download not found or not resumable', 'unknown', false);
  }

  /** İndirmeyi iptal et. */
  async cancel(downloadId: string): Promise<void> {
    const active = this.activeDownloads.get(downloadId);
    if (active?.abort) {
      active.abort();
    }
    this.activeDownloads.delete(downloadId);
    const status = this.statusMap.get(downloadId);
    if (status) {
      this.notifyStatus(downloadId, {
        ...status,
        state: 'cancelled',
        updatedAt: new Date(),
      });
    }
  }

  /** Başarısız indirmeyi tekrar dene; döner yeni downloadId. */
  async retry(downloadId: string): Promise<string> {
    const status = this.statusMap.get(downloadId);
    if (status?.error && (status.state === 'failed' || status.state === 'cancelled')) {
      const opts = this.queue.find((q) => q.downloadId === downloadId)?.options;
      if (opts) {
        const result = await this.download(opts);
        return result.downloadId;
      }
    }
    throw createDownloadError('Cannot retry this download', 'unknown', false);
  }

  // ---- Dosya indir ----
  /** Tek dosyayı indir. */
  async download(options: DownloadOptions): Promise<DownloadResult> {
    // Security: Validate and sanitize URL
    const urlValidation = validateAndSanitizeUrl(options.url);
    if (!urlValidation.valid) {
      const err = createDownloadError(
        urlValidation.error ?? 'Invalid download URL',
        'validation',
        false,
        'INVALID_URL'
      );
      options.onError?.(err);
      throw err;
    }
    const sanitizedUrl = urlValidation.sanitized!;
    
    // Check storage space before download (if expected size provided)
    if (options.expectedSize != null && options.expectedSize > 0) {
      const storageInfo = await this.checkStorageSpace();
      if (!storageInfo.available || storageInfo.freeSpace < options.expectedSize) {
        const err = createDownloadError(
          `Insufficient storage space. Required: ${this.formatFileSize(options.expectedSize)}, Available: ${this.formatFileSize(storageInfo.freeSpace)}`,
          'storage',
          false,
          'INSUFFICIENT_STORAGE'
        );
        options.onError?.(err);
        throw err;
      }
    }
    
    // Optional: request storage permission before download (unified permission handling)
    if (options.requestPermissionBeforeDownload) {
      const perm = await this.requestStoragePermission({ rationale: options.retry ? undefined : 'Storage access is needed to save downloaded files.' });
      if (!perm.granted) {
        const err = createDownloadError(
          'Storage permission not granted.',
          'permission',
          !!perm.canAskAgain,
          'PERMISSION_DENIED'
        );
        options.onError?.(err);
        if (perm.blocked ?? !perm.canAskAgain) {
          this.handlePermissionDenied();
        }
        throw err;
      }
    }

    // Platform-specific permission check (app directory by default, no permission needed)
    await this.ensureStoragePermission('app');

    // NOTE: Android DownloadManager integration
    // ----------------------------------------
    // Issue #31 proposes an optional `useDownloadManager` flag for large downloads.
    // This core helper currently runs in an Expo / JS-only environment and does not
    // have a native DownloadManager bridge. To keep the public API compatible with
    // the proposal without breaking Expo apps, we:
    // - Accept `useDownloadManager`, `showNotification`, `description` in DownloadOptions
    // - Log a debug entry when they are enabled
    // - Fall back to the existing expo-file-system based implementation
    //
    // When a native DownloadManager integration is added in the host app, this block
    // can be extended to delegate to that implementation instead of the fallback.
    if (options.useDownloadManager && Platform.OS === 'android') {
      safeLog('debug', 'Download requested with useDownloadManager, falling back to expo-file-system implementation', {
        url: options.url,
        showNotification: options.showNotification,
        description: options.description,
      });
    }

    const storageType = options.storageType ?? 'document';
    const baseFileName = options.fileName ?? this.getFileNameFromUrl(sanitizedUrl);
    const dir = options.directory ?? DEFAULT_DIRECTORY;
    const filePath = options.avoidOverwrite
      ? await this.generateUniqueFilePath(baseFileName, dir, storageType)
      : this.generateFilePath(baseFileName, dir, storageType);
    const fileName = filePath.split('/').filter(Boolean).pop() ?? baseFileName;

    const downloadId = generateId();
    const startTime = new Date();
    this.progressStarts.set(downloadId, startTime.getTime());

    const progressCallback = (totalBytesWritten: number, totalBytesExpectedToWrite: number) => {
      const now = Date.now();
      const start = this.progressStarts.get(downloadId) ?? now;
      const elapsed = (now - start) / 1000;
      const speed = elapsed > 0 ? totalBytesWritten / elapsed : 0;
      const progress: DownloadProgress = {
        downloadId,
        bytesDownloaded: totalBytesWritten,
        totalBytes: totalBytesExpectedToWrite,
        progress: totalBytesExpectedToWrite > 0 ? (totalBytesWritten / totalBytesExpectedToWrite) * 100 : 0,
        speed,
        estimatedTimeRemaining: speed > 0 && totalBytesExpectedToWrite > totalBytesWritten
          ? (totalBytesExpectedToWrite - totalBytesWritten) / speed
          : 0,
        startTime,
      };
      this.notifyStatus(downloadId, {
        downloadId,
        state: 'downloading',
        progress,
        result: null,
        error: null,
        createdAt: startTime,
        updatedAt: new Date(),
      });
      options.onProgress?.(progress);
    };

    this.notifyStatus(downloadId, {
      downloadId,
      state: 'pending',
      progress: null,
      result: null,
      error: null,
      createdAt: startTime,
      updatedAt: new Date(),
    });
    options.onStart?.(downloadId);

    const run = async (attempt = 1): Promise<DownloadResult> => {
      const maxAttempts = options.retry?.maxAttempts ?? 1;
      const retryDelay = options.retry?.retryDelay ?? 1000;
      const exponential = options.retry?.exponentialBackoff ?? false;

      try {
        await ensureDirectoryFor(filePath);
        const resumable = FileSystem.createDownloadResumable(
          sanitizedUrl,
          filePath,
          { headers: options.headers ?? {} },
          ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
            progressCallback(totalBytesWritten, totalBytesExpectedToWrite);
          }
        );

        let result: FileSystem.DownloadResult | undefined;
        const abort = () => {
          resumable.pauseAsync?.().catch(() => {});
        };
        this.activeDownloads.set(downloadId, { abort, resumable });
        
        // If resume is enabled and we have a saved state, try to resume
        if (options.resume) {
          const savedResumable = this.resumeStates.get(downloadId);
          if (savedResumable) {
            try {
              result = await savedResumable.resumeAsync();
              if (result?.uri) {
                this.resumeStates.delete(downloadId);
              }
            } catch {
              // Resume failed, continue with new download
            }
          }
        }
        
        // If not resumed, start new download
        if (!result) {

          result = await resumable.downloadAsync();
        }

        this.activeDownloads.delete(downloadId);
        this.progressStarts.delete(downloadId);

        if (!result?.uri) {
          throw createDownloadError('Download did not return a file path', 'unknown', true);
        }

        const size = await this.getFileSize(result.uri);
        const type = this.getMimeType(fileName);
        const downloadResult: DownloadResult = {
          downloadId,
          filePath: result.uri,
          fileName,
          size,
          type,
          url: sanitizedUrl,
          downloadedAt: new Date(),
        };

        if (options.validate) {
          if (options.expectedSize != null && size !== options.expectedSize) {
            throw createDownloadError(
              `File size mismatch: expected ${options.expectedSize}, got ${size}`,
              'validation',
              false
            );
          }
          if (options.expectedType && type !== options.expectedType) {
            throw createDownloadError(
              `File type mismatch: expected ${options.expectedType}, got ${type}`,
              'validation',
              false
            );
          }
        }

        this.notifyStatus(downloadId, {
          downloadId,
          state: 'completed',
          progress: null,
          result: downloadResult,
          error: null,
          createdAt: startTime,
          updatedAt: new Date(),
        });
        options.onComplete?.(downloadResult);
        return downloadResult;
      } catch (e) {
        this.activeDownloads.delete(downloadId);
        this.progressStarts.delete(downloadId);
        const message = e instanceof Error ? e.message : String(e);
        const code = e instanceof Error ? (e as { code?: string }).code : undefined;
        const retryable = !isCertificateOrSslError(message);
        const err: DownloadError = createDownloadError(
          message,
          inferErrorType(message, code),
          retryable,
          e instanceof Error ? e.name : undefined
        );
        this.notifyStatus(downloadId, {
          downloadId,
          state: 'failed',
          progress: null,
          result: null,
          error: err,
          createdAt: startTime,
          updatedAt: new Date(),
        });
        options.onError?.(err);

        if (attempt < maxAttempts && err.retryable) {
          await new Promise((r) => setTimeout(r, exponential ? retryDelay * Math.pow(2, attempt - 1) : retryDelay));
          return run(attempt + 1);
        }
        throw err;
      }
    };

    return run();
  }

  /** Birden fazla dosya indirin. */
  async downloadMultiple(
    files: DownloadOptions[],
    options?: BatchDownloadOptions
  ): Promise<DownloadResult[]> {
    const maxConcurrent = options?.maxConcurrent ?? 2;
    const results: DownloadResult[] = [];
    const errors: { id: string; error: DownloadError }[] = [];
    let index = 0;

    const runNext = async (): Promise<void> => {
      if (index >= files.length) return;
      const opts = files[index++];
      let currentDownloadId: string = '';
      try {
        const result = await this.download({
          ...opts,
          onStart: (id) => {
            currentDownloadId = id;
          },
          onProgress: (p) => options?.onProgress?.(p.downloadId, p),
          onComplete: (r) => results.push(r),
          onError: (e) => {
            errors.push({ id: currentDownloadId || opts.url, error: e });
            options?.onError?.(currentDownloadId || opts.url, e);
          },
        });
        results.push(result);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const code = e instanceof Error ? (e as { code?: string }).code : undefined;
        const retryable = !isCertificateOrSslError(message);
        const err: DownloadError = createDownloadError(
          message,
          inferErrorType(message, code),
          retryable
        );
        errors.push({ id: currentDownloadId || opts.url, error: err });
        options?.onError?.(currentDownloadId || opts.url, err);
      }
      await runNext();
    };

    const workers = Array.from({ length: Math.min(maxConcurrent, files.length) }, () => runNext());
    await Promise.all(workers);
    options?.onComplete?.(results);
    return results;
  }

  /** İndirmeyi kuyruğa ekle; döner downloadId. Priority can be in options.priority or second arg (issue #31 Example 7). */
  async addToQueue(
    options: DownloadOptions,
    priority?: DownloadPriority
  ): Promise<string> {
    const resolvedPriority = priority ?? options.priority ?? 'normal';
    const downloadId = generateId();
    const item = createQueueItem(downloadId, options, resolvedPriority);
    this.queue.push(item);
    this.statusMap.set(downloadId, item.status);
    sortQueueByPriority(this.queue);
    return downloadId;
  }

  /** İndirme kuyruğunu al. */
  async getQueue(): Promise<QueueItem[]> {
    return [...this.queue];
  }

  /** İndirme kuyruğunu işle (maxConcurrent kadar öğe). */
  async processQueue(queueOptions?: QueueOptions): Promise<void> {
    const maxConcurrent = queueOptions?.maxConcurrent ?? 2;
    const items = this.queue.splice(0, Math.min(maxConcurrent, this.queue.length));
    await Promise.all(
      items.map((item) =>
        this.download({
          ...item.options,
          onProgress: (p) => queueOptions?.onProgress?.(p.downloadId, p),
          onComplete: (r) => queueOptions?.onComplete?.(r.downloadId, r),
          onError: (e) => queueOptions?.onError?.(item.downloadId, e),
        })
      )
    );
  }
}

export const fileDownloadHelper = new FileDownloadHelper();
