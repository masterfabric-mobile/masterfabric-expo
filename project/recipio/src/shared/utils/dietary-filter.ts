/**
 * Dietary filter — exclude recipes that contain user's allergens;
 * optionally restrict to recipes matching user's selected diets.
 */

/** Allergy slug → ingredient keywords (EN/TR) to match; recipe is excluded if any ingredient contains any keyword */
const ALLERGY_SLUG_KEYWORDS: Record<string, string[]> = {
  dairy: ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'dairy', 'süt', 'peynir', 'tereyağ', 'krema', 'yoğurt'],
  nuts: ['nut', 'almond', 'walnut', 'peanut', 'hazelnut', 'cashew', 'pecan', 'pistachio', 'fındık', 'ceviz', 'badem', 'fıstık', 'kaju'],
  shellfish: ['shrimp', 'prawn', 'crab', 'lobster', 'shellfish', 'mussel', 'oyster', 'karides', 'yengeç', 'ıstakoz', 'midye', 'istiridye'],
  soy: ['soy', 'soya', 'tofu', 'soya', 'soy sauce', 'soya sos'],
  wheat: ['wheat', 'flour', 'gluten', 'bread', 'buğday', 'un', 'ekmek'],
  eggs: ['egg', 'eggs', 'yumurta'],
};

function normalizeForMatch(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Build set of normalized keywords for user's allergies (slug-based + custom labels) */
export function getAllergenKeywords(
  allergySlugs: string[],
  customAllergies: string[]
): Set<string> {
  const set = new Set<string>();
  for (const slug of allergySlugs) {
    const keywords = ALLERGY_SLUG_KEYWORDS[slug];
    if (keywords) for (const k of keywords) set.add(normalizeForMatch(k));
  }
  for (const label of customAllergies) {
    const t = label.trim().toLowerCase();
    if (t) set.add(t);
  }
  return set;
}

/** True if any ingredient name (from displayName or matchSet) matches any allergen keyword */
export function recipeContainsAllergen(
  ingredientItems: { displayName: string; matchSet: Set<string> }[],
  allergenKeywords: Set<string>
): boolean {
  if (allergenKeywords.size === 0) return false;
  for (const item of ingredientItems) {
    const displayNorm = normalizeForMatch(item.displayName);
    if (displayNorm && allergenKeywords.has(displayNorm)) return true;
    for (const name of item.matchSet) {
      const n = normalizeForMatch(name);
      if (!n) continue;
      if (allergenKeywords.has(n)) return true;
      for (const kw of allergenKeywords) {
        if (n.includes(kw) || kw.includes(n)) return true;
      }
    }
  }
  return false;
}

/** True if recipe has at least one of the user's selected diet slugs */
export function recipeMatchesDiet(
  recipeDietSlugs: string[] | undefined | null,
  userDietSlugs: string[]
): boolean {
  if (userDietSlugs.length === 0) return true;
  if (!recipeDietSlugs?.length) return true;
  const recipeSet = new Set(recipeDietSlugs.map((s) => s.toLowerCase()));
  return userDietSlugs.some((d) => recipeSet.has(d.toLowerCase()));
}

export interface DietaryPrefsForFilter {
  dietSlugs: string[];
  allergySlugs: string[];
  customAllergies: string[];
}
