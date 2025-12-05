-- Seed data for products table
-- This file contains sample product data for the Cases section
-- Run this after creating the table

-- Clear existing data (optional, comment out if you want to keep existing data)
-- TRUNCATE TABLE public.products RESTART IDENTITY CASCADE;

-- Insert seed data
INSERT INTO public.products (name, description, price, image_url, category, stock, brand) VALUES
-- Electronics
('iPhone 15 Pro', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system', 999.99, NULL, 'Electronics', 45, 'Apple'),
('Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen, 200MP camera, and Snapdragon 8 Gen 3', 1199.99, NULL, 'Electronics', 32, 'Samsung'),
('MacBook Pro 16"', 'Powerful laptop with M3 Pro chip, 18-hour battery life, and Liquid Retina XDR display', 2499.99, NULL, 'Electronics', 18, 'Apple'),
('Sony WH-1000XM5', 'Industry-leading noise canceling headphones with 30-hour battery life', 399.99, NULL, 'Electronics', 67, 'Sony'),
('iPad Air', 'Versatile tablet with M2 chip, 10.9-inch display, and Apple Pencil support', 599.99, NULL, 'Electronics', 54, 'Apple'),
('Dell XPS 13', 'Ultra-thin laptop with Intel Core i7, 13.4-inch display, and premium build quality', 1299.99, NULL, 'Electronics', 23, 'Dell'),

-- Clothing
('Classic White T-Shirt', '100% organic cotton, comfortable fit, perfect for everyday wear', 29.99, NULL, 'Clothing', 120, 'Basic Wear'),
('Denim Jeans', 'Slim fit jeans with stretch, classic blue wash, durable construction', 79.99, NULL, 'Clothing', 89, 'Denim Co'),
('Winter Jacket', 'Waterproof and insulated jacket, perfect for cold weather, multiple pockets', 149.99, NULL, 'Clothing', 45, 'Outdoor Gear'),
('Running Shoes', 'Lightweight running shoes with cushioned sole, breathable mesh upper', 99.99, NULL, 'Clothing', 78, 'SportMax'),
('Wool Sweater', '100% merino wool, soft and warm, perfect for winter', 89.99, NULL, 'Clothing', 56, 'Wool Works'),
('Leather Jacket', 'Genuine leather jacket, classic design, timeless style', 299.99, NULL, 'Clothing', 34, 'Leather Craft'),

-- Books
('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald, set in the Jazz Age', 12.99, NULL, 'Books', 156, 'Classic Publishers'),
('1984', 'Dystopian novel by George Orwell, exploring themes of surveillance and totalitarianism', 14.99, NULL, 'Books', 143, 'Classic Publishers'),
('To Kill a Mockingbird', 'Pulitzer Prize-winning novel by Harper Lee, addressing racial injustice', 13.99, NULL, 'Books', 167, 'Classic Publishers'),
('The Catcher in the Rye', 'Coming-of-age novel by J.D. Salinger, following Holden Caulfield', 11.99, NULL, 'Books', 134, 'Classic Publishers'),
('Pride and Prejudice', 'Romantic novel by Jane Austen, exploring love and social class', 10.99, NULL, 'Books', 178, 'Classic Publishers'),
('Moby Dick', 'Epic tale of Captain Ahab and the white whale, by Herman Melville', 15.99, NULL, 'Books', 98, 'Classic Publishers'),

-- Home & Kitchen
('Coffee Maker', 'Programmable coffee maker with thermal carafe, 12-cup capacity', 89.99, NULL, 'Home & Kitchen', 67, 'BrewMaster'),
('Air Fryer', 'Digital air fryer with 5.5-quart capacity, multiple cooking presets', 129.99, NULL, 'Home & Kitchen', 54, 'Kitchen Pro'),
('Stand Mixer', 'Professional stand mixer with 5-quart bowl, multiple attachments included', 349.99, NULL, 'Home & Kitchen', 28, 'Kitchen Pro'),
('Bed Sheets Set', '100% Egyptian cotton sheets, 4-piece set, available in multiple colors', 79.99, NULL, 'Home & Kitchen', 89, 'Comfort Home'),
('Vacuum Cleaner', 'Cordless stick vacuum with HEPA filter, lightweight and powerful', 199.99, NULL, 'Home & Kitchen', 42, 'CleanTech'),
('Dinnerware Set', 'Porcelain dinnerware set for 8, dishwasher safe, elegant design', 149.99, NULL, 'Home & Kitchen', 35, 'Table Elegance'),

-- Sports & Outdoors
('Yoga Mat', 'Non-slip yoga mat, 6mm thickness, eco-friendly material', 39.99, NULL, 'Sports & Outdoors', 112, 'FitLife'),
('Dumbbell Set', 'Adjustable dumbbell set, 5-50 lbs per dumbbell, space-saving design', 299.99, NULL, 'Sports & Outdoors', 45, 'Strength Pro'),
('Tennis Racket', 'Professional tennis racket, graphite construction, pre-strung', 129.99, NULL, 'Sports & Outdoors', 67, 'Racket Sports'),
('Camping Tent', '4-person camping tent, weather-resistant, easy setup', 199.99, NULL, 'Sports & Outdoors', 38, 'Outdoor Adventure'),
('Bicycle', 'Mountain bike with 21-speed gears, aluminum frame, front suspension', 599.99, NULL, 'Sports & Outdoors', 24, 'Cycle Pro'),
('Fitness Tracker', 'Smart fitness tracker with heart rate monitor, sleep tracking, 7-day battery', 79.99, NULL, 'Sports & Outdoors', 89, 'FitTech')
ON CONFLICT DO NOTHING;

