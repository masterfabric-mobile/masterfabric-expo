-- Recipe diet compatibility (vegan, vegetarian, keto, etc.)
-- Used to filter recipes when the user has dietary preferences set.

ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS diet_slugs TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.recipes.diet_slugs IS 'Diet compatibility tags: vegan, vegetarian, keto, paleo, low_carb, gluten_free';

CREATE INDEX IF NOT EXISTS recipes_diet_slugs_gin_idx ON public.recipes USING GIN (diet_slugs);

-- Assign diet tags to existing seed recipes
-- 1: Lentil soup -> vegan, vegetarian
UPDATE public.recipes SET diet_slugs = ARRAY['vegan', 'vegetarian', 'gluten_free'] WHERE id = 1;
-- 2: Brownie -> vegetarian (contains egg, dairy; not vegan)
UPDATE public.recipes SET diet_slugs = ARRAY['vegetarian'] WHERE id = 2;
-- 3: Green salad -> vegan, vegetarian
UPDATE public.recipes SET diet_slugs = ARRAY['vegan', 'vegetarian', 'gluten_free', 'low_carb'] WHERE id = 3;
-- 4: Grilled chicken -> paleo, low_carb
UPDATE public.recipes SET diet_slugs = ARRAY['paleo', 'low_carb'] WHERE id = 4;
-- 5: Steak -> paleo, low_carb, keto
UPDATE public.recipes SET diet_slugs = ARRAY['paleo', 'low_carb', 'keto'] WHERE id = 5;
-- 6: Scrambled eggs -> vegetarian, keto, low_carb, paleo
UPDATE public.recipes SET diet_slugs = ARRAY['vegetarian', 'keto', 'low_carb', 'paleo'] WHERE id = 6;
-- 7: Bruschetta -> vegetarian (contains cheese)
UPDATE public.recipes SET diet_slugs = ARRAY['vegetarian'] WHERE id = 7;
-- 8: Tomato soup -> vegan, vegetarian
UPDATE public.recipes SET diet_slugs = ARRAY['vegan', 'vegetarian', 'gluten_free'] WHERE id = 8;
-- 9: Vanilla ice cream -> vegetarian
UPDATE public.recipes SET diet_slugs = ARRAY['vegetarian'] WHERE id = 9;
-- 10: Rejected salad -> vegan, vegetarian
UPDATE public.recipes SET diet_slugs = ARRAY['vegan', 'vegetarian', 'gluten_free', 'low_carb'] WHERE id = 10;

-- New recipes can leave diet_slugs empty; filters can show "all" or "matching" recipes.
