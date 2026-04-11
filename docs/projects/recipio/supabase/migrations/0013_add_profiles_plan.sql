-- User plan / upgrade (Pro Chef, Kitchen Chef, Kitchen Pro, etc.)
-- plan_slug is stored on profiles; current plan is read from here.

-- Plan values: 'free' | 'pro_chef' | 'kitchen_chef' | 'kitchen_pro'
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan_slug TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.plan_slug IS 'User subscription plan: free, pro_chef, kitchen_chef, kitchen_pro';
COMMENT ON COLUMN public.profiles.plan_expires_at IS 'When the current plan expires (NULL = no expiry or free).';

CREATE INDEX IF NOT EXISTS profiles_plan_slug_idx ON public.profiles (plan_slug);
