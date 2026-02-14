-- Fix: update_recipe_stats trigger runs as invoking user, so INSERT/UPDATE on recipe_stats
-- is blocked by RLS. Use SECURITY DEFINER + policy so the definer (or postgres) can write.

-- 1) Recreate function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_recipe_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_recipe_id INTEGER;
BEGIN
    IF TG_TABLE_NAME = 'recipes' THEN
        IF TG_OP = 'DELETE' THEN
            target_recipe_id := OLD.id;
        ELSE
            target_recipe_id := NEW.id;
        END IF;
    ELSE
        IF TG_OP = 'DELETE' THEN
            target_recipe_id := OLD.recipe_id;
        ELSE
            target_recipe_id := NEW.recipe_id;
        END IF;
    END IF;

    INSERT INTO public.recipe_stats (recipe_id, view_count, favorite_count, save_count, tried_count, comment_count)
    VALUES (
        target_recipe_id,
        (SELECT COUNT(*) FROM public.views WHERE recipe_id = target_recipe_id),
        (SELECT COUNT(*) FROM public.favorites WHERE recipe_id = target_recipe_id),
        (SELECT COUNT(*) FROM public.saved_recipes WHERE recipe_id = target_recipe_id),
        (SELECT COUNT(*) FROM public.tried_recipes WHERE recipe_id = target_recipe_id),
        (SELECT COUNT(*) FROM public.comments WHERE recipe_id = target_recipe_id AND is_hidden = false)
    )
    ON CONFLICT (recipe_id) DO UPDATE SET
        view_count = (SELECT COUNT(*) FROM public.views WHERE recipe_id = target_recipe_id),
        favorite_count = (SELECT COUNT(*) FROM public.favorites WHERE recipe_id = target_recipe_id),
        save_count = (SELECT COUNT(*) FROM public.saved_recipes WHERE recipe_id = target_recipe_id),
        tried_count = (SELECT COUNT(*) FROM public.tried_recipes WHERE recipe_id = target_recipe_id),
        comment_count = (SELECT COUNT(*) FROM public.comments WHERE recipe_id = target_recipe_id AND is_hidden = false),
        updated_at = now();

    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2) Set function owner so SECURITY DEFINER runs as a role that can write (postgres/supabase_admin)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgres') THEN
        ALTER FUNCTION public.update_recipe_stats() OWNER TO postgres;
    ELSIF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_admin') THEN
        ALTER FUNCTION public.update_recipe_stats() OWNER TO supabase_admin;
    END IF;
EXCEPTION WHEN insufficient_privilege OR OTHERS THEN
    NULL; -- owner unchanged; run in SQL Editor as superuser: ALTER FUNCTION public.update_recipe_stats() OWNER TO postgres;
END
$$;

-- 3) RLS: allow INSERT/UPDATE for the role that owns the trigger (so SECURITY DEFINER can write)
DROP POLICY IF EXISTS "Allow stats maintenance by definer" ON public.recipe_stats;
CREATE POLICY "Allow stats maintenance by definer"
    ON public.recipe_stats
    FOR ALL
    TO postgres
    USING (true)
    WITH CHECK (true);

-- Supabase Cloud often uses supabase_admin; add policy if role exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_admin') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Allow stats maintenance by supabase_admin" ON public.recipe_stats';
        EXECUTE 'CREATE POLICY "Allow stats maintenance by supabase_admin" ON public.recipe_stats FOR ALL TO supabase_admin USING (true) WITH CHECK (true)';
    END IF;
END
$$;
