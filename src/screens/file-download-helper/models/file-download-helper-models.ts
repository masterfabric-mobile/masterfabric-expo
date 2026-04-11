/** Form default values (e.g. directory) live in file-download-helper.constants. */
export type StorageTypeOption = 'document' | 'cache';

/** Parça indirme durumu: beklemede, indiriliyor, duraklatıldı, tamamlandı, başarısız, iptal edildi */
export type DownloadUiState =
  | 'idle'
  | 'pending'
  | 'downloading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface FileDownloadHelperFormState {
  url: string;
  fileName: string;
  directory: string;
  storageType: StorageTypeOption;
  /** Custom headers as JSON string, e.g. {"X-Custom": "value"} */
  customHeadersJson: string;
  /** Optional auth token; sent as Authorization: Bearer <token> */
  authToken: string;
  /** Enable resume support (pause/resume) for this download */
  enableResume: boolean;
  /** Batch download: one URL per line */
  batchUrls: string;
}

export interface ProgressDetail {
  bytesWritten: number;
  totalBytes: number;
  progress: number;
  speed: number;
  etaSeconds: number;
}

export interface BatchDownloadItemResult {
  url: string;
  filePath?: string;
  error?: string;
}

export interface FileDownloadHelperUiState {
  downloadProgress: number;
  progressDetail: ProgressDetail | null;
  downloadState: DownloadUiState;
  downloadId: string | null;
  isDownloading: boolean;
  lastResultPath: string | null;
  lastResultExists: boolean | null;
  lastResultSize: number | null;
  lastError: string | null;
  logEntries: string[];
  /** Batch download: results per URL */
  batchResults: BatchDownloadItemResult[];
}
