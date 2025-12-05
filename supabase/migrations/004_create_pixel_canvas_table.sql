-- Create public pixel_canvas table
-- This table stores pixel placements for the Pixel Canvas game
-- Real-time enabled for collaborative gameplay

CREATE TABLE IF NOT EXISTS public.pixel_canvas (
  id BIGSERIAL PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  color TEXT NOT NULL,
  user_id UUID,
  user_nickname TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security but allow public read access
ALTER TABLE public.pixel_canvas ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.pixel_canvas
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (users can place pixels)
CREATE POLICY "Allow public insert" ON public.pixel_canvas
  FOR INSERT
  WITH CHECK (true);

-- Create unique constraint on x,y to prevent duplicate pixels
CREATE UNIQUE INDEX IF NOT EXISTS idx_pixel_canvas_position ON public.pixel_canvas(x, y);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_pixel_canvas_created_at ON public.pixel_canvas(created_at DESC);

-- Create index on user_id for user tracking
CREATE INDEX IF NOT EXISTS idx_pixel_canvas_user_id ON public.pixel_canvas(user_id);

-- Enable real-time for this table (if real-time is enabled in Supabase)
-- Note: This may fail if real-time is not enabled in your Supabase project
-- You can enable it manually in Supabase Dashboard > Database > Replication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pixel_canvas;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Real-time publication might not exist, that's okay
    NULL;
END $$;

-- Function to check pixel count and reset if needed
CREATE OR REPLACE FUNCTION check_and_reset_canvas()
RETURNS TRIGGER AS $$
DECLARE
  pixel_count INTEGER;
BEGIN
  -- Count total pixels
  SELECT COUNT(*) INTO pixel_count FROM public.pixel_canvas;
  
  -- If 1000 pixels reached, reset the canvas
  IF pixel_count >= 1000 THEN
    DELETE FROM public.pixel_canvas;
    -- Reset sequence if needed
    PERFORM setval('pixel_canvas_id_seq', 1, false);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check pixel count after each insert
CREATE TRIGGER check_pixel_count_trigger
  AFTER INSERT ON public.pixel_canvas
  FOR EACH ROW
  EXECUTE FUNCTION check_and_reset_canvas();

