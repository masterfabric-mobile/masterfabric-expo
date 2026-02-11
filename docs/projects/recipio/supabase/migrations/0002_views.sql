-- Recipio Schema Setup: Views for easier data access
-- Migration: 0002_views

-- Recipe Stats View (uses recipe_stats table)
CREATE OR REPLACE VIEW public.v_recipe_stats AS
SELECT
    rs.recipe_id,
    COALESCE(rs.view_count, 0) AS view_count,
    COALESCE(rs.favorite_count, 0) AS favorite_count,
    COALESCE(rs.save_count, 0) AS save_count,
    COALESCE(rs.tried_count, 0) AS tried_count,
    COALESCE(rs.comment_count, 0) AS comment_count,
    rs.updated_at
FROM
    public.recipe_stats rs;

-- Public Recipe Cards View (for listing pages)
-- Updated to include both TR and EN translations for client-side locale selection
CREATE OR REPLACE VIEW public.v_public_recipe_cards AS
SELECT
    r.id AS recipe_id,
    r.status,
    r.is_free,
    r.user_id,
    r.cover_image_url,
    r.created_at,
    -- Both translations from recipe_translations table (for client-side locale selection)
    rt_en.title AS title_en,
    rt_tr.title AS title_tr,
    rt_en.description AS description_en,
    rt_tr.description AS description_tr,
    -- Fallback title and description (prefer EN, then TR, then any available)
    -- This ensures we always have a title/description even if one locale is missing
    COALESCE(
        rt_en.title,
        rt_tr.title,
        (SELECT title FROM public.recipe_translations WHERE recipe_id = r.id LIMIT 1)
    ) AS title,
    COALESCE(
        rt_en.description,
        rt_tr.description,
        (SELECT description FROM public.recipe_translations WHERE recipe_id = r.id LIMIT 1)
    ) AS description,
    -- Category slug
    (SELECT c.slug FROM public.categories c 
     JOIN public.recipe_categories rc ON c.id = rc.category_id 
     WHERE rc.recipe_id = r.id LIMIT 1) AS category_slug,
    -- Stats
    COALESCE(rs.view_count, 0) AS view_count,
    COALESCE(rs.favorite_count, 0) AS favorite_count,
    COALESCE(rs.save_count, 0) AS save_count,
    COALESCE(rs.tried_count, 0) AS tried_count,
    COALESCE(rs.comment_count, 0) AS comment_count
FROM
    public.recipes r
LEFT JOIN public.recipe_translations rt_en ON r.id = rt_en.recipe_id AND rt_en.locale = 'en'
LEFT JOIN public.recipe_translations rt_tr ON r.id = rt_tr.recipe_id AND rt_tr.locale = 'tr'
LEFT JOIN public.v_recipe_stats rs ON r.id = rs.recipe_id
WHERE
    r.status = 'published';

-- Recipe Detail View (for single recipe page)
CREATE OR REPLACE VIEW public.v_recipe_detail AS
SELECT
    r.id AS recipe_id,
    r.status,
    r.is_free,
    r.user_id,
    r.cover_image_url,
    r.created_at,
    r.updated_at,
    -- Translations (both locales)
    rt_en.title AS title_en,
    rt_tr.title AS title_tr,
    rt_en.description AS description_en,
    rt_tr.description AS description_tr,
    rt_en.tips AS tips_en,
    rt_tr.tips AS tips_tr,
    rt_en.seo_title AS seo_title_en,
    rt_tr.seo_title AS seo_title_tr,
    rt_en.seo_description AS seo_description_en,
    rt_tr.seo_description AS seo_description_tr,
    -- Categories
    (
        SELECT jsonb_object_agg(ct.locale, ct.name)
        FROM public.recipe_categories rc
        JOIN public.category_translations ct ON rc.category_id = ct.category_id
        WHERE rc.recipe_id = r.id
    ) AS category_names,
    -- Stats
    COALESCE(rs.view_count, 0) AS view_count,
    COALESCE(rs.favorite_count, 0) AS favorite_count,
    COALESCE(rs.save_count, 0) AS save_count,
    COALESCE(rs.tried_count, 0) AS tried_count,
    COALESCE(rs.comment_count, 0) AS comment_count,
    -- Steps (both locales as JSONB arrays)
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'step_number', step_number,
                'text', text
            ) ORDER BY step_number
        )
        FROM public.recipe_steps
        WHERE recipe_id = r.id AND locale = 'en'
    ) AS steps_en_json,
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'step_number', step_number,
                'text', text
            ) ORDER BY step_number
        )
        FROM public.recipe_steps
        WHERE recipe_id = r.id AND locale = 'tr'
    ) AS steps_tr_json,
    -- Available servings
    (
        SELECT jsonb_agg(servings ORDER BY servings)
        FROM public.recipe_variants
        WHERE recipe_id = r.id
    ) AS available_servings,
    -- Variants with ingredients (for all serving sizes)
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'servings', rv.servings,
                'variant_id', rv.id,
                'variant_image_url', rv.variant_image_url,
                'ingredients_en', (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'name', it.name,
                            'amount', rvi.amount,
                            'unit', u.code,
                            'note', rvi.note
                        ) ORDER BY it.name
                    )
                    FROM public.recipe_variant_ingredients rvi
                    JOIN public.ingredients i ON rvi.ingredient_id = i.id
                    JOIN public.ingredient_translations it ON i.id = it.ingredient_id
                    JOIN public.units u ON rvi.unit_id = u.id
                    WHERE rvi.variant_id = rv.id AND it.locale = 'en'
                ),
                'ingredients_tr', (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'name', it.name,
                            'amount', rvi.amount,
                            'unit', u.code,
                            'note', rvi.note
                        ) ORDER BY it.name
                    )
                    FROM public.recipe_variant_ingredients rvi
                    JOIN public.ingredients i ON rvi.ingredient_id = i.id
                    JOIN public.ingredient_translations it ON i.id = it.ingredient_id
                    JOIN public.units u ON rvi.unit_id = u.id
                    WHERE rvi.variant_id = rv.id AND it.locale = 'tr'
                )
            )
            ORDER BY rv.servings
        )
        FROM public.recipe_variants rv
        WHERE rv.recipe_id = r.id
    ) AS variants_with_ingredients
