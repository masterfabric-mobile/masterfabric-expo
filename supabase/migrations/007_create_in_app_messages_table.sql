-- Create in-app messages table
-- This table stores in-app messages that can be displayed to users
-- Real-time enabled for live message delivery

CREATE TABLE IF NOT EXISTS public.in_app_messages (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  button_text TEXT,
  button_action TEXT,
  button_action_type TEXT DEFAULT 'dismiss' CHECK (button_action_type IN ('url', 'deep_link', 'dismiss')),
  position TEXT DEFAULT 'top' CHECK (position IN ('top', 'bottom', 'center')),
  style TEXT DEFAULT 'modal' CHECK (style IN ('modal', 'banner', 'card')),
  background_color TEXT,
  text_color TEXT,
  button_background_color TEXT,
  button_text_color TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 0,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'authenticated', 'unauthenticated')),
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.in_app_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to in_app_messages" ON public.in_app_messages
  FOR SELECT
  USING (true);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_in_app_messages_is_active ON public.in_app_messages(is_active);
CREATE INDEX IF NOT EXISTS idx_in_app_messages_start_date ON public.in_app_messages(start_date);
CREATE INDEX IF NOT EXISTS idx_in_app_messages_end_date ON public.in_app_messages(end_date);
CREATE INDEX IF NOT EXISTS idx_in_app_messages_priority ON public.in_app_messages(priority DESC);
CREATE INDEX IF NOT EXISTS idx_in_app_messages_target_audience ON public.in_app_messages(target_audience);
CREATE INDEX IF NOT EXISTS idx_in_app_messages_language ON public.in_app_messages(language);
CREATE INDEX IF NOT EXISTS idx_in_app_messages_active_dates ON public.in_app_messages(is_active, start_date, end_date) WHERE is_active = true;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_in_app_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on row update
CREATE TRIGGER update_in_app_messages_timestamp
  BEFORE UPDATE ON public.in_app_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_in_app_messages_updated_at();

-- Enable real-time for this table (if real-time is enabled in Supabase)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.in_app_messages;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Real-time publication might not exist, that's okay
    NULL;
END $$;

