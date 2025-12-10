-- Create in-app message dismissals table
-- This table tracks which messages have been dismissed by users

CREATE TABLE IF NOT EXISTS public.in_app_message_dismissals (
  id BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES public.in_app_messages(id) ON DELETE CASCADE,
  user_id UUID,
  device_id TEXT,
  dismissed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_user_or_device CHECK (
    (user_id IS NOT NULL) OR (device_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.in_app_message_dismissals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert access (for tracking dismissals)
CREATE POLICY "Allow public insert access to dismissals" ON public.in_app_message_dismissals
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public select access (for checking dismissals)
CREATE POLICY "Allow public select access to dismissals" ON public.in_app_message_dismissals
  FOR SELECT
  USING (true);

-- Create unique constraint for user-based dismissals
CREATE UNIQUE INDEX IF NOT EXISTS idx_in_app_message_dismissals_user 
  ON public.in_app_message_dismissals(message_id, user_id) 
  WHERE user_id IS NOT NULL;

-- Create unique constraint for device-based dismissals
CREATE UNIQUE INDEX IF NOT EXISTS idx_in_app_message_dismissals_device 
  ON public.in_app_message_dismissals(message_id, device_id) 
  WHERE device_id IS NOT NULL;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_in_app_message_dismissals_message_id ON public.in_app_message_dismissals(message_id);
CREATE INDEX IF NOT EXISTS idx_in_app_message_dismissals_user_id ON public.in_app_message_dismissals(user_id);
CREATE INDEX IF NOT EXISTS idx_in_app_message_dismissals_device_id ON public.in_app_message_dismissals(device_id);

