/**
 * Format recipe time and difficulty for display using i18n.
 */

type TFunction = (key: string, params?: Record<string, string | number>) => string;

/** Parse minutes from time string like "25 Mins" or "30m". Returns null if not parseable. */
export function parseMinutesFromTimeString(time: string): number | null {
  if (!time?.trim()) return null;
  const match = time.trim().match(/^(\d+)\s*(?:Mins?|m|min|minutes?)?$/i);
  return match ? parseInt(match[1], 10) : null;
}

/** Format time for display (e.g. "25 Mins" -> "25 dk" in Turkish). */
export function formatRecipeTime(
  t: TFunction,
  time: string
): string {
  const mins = parseMinutesFromTimeString(time);
  return mins != null ? t('recipe.mins', { count: mins }) : time;
}

/** Format difficulty for display (e.g. "Easy" -> "Kolay" in Turkish). */
export function formatRecipeDifficulty(
  t: TFunction,
  difficulty: string
): string {
  const key = difficulty?.trim().toLowerCase();
  if (key === 'easy') return t('recipe.difficultyEasy');
  if (key === 'medium') return t('recipe.difficultyMedium');
  if (key === 'hard') return t('recipe.difficultyHard');
  return difficulty?.trim() || t('recipe.difficultyEasy');
}
