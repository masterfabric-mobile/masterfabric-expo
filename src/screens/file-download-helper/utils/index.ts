export { DEFAULT_DOWNLOAD_DIRECTORY } from '../constants/file-download-helper.constants';

/** Detect SSL/certificate validation errors (e.g. CertPathValidatorException on Android). */
export function isCertificateError(message: string): boolean {
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

/** Format bytes per second for display (e.g. "1.2 MB/s", "450 KB/s"). */
export function formatSpeed(bytesPerSecond: number): string {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond < 0) return '0 B/s';
  if (bytesPerSecond === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.min(
    Math.floor(Math.log(bytesPerSecond) / Math.log(k)),
    sizes.length - 1
  );
  return `${parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
