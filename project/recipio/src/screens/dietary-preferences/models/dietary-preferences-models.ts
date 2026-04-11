export const DIET_SLUGS = [
  'vegan',
  'vegetarian',
  'keto',
  'paleo',
  'low_carb',
  'gluten_free',
] as const;

export const ALLERGY_SLUGS = [
  'dairy',
  'nuts',
  'shellfish',
  'soy',
  'wheat',
  'eggs',
] as const;

export type DietSlug = (typeof DIET_SLUGS)[number];
export type AllergySlug = (typeof ALLERGY_SLUGS)[number];

export interface DietaryPreferences {
  dietSlugs: string[];
  allergySlugs: string[];
  customAllergies: string[];
}
