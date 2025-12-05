-- Create public orders table
-- This table stores order information for the Cases section
-- Public access enabled (no authentication required)

CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  items JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security but allow public read access
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no authentication required)
CREATE POLICY "Allow public read access" ON public.orders
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (optional, if you want public writes)
CREATE POLICY "Allow public insert" ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update (optional, if you want public updates)
CREATE POLICY "Allow public update" ON public.orders
  FOR UPDATE
  USING (true);

-- Create policy to allow public delete (optional, if you want public deletes)
CREATE POLICY "Allow public delete" ON public.orders
  FOR DELETE
  USING (true);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Create index on items JSONB for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_items ON public.orders USING GIN (items);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

