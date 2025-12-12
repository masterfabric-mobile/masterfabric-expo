-- Create public products table
-- This table stores product information for the Cases section
-- Public access enabled (no authentication required)

CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  brand TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security but allow public read access
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (no authentication required)
CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT
  USING (true);

-- Create policy to allow public insert (optional, if you want public writes)
CREATE POLICY "Allow public insert" ON public.products
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update (optional, if you want public updates)
CREATE POLICY "Allow public update" ON public.products
  FOR UPDATE
  USING (true);

-- Create policy to allow public delete (optional, if you want public deletes)
CREATE POLICY "Allow public delete" ON public.products
  FOR DELETE
  USING (true);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Create index on brand for faster queries
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);

-- Create index on price for sorting
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_timestamp
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

