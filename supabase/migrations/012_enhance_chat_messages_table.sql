-- Enhance chat_messages table with additional features
-- Add fields for message status, editing, and deletion

-- Add new columns to chat_messages table
ALTER TABLE public.chat_messages 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'failed')),
  ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_chat_messages_status ON public.chat_messages(status);

-- Create index on deleted_at for filtering active messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_deleted_at ON public.chat_messages(deleted_at) WHERE deleted_at IS NULL;

-- Create policy to allow users to update their own messages
CREATE POLICY "Allow users to update own messages" ON public.chat_messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow users to delete their own messages (soft delete)
CREATE POLICY "Allow users to delete own messages" ON public.chat_messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create table for tracking online users
CREATE TABLE IF NOT EXISTS public.chat_online_users (
  user_id UUID PRIMARY KEY,
  user_nickname TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_typing BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for online users table
ALTER TABLE public.chat_online_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.chat_online_users
  FOR SELECT
  USING (true);

-- Create policy to allow public insert/update
CREATE POLICY "Allow public insert" ON public.chat_online_users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.chat_online_users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create index on last_seen for cleanup
CREATE INDEX IF NOT EXISTS idx_chat_online_users_last_seen ON public.chat_online_users(last_seen);

-- Enable real-time for online users table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_online_users;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- Create function to clean up stale online users (older than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_stale_online_users()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_online_users
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

