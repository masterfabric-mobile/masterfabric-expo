-- Recipio Seed Data
-- /supabase/seed/seed.sql

-- Reset sequences for clean seeding
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE ingredients_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_variants_id_seq RESTART WITH 1;
ALTER SEQUENCE units_id_seq RESTART WITH 1;

-- 1. Units
INSERT INTO public.units (code) VALUES
('g'), ('kg'), ('ml'), ('l'), ('pcs'), ('tbsp'), ('tsp'), ('cup'), ('pinch')
ON CONFLICT (code) DO NOTHING;

-- 2. Categories
INSERT INTO public.categories (id, slug) VALUES
(1, 'soups'),
(2, 'salads'),
(3, 'main-courses'),
(4, 'desserts'),
(5, 'breakfast'),
(6, 'appetizers')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.category_translations (category_id, locale, name, description) VALUES
(1, 'en', 'Soups', 'Warm and comforting soups.'),
(1, 'tr', 'Çorbalar', 'Sıcak ve rahatlatıcı çorbalar.'),
(2, 'en', 'Salads', 'Fresh and healthy salads.'),
(2, 'tr', 'Salatalar', 'Taze ve sağlıklı salatalar.'),
(3, 'en', 'Main Courses', 'Hearty and satisfying main dishes.'),
(3, 'tr', 'Ana Yemekler', 'Doyurucu ve tatmin edici ana yemekler.'),
(4, 'en', 'Desserts', 'Sweet treats to finish your meal.'),
(4, 'tr', 'Tatlılar', 'Yemeğinizi tatlı bir sonla bitirin.'),
(5, 'en', 'Breakfast', 'Delicious ways to start your day.'),
(5, 'tr', 'Kahvaltı', 'Güne başlamanın lezzetli yolları.'),
(6, 'en', 'Appetizers', 'Small bites to whet your appetite.'),
(6, 'tr', 'Başlangıçlar', 'İştahınızı açacak küçük atıştırmalıklar.')
ON CONFLICT (category_id, locale) DO NOTHING;

