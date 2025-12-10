-- Fix get_category_statistics function
-- Resolves "aggregate function calls cannot be nested" error
-- by using CTE to separate aggregation steps

CREATE OR REPLACE FUNCTION get_category_statistics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH category_stats AS (
    SELECT 
      category,
      COUNT(*) as product_count,
      ROUND(AVG(price)::numeric, 2) as average_price,
      MIN(price) as min_price,
      MAX(price) as max_price,
      SUM(stock) as total_stock,
      COUNT(*) FILTER (WHERE stock < 10) as low_stock_count
    FROM public.products
    GROUP BY category
  )
  SELECT json_agg(
    json_build_object(
      'category', category,
      'product_count', product_count,
      'average_price', average_price,
      'min_price', min_price,
      'max_price', max_price,
      'total_stock', total_stock,
      'low_stock_count', low_stock_count
    )
    ORDER BY category
  ) INTO result
  FROM category_stats;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions (in case it wasn't granted before)
GRANT EXECUTE ON FUNCTION get_category_statistics() TO anon, authenticated;

