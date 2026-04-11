/** Hex opacity suffix for border color (e.g. surfaceBorder + this => #rrggbb1A). */
export const BORDER_OPACITY_SUFFIX = '1A';

/** Default font size for secondary labels (e.g. storage type buttons). */
export const DEFAULT_LABEL_FONT_SIZE = 14;

/** Default directory name for downloads (app storage folder). */
export const DEFAULT_DOWNLOAD_DIRECTORY = 'Downloads';

/** Regex for invalid characters in file or directory names. */
export const INVALID_NAME_CHARS = /[\/\\:*?"<>|]/;

/** Whitelist of known/supported file extensions for downloads. */
export const KNOWN_FILE_EXTENSIONS = new Set([
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'mp4',
  'mp3',
  'wav',
  'm4a',
  'zip',
  'rar',
  '7z',
  'json',
  'txt',
  'html',
  'htm',
  'xml',
  'csv',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'apk',
  'ipa',
]);

/** Progress bar height (px). */
export const PROGRESS_BAR_HEIGHT = 6;

/** Progress bar border radius (px). */
export const PROGRESS_BAR_BORDER_RADIUS = 3;

/** Min height for multiline text input (px). */
export const INPUT_MULTILINE_MIN_HEIGHT = 88;

/** Line height for result/error text (px). */
export const RESULT_LINE_HEIGHT = 20;

/** Label opacity (0–1). */
export const LABEL_OPACITY = 0.9;

/** Disabled button opacity (0–1). */
export const BUTTON_DISABLED_OPACITY = 0.6;
