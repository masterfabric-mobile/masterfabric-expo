/**
 * Parse comma-separated ingredients string into trimmed non-empty list.
 */
export function parseIngredientsParam(param: string | undefined): string[] {
  if (!param || typeof param !== 'string') return [];
  return param
    .split(',')
    .map((i) => i.trim())
    .filter(Boolean);
}

/**
 * Join ingredient list for route param.
 */
export function joinIngredientsParam(ingredients: string[]): string {
  return ingredients.join(',');
}
