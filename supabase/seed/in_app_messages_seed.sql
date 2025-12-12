-- Seed data for in_app_messages table
-- Example in-app messages demonstrating various features and styles

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

-- Welcome message for all users (high priority)
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
  NOW() - INTERVAL '1 day'
),

-- Feature announcement with action button
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
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '7 days',
  8,
  'all',
  'en',
  NOW() - INTERVAL '2 hours'
),

-- Authenticated users only - premium feature
(
  'Unlock Premium Features',
  'Upgrade to Premium to access advanced templates, priority support, and exclusive features. Start your free trial today!',
  NULL,
  'Upgrade Now',
  'https://masterfabric.co/pricing',
  'url',
  'top',
  'modal',
  '#6366F1',
  '#FFFFFF',
  '#FFFFFF',
  '#6366F1',
  true,
  NULL,
  NULL,
  7,
  'authenticated',
  'en',
  NOW() - INTERVAL '3 hours'
),

-- Limited time offer
(
  'Limited Time: 50% Off Premium',
  'Get 50% off your first month of Premium! This offer expires in 48 hours. Don''t miss out on advanced features and priority support.',
  NULL,
  'Claim Offer',
  'https://masterfabric.co/promo',
  'url',
  'top',
  'modal',
  '#10B981',
  '#FFFFFF',
  '#FFFFFF',
  '#10B981',
  true,
  NOW(),
  NOW() + INTERVAL '2 days',
  9,
  'all',
  'en',
  NOW() - INTERVAL '30 minutes'
),

-- System update notification
(
  'App Update Available',
  'A new version of MasterFabric is available with bug fixes and performance improvements. Update now for the best experience.',
  NULL,
  'Update',
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
  6,
  'all',
  'en',
  NOW() - INTERVAL '4 hours'
),

-- Developer tips for authenticated users
(
  'Pro Tip: Use Expo Router',
  'Expo Router provides file-based routing with automatic code splitting. It''s the recommended way to handle navigation in Expo apps.',
  NULL,
  'Learn More',
  '/documentation',
  'deep_link',
  'top',
  'modal',
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  NULL,
  NULL,
  5,
  'authenticated',
  'en',
  NOW() - INTERVAL '5 hours'
),

-- Security alert
(
  'Security Update Required',
  'We''ve enhanced our security features. Please review your account settings and enable two-factor authentication for better protection.',
  NULL,
  'Go to Settings',
  '/settings',
  'deep_link',
  'top',
  'modal',
  '#EF4444',
  '#FFFFFF',
  '#FFFFFF',
  '#EF4444',
  true,
  NULL,
  NULL,
  8,
  'authenticated',
  'en',
  NOW() - INTERVAL '6 hours'
),

-- Community announcement
(
  'Join Our Community',
  'Connect with other developers, share your projects, and get help from the community. Join our Discord server today!',
  NULL,
  'Join Discord',
  'https://discord.gg/masterfabric',
  'url',
  'top',
  'modal',
  '#5865F2',
  '#FFFFFF',
  '#FFFFFF',
  '#5865F2',
  true,
  NULL,
  NULL,
  4,
  'all',
  'en',
  NOW() - INTERVAL '1 day'
),

-- New template announcement
(
  'New Template: E-Commerce Starter',
  'Check out our new E-Commerce starter template with shopping cart, payment integration, and product management. Perfect for your next project!',
  NULL,
  'View Template',
  '/projects',
  'deep_link',
  'top',
  'modal',
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  NOW() - INTERVAL '12 hours',
  NOW() + INTERVAL '14 days',
  6,
  'all',
  'en',
  NOW() - INTERVAL '12 hours'
),

-- Feedback request
(
  'Help Us Improve',
  'Your feedback helps us build better tools. Take a quick 2-minute survey and help shape the future of MasterFabric.',
  NULL,
  'Take Survey',
  'https://forms.gle/masterfabric-feedback',
  'url',
  'top',
  'modal',
  NULL,
  NULL,
  NULL,
  NULL,
  true,
  NULL,
  NULL,
  3,
  'all',
  'en',
  NOW() - INTERVAL '2 days'
);

