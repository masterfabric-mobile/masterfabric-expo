-- Create database functions for the Database Functions case
-- These functions demonstrate PostgreSQL function capabilities

-- Function 1: Get product statistics
-- Returns aggregate statistics about products
CREATE OR REPLACE FUNCTION get_product_statistics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_products', COUNT(*),
    'average_price', ROUND(AVG(price)::numeric, 2),
    'min_price', MIN(price),
    'max_price', MAX(price),
    'total_stock', SUM(stock),
    'low_stock_count', COUNT(*) FILTER (WHERE stock < 10),
    'categories_count', COUNT(DISTINCT category)
  ) INTO result
  FROM public.products;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Get user order summary
-- Returns order statistics for a specific user
CREATE OR REPLACE FUNCTION get_user_order_summary(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', p_user_id,
    'total_orders', COUNT(*),
    'total_spent', COALESCE(SUM(total_price), 0),
    'average_order_value', COALESCE(ROUND(AVG(total_price)::numeric, 2), 0),
    'pending_orders', COUNT(*) FILTER (WHERE status = 'pending'),
    'completed_orders', COUNT(*) FILTER (WHERE status = 'delivered'),
    'last_order_date', MAX(created_at)
  ) INTO result
  FROM public.orders
  WHERE user_id = p_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Calculate order total from items array
-- Takes a JSONB array of items and calculates the total
CREATE OR REPLACE FUNCTION calculate_order_total(order_items JSONB)
RETURNS NUMERIC AS $$
DECLARE
  item JSONB;
  total NUMERIC := 0;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(order_items)
  LOOP
    total := total + ((item->>'quantity')::NUMERIC * (item->>'price')::NUMERIC);
  END LOOP;
  
  RETURN ROUND(total, 2);
END;
$$ LANGUAGE plpgsql;

-- Function 4: Search products
-- Filters products by category, brand, or price range
CREATE OR REPLACE FUNCTION search_products(
  p_category TEXT DEFAULT NULL,
  p_brand TEXT DEFAULT NULL,
  p_min_price NUMERIC DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', id,
      'name', name,
      'description', description,
      'price', price,
      'image_url', image_url,
      'category', category,
      'stock', stock,
      'brand', brand,
      'created_at', created_at
    )
    ORDER BY name
  ) INTO result
  FROM public.products
  WHERE (p_category IS NULL OR category ILIKE '%' || p_category || '%')
    AND (p_brand IS NULL OR brand ILIKE '%' || p_brand || '%')
    AND (p_min_price IS NULL OR price >= p_min_price)
    AND (p_max_price IS NULL OR price <= p_max_price);
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql;

-- Function 5: Get order statistics
-- Returns aggregate statistics about all orders
CREATE OR REPLACE FUNCTION get_order_statistics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_orders', COUNT(*),
    'total_revenue', COALESCE(SUM(total_price), 0),
    'average_order_value', COALESCE(ROUND(AVG(total_price)::numeric, 2), 0),
    'min_order_value', COALESCE(MIN(total_price), 0),
    'max_order_value', COALESCE(MAX(total_price), 0),
    'pending_orders', COUNT(*) FILTER (WHERE status = 'pending'),
    'delivered_orders', COUNT(*) FILTER (WHERE status = 'delivered'),
    'cancelled_orders', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'total_unique_users', COUNT(DISTINCT user_id)
  ) INTO result
  FROM public.orders;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function 6: Get category statistics
-- Returns product statistics grouped by category
CREATE OR REPLACE FUNCTION get_category_statistics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'category', category,
      'product_count', COUNT(*),
      'average_price', ROUND(AVG(price)::numeric, 2),
      'min_price', MIN(price),
      'max_price', MAX(price),
      'total_stock', SUM(stock),
      'low_stock_count', COUNT(*) FILTER (WHERE stock < 10)
    )
    ORDER BY category
  ) INTO result
  FROM public.products
  GROUP BY category;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_product_statistics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_order_summary(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_order_total(JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_products(TEXT, TEXT, NUMERIC, NUMERIC) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_order_statistics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_category_statistics() TO anon, authenticated;

