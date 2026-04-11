/**
 * Parse recipe id from route param.
 */
export function parseRecipeId(param: string | undefined): number | null {
  if (!param) return null;
  const num = parseInt(param, 10);
  return Number.isFinite(num) ? num : null;
}
