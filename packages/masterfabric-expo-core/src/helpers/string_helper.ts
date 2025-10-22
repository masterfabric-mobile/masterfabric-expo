/**
 * String manipulation utilities for MasterFabric Expo Core
 */

/**
 * Capitalizes the first letter of a string.
 * @param str The input string.
 * @returns The capitalized string.
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length and adds a suffix.
 * @param str The input string.
 * @param length The maximum length of the string.
 * @param suffix The suffix to add if the string is truncated.
 * @returns The truncated string.
 */
export function truncate(str: string, length: number, suffix: string = "..."):
 string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * Checks if a string is a valid email address.
 * @param str The input string.
 * @returns True if the string is a valid email address, false otherwise.
 */
export function isEmail(str: string): boolean {
  if (!str) return false;
  const emailRegex = /^(([^<>()[\]\\.,;:\\s@\"]+(\\.[^<>()[\]\\.,;:\\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\\. [0-9]{1,3}\\. [0-9]{1,3}\\. [0-9]{1,3}\])|(([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(str);
}

/**
 * Checks if a string is a valid URL.
 * @param str The input string.
 * @returns True if the string is a valid URL, false otherwise.
 */
export function isUrl(str: string): boolean {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Formats a number as a currency string.
 * @param amount The number to format.
 * @param currency The currency code (e.g., "USD", "EUR").
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number, currency: string = "USD"):
 string {
  return new Intl.NumberFormat("default", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a number with a specified number of decimal places.
 * @param num The number to format.
 * @param decimals The number of decimal places.
 * @returns The formatted number string.
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

/**
 * Converts a string to kebab-case.
 * @param str The input string.
 * @returns The kebab-cased string.
 */
export function kebabCase(str: string): string {
  if (!str) return "";
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Converts a string to snake_case.
 * @param str The input string.
 * @returns The snake_cased string.
 */
export function snakeCase(str: string): string {
  if (!str) return "";
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1_$2")
    .toLowerCase();
}

/**
 * Converts a string to camelCase.
 * @param str The input string.
 * @returns The camelCased string.
 */
export function camelCase(str: string): string {
  if (!str) return "";
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

/**
 * Converts a string to PascalCase.
 * @param str The input string.
 * @returns The PascalCased string.
 */
export function pascalCase(str: string): string {
  if (!str) return "";
  return capitalize(camelCase(str));
}

/**
 * Pluralizes a string based on a count.
 * @param str The input string.
 * @param count The count to determine if the string should be pluralized.
 * @returns The pluralized string.
 */
export function pluralize(str: string, count: number): string {
  if (count === 1) {
    return str;
  }
  // This is a simple implementation and may not work for all words.
  // For a more robust solution, a library like `pluralize` could be used.
  if (str.endsWith("y")) {
    return str.slice(0, -1) + "ies";
  }
  if (str.endsWith("s")) {
    return str + "es";
  }
  return str + "s";
}

/**
 * Removes HTML tags from a string.
 * @param str The input string.
 * @returns The string with HTML tags removed.
 */
export function stripHtml(str: string): string {
  if (!str) return "";
  return str.replace(/<[^>]*>?/gm, "");
}

/**
 * Escapes HTML special characters in a string.
 * @param str The input string.
 * @returns The escaped string.
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/[&<>\n\r\t\'"]/g, (s) => {
    const entityMap: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\n": "<br/>",
      "\r": "<br/>",
      "\t": "    ",
      "'" : "&#39;",
      "\"": "&quot;",
    };
    return entityMap[s];
  });
}

/**
 * Unescapes HTML special characters in a string.
 * @param str The input string.
 * @returns The unescaped string.
 */
export function unescapeHtml(str: string): string {
  if (!str) return "";
  const entityMap: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "<br/>": "\n",
  };
  return str.replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|<br\/>)/g, (s: string) => entityMap[s]);
}