-- 3. Ingredients
INSERT INTO public.ingredients (id, slug, image_url) VALUES
(1, 'tomato', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bright_red_tomato_and_cross_section02.jpg/800px-Bright_red_tomato_and_cross_section02.jpg'),
(2, 'onion', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Onion_on_White.JPG/800px-Onion_on_White.JPG'),
(3, 'garlic', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Garlic.jpg/800px-Garlic.jpg'),
(4, 'lentil', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Red_lentils.jpg/800px-Red_lentils.jpg'),
(5, 'chicken-breast', NULL),
(6, 'lettuce', NULL),
(7, 'cucumber', NULL),
(8, 'olive-oil', NULL),
(9, 'flour', NULL),
(10, 'sugar', NULL),
(11, 'egg', NULL),
(12, 'milk', NULL),
(13, 'butter', NULL),
(14, 'salt', NULL),
(15, 'black-pepper', NULL),
(16, 'mint', NULL),
(17, 'bulgur', NULL),
(18, 'parsley', NULL),
(19, 'lemon', NULL),
(20, 'chocolate', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chocolate_%28blue_background%29.jpg/1024px-Chocolate_%28blue_background%29.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ingredient_translations (ingredient_id, locale, name) VALUES
(1, 'en', 'Tomato'), (1, 'tr', 'Domates'),
(2, 'en', 'Onion'), (2, 'tr', 'Soğan'),
(3, 'en', 'Garlic'), (3, 'tr', 'Sarımsak'),
(4, 'en', 'Red Lentil'), (4, 'tr', 'Kırmızı Mercimek'),
(5, 'en', 'Chicken Breast'), (5, 'tr', 'Tavuk Göğsü'),
(6, 'en', 'Lettuce'), (6, 'tr', 'Marul'),
(7, 'en', 'Cucumber'), (7, 'tr', 'Salatalık'),
(8, 'en', 'Olive Oil'), (8, 'tr', 'Zeytinyağı'),
(9, 'en', 'Flour'), (9, 'tr', 'Un'),
(10, 'en', 'Sugar'), (10, 'tr', 'Şeker'),
(11, 'en', 'Egg'), (11, 'tr', 'Yumurta'),
(12, 'en', 'Milk'), (12, 'tr', 'Süt'),
(13, 'en', 'Butter'), (13, 'tr', 'Tereyağı'),
(14, 'en', 'Salt'), (14, 'tr', 'Tuz'),
(15, 'en', 'Black Pepper'), (15, 'tr', 'Karabiber'),
(16, 'en', 'Dried Mint'), (16, 'tr', 'Nane'),
(17, 'en', 'Fine Bulgur'), (17, 'tr', 'İnce Bulgur'),
(18, 'en', 'Parsley'), (18, 'tr', 'Maydanoz'),
(19, 'en', 'Lemon'), (19, 'tr', 'Limon'),
(20, 'en', 'Dark Chocolate'), (20, 'tr', 'Bitter Çikolata')
ON CONFLICT (ingredient_id, locale) DO NOTHING;


-- 4. Recipes
-- Recipe 1: Lentil Soup (Published, Free)
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(1, NULL, 'published', true, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Lentil_soup_%28mercimek_%C3%A7orbas%C4%B1%29.jpg/1024px-Lentil_soup_%28mercimek_%C3%A7orbas%C4%B1%29.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (1, 1)
ON CONFLICT (recipe_id, category_id) DO NOTHING;

INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(1, 'en', 'Classic Lentil Soup', 'A timeless, hearty red lentil soup, perfect for any season.', 'Serve with a squeeze of lemon and a sprinkle of dried mint.', NULL, NULL),
(1, 'tr', 'Klasik Mercimek Çorbası', 'Her mevsime uygun, doyurucu ve klasik bir kırmızı mercimek çorbası.', 'Limon sıkarak ve nane serperek servis edin.', NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;

INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(1, 'en', 1, 'Sauté one chopped onion in olive oil until translucent.'),
(1, 'en', 2, 'Add washed red lentils, water, and salt. Bring to a boil.'),
(1, 'en', 3, 'Simmer for 20-25 minutes until lentils are soft.'),
(1, 'en', 4, 'Blend the soup until smooth. Melt butter in a separate pan, add dried mint, and pour over the soup.'),
(1, 'tr', 1, 'Doğranmış bir soğanı zeytinyağında pembeleşinceye kadar kavurun.'),
(1, 'tr', 2, 'Yıkanmış kırmızı mercimek, su ve tuzu ekleyip kaynamaya bırakın.'),
(1, 'tr', 3, 'Mercimekler yumuşayana kadar 20-25 dakika pişirin.'),
(1, 'tr', 4, 'Çorbayı pürüzsüz olana kadar blenderdan geçirin. Ayrı bir tavada tereyağını eritip naneyi ekleyin ve çorbanın üzerine gezdirin.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

-- Variants for Recipe 1: 1, 2, 3, 4 servings
INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(1, 1, 1), (2, 1, 2), (3, 1, 3), (4, 1, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for 1 serving
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(1, 4, 75, (SELECT id from public.units where code = 'g')),
(1, 2, 0.25, (SELECT id from public.units where code = 'pcs')),
(1, 8, 1, (SELECT id from public.units where code = 'tbsp')),
(1, 13, 0.5, (SELECT id from public.units where code = 'tbsp')),
(1, 16, 0.5, (SELECT id from public.units where code = 'tsp')),
(1, 14, 0.5, (SELECT id from public.units where code = 'pinch'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;
-- Ingredients for 2 servings
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(2, 4, 150, (SELECT id from public.units where code = 'g')),
(2, 2, 0.5, (SELECT id from public.units where code = 'pcs')),
(2, 8, 2, (SELECT id from public.units where code = 'tbsp')),
(2, 13, 1, (SELECT id from public.units where code = 'tbsp')),
(2, 16, 1, (SELECT id from public.units where code = 'tsp')),
(2, 14, 1, (SELECT id from public.units where code = 'pinch'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;
-- Ingredients for 3 servings
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(3, 4, 225, (SELECT id from public.units where code = 'g')),
(3, 2, 0.75, (SELECT id from public.units where code = 'pcs')),
(3, 8, 3, (SELECT id from public.units where code = 'tbsp')),
(3, 13, 1.5, (SELECT id from public.units where code = 'tbsp')),
(3, 16, 1.5, (SELECT id from public.units where code = 'tsp')),
(3, 14, 1, (SELECT id from public.units where code = 'pinch'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;
-- Ingredients for 4 servings
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(4, 4, 300, (SELECT id from public.units where code = 'g')),
(4, 2, 1, (SELECT id from public.units where code = 'pcs')),
(4, 8, 4, (SELECT id from public.units where code = 'tbsp')),
(4, 13, 2, (SELECT id from public.units where code = 'tbsp')),
(4, 16, 2, (SELECT id from public.units where code = 'tsp')),
(4, 14, 1, (SELECT id from public.units where code = 'tsp'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;


-- Recipe 2: Chocolate Brownie (Published, Free)
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(2, NULL, 'published', true, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fudge_Brownie.jpg/1024px-Fudge_Brownie.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (2, 4)
ON CONFLICT (recipe_id, category_id) DO NOTHING;

INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(2, 'en', 'Fudgy Chocolate Brownies', 'Rich, dense, and incredibly fudgy chocolate brownies.', 'Do not overbake! A slightly underbaked center makes for the best texture.', NULL, NULL),
(2, 'tr', 'Islak Çikolatalı Brownie', 'Yoğun, nemli ve inanılmaz lezzetli çikolatalı brownie.', 'Fazla pişirmemeye dikkat edin! Ortasının hafif nemli kalması en iyi dokuyu sağlar.', NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;

INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(2, 'en', 1, 'Preheat oven to 175°C (350°F). Melt butter and dark chocolate together.'),
(2, 'en', 2, 'In a separate bowl, whisk eggs and sugar until pale and fluffy.'),
(2, 'en', 3, 'Pour the cooled chocolate mixture into the egg mixture and combine.'),
(2, 'en', 4, 'Gently fold in the flour and a pinch of salt. Do not overmix.'),
(2, 'en', 5, 'Pour batter into a greased baking pan and bake for 25-30 minutes.'),
(2, 'tr', 1, 'Fırını 175°C''ye ısıtın. Tereyağı ve bitter çikolatayı birlikte eritin.'),
(2, 'tr', 2, 'Ayrı bir kapta yumurta ve şekeri rengi açılıp köpürene kadar çırpın.'),
(2, 'tr', 3, 'Soğuyan çikolatalı karışımı yumurtalı karışıma döküp birleştirin.'),
(2, 'tr', 4, 'Unu ve bir tutam tuzu yavaşça karışıma ekleyin. Fazla karıştırmayın.'),
(2, 'tr', 5, 'Karışımı yağlanmış fırın kabına dökün ve 25-30 dakika pişirin.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

-- Variants for Recipe 2: 1, 2, 3, 4 servings
INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(5, 2, 1), (6, 2, 2), (7, 2, 3), (8, 2, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for 1 serving
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(5, 20, 25, (SELECT id from public.units where code = 'g')),
(5, 13, 21, (SELECT id from public.units where code = 'g')),
(5, 10, 38, (SELECT id from public.units where code = 'g')),
(5, 11, 0.5, (SELECT id from public.units where code = 'pcs')),
(5, 9, 15, (SELECT id from public.units where code = 'g')),
(5, 14, 0.25, (SELECT id from public.units where code = 'pinch'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;
-- Ingredients for 2 servings
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(6, 20, 50, (SELECT id from public.units where code = 'g')),
(6, 13, 43, (SELECT id from public.units where code = 'g')),
(6, 10, 75, (SELECT id from public.units where code = 'g')),
(6, 11, 1, (SELECT id from public.units where code = 'pcs')),
(6, 9, 30, (SELECT id from public.units where code = 'g')),
(6, 14, 0.5, (SELECT id from public.units where code = 'pinch'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;
-- Ingredients for 3 servings
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(7, 20, 75, (SELECT id from public.units where code = 'g')),
(7, 13, 64, (SELECT id from public.units where code = 'g')),
(7, 10, 113, (SELECT id from public.units where code = 'g')),
(7, 11, 1.5, (SELECT id from public.units where code = 'pcs')),
(7, 9, 45, (SELECT id from public.units where code = 'g')),
(7, 14, 0.75, (SELECT id from public.units where code = 'pinch'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;
-- Ingredients for 4 servings
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(8, 20, 100, (SELECT id from public.units where code = 'g')),
(8, 13, 85, (SELECT id from public.units where code = 'g')),
(8, 10, 150, (SELECT id from public.units where code = 'g')),
(8, 11, 2, (SELECT id from public.units where code = 'pcs')),
(8, 9, 60, (SELECT id from public.units where code = 'g')),
(8, 14, 1, (SELECT id from public.units where code = 'pinch'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Add 8 more recipes to reach the >= 10 goal.
-- Recipe 3: Simple Green Salad
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(3, NULL, 'published', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (3, 2)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(3, 'en', 'Simple Green Salad', 'A quick and easy green salad.', NULL, NULL, NULL),
(3, 'tr', 'Basit Yeşil Salata', 'Hızlı ve kolay bir yeşil salata.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(3, 'en', 1, 'Wash and dry lettuce leaves.'),
(3, 'en', 2, 'Chop lettuce into bite-sized pieces.'),
(3, 'en', 3, 'Add your favorite dressing and toss gently.'),
(3, 'tr', 1, 'Marul yapraklarını yıkayıp kurulayın.'),
(3, 'tr', 2, 'Marulu lokma büyüklüğünde doğrayın.'),
(3, 'tr', 3, 'Favori sosunuzu ekleyip nazikçe karıştırın.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(9, 3, 1), (10, 3, 2), (11, 3, 3), (12, 3, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 3 (all servings)
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(9, 6, 50, (SELECT id from public.units where code = 'g')),
(10, 6, 100, (SELECT id from public.units where code = 'g')),
(11, 6, 150, (SELECT id from public.units where code = 'g')),
(12, 6, 200, (SELECT id from public.units where code = 'g'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Recipe 4: Grilled Chicken
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(4, NULL, 'published', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (4, 3)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(4, 'en', 'Grilled Chicken', 'Juicy grilled chicken breast.', NULL, NULL, NULL),
(4, 'tr', 'Izgara Tavuk', 'Sulu ızgara tavuk göğsü.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(4, 'en', 1, 'Season chicken breast with salt and pepper.'),
(4, 'en', 2, 'Grill for 6-8 minutes per side until cooked through.'),
(4, 'en', 3, 'Let rest for 5 minutes before slicing.'),
(4, 'tr', 1, 'Tavuk göğsünü tuz ve karabiberle baharatlayın.'),
(4, 'tr', 2, 'Her tarafını 6-8 dakika pişene kadar ızgara yapın.'),
(4, 'tr', 3, 'Dilimlemeden önce 5 dakika dinlendirin.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(13, 4, 1), (14, 4, 2), (15, 4, 3), (16, 4, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 4 (all servings)
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(13, 5, 150, (SELECT id from public.units where code = 'g')),
(13, 14, 0.5, (SELECT id from public.units where code = 'tsp')),
(13, 15, 0.25, (SELECT id from public.units where code = 'tsp')),
(14, 5, 300, (SELECT id from public.units where code = 'g')),
(14, 14, 1, (SELECT id from public.units where code = 'tsp')),
(14, 15, 0.5, (SELECT id from public.units where code = 'tsp')),
(15, 5, 450, (SELECT id from public.units where code = 'g')),
(15, 14, 1.5, (SELECT id from public.units where code = 'tsp')),
(15, 15, 0.75, (SELECT id from public.units where code = 'tsp')),
(16, 5, 600, (SELECT id from public.units where code = 'g')),
(16, 14, 2, (SELECT id from public.units where code = 'tsp')),
(16, 15, 1, (SELECT id from public.units where code = 'tsp'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Recipe 5: Premium Steak (Not free)
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(5, NULL, 'published', false, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (5, 3)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(5, 'en', 'Premium Steak', 'A members-only steak recipe.', NULL, NULL, NULL),
(5, 'tr', 'Özel Biftek', 'Sadece üyelere özel biftek tarifi.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(5, 'en', 1, 'Season steak generously with salt and pepper.'),
(5, 'en', 2, 'Cook on high heat for 3-4 minutes per side.'),
(5, 'en', 3, 'Rest for 10 minutes before serving.'),
(5, 'tr', 1, 'Bifteği bolca tuz ve karabiberle baharatlayın.'),
(5, 'tr', 2, 'Yüksek ateşte her tarafını 3-4 dakika pişirin.'),
(5, 'tr', 3, 'Servis etmeden önce 10 dakika dinlendirin.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(17, 5, 1), (18, 5, 2), (19, 5, 3), (20, 5, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 5 (all servings) - placeholder amounts
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(17, 14, 1, (SELECT id from public.units where code = 'tsp')),
(17, 15, 0.5, (SELECT id from public.units where code = 'tsp')),
(18, 14, 2, (SELECT id from public.units where code = 'tsp')),
(18, 15, 1, (SELECT id from public.units where code = 'tsp')),
(19, 14, 3, (SELECT id from public.units where code = 'tsp')),
(19, 15, 1.5, (SELECT id from public.units where code = 'tsp')),
(20, 14, 4, (SELECT id from public.units where code = 'tsp')),
(20, 15, 2, (SELECT id from public.units where code = 'tsp'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Recipe 6: Scrambled Eggs (Pending)
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(6, NULL, 'pending', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (6, 5)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(6, 'en', 'Scrambled Eggs', 'User submitted scrambled eggs.', NULL, NULL, NULL),
(6, 'tr', 'Çırpılmış Yumurta', 'Kullanıcı gönderimi çırpılmış yumurta.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(6, 'en', 1, 'Crack eggs into a bowl.'),
(6, 'en', 2, 'Scramble with a fork until well mixed.'),
(6, 'en', 3, 'Cook in a pan over medium heat, stirring constantly.'),
(6, 'tr', 1, 'Yumurtaları bir kaseye kırın.'),
(6, 'tr', 2, 'Çatalla iyice karışana kadar çırpın.'),
(6, 'tr', 3, 'Orta ateşte tavada sürekli karıştırarak pişirin.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(21, 6, 1), (22, 6, 2), (23, 6, 3), (24, 6, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 6 (all servings)
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(21, 11, 2, (SELECT id from public.units where code = 'pcs')),
(21, 14, 0.25, (SELECT id from public.units where code = 'tsp')),
(21, 13, 5, (SELECT id from public.units where code = 'g')),
(22, 11, 4, (SELECT id from public.units where code = 'pcs')),
(22, 14, 0.5, (SELECT id from public.units where code = 'tsp')),
(22, 13, 10, (SELECT id from public.units where code = 'g')),
(23, 11, 6, (SELECT id from public.units where code = 'pcs')),
(23, 14, 0.75, (SELECT id from public.units where code = 'tsp')),
(23, 13, 15, (SELECT id from public.units where code = 'g')),
(24, 11, 8, (SELECT id from public.units where code = 'pcs')),
(24, 14, 1, (SELECT id from public.units where code = 'tsp')),
(24, 13, 20, (SELECT id from public.units where code = 'g'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Recipe 7: Bruschetta
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(7, NULL, 'published', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (7, 6)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(7, 'en', 'Bruschetta', 'Classic tomato and basil bruschetta.', NULL, NULL, NULL),
(7, 'tr', 'Bruschetta', 'Klasik domates ve fesleğenli bruschetta.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(7, 'en', 1, 'Toast bread slices until golden.'),
(7, 'en', 2, 'Rub with garlic and drizzle with olive oil.'),
(7, 'en', 3, 'Top with diced tomatoes and fresh basil.'),
(7, 'tr', 1, 'Ekmek dilimlerini altın rengi alana kadar kızartın.'),
(7, 'tr', 2, 'Sarımsakla ovun ve zeytinyağı gezdirin.'),
(7, 'tr', 3, 'Üzerine doğranmış domates ve taze fesleğen ekleyin.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(25, 7, 1), (26, 7, 2), (27, 7, 3), (28, 7, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 7 (all servings)
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(25, 1, 1, (SELECT id from public.units where code = 'pcs')),
(25, 3, 0.5, (SELECT id from public.units where code = 'pcs')),
(25, 8, 1, (SELECT id from public.units where code = 'tbsp')),
(26, 1, 2, (SELECT id from public.units where code = 'pcs')),
(26, 3, 1, (SELECT id from public.units where code = 'pcs')),
(26, 8, 2, (SELECT id from public.units where code = 'tbsp')),
(27, 1, 3, (SELECT id from public.units where code = 'pcs')),
(27, 3, 1.5, (SELECT id from public.units where code = 'pcs')),
(27, 8, 3, (SELECT id from public.units where code = 'tbsp')),
(28, 1, 4, (SELECT id from public.units where code = 'pcs')),
(28, 3, 2, (SELECT id from public.units where code = 'pcs')),
(28, 8, 4, (SELECT id from public.units where code = 'tbsp'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Recipe 8: Tomato Soup
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(8, NULL, 'published', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (8, 1)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(8, 'en', 'Tomato Soup', 'Creamy tomato soup.', NULL, NULL, NULL),
(8, 'tr', 'Domates Çorbası', 'Kremalı domates çorbası.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(8, 'en', 1, 'Sauté onions until soft.'),
(8, 'en', 2, 'Add tomatoes and cook until they break down.'),
(8, 'en', 3, 'Add broth and simmer for 20 minutes.'),
(8, 'en', 4, 'Blend until smooth and add cream if desired.'),
(8, 'tr', 1, 'Soğanları yumuşayana kadar kavurun.'),
(8, 'tr', 2, 'Domatesleri ekleyip parçalanana kadar pişirin.'),
(8, 'tr', 3, 'Et suyunu ekleyip 20 dakika pişirin.'),
(8, 'tr', 4, 'Pürüzsüz olana kadar blenderdan geçirin ve isterseniz krema ekleyin.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(29, 8, 1), (30, 8, 2), (31, 8, 3), (32, 8, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 8 (all servings)
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(29, 1, 2, (SELECT id from public.units where code = 'pcs')),
(29, 2, 0.5, (SELECT id from public.units where code = 'pcs')),
(29, 14, 0.5, (SELECT id from public.units where code = 'tsp')),
(30, 1, 4, (SELECT id from public.units where code = 'pcs')),
(30, 2, 1, (SELECT id from public.units where code = 'pcs')),
(30, 14, 1, (SELECT id from public.units where code = 'tsp')),
(31, 1, 6, (SELECT id from public.units where code = 'pcs')),
(31, 2, 1.5, (SELECT id from public.units where code = 'pcs')),
(31, 14, 1.5, (SELECT id from public.units where code = 'tsp')),
(32, 1, 8, (SELECT id from public.units where code = 'pcs')),
(32, 2, 2, (SELECT id from public.units where code = 'pcs')),
(32, 14, 2, (SELECT id from public.units where code = 'tsp'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Recipe 9: Vanilla Ice Cream
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(9, NULL, 'published', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (9, 4)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(9, 'en', 'Vanilla Ice Cream', 'Homemade vanilla ice cream.', NULL, NULL, NULL),
(9, 'tr', 'Vanilyalı Dondurma', 'Ev yapımı vanilyalı dondurma.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(9, 'en', 1, 'Heat milk and cream in a saucepan.'),
(9, 'en', 2, 'Whisk egg yolks with sugar until pale.'),
(9, 'en', 3, 'Temper eggs with hot milk mixture.'),
(9, 'en', 4, 'Cook until thickened, then chill and churn.'),
(9, 'tr', 1, 'Tencereye süt ve kremayı ısıtın.'),
(9, 'tr', 2, 'Yumurta sarılarını şekerle açık renge kadar çırpın.'),
(9, 'tr', 3, 'Yumurtaları sıcak süt karışımıyla ısıtın.'),
(9, 'tr', 4, 'Koyulaşana kadar pişirin, sonra soğutup çırpın.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(33, 9, 1), (34, 9, 2), (35, 9, 3), (36, 9, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 9 (all servings)
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(33, 12, 125, (SELECT id from public.units where code = 'ml')),
(33, 11, 2, (SELECT id from public.units where code = 'pcs')),
(33, 10, 25, (SELECT id from public.units where code = 'g')),
(34, 12, 250, (SELECT id from public.units where code = 'ml')),
(34, 11, 4, (SELECT id from public.units where code = 'pcs')),
(34, 10, 50, (SELECT id from public.units where code = 'g')),
(35, 12, 375, (SELECT id from public.units where code = 'ml')),
(35, 11, 6, (SELECT id from public.units where code = 'pcs')),
(35, 10, 75, (SELECT id from public.units where code = 'g')),
(36, 12, 500, (SELECT id from public.units where code = 'ml')),
(36, 11, 8, (SELECT id from public.units where code = 'pcs')),
(36, 10, 100, (SELECT id from public.units where code = 'g'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- Recipe 10: Rejected Salad
INSERT INTO public.recipes (id, user_id, status, is_free, cover_image_url) VALUES
(10, NULL, 'rejected', true, NULL)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recipe_categories (recipe_id, category_id) VALUES (10, 2)
ON CONFLICT (recipe_id, category_id) DO NOTHING;
INSERT INTO public.recipe_translations (recipe_id, locale, title, description, tips, seo_title, seo_description) VALUES
(10, 'en', 'Rejected Salad', 'A rejected salad recipe.', NULL, NULL, NULL),
(10, 'tr', 'Reddedilmiş Salata', 'Reddedilmiş bir salata tarifi.', NULL, NULL, NULL)
ON CONFLICT (recipe_id, locale) DO NOTHING;
INSERT INTO public.recipe_steps (recipe_id, locale, step_number, text) VALUES
(10, 'en', 1, 'This recipe was rejected and needs revision.'),
(10, 'tr', 1, 'Bu tarif reddedildi ve revizyon gerekiyor.')
ON CONFLICT (recipe_id, locale, step_number) DO NOTHING;

INSERT INTO public.recipe_variants (id, recipe_id, servings) VALUES 
(37, 10, 1), (38, 10, 2), (39, 10, 3), (40, 10, 4)
ON CONFLICT (id) DO NOTHING;
-- Ingredients for Recipe 10 (all servings) - placeholder
INSERT INTO public.recipe_variant_ingredients (variant_id, ingredient_id, amount, unit_id) VALUES
(37, 6, 50, (SELECT id from public.units where code = 'g')),
(38, 6, 100, (SELECT id from public.units where code = 'g')),
(39, 6, 150, (SELECT id from public.units where code = 'g')),
(40, 6, 200, (SELECT id from public.units where code = 'g'))
ON CONFLICT (variant_id, ingredient_id) DO NOTHING;

-- 5. Set one admin user
-- In a real scenario, you would find a user's ID from the auth.users table
-- and use it here. For seeding, we can't know the ID in advance.
-- The /supabase/README.md will instruct the developer on how to do this manually.
-- Example:
-- UPDATE public.user_roles
-- SET role = 'admin'
-- WHERE user_id = '... an actual user id from auth.users ...';
