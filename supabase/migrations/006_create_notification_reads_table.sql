-- Create notification_reads table
-- This table tracks which users have read which notifications
-- Each user can independently mark notifications as read

CREATE TABLE IF NOT EXISTS public.notification_reads (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id BIGINT NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, notification_id)
);

-- Enable Row Level Security
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own read status
CREATE POLICY "Users can view their own notification reads" ON public.notification_reads
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own read status
CREATE POLICY "Users can mark notifications as read" ON public.notification_reads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own read status
CREATE POLICY "Users can update their own notification reads" ON public.notification_reads
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON public.notification_reads(user_id);

-- Create index on notification_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_notification_reads_notification_id ON public.notification_reads(notification_id);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_notification_reads_user_notification ON public.notification_reads(user_id, notification_id);

