-- Fix: Triggers that insert into recipe_events run as invoking user; recipe_events has only SELECT RLS.
-- Make event-writer functions SECURITY DEFINER and allow postgres/supabase_admin to write.

-- 1) update_favorite_stats (favorites table trigger)
CREATE OR REPLACE FUNCTION public.update_favorite_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
        VALUES (NEW.recipe_id, NEW.user_id, 'favorite');
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
        VALUES (OLD.recipe_id, OLD.user_id, 'favorite');
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2) update_save_stats (saved_recipes trigger)
CREATE OR REPLACE FUNCTION public.update_save_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
        VALUES (NEW.recipe_id, NEW.user_id, 'save');
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
        VALUES (OLD.recipe_id, OLD.user_id, 'save');
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3) update_tried_stats (tried_recipes trigger)
CREATE OR REPLACE FUNCTION public.update_tried_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
        VALUES (NEW.recipe_id, NEW.user_id, 'try');
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
        VALUES (OLD.recipe_id, OLD.user_id, 'try');
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 4) update_comment_stats (comments trigger)
CREATE OR REPLACE FUNCTION public.update_comment_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
    VALUES (NEW.recipe_id, NEW.user_id, 'comment');
    RETURN NEW;
END;
$$;

-- 5) Set owners so SECURITY DEFINER runs as a role that can write
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgres') THEN
        ALTER FUNCTION public.update_favorite_stats() OWNER TO postgres;
        ALTER FUNCTION public.update_save_stats() OWNER TO postgres;
        ALTER FUNCTION public.update_tried_stats() OWNER TO postgres;
        ALTER FUNCTION public.update_comment_stats() OWNER TO postgres;
    ELSIF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_admin') THEN
        ALTER FUNCTION public.update_favorite_stats() OWNER TO supabase_admin;
        ALTER FUNCTION public.update_save_stats() OWNER TO supabase_admin;
        ALTER FUNCTION public.update_tried_stats() OWNER TO supabase_admin;
        ALTER FUNCTION public.update_comment_stats() OWNER TO supabase_admin;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END
$$;

-- 6) RLS: allow INSERT (and ALL) on recipe_events for trigger definer roles
DROP POLICY IF EXISTS "Allow recipe_events maintenance by definer" ON public.recipe_events;
CREATE POLICY "Allow recipe_events maintenance by definer"
    ON public.recipe_events
    FOR ALL
    TO postgres
    USING (true)
    WITH CHECK (true);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'supabase_admin') THEN
        EXECUTE 'DROP POLICY IF EXISTS "Allow recipe_events maintenance by supabase_admin" ON public.recipe_events';
        EXECUTE 'CREATE POLICY "Allow recipe_events maintenance by supabase_admin" ON public.recipe_events FOR ALL TO supabase_admin USING (true) WITH CHECK (true)';
    END IF;
END
$$;
