-- Example center card-style in-app message with 2 buttons
-- This demonstrates the new card type that appears in the center, is bigger, and supports 2 buttons

INSERT INTO public.in_app_messages (
  title,
  message,
  image_url,
  button_text,
  button_action,
  button_action_type,
  button2_text,
  button2_action,
  button2_action_type,
  button2_background_color,
  button2_text_color,
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

-- Center card example with 2 buttons
(
  'Upgrade to Premium',
  'Get access to all premium features including advanced templates, priority support, and exclusive content. Start your free trial today!',
  NULL, -- You can add an image URL here if you have one
  'Start Free Trial',
  '/settings',
  'deep_link',
  'Learn More',
  'https://masterfabric.co/pricing',
  'url',
  '#F5F5F5', -- Light gray for secondary button
  '#000000', -- Black text for secondary button
  'center',
  'card',
  NULL, -- Uses default theme color
  NULL, -- Uses default theme color
  '#6366F1', -- Primary button color (indigo)
  '#FFFFFF', -- White text for primary button
  true,
  NOW(),
  NOW() + INTERVAL '30 days',
  9,
  'all',
  'en',
  NOW()
);

