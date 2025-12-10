-- Add support for second button in in-app messages
-- This allows for card-style messages with up to 2 action buttons

ALTER TABLE public.in_app_messages
  ADD COLUMN IF NOT EXISTS button2_text TEXT,
  ADD COLUMN IF NOT EXISTS button2_action TEXT,
  ADD COLUMN IF NOT EXISTS button2_action_type TEXT DEFAULT 'dismiss' CHECK (button2_action_type IN ('url', 'deep_link', 'dismiss')),
  ADD COLUMN IF NOT EXISTS button2_background_color TEXT,
  ADD COLUMN IF NOT EXISTS button2_text_color TEXT;

