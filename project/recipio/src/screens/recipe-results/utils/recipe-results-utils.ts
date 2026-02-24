/**
 * Parse comma-separated ingredients from route param.
 */
export function parseIngredientsParam(param: string | undefined): string[] {
  if (!param || typeof param !== 'string') return [];
  return param
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);
}
