-- Create public chat_messages table
-- This table stores chat messages for the Realtime Chat case
-- Real-time enabled for instant message updates

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  user_nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security but allow public read access
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.chat_messages
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (users can send messages)
CREATE POLICY "Allow public insert" ON public.chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Create index on created_at for sorting messages chronologically
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Create index on user_id for user tracking
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);

-- Enable real-time for this table (if real-time is enabled in Supabase)
-- Note: This may fail if real-time is not enabled in your Supabase project
-- You can enable it manually in Supabase Dashboard > Database > Replication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Real-time publication might not exist, that's okay
    NULL;
END $$;

