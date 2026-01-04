-- Fix the workspace creation trigger to work properly with RLS
-- This replaces the previous trigger with a working version

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the fixed trigger function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_workspace_id uuid;
BEGIN
  -- Generate a new workspace ID
  new_workspace_id := gen_random_uuid();

  -- Insert workspace first (this was failing silently before)
  INSERT INTO public.workspaces (id, name, slug, owner_id, created_at)
  VALUES (
    new_workspace_id,
    'My Workspace',
    'workspace-' || substr(md5(random()::text), 1, 8),
    NEW.id,
    NOW()
  );

  -- Insert workspace member
  INSERT INTO public.workspace_members (workspace_id, user_id, role, created_at)
  VALUES (
    new_workspace_id,
    NEW.id,
    'owner',
    NOW()
  );

  -- Insert or update profile with the workspace
  INSERT INTO public.profiles (id, email, current_workspace_id, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    new_workspace_id,
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET 
    current_workspace_id = new_workspace_id,
    email = NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, authenticated, service_role;

-- Verify the trigger was created
SELECT 
  t.tgname AS trigger_name,
  p.proname AS function_name,
  CASE t.tgenabled
    WHEN 'O' THEN 'enabled'
    WHEN 'D' THEN 'disabled'
    ELSE 'unknown'
  END AS status
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname = 'on_auth_user_created';
