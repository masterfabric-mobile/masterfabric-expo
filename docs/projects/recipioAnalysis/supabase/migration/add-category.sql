-- Add image_url column to categories table
-- Migration: 0003_add_category_image

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.categories.image_url IS 'URL for category image/icon';

-- Update existing categories with image URLs
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop&crop=center' WHERE id = 1;
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&crop=center' WHERE id = 2;
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&crop=center' WHERE id = 3;
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&crop=center' WHERE id = 4;
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=400&fit=crop&crop=center' WHERE id = 5;
UPDATE public.categories SET image_url = 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=400&fit=crop&crop=center' WHERE id = 6;