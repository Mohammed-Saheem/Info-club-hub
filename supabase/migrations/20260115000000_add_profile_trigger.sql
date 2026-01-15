-- ═══════════════════════════════════════════════════════════════════════════
-- Auto-create profile when user signs up
-- This trigger ensures a profile row is created for every new auth user
-- ═══════════════════════════════════════════════════════════════════════════

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false  -- Default to non-admin, manually set is_admin = true for admins
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
-- Create profiles for existing users who don't have one
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.profiles (user_id, email, full_name, is_admin)
SELECT 
  u.id as user_id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', '') as full_name,
  false as is_admin  -- Set to true manually for admins
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);

-- ═══════════════════════════════════════════════════════════════════════════
-- IMPORTANT: After running this migration, you need to manually set 
-- is_admin = true for your admin user:
--
-- UPDATE public.profiles SET is_admin = true WHERE email = 'admin@infoclub.com';
-- ═══════════════════════════════════════════════════════════════════════════
