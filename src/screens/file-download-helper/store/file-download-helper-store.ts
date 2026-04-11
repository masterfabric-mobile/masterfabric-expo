import { create } from 'zustand';
import { DEFAULT_DOWNLOAD_DIRECTORY } from '../constants/file-download-helper.constants';
import type {
  BatchDownloadItemResult,
  FileDownloadHelperFormState,
  FileDownloadHelperUiState,
  ProgressDetail,
} from '../models/file-download-helper-models';

interface FileDownloadHelperStore extends FileDownloadHelperFormState, FileDownloadHelperUiState {
  setForm: (updates: Partial<FileDownloadHelperFormState>) => void;
  setProgress: (progress: number) => void;
  setProgressDetail: (detail: ProgressDetail | null) => void;
  setDownloadState: (state: FileDownloadHelperUiState['downloadState']) => void;
  setDownloadId: (id: string | null) => void;
  setIsDownloading: (value: boolean) => void;
  setLastResult: (path: string | null, exists: boolean | null, size: number | null) => void;
  setLastError: (message: string | null) => void;
  setBatchResults: (results: BatchDownloadItemResult[]) => void;
  appendLog: (entry: string) => void;
  clearLog: () => void;
  resetResult: () => void;
}

const defaultForm: FileDownloadHelperFormState = {
  url: '',
  fileName: '',
  // Show clean UI by default; fallback to DEFAULT_DOWNLOAD_DIRECTORY is applied in the view model.
  directory: '',
  storageType: 'document',
  customHeadersJson: '',
  authToken: '',
  enableResume: true,
  batchUrls: '',
};

export const useFileDownloadHelperStore = create<FileDownloadHelperStore>((set) => ({
  ...defaultForm,
  downloadProgress: 0,
  progressDetail: null,
  downloadState: 'idle',
  downloadId: null,
  isDownloading: false,
  lastResultPath: null,
  lastResultExists: null,
  lastResultSize: null,
  lastError: null,
  logEntries: [],
  batchResults: [],
  setForm: (updates) => set((state) => ({ ...state, ...updates })),
  setProgress: (downloadProgress) => set({ downloadProgress }),
  setProgressDetail: (progressDetail) => set({ progressDetail }),
  setDownloadState: (downloadState) => set({ downloadState }),
  setDownloadId: (downloadId) => set({ downloadId }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setLastResult: (
    lastResultPath,
    lastResultExists: boolean | null = null,
    lastResultSize: number | null = null,
  ) =>
    set({ lastResultPath, lastResultExists, lastResultSize, lastError: null }),
  setLastError: (lastError) =>
    set({ lastError, lastResultPath: null, lastResultExists: null, lastResultSize: null }),
  setBatchResults: (batchResults) => set({ batchResults }),
  appendLog: (entry) =>
    set((state) => ({
      logEntries: [...state.logEntries, `[${new Date().toISOString().slice(11, 19)}] ${entry}`],
    })),
  clearLog: () => set({ logEntries: [] }),
  resetResult: () =>
    set({
      lastResultPath: null,
      lastError: null,
      lastResultExists: null,
      lastResultSize: null,
      downloadProgress: 0,
      progressDetail: null,
      downloadState: 'idle',
      downloadId: null,
      batchResults: [],
    }),
}));
