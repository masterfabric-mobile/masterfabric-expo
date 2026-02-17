-- Recipio Schema Setup: Complete Structure for Multi-language Recipe App
-- Migration: 0001_init

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types (Enums)
DO $$ BEGIN
    CREATE TYPE public.recipe_status AS ENUM ('draft', 'pending', 'published', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.recipe_event_type AS ENUM ('view', 'favorite', 'save', 'try', 'comment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tables
-- Profiles (separate from auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    locale VARCHAR(2) DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'user',
    PRIMARY KEY (user_id, role)
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.category_translations (
    category_id INTEGER NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    locale VARCHAR(2) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    PRIMARY KEY (category_id, locale)
);

-- Recipes - Core table (NO JSON fields)
CREATE TABLE IF NOT EXISTS public.recipes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status public.recipe_status NOT NULL DEFAULT 'draft',
    is_free BOOLEAN NOT NULL DEFAULT false,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON public.recipes (user_id);
CREATE INDEX IF NOT EXISTS recipes_status_idx ON public.recipes (status);
CREATE INDEX IF NOT EXISTS recipes_status_is_free_idx ON public.recipes (status, is_free);

-- Recipe Translations (separate table for each language)
CREATE TABLE IF NOT EXISTS public.recipe_translations (
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    locale VARCHAR(2) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    tips TEXT,
    seo_title TEXT,
    seo_description TEXT,
    PRIMARY KEY (recipe_id, locale)
);
CREATE INDEX IF NOT EXISTS recipe_translations_recipe_id_idx ON public.recipe_translations (recipe_id);
CREATE INDEX IF NOT EXISTS recipe_translations_locale_idx ON public.recipe_translations (locale);

-- Recipe Steps (separate table for each language)
CREATE TABLE IF NOT EXISTS public.recipe_steps (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    locale VARCHAR(2) NOT NULL,
    step_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    UNIQUE(recipe_id, locale, step_number)
);
CREATE INDEX IF NOT EXISTS recipe_steps_recipe_id_locale_idx ON public.recipe_steps (recipe_id, locale);

-- Recipe Categories (many-to-many)
CREATE TABLE IF NOT EXISTS public.recipe_categories (
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);

-- Ingredients
CREATE TABLE IF NOT EXISTS public.ingredients (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS public.ingredient_translations (
    ingredient_id INTEGER NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    locale VARCHAR(2) NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (ingredient_id, locale)
);

-- Units
CREATE TABLE IF NOT EXISTS public.units (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE
);

-- Recipe Variants (1, 2, 3, 4 servings)
CREATE TABLE IF NOT EXISTS public.recipe_variants (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    servings INTEGER NOT NULL,
    variant_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(recipe_id, servings)
);
CREATE INDEX IF NOT EXISTS recipe_variants_recipe_id_idx ON public.recipe_variants (recipe_id);
CREATE INDEX IF NOT EXISTS recipe_variants_recipe_id_servings_idx ON public.recipe_variants (recipe_id, servings);

-- Recipe Variant Ingredients
CREATE TABLE IF NOT EXISTS public.recipe_variant_ingredients (
    variant_id INTEGER NOT NULL REFERENCES public.recipe_variants(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    unit_id INTEGER NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    note TEXT,
    PRIMARY KEY (variant_id, ingredient_id)
);
CREATE INDEX IF NOT EXISTS recipe_variant_ingredients_variant_id_idx ON public.recipe_variant_ingredients (variant_id);
CREATE INDEX IF NOT EXISTS recipe_variant_ingredients_ingredient_id_idx ON public.recipe_variant_ingredients (ingredient_id);

-- User Engagements (separate tables)
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, recipe_id)
);
CREATE INDEX IF NOT EXISTS favorites_recipe_id_idx ON public.favorites (recipe_id);
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites (user_id);

CREATE TABLE IF NOT EXISTS public.saved_recipes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, recipe_id)
);
CREATE INDEX IF NOT EXISTS saved_recipes_recipe_id_idx ON public.saved_recipes (recipe_id);
CREATE INDEX IF NOT EXISTS saved_recipes_user_id_idx ON public.saved_recipes (user_id);

CREATE TABLE IF NOT EXISTS public.tried_recipes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, recipe_id)
);
CREATE INDEX IF NOT EXISTS tried_recipes_recipe_id_idx ON public.tried_recipes (recipe_id);
CREATE INDEX IF NOT EXISTS tried_recipes_user_id_idx ON public.tried_recipes (user_id);

