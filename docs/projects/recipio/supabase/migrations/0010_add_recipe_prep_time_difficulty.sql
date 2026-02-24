-- Add prep time (minutes) and difficulty to recipe_translations (per locale)
ALTER TABLE public.recipe_translations
  ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS difficulty TEXT;

COMMENT ON COLUMN public.recipe_translations.prep_time_minutes IS 'Preparation time in minutes (e.g. 25).';
COMMENT ON COLUMN public.recipe_translations.difficulty IS 'Difficulty level (e.g. Easy, Medium, Hard).';
