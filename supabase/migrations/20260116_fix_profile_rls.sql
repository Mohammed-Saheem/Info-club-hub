-- ═══════════════════════════════════════════════════════════════════════════
-- Fix Profile RLS Policies - Ensure users can always read their own profile
-- ═══════════════════════════════════════════════════════════════════════════

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate SELECT policy with more permissive approach
-- Users should be able to read their own profile if they're authenticated
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = user_id
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to insert their own profile (for signup flow)
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- Ensure all auth users have a profile
-- ═══════════════════════════════════════════════════════════════════════════

-- Recreate the trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
-- Create profiles for any existing users who don't have one
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.profiles (user_id, email, full_name, is_admin)
SELECT 
  u.id as user_id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', '') as full_name,
  false as is_admin
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- Verify policies are working
-- ═══════════════════════════════════════════════════════════════════════════

-- Check existing policies (run this manually if needed)
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
