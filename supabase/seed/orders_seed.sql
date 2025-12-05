-- Seed data for orders table
-- This file contains sample order data for the Cases section
-- Run this after creating the table

-- Clear existing data (optional, comment out if you want to keep existing data)
-- TRUNCATE TABLE public.orders RESTART IDENTITY CASCADE;

-- Insert seed data
INSERT INTO public.orders (user_id, items, total_price, status, shipping_address, payment_method) VALUES
-- Pending orders
(NULL, '[
  {"product_id": 1, "name": "iPhone 15 Pro", "quantity": 1, "price": 999.99},
  {"product_id": 5, "name": "iPad Air", "quantity": 1, "price": 599.99}
]'::jsonb, 1599.98, 'pending', '123 Main Street, New York, NY 10001', 'Credit Card'),

(NULL, '[
  {"product_id": 13, "name": "The Great Gatsby", "quantity": 2, "price": 12.99},
  {"product_id": 14, "name": "1984", "quantity": 1, "price": 14.99}
]'::jsonb, 40.97, 'pending', '456 Oak Avenue, Los Angeles, CA 90001', 'PayPal'),

-- Processing orders
(NULL, '[
  {"product_id": 3, "name": "MacBook Pro 16\"", "quantity": 1, "price": 2499.99}
]'::jsonb, 2499.99, 'processing', '789 Pine Road, Chicago, IL 60601', 'Credit Card'),

(NULL, '[
  {"product_id": 7, "name": "Classic White T-Shirt", "quantity": 3, "price": 29.99},
  {"product_id": 8, "name": "Denim Jeans", "quantity": 1, "price": 79.99}
]'::jsonb, 169.96, 'processing', '321 Elm Street, Houston, TX 77001', 'Debit Card'),

-- Shipped orders
(NULL, '[
  {"product_id": 4, "name": "Sony WH-1000XM5", "quantity": 1, "price": 399.99},
  {"product_id": 6, "name": "Dell XPS 13", "quantity": 1, "price": 1299.99}
]'::jsonb, 1699.98, 'shipped', '654 Maple Drive, Phoenix, AZ 85001', 'Credit Card'),

(NULL, '[
  {"product_id": 19, "name": "Coffee Maker", "quantity": 1, "price": 89.99},
  {"product_id": 20, "name": "Air Fryer", "quantity": 1, "price": 129.99}
]'::jsonb, 219.98, 'shipped', '987 Cedar Lane, Philadelphia, PA 19101', 'PayPal'),

(NULL, '[
  {"product_id": 15, "name": "To Kill a Mockingbird", "quantity": 1, "price": 13.99},
  {"product_id": 16, "name": "The Catcher in the Rye", "quantity": 1, "price": 11.99},
  {"product_id": 17, "name": "Pride and Prejudice", "quantity": 1, "price": 10.99}
]'::jsonb, 36.97, 'shipped', '147 Birch Court, San Antonio, TX 78201', 'Credit Card'),

-- Delivered orders
(NULL, '[
  {"product_id": 9, "name": "Winter Jacket", "quantity": 1, "price": 149.99},
  {"product_id": 10, "name": "Running Shoes", "quantity": 1, "price": 99.99}
]'::jsonb, 249.98, 'delivered', '258 Spruce Way, San Diego, CA 92101', 'Credit Card'),

(NULL, '[
  {"product_id": 11, "name": "Wool Sweater", "quantity": 2, "price": 89.99}
]'::jsonb, 179.98, 'delivered', '369 Willow Street, Dallas, TX 75201', 'PayPal'),

(NULL, '[
  {"product_id": 21, "name": "Stand Mixer", "quantity": 1, "price": 349.99},
  {"product_id": 22, "name": "Bed Sheets Set", "quantity": 1, "price": 79.99}
]'::jsonb, 429.98, 'delivered', '741 Ash Avenue, San Jose, CA 95101', 'Credit Card'),

-- Cancelled orders
(NULL, '[
  {"product_id": 12, "name": "Leather Jacket", "quantity": 1, "price": 299.99}
]'::jsonb, 299.99, 'cancelled', '852 Poplar Road, Austin, TX 78701', 'Credit Card'),

(NULL, '[
  {"product_id": 23, "name": "Vacuum Cleaner", "quantity": 1, "price": 199.99},
  {"product_id": 24, "name": "Dinnerware Set", "quantity": 1, "price": 149.99}
]'::jsonb, 349.98, 'cancelled', '963 Fir Lane, Jacksonville, FL 32201', 'PayPal'),

-- More recent orders
(NULL, '[
  {"product_id": 25, "name": "Yoga Mat", "quantity": 2, "price": 39.99},
  {"product_id": 26, "name": "Dumbbell Set", "quantity": 1, "price": 299.99}
]'::jsonb, 379.97, 'processing', '159 Redwood Drive, Fort Worth, TX 76101', 'Credit Card'),

(NULL, '[
  {"product_id": 27, "name": "Tennis Racket", "quantity": 1, "price": 129.99},
  {"product_id": 30, "name": "Fitness Tracker", "quantity": 1, "price": 79.99}
]'::jsonb, 209.98, 'shipped', '357 Sequoia Court, Columbus, OH 43201', 'Debit Card')
ON CONFLICT DO NOTHING;

