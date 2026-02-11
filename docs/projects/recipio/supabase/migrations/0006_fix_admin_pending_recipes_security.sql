-- Fix v_admin_pending_recipes: use SECURITY INVOKER so RLS applies to the calling user
-- Previously the view ran with the view owner's privileges (security definer behavior),
-- which could bypass RLS and expose pending recipes to non-admin users.
-- With security_invoker = true, only admins (who pass RLS on recipes) will see rows.
-- This also avoids permission/RLS issues for newly signed-up users when the app
-- queries views after login.

DROP VIEW IF EXISTS public.v_admin_pending_recipes CASCADE;

CREATE VIEW public.v_admin_pending_recipes
WITH (security_invoker = true)
AS
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

GRANT SELECT ON public.v_admin_pending_recipes TO authenticated;
