/**
 * Download cache constants and path helpers
 * Issue #31: https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 *
 * Actual cache operations (clearCache, getCachedFiles, etc.) remain in file_download_helper
 * so they can use FileSystem and the same sanitizeFileName/path logic.
 */

/** Default cache size limit in bytes (100 MB). */
export const DEFAULT_CACHE_LIMIT_BYTES = 100 * 1024 * 1024;

/** Return cache directory path (pass FileSystem.cacheDirectory from caller). */
export function getCacheDirPath(cacheDirectory: string | null): string {
  return cacheDirectory ?? '';
}
