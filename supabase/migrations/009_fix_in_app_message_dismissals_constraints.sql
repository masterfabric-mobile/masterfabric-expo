-- Fix unique constraints for in_app_message_dismissals table
-- Replace partial unique indexes with function-based unique index that works with upsert

-- Drop the partial unique indexes
DROP INDEX IF EXISTS idx_in_app_message_dismissals_user;
DROP INDEX IF EXISTS idx_in_app_message_dismissals_device;

-- Create a function-based unique index that works for both user_id and device_id cases
-- This creates a unique constraint on message_id + identifier (either user_id or device_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_in_app_message_dismissals_unique
  ON public.in_app_message_dismissals(
    message_id,
    COALESCE('user_' || user_id::text, 'device_' || device_id)
  );

