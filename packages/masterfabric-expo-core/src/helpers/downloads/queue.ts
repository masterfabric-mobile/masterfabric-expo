/**
 * Download queue helpers – priority and queue item creation
 * Issue #31: https://github.com/masterfabric-mobile/masterfabric-expo/issues/31
 */

import type {
  DownloadOptions,
  DownloadPriority,
  DownloadStatus,
  QueueItem,
} from './types';

export const PRIORITY_ORDER: Record<DownloadPriority, number> = {
  high: 0,
  normal: 1,
  low: 2,
};

/** Create a new queue item (pending status). */
export function createQueueItem(
  downloadId: string,
  options: DownloadOptions,
  priority: DownloadPriority
): QueueItem {
  const now = new Date();
  const status: DownloadStatus = {
    downloadId,
    state: 'pending',
    progress: null,
    result: null,
    error: null,
    createdAt: now,
    updatedAt: now,
  };
  return {
    downloadId,
    options,
    priority,
    status,
    addedAt: now,
  };
}

/** Sort queue by priority (high first). */
export function sortQueueByPriority(queue: QueueItem[]): void {
  queue.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}
