-- Dietary preferences (diets, allergies, custom allergies) for recipe personalization
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS diet_slugs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS allergy_slugs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS custom_allergies TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.diet_slugs IS 'Selected diet types: vegan, vegetarian, keto, paleo, low_carb, gluten_free';
COMMENT ON COLUMN public.profiles.allergy_slugs IS 'Selected allergies: dairy, nuts, shellfish, soy, wheat, eggs';
COMMENT ON COLUMN public.profiles.custom_allergies IS 'User-added allergy labels (e.g. from "Add other allergy" input).';
