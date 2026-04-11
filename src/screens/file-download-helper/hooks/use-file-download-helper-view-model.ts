import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import type { StorageType } from 'masterfabric-expo-core';
import {
  fileDownloadHelper,
  getThemeColors,
  useTheme,
} from 'masterfabric-expo-core';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import {
  DEFAULT_DOWNLOAD_DIRECTORY,
  INVALID_NAME_CHARS,
  KNOWN_FILE_EXTENSIONS,
} from '../constants/file-download-helper.constants';
import { useFileDownloadHelperStore } from '../store/file-download-helper-store';
import { isCertificateError } from '../utils';

export function useFileDownloadHelperViewModel() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    url,
    fileName,
    directory,
    storageType,
    customHeadersJson,
    authToken,
    enableResume,
    batchUrls,
    batchResults,
    downloadProgress,
    progressDetail,
    downloadState,
    downloadId,
    isDownloading,
    lastResultPath,
    lastResultExists,
    lastResultSize,
    lastError,
    setForm,
    setProgress,
    setProgressDetail,
    setDownloadState,
    setDownloadId,
    setIsDownloading,
    setLastResult,
    setLastError,
    setBatchResults,
    appendLog,
    clearLog,
    resetResult,
  } = useFileDownloadHelperStore();

  /** Build headers from optional JSON and/or Bearer token */
  const buildHeaders = useCallback((): Record<string, string> | undefined => {
    const headers: Record<string, string> = {};
    if (authToken.trim()) {
      headers['Authorization'] = authToken.trim().startsWith('Bearer ')
        ? authToken.trim()
        : `Bearer ${authToken.trim()}`;
    }
    if (customHeadersJson.trim()) {
      try {
        const parsed = JSON.parse(customHeadersJson.trim()) as Record<
          string,
          string
        >;
        if (parsed && typeof parsed === 'object') {
          Object.assign(headers, parsed);
        }
      } catch {
        // ignore invalid JSON
      }
    }
    return Object.keys(headers).length > 0 ? headers : undefined;
  }, [authToken, customHeadersJson]);

  const {
    success: showSuccess,
    error: showError,
    warning: showWarning,
  } = useSnackbar();

  /** Show user-friendly message for SSL/certificate errors instead of raw Java exception. */
  const getDisplayError = useCallback(
    (message: string) =>
      isCertificateError(message)
        ? t('helpers.fileDownloadHelper.errorCertificate')
        : message,
    []
  );

  const startDownload = useCallback(async () => {
    const trimmedUrl = url.trim();
    const trimmedFileName = fileName.trim();
    const trimmedDirectory = directory.trim() || DEFAULT_DOWNLOAD_DIRECTORY;

    if (!trimmedUrl) {
      showWarning(t('helpers.fileDownloadHelper.validation.emptyUrl'));
      return;
    }
    if (!fileDownloadHelper.validateUrl(trimmedUrl)) {
      showWarning(t('helpers.fileDownloadHelper.validation.invalidUrl'));
      return;
    }

    if (trimmedFileName.length > 0 && INVALID_NAME_CHARS.test(trimmedFileName)) {
      showWarning(t('helpers.fileDownloadHelper.validation.invalidFileName'));
      return;
    }
    if (
      trimmedDirectory.length > 0 &&
      INVALID_NAME_CHARS.test(trimmedDirectory)
    ) {
      showWarning(t('helpers.fileDownloadHelper.validation.invalidDirectory'));
      return;
    }

    if (trimmedFileName.length > 0) {
      if (trimmedFileName.endsWith('.') || trimmedFileName.startsWith('.')) {
        showWarning(
          t('helpers.fileDownloadHelper.validation.fileNameEndsWithDot')
        );
        return;
      }
      const ext = trimmedFileName.includes('.')
        ? (trimmedFileName.split('.').pop()?.toLowerCase() ?? '').trim()
        : '';
      if (trimmedFileName.includes('.') && !ext) {
        showWarning(
          t('helpers.fileDownloadHelper.validation.fileNameEndsWithDot')
        );
        return;
      }
      if (ext && !KNOWN_FILE_EXTENSIONS.has(ext)) {
        showWarning(
          t('helpers.fileDownloadHelper.validation.unknownExtension')
        );
        return;
      }
    }

    try {
      if (Platform.OS === 'android') {
        const perm = await fileDownloadHelper.requestStoragePermission({
          rationale: t('helpers.fileDownloadHelper.permissionRationale'),
        });
        if (!perm.granted) {
          if (perm.blocked ?? !perm.canAskAgain) {
            fileDownloadHelper.handlePermissionDenied();
          } else {
            showWarning(t('helpers.fileDownloadHelper.permissionDenied'));
          }
          return;
        }
      }

      resetResult();
      clearLog();
      appendLog(t('helpers.fileDownloadHelper.log.init'));
      setIsDownloading(true);
      setDownloadState('pending');
      setProgress(0);
      setProgressDetail(null);

      const storageTypeCore: StorageType = storageType;
      const headers = buildHeaders();

      fileDownloadHelper
        .download({
          url: trimmedUrl,
          fileName: trimmedFileName || undefined,
          directory: trimmedDirectory,
          storageType: storageTypeCore,
          headers,
          resume: enableResume,
          onStart: id => {
            setDownloadId(id);
            setDownloadState('downloading');
            appendLog(t('helpers.fileDownloadHelper.log.requestStarted'));
          },
          onProgress: p => {
            setProgress(p.progress);
            setProgressDetail({
              bytesWritten: p.bytesDownloaded,
              totalBytes: p.totalBytes,
              progress: p.progress,
              speed: p.speed,
              etaSeconds: p.estimatedTimeRemaining,
            });
            appendLog(
              `${t('helpers.fileDownloadHelper.log.progress')} ${Math.round(p.progress)}%`
            );
          },
          onComplete: async r => {
            setDownloadState('completed');
            const exists = await fileDownloadHelper.fileExists(r.filePath);
            const size = await fileDownloadHelper.getFileSize(r.filePath);
            setLastResult(r.filePath, exists, size);
            appendLog(t('helpers.fileDownloadHelper.log.completed'));
            showSuccess(t('helpers.fileDownloadHelper.downloadComplete'));
            setIsDownloading(false);
            setProgress(0);
            setProgressDetail(null);
          },
          onError: err => {
            setDownloadState('failed');
            setLastError(err.message);
            appendLog(
              `${t('helpers.fileDownloadHelper.log.error')} ${err.message}`
            );
            showError(getDisplayError(err.message));
            setIsDownloading(false);
            setProgress(0);
            setProgressDetail(null);
          },
        })
        .then(() => {})
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          setDownloadState('failed');
          setLastError(message);
          appendLog(`${t('helpers.fileDownloadHelper.log.error')} ${message}`);
          showError(getDisplayError(message));
          setIsDownloading(false);
          setProgress(0);
          setProgressDetail(null);
        });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setDownloadState('failed');
      setLastError(message);
      appendLog(`${t('helpers.fileDownloadHelper.log.error')} ${message}`);
      showError(getDisplayError(message));
      setIsDownloading(false);
      setProgress(0);
      setProgressDetail(null);
    }
  }, [
    url,
    fileName,
    directory,
    storageType,
    enableResume,
    buildHeaders,
    setForm,
    setProgress,
    setProgressDetail,
    setDownloadState,
    setDownloadId,
    setIsDownloading,
    setLastResult,
    setLastError,
    appendLog,
    clearLog,
    resetResult,
    showSuccess,
    showError,
    showWarning,
  ]);

  const startBatchDownload = useCallback(async () => {
    const trimmedDirectory = directory.trim() || DEFAULT_DOWNLOAD_DIRECTORY;
    const urls = batchUrls
      .split(/\r?\n/)
      .map(u => u.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      showWarning(t('helpers.fileDownloadHelper.validation.batchEmpty'));
      return;
    }
    const invalid = urls.find(u => !fileDownloadHelper.validateUrl(u));
    if (invalid) {
      showWarning(t('helpers.fileDownloadHelper.validation.invalidUrl'));
      return;
    }

    if (
      trimmedDirectory.length > 0 &&
      INVALID_NAME_CHARS.test(trimmedDirectory)
    ) {
      showWarning(t('helpers.fileDownloadHelper.validation.invalidDirectory'));
      return;
    }

    try {
      if (Platform.OS === 'android') {
        const perm = await fileDownloadHelper.requestStoragePermission({
          rationale: t('helpers.fileDownloadHelper.permissionRationale'),
        });
        if (!perm.granted) {
          if (perm.blocked ?? !perm.canAskAgain) {
            fileDownloadHelper.handlePermissionDenied();
          } else {
            showWarning(t('helpers.fileDownloadHelper.permissionDenied'));
          }
          return;
        }
      }

      resetResult();
      clearLog();
      setBatchResults([]);
      appendLog(
        t('helpers.fileDownloadHelper.log.batchStart', { count: urls.length })
      );
      setIsDownloading(true);
      setDownloadState('downloading');
      setProgress(0);
      setProgressDetail(null);

      const storageTypeCore: StorageType = storageType;
      const headers = buildHeaders();

      const files = urls.map(u => ({
        url: u,
        fileName: undefined as string | undefined,
        directory: trimmedDirectory,
        storageType: storageTypeCore,
        headers,
        resume: enableResume,
      }));

      const results = await fileDownloadHelper.downloadMultiple(files, {
        maxConcurrent: 2,
        onProgress: (id, p) => {
          setProgress(p.progress);
          setProgressDetail({
            bytesWritten: p.bytesDownloaded,
            totalBytes: p.totalBytes,
            progress: p.progress,
            speed: p.speed,
            etaSeconds: p.estimatedTimeRemaining,
          });
        },
        onComplete: completedResults => {
          const items = urls.map(u => {
            const r = completedResults.find(res => res.url === u);
            return r
              ? { url: u, filePath: r.filePath }
              : { url: u, error: 'Not in results' };
          });
          setBatchResults(items);
        },
        onError: (id, err) => {
          appendLog(
            `${t('helpers.fileDownloadHelper.log.error')} ${err.message}`
          );
        },
      });

      const items = urls.map(u => {
        const r = results.find(res => res.url === u);
        return r
          ? { url: u, filePath: r.filePath }
          : { url: u, error: 'Failed' };
      });
      setBatchResults(items);
      setDownloadState('completed');
      setProgress(100);
      setProgressDetail(null);
      setIsDownloading(false);
      appendLog(
        t('helpers.fileDownloadHelper.log.batchComplete', {
          count: results.length,
        })
      );
      showSuccess(
        t('helpers.fileDownloadHelper.batchComplete', { count: results.length })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setDownloadState('failed');
      setLastError(message);
      appendLog(`${t('helpers.fileDownloadHelper.log.error')} ${message}`);
      showError(getDisplayError(message));
      setIsDownloading(false);
      setProgress(0);
      setProgressDetail(null);
    }
  }, [
    batchUrls,
    directory,
    storageType,
    enableResume,
    buildHeaders,
    setProgress,
    setProgressDetail,
    setDownloadState,
    setIsDownloading,
    setLastError,
    setBatchResults,
    appendLog,
    clearLog,
    resetResult,
    showSuccess,
    showError,
    showWarning,
  ]);

  const pauseDownload = useCallback(async () => {
    if (!downloadId) return;
    try {
      await fileDownloadHelper.pause(downloadId);
      setDownloadState('paused');
      setIsDownloading(false);
      appendLog(t('helpers.fileDownloadHelper.log.paused'));
    } catch (e) {
      showError(e instanceof Error ? e.message : String(e));
    }
  }, [downloadId, setDownloadState, setIsDownloading, appendLog, showError]);

  const resumeDownload = useCallback(async () => {
    if (!downloadId) return;
    try {
      setDownloadState('downloading');
      setIsDownloading(true);
      appendLog(t('helpers.fileDownloadHelper.log.resumed'));
      await fileDownloadHelper.resume(downloadId);
      const status = await fileDownloadHelper.getStatus(downloadId);
      if (status?.state === 'completed' && status.result) {
        const r = status.result;
        const exists = await fileDownloadHelper.fileExists(r.filePath);
        setLastResult(r.filePath, exists, r.size);
        setDownloadState('completed');
        showSuccess(t('helpers.fileDownloadHelper.downloadComplete'));
      }
      setIsDownloading(false);
      setProgress(0);
      setProgressDetail(null);
    } catch (e) {
      setDownloadState('failed');
      setIsDownloading(false);
      showError(e instanceof Error ? e.message : String(e));
    }
  }, [
    downloadId,
    setDownloadState,
    setIsDownloading,
    setLastResult,
    setProgress,
    setProgressDetail,
    appendLog,
    showSuccess,
    showError,
  ]);

  const cancelDownload = useCallback(async () => {
    if (!downloadId) return;
    try {
      await fileDownloadHelper.cancel(downloadId);
      setDownloadState('cancelled');
      setIsDownloading(false);
      appendLog(t('helpers.fileDownloadHelper.log.cancelled'));
    } catch (e) {
      showError(e instanceof Error ? e.message : String(e));
    }
  }, [downloadId, setDownloadState, setIsDownloading, appendLog, showError]);

  const retryDownload = useCallback(() => {
    resetResult();
    setDownloadState('idle');
    setDownloadId(null);
    startDownload();
  }, [resetResult, setDownloadState, setDownloadId, startDownload]);

  const deleteDownloadedFile = useCallback(async () => {
    if (!lastResultPath) return;
    try {
      await fileDownloadHelper.deleteFile(lastResultPath);
      resetResult();
      appendLog(t('helpers.fileDownloadHelper.log.completed'));
      showSuccess(t('helpers.fileDownloadHelper.fileDeleted'));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      showError(message);
      appendLog(`${t('helpers.fileDownloadHelper.log.error')} ${message}`);
    }
  }, [lastResultPath, resetResult, appendLog, showSuccess, showError]);

  const clearDownloadCache = useCallback(async () => {
    try {
      await fileDownloadHelper.clearCache();
      appendLog(t('helpers.fileDownloadHelper.cacheCleared'));
      showSuccess(t('helpers.fileDownloadHelper.cacheCleared'));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      showError(message);
    }
  }, [appendLog, showSuccess, showError]);

  return {
    url,
    fileName,
    directory,
    storageType,
    customHeadersJson,
    authToken,
    enableResume,
    batchUrls,
    batchResults,
    setForm,
    downloadProgress,
    progressDetail,
    downloadState,
    downloadId,
    isDownloading,
    lastResultPath,
    lastResultExists,
    lastResultSize,
    lastError,
    colors,
    startDownload,
    startBatchDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    retryDownload,
    resetResult,
    deleteDownloadedFile,
    clearDownloadCache,
  };
}