-- Views tracking
CREATE TABLE IF NOT EXISTS public.views (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS views_recipe_id_idx ON public.views (recipe_id);
CREATE INDEX IF NOT EXISTS views_recipe_id_user_id_idx ON public.views (recipe_id, user_id);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_recipe_id_idx ON public.comments (recipe_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments (user_id);

-- Recipe Stats (aggregated counts)
CREATE TABLE IF NOT EXISTS public.recipe_stats (
    recipe_id INTEGER PRIMARY KEY REFERENCES public.recipes(id) ON DELETE CASCADE,
    view_count INTEGER NOT NULL DEFAULT 0,
    favorite_count INTEGER NOT NULL DEFAULT 0,
    save_count INTEGER NOT NULL DEFAULT 0,
    tried_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recipe Events (event log for stats updates)
CREATE TABLE IF NOT EXISTS public.recipe_events (
    id BIGSERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type public.recipe_event_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS recipe_events_recipe_id_event_type_idx ON public.recipe_events (recipe_id, event_type);
CREATE INDEX IF NOT EXISTS recipe_events_created_at_idx ON public.recipe_events (created_at);

-- Helper function to check for admin role
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = is_admin.user_id AND ur.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check recipe accessibility
CREATE OR REPLACE FUNCTION is_recipe_accessible(recipe_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    recipe_status public.recipe_status;
    recipe_is_free BOOLEAN;
    recipe_user_id UUID;
BEGIN
    SELECT r.status, r.is_free, r.user_id
    INTO recipe_status, recipe_is_free, recipe_user_id
    FROM public.recipes r
    WHERE r.id = is_recipe_accessible.recipe_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    RETURN (
        (recipe_status = 'published' AND recipe_is_free = true)
        OR (recipe_status = 'published' AND auth.role() = 'authenticated')
        OR (auth.uid() = recipe_user_id)
        OR (is_admin(auth.uid()))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Functions to update recipe stats
CREATE OR REPLACE FUNCTION public.update_recipe_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_recipe_id INTEGER;
BEGIN
    -- Get recipe_id from NEW or OLD depending on operation and table
    -- 'recipes' table uses 'id', all other tables use 'recipe_id'
    IF TG_TABLE_NAME = 'recipes' THEN
        -- Recipes table: use 'id' field
        IF TG_OP = 'DELETE' THEN
            target_recipe_id := OLD.id;
        ELSE
            target_recipe_id := NEW.id;
        END IF;
    ELSE
        -- All other tables: use 'recipe_id' field
        IF TG_OP = 'DELETE' THEN
            target_recipe_id := OLD.recipe_id;
        ELSE
            target_recipe_id := NEW.recipe_id;
        END IF;
    END IF;
    
    -- Update stats directly from source tables (not from events to avoid loops)
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_favorite_stats()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_save_stats()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_tried_stats()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_comment_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
    VALUES (NEW.recipe_id, NEW.user_id, 'comment');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_view_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.recipe_events (recipe_id, user_id, event_type)
    VALUES (NEW.recipe_id, NEW.user_id, 'view');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_recipes_updated_at ON public.recipes;
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Triggers for stats updates
DROP TRIGGER IF EXISTS on_favorite_engagement ON public.favorites;
CREATE TRIGGER on_favorite_engagement
    AFTER INSERT OR DELETE ON public.favorites
    FOR EACH ROW EXECUTE FUNCTION public.update_favorite_stats();

DROP TRIGGER IF EXISTS on_saved_engagement ON public.saved_recipes;
CREATE TRIGGER on_saved_engagement
    AFTER INSERT OR DELETE ON public.saved_recipes
    FOR EACH ROW EXECUTE FUNCTION public.update_save_stats();

DROP TRIGGER IF EXISTS on_tried_engagement ON public.tried_recipes;
CREATE TRIGGER on_tried_engagement
    AFTER INSERT OR DELETE ON public.tried_recipes
    FOR EACH ROW EXECUTE FUNCTION public.update_tried_stats();

DROP TRIGGER IF EXISTS on_comment_engagement ON public.comments;
CREATE TRIGGER on_comment_engagement
    AFTER INSERT ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_comment_stats();

DROP TRIGGER IF EXISTS on_view_engagement ON public.views;
CREATE TRIGGER on_view_engagement
    AFTER INSERT ON public.views
    FOR EACH ROW EXECUTE FUNCTION public.update_view_stats();

-- Triggers for stats updates (directly from source tables, not from events to avoid loops)
DROP TRIGGER IF EXISTS on_favorite_changed ON public.favorites;
CREATE TRIGGER on_favorite_changed
    AFTER INSERT OR DELETE ON public.favorites
    FOR EACH ROW EXECUTE FUNCTION public.update_recipe_stats();

DROP TRIGGER IF EXISTS on_saved_changed ON public.saved_recipes;
CREATE TRIGGER on_saved_changed
    AFTER INSERT OR DELETE ON public.saved_recipes
    FOR EACH ROW EXECUTE FUNCTION public.update_recipe_stats();

DROP TRIGGER IF EXISTS on_tried_changed ON public.tried_recipes;
CREATE TRIGGER on_tried_changed
    AFTER INSERT OR DELETE ON public.tried_recipes
    FOR EACH ROW EXECUTE FUNCTION public.update_recipe_stats();

DROP TRIGGER IF EXISTS on_comment_changed ON public.comments;
CREATE TRIGGER on_comment_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_recipe_stats();

DROP TRIGGER IF EXISTS on_view_changed ON public.views;
CREATE TRIGGER on_view_changed
    AFTER INSERT ON public.views
    FOR EACH ROW EXECUTE FUNCTION public.update_recipe_stats();

DROP TRIGGER IF EXISTS on_recipe_created ON public.recipes;
CREATE TRIGGER on_recipe_created
    AFTER INSERT ON public.recipes
    FOR EACH ROW EXECUTE FUNCTION public.update_recipe_stats();

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredient_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_variant_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tried_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_events ENABLE ROW LEVEL SECURITY;

-- Policies
-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User Roles
DROP POLICY IF EXISTS "User roles are viewable by everyone." ON public.user_roles;
CREATE POLICY "User roles are viewable by everyone." ON public.user_roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage all user roles." ON public.user_roles;
CREATE POLICY "Admins can manage all user roles." ON public.user_roles FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Public readable content
DROP POLICY IF EXISTS "Anyone can read categories, ingredients, and units." ON public.categories;
CREATE POLICY "Anyone can read categories, ingredients, and units." ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can read category_translations." ON public.category_translations;
CREATE POLICY "Anyone can read category_translations." ON public.category_translations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can read ingredients." ON public.ingredients;
CREATE POLICY "Anyone can read ingredients." ON public.ingredients FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can read ingredient_translations." ON public.ingredient_translations;
CREATE POLICY "Anyone can read ingredient_translations." ON public.ingredient_translations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can read units." ON public.units;
CREATE POLICY "Anyone can read units." ON public.units FOR SELECT USING (true);

-- Recipes
DROP POLICY IF EXISTS "Published, free recipes are public." ON public.recipes;
CREATE POLICY "Published, free recipes are public." ON public.recipes FOR SELECT USING (status = 'published' AND is_free = true);
DROP POLICY IF EXISTS "Published, non-free recipes for auth users." ON public.recipes;
CREATE POLICY "Published, non-free recipes for auth users." ON public.recipes FOR SELECT USING (status = 'published' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Users can see their own non-published recipes." ON public.recipes;
CREATE POLICY "Users can see their own non-published recipes." ON public.recipes FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can see all recipes." ON public.recipes;
CREATE POLICY "Admins can see all recipes." ON public.recipes FOR SELECT USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Auth users can create recipes." ON public.recipes;
CREATE POLICY "Auth users can create recipes." ON public.recipes FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid() AND status IN ('pending', 'draft'));
DROP POLICY IF EXISTS "Users can update their own draft/rejected recipes." ON public.recipes;
CREATE POLICY "Users can update their own draft/rejected recipes." ON public.recipes FOR UPDATE USING (auth.uid() = user_id AND status IN ('draft', 'rejected')) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can update any recipe." ON public.recipes;
CREATE POLICY "Admins can update any recipe." ON public.recipes FOR UPDATE USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Recipe Translations
DROP POLICY IF EXISTS "Related content is visible if recipe is accessible." ON public.recipe_translations;
CREATE POLICY "Related content is visible if recipe is accessible." ON public.recipe_translations FOR SELECT USING (is_recipe_accessible(recipe_id));
DROP POLICY IF EXISTS "Users can manage translations for their own recipes." ON public.recipe_translations;
CREATE POLICY "Users can manage translations for their own recipes." ON public.recipe_translations FOR ALL USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can manage all recipe translations." ON public.recipe_translations;
CREATE POLICY "Admins can manage all recipe translations." ON public.recipe_translations FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Recipe Steps
DROP POLICY IF EXISTS "Related content is visible if recipe is accessible." ON public.recipe_steps;
CREATE POLICY "Related content is visible if recipe is accessible." ON public.recipe_steps FOR SELECT USING (is_recipe_accessible(recipe_id));
DROP POLICY IF EXISTS "Users can manage steps for their own recipes." ON public.recipe_steps;
CREATE POLICY "Users can manage steps for their own recipes." ON public.recipe_steps FOR ALL USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can manage all recipe steps." ON public.recipe_steps;
CREATE POLICY "Admins can manage all recipe steps." ON public.recipe_steps FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Recipe Categories
DROP POLICY IF EXISTS "Related content is visible if recipe is accessible." ON public.recipe_categories;
CREATE POLICY "Related content is visible if recipe is accessible." ON public.recipe_categories FOR SELECT USING (is_recipe_accessible(recipe_id));
DROP POLICY IF EXISTS "Users can manage categories for their own recipes." ON public.recipe_categories;
CREATE POLICY "Users can manage categories for their own recipes." ON public.recipe_categories FOR ALL USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can manage all recipe categories." ON public.recipe_categories;
CREATE POLICY "Admins can manage all recipe categories." ON public.recipe_categories FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Recipe Variants
DROP POLICY IF EXISTS "Related content is visible if recipe is accessible." ON public.recipe_variants;
CREATE POLICY "Related content is visible if recipe is accessible." ON public.recipe_variants FOR SELECT USING (is_recipe_accessible(recipe_id));
DROP POLICY IF EXISTS "Users can manage variants for their own recipes." ON public.recipe_variants;
CREATE POLICY "Users can manage variants for their own recipes." ON public.recipe_variants FOR ALL USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_id AND r.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can manage all recipe variants." ON public.recipe_variants;
CREATE POLICY "Admins can manage all recipe variants." ON public.recipe_variants FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Recipe Variant Ingredients
DROP POLICY IF EXISTS "Related content is visible if recipe is accessible." ON public.recipe_variant_ingredients;
CREATE POLICY "Related content is visible if recipe is accessible." ON public.recipe_variant_ingredients FOR SELECT USING (EXISTS (SELECT 1 FROM public.recipe_variants v WHERE v.id = variant_id AND is_recipe_accessible(v.recipe_id)));
DROP POLICY IF EXISTS "Users can manage variant ingredients for their own recipes." ON public.recipe_variant_ingredients;
CREATE POLICY "Users can manage variant ingredients for their own recipes." ON public.recipe_variant_ingredients FOR ALL USING (EXISTS (SELECT 1 FROM public.recipe_variants v JOIN public.recipes r ON v.recipe_id = r.id WHERE v.id = variant_id AND r.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.recipe_variants v JOIN public.recipes r ON v.recipe_id = r.id WHERE v.id = variant_id AND r.user_id = auth.uid()));
DROP POLICY IF EXISTS "Admins can manage all variant ingredients." ON public.recipe_variant_ingredients;
CREATE POLICY "Admins can manage all variant ingredients." ON public.recipe_variant_ingredients FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Favorites
DROP POLICY IF EXISTS "Auth users can manage their own favorites." ON public.favorites;
CREATE POLICY "Auth users can manage their own favorites." ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can read favorites for accessible recipes." ON public.favorites;
CREATE POLICY "Anyone can read favorites for accessible recipes." ON public.favorites FOR SELECT USING (is_recipe_accessible(recipe_id));

-- Saved Recipes
DROP POLICY IF EXISTS "Auth users can manage their own saved recipes." ON public.saved_recipes;
CREATE POLICY "Auth users can manage their own saved recipes." ON public.saved_recipes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can read saved recipes for accessible recipes." ON public.saved_recipes;
CREATE POLICY "Anyone can read saved recipes for accessible recipes." ON public.saved_recipes FOR SELECT USING (is_recipe_accessible(recipe_id));

-- Tried Recipes
DROP POLICY IF EXISTS "Auth users can manage their own tried recipes." ON public.tried_recipes;
CREATE POLICY "Auth users can manage their own tried recipes." ON public.tried_recipes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can read tried recipes for accessible recipes." ON public.tried_recipes;
CREATE POLICY "Anyone can read tried recipes for accessible recipes." ON public.tried_recipes FOR SELECT USING (is_recipe_accessible(recipe_id));

-- Views
DROP POLICY IF EXISTS "Anyone can insert view events." ON public.views;
CREATE POLICY "Anyone can insert view events." ON public.views FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can read view counts for accessible recipes." ON public.views;
CREATE POLICY "Anyone can read view counts for accessible recipes." ON public.views FOR SELECT USING (is_recipe_accessible(recipe_id));

-- Comments
DROP POLICY IF EXISTS "Comments are public if not hidden and recipe is accessible." ON public.comments;
CREATE POLICY "Comments are public if not hidden and recipe is accessible." ON public.comments FOR SELECT USING (is_hidden = false AND is_recipe_accessible(recipe_id));
DROP POLICY IF EXISTS "Users can see their own hidden comments." ON public.comments;
CREATE POLICY "Users can see their own hidden comments." ON public.comments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can see all comments." ON public.comments;
CREATE POLICY "Admins can see all comments." ON public.comments FOR SELECT USING (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Auth users can post comments on accessible recipes." ON public.comments;
CREATE POLICY "Auth users can post comments on accessible recipes." ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid() AND is_recipe_accessible(recipe_id));
DROP POLICY IF EXISTS "Users can delete their own comments." ON public.comments;
CREATE POLICY "Users can delete their own comments." ON public.comments FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can hide/unhide any comment." ON public.comments;
CREATE POLICY "Admins can hide/unhide any comment." ON public.comments FOR UPDATE USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Recipe Stats
DROP POLICY IF EXISTS "Anyone can read stats for accessible recipes." ON public.recipe_stats;
CREATE POLICY "Anyone can read stats for accessible recipes." ON public.recipe_stats FOR SELECT USING (is_recipe_accessible(recipe_id));

-- Recipe Events
DROP POLICY IF EXISTS "Anyone can read events for accessible recipes." ON public.recipe_events;
CREATE POLICY "Anyone can read events for accessible recipes." ON public.recipe_events FOR SELECT USING (is_recipe_accessible(recipe_id));
