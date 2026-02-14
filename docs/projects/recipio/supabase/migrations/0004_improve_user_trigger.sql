-- Improve handle_new_user trigger to better handle email/password signups
-- Use email as fallback for display_name if full_name is not provided

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_display_name TEXT;
    user_email TEXT;
BEGIN
    -- Extract display name from metadata or use email as fallback
    user_display_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'display_name',
        new.email
    );
    
    -- Extract email for reference
    user_email := new.email;
    
    -- Insert profile with display_name (email fallback) and avatar_url
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        new.id,
        user_display_name,
        new.raw_user_meta_data->>'avatar_url'
    );
    
    -- Insert default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
