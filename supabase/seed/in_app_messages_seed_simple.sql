-- Simple seed data for in_app_messages table
-- 2 example in-app messages for testing

-- Clear existing seed data (optional - comment out if you want to keep existing data)
-- DELETE FROM public.in_app_message_dismissals;
-- DELETE FROM public.in_app_messages;

INSERT INTO public.in_app_messages (
  title,
  message,
  image_url,
  button_text,
  button_action,
  button_action_type,
  position,
  style,
  background_color,
  text_color,
  button_background_color,
  button_text_color,
  is_active,
  start_date,
  end_date,
  priority,
  target_audience,
  language,
  created_at
) VALUES

-- Example 1: Welcome message for all users
(
  'Welcome to MasterFabric! 🎉',
  'Start building amazing mobile apps with React Native and Expo. Explore our features and templates to accelerate your development.',
  NULL,
  'Get Started',
  NULL,
  'dismiss',
  'top',
  'modal',
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  NULL,
  NULL,
  10,
  'all',
  'en',
  NOW()
),

-- Example 2: Feature announcement with action button
(
  'New Feature: Real-time Collaboration',
  'Collaborate with your team in real-time using our new Pixel Canvas feature. Build together and see changes instantly!',
  NULL,
  'Try It Now',
  '/supabase-cases',
  'deep_link',
  'top',
  'modal',
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  NOW(),
  NOW() + INTERVAL '30 days',
  8,
  'all',
  'en',
  NOW()
);

