-- Favoriler tablosu: kullanıcının favori tarifleri (kalp ikonu).
-- Uygulama: favorites-service.ts user_id + recipe_id ile insert/delete/select kullanır.

CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS favorites_recipe_id_idx ON public.favorites (recipe_id);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi favori kayıtlarını görebilir
DROP POLICY IF EXISTS "Users can view own favorites." ON public.favorites;
CREATE POLICY "Users can view own favorites." ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcı sadece kendi adına favori ekleyebilir
DROP POLICY IF EXISTS "Users can insert own favorites." ON public.favorites;
CREATE POLICY "Users can insert own favorites." ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcı sadece kendi favorilerini silebilir
DROP POLICY IF EXISTS "Users can delete own favorites." ON public.favorites;
CREATE POLICY "Users can delete own favorites." ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);
