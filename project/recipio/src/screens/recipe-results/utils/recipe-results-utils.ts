import type { RecipeCardWithMatch } from '@/shared/services/recipe-service';

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

export type RecipeSortType = 'relevance' | 'time' | 'difficulty' | 'category';

/** Parse minutes from time string (e.g. "30m", "25 Mins", "1h") */
function parseTimeMinutes(time: string): number {
  const s = (time || '').trim();
  const num = parseInt(s.replace(/\D/g, ''), 10);
  if (Number.isNaN(num)) return 9999;
  if (/h|hour/i.test(s)) return num * 60;
  return num;
}

/** Difficulty order for sorting: lower = easier */
const DIFFICULTY_ORDER: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

function difficultyRank(d: string): number {
  return DIFFICULTY_ORDER[(d || '').toLowerCase().trim()] ?? 2;
}

export function sortRecipes(
  recipes: RecipeCardWithMatch[],
  sortType: RecipeSortType
): RecipeCardWithMatch[] {
  const list = [...recipes];
  switch (sortType) {
    case 'relevance':
      list.sort((a, b) => b.matchPercent - a.matchPercent);
      break;
    case 'time':
      list.sort(
        (a, b) =>
          parseTimeMinutes(a.time) - parseTimeMinutes(b.time)
      );
      break;
    case 'difficulty':
      list.sort(
        (a, b) =>
          difficultyRank(a.difficulty) - difficultyRank(b.difficulty)
      );
      break;
    case 'category':
      list.sort((a, b) => {
        const catA = (a.categorySlug ?? a.title ?? '').toLowerCase();
        const catB = (b.categorySlug ?? b.title ?? '').toLowerCase();
        return catA.localeCompare(catB);
      });
      break;
    default:
      list.sort((a, b) => b.matchPercent - a.matchPercent);
  }
  return list;
}
