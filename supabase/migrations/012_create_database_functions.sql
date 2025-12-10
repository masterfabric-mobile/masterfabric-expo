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

-- Grant execute permissions to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_product_statistics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_order_summary(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_order_total(JSONB) TO anon, authenticated;

