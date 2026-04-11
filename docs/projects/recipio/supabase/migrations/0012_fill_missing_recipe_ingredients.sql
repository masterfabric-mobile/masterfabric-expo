-- Fill missing recipe ingredients
-- All recipes were compared with their steps; missing ingredients are added.
--
-- Summary (recipe / added ingredients):
--  1 Lentil Soup       → water, lemon
--  2 Brownie           → vanilla extract, cocoa powder
--  3 Green Salad       → olive oil, salt
--  4 Grilled Chicken   → olive oil
--  5 Premium Steak     → beef, butter
--  6 Scrambled Eggs    → (complete)
--  7 Bruschetta        → bread, basil
--  8 Tomato Soup       → broth, cream, olive oil
--  9 Vanilla Ice Cream → cream, vanilla extract
-- 10 Rejected Salad    → (placeholder, none)

-- =============================================================================
-- 1. New ingredients (ingredients + ingredient_translations)
-- Seed data uses explicit ids, so the sequence can stay at 1; fix it so
-- new INSERTs get the next id and avoid "duplicate key" errors.
-- =============================================================================
SELECT setval(
  pg_get_serial_sequence('public.ingredients', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM public.ingredients)
);

INSERT INTO public.ingredients (slug, image_url) VALUES
('vanilla-extract', NULL),
('cocoa-powder', NULL),
('water', NULL),
('bread', NULL),
('basil', NULL),
('broth', NULL),
('cream', NULL),
('beef', NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.ingredient_translations (ingredient_id, locale, name)
SELECT i.id, t.locale, t.name
FROM public.ingredients i
CROSS JOIN (VALUES
  ('vanilla-extract', 'en', 'Vanilla Extract'),
  ('vanilla-extract', 'tr', 'Vanilya Özütü'),
  ('cocoa-powder', 'en', 'Cocoa Powder'),
  ('cocoa-powder', 'tr', 'Kakao Tozu'),
  ('water', 'en', 'Water'),
  ('water', 'tr', 'Su'),
  ('bread', 'en', 'Bread'),
  ('bread', 'tr', 'Ekmek'),
  ('basil', 'en', 'Basil'),
  ('basil', 'tr', 'Fesleğen'),
  ('broth', 'en', 'Broth'),
  ('broth', 'tr', 'Et Suyu'),
  ('cream', 'en', 'Cream'),
  ('cream', 'tr', 'Krema'),
  ('beef', 'en', 'Beef'),
  ('beef', 'tr', 'Sığır Eti')
) AS t(slug, locale, name)
WHERE i.slug = t.slug
ON CONFLICT (ingredient_id, locale) DO NOTHING;

-- =============================================================================
-- 2. Recipe 1 – Lentil Soup
-- Steps mention: water, lemon (for serving). Existing: lentil, onion, olive oil, butter, mint, salt.
-- Missing: water, lemon (for serving). Variants: 1,2,3,4.
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u,
     public.ingredients i,
     (VALUES (1, 250, 'ml', 'water'), (2, 500, 'ml', 'water'), (3, 750, 'ml', 'water'), (4, 1000, 'ml', 'water'),
             (1, 0.25, 'pcs', 'lemon'), (2, 0.5, 'pcs', 'lemon'), (3, 0.75, 'pcs', 'lemon'), (4, 1, 'pcs', 'lemon')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 3. Recipe 2 – Brownie
-- Missing: vanilla extract, cocoa powder (variants 5,6,7,8)
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u, public.ingredients i,
     (VALUES (5, 0.5, 'tsp', 'vanilla-extract'), (6, 1, 'tsp', 'vanilla-extract'), (7, 1.5, 'tsp', 'vanilla-extract'), (8, 2, 'tsp', 'vanilla-extract'),
             (5, 5, 'g', 'cocoa-powder'), (6, 10, 'g', 'cocoa-powder'), (7, 15, 'g', 'cocoa-powder'), (8, 20, 'g', 'cocoa-powder')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 4. Recipe 3 – Simple Green Salad
-- Steps: lettuce, "favorite dressing". Existing: lettuce, yogurt. Missing: olive oil, salt (for dressing)
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u, public.ingredients i,
     (VALUES (9, 1, 'tbsp', 'olive-oil'), (10, 2, 'tbsp', 'olive-oil'), (11, 3, 'tbsp', 'olive-oil'), (12, 4, 'tbsp', 'olive-oil'),
             (9, 0.25, 'tsp', 'salt'), (10, 0.5, 'tsp', 'salt'), (11, 0.75, 'tsp', 'salt'), (12, 1, 'tsp', 'salt')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 5. Recipe 4 – Grilled Chicken
-- Steps: chicken, salt, pepper. Missing: olive oil for grilling
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u, public.ingredients i,
     (VALUES (13, 1, 'tbsp', 'olive-oil'), (14, 2, 'tbsp', 'olive-oil'), (15, 3, 'tbsp', 'olive-oil'), (16, 4, 'tbsp', 'olive-oil')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 6. Recipe 5 – Premium Steak
-- Steps: steak, salt, pepper. Existing: only salt, pepper. Missing: beef, butter
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u, public.ingredients i,
     (VALUES (17, 150, 'g', 'beef'), (18, 300, 'g', 'beef'), (19, 450, 'g', 'beef'), (20, 600, 'g', 'beef'),
             (17, 15, 'g', 'butter'), (18, 30, 'g', 'butter'), (19, 45, 'g', 'butter'), (20, 60, 'g', 'butter')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 7. Recipe 6 – Scrambled Eggs
-- Existing: egg, salt, butter. Complete.
-- =============================================================================
-- (no change)

-- =============================================================================
-- 8. Recipe 7 – Bruschetta
-- Steps: bread slices, garlic, olive oil, tomatoes, basil. Existing: tomato, garlic, olive oil, cheese.
-- Missing: bread, basil
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u, public.ingredients i,
     (VALUES (25, 2, 'pcs', 'bread'), (26, 4, 'pcs', 'bread'), (27, 6, 'pcs', 'bread'), (28, 8, 'pcs', 'bread'),
             (25, 5, 'g', 'basil'), (26, 10, 'g', 'basil'), (27, 15, 'g', 'basil'), (28, 20, 'g', 'basil')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 9. Recipe 8 – Tomato Soup
-- Steps: onions, tomatoes, broth, cream. Existing: tomato, onion, salt. Missing: broth, cream, olive oil (for sauté)
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u, public.ingredients i,
     (VALUES (29, 200, 'ml', 'broth'), (30, 400, 'ml', 'broth'), (31, 600, 'ml', 'broth'), (32, 800, 'ml', 'broth'),
             (29, 50, 'ml', 'cream'), (30, 100, 'ml', 'cream'), (31, 150, 'ml', 'cream'), (32, 200, 'ml', 'cream'),
             (29, 1, 'tbsp', 'olive-oil'), (30, 2, 'tbsp', 'olive-oil'), (31, 3, 'tbsp', 'olive-oil'), (32, 4, 'tbsp', 'olive-oil')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 10. Recipe 9 – Vanilla Ice Cream
-- Steps: milk and cream, egg yolks, sugar, chill and churn. Existing: milk, egg, sugar. Missing: cream, vanilla
-- =============================================================================
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id)
SELECT v.variant_id, i.id, v.amount, u.id
FROM public.units u, public.ingredients i,
     (VALUES (33, 125, 'ml', 'cream'), (34, 250, 'ml', 'cream'), (35, 375, 'ml', 'cream'), (36, 500, 'ml', 'cream'),
             (33, 0.5, 'tsp', 'vanilla-extract'), (34, 1, 'tsp', 'vanilla-extract'), (35, 1.5, 'tsp', 'vanilla-extract'), (36, 2, 'tsp', 'vanilla-extract')) AS v(variant_id, amount, unit_code, ing_slug)
WHERE i.slug = v.ing_slug AND u.code = v.unit_code
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- =============================================================================
-- 11. Recipe 10 – Rejected Salad (placeholder: lettuce only; no extras added)
-- =============================================================================