FROM
    public.recipes r
LEFT JOIN public.recipe_translations rt_en ON r.id = rt_en.recipe_id AND rt_en.locale = 'en'
LEFT JOIN public.recipe_translations rt_tr ON r.id = rt_tr.recipe_id AND rt_tr.locale = 'tr'
LEFT JOIN public.v_recipe_stats rs ON r.id = rs.recipe_id;

-- Admin Pending Recipes View
CREATE OR REPLACE VIEW public.v_admin_pending_recipes AS
SELECT
    r.id AS recipe_id,
    r.status,
    r.user_id,
    r.cover_image_url,
    r.created_at,
    rt_en.title AS title_en,
    rt_tr.title AS title_tr,
    p.display_name AS author_name,
    (
        SELECT COUNT(*)
        FROM public.recipe_translations
        WHERE recipe_id = r.id
    ) AS translation_count,
    (
        SELECT COUNT(*)
        FROM public.recipe_steps
        WHERE recipe_id = r.id
    ) AS step_count,
    (
        SELECT COUNT(*)
        FROM public.recipe_variants
        WHERE recipe_id = r.id
    ) AS variant_count
FROM
    public.recipes r
LEFT JOIN public.recipe_translations rt_en ON r.id = rt_en.recipe_id AND rt_en.locale = 'en'
LEFT JOIN public.recipe_translations rt_tr ON r.id = rt_tr.recipe_id AND rt_tr.locale = 'tr'
LEFT JOIN public.profiles p ON r.user_id = p.id
WHERE
    r.status = 'pending'
ORDER BY r.created_at DESC;

-- User Library View (favorites, saved, tried)
CREATE OR REPLACE VIEW public.v_user_library AS
SELECT
    r.id AS recipe_id,
    r.status,
    r.is_free,
    r.cover_image_url,
    r.created_at,
    rt_en.title AS title_en,
    rt_tr.title AS title_tr,
    CASE
        WHEN f.user_id IS NOT NULL THEN 'favorite'
        WHEN s.user_id IS NOT NULL THEN 'saved'
        WHEN t.user_id IS NOT NULL THEN 'tried'
    END AS engagement_type,
    COALESCE(f.created_at, s.created_at, t.created_at) AS engaged_at,
    COALESCE(rs.view_count, 0) AS view_count,
    COALESCE(rs.favorite_count, 0) AS favorite_count,
    COALESCE(rs.save_count, 0) AS save_count,
    COALESCE(rs.tried_count, 0) AS tried_count
FROM
    public.recipes r
LEFT JOIN public.recipe_translations rt_en ON r.id = rt_en.recipe_id AND rt_en.locale = 'en'
LEFT JOIN public.recipe_translations rt_tr ON r.id = rt_tr.recipe_id AND rt_tr.locale = 'tr'
LEFT JOIN public.favorites f ON r.id = f.recipe_id
LEFT JOIN public.saved_recipes s ON r.id = s.recipe_id
LEFT JOIN public.tried_recipes t ON r.id = t.recipe_id
LEFT JOIN public.v_recipe_stats rs ON r.id = rs.recipe_id
WHERE
    (f.user_id IS NOT NULL OR s.user_id IS NOT NULL OR t.user_id IS NOT NULL)
    AND r.status = 'published';

-- Grant usage
GRANT SELECT ON public.v_recipe_stats TO anon, authenticated;
GRANT SELECT ON public.v_public_recipe_cards TO anon, authenticated;
GRANT SELECT ON public.v_recipe_detail TO anon, authenticated;
GRANT SELECT ON public.v_admin_pending_recipes TO authenticated;
GRANT SELECT ON public.v_user_library TO authenticated;

-- Grant usage on all tables (query directly - recommended)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant usage on all sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
