-- Fix v_user_library view to include user_id for proper filtering
-- This allows users to query only their own saved/favorited/tried recipes
-- Note: Using DROP and CREATE instead of REPLACE to avoid column order conflicts
-- when adding new columns to an existing view

DROP VIEW IF EXISTS public.v_user_library CASCADE;

CREATE VIEW public.v_user_library AS
SELECT
    r.id AS recipe_id,
    r.status,
    r.is_free,
    r.cover_image_url,
    r.created_at,
    rt_en.title AS title_en,
    rt_tr.title AS title_tr,
    -- Include user_id from the engagement tables
    COALESCE(f.user_id, s.user_id, t.user_id) AS user_id,
    CASE
        WHEN f.user_id IS NOT NULL THEN 'favorite'
        WHEN s.user_id IS NOT NULL THEN 'saved'
        WHEN t.user_id IS NOT NULL THEN 'tried'
    END AS engagement_type,
    COALESCE(f.created_at, s.created_at, t.created_at) AS engaged_at,
    COALESCE(rs.view_count, 0) AS view_count,
    COALESCE(rs.favorite_count, 0) AS favorite_count,
    COALESCE(rs.save_count, 0) AS save_count,
    COALESCE(rs.tried_count, 0) AS tried_count,
    -- Include description for recipe cards
    rt_en.description AS description_en,
    rt_tr.description AS description_tr,
    -- Include category slug
    (SELECT c.slug FROM public.categories c 
     JOIN public.recipe_categories rc ON c.id = rc.category_id 
     WHERE rc.recipe_id = r.id LIMIT 1) AS category_slug
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

-- Update grant (already exists, but ensure it's correct)
GRANT SELECT ON public.v_user_library TO authenticated;
