-- Fix the workspace creation trigger to bypass RLS
-- The trigger runs with SECURITY DEFINER to have full permissions

-- Drop and recreate the function with proper permissions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- Run with function owner's permissions, not caller's
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Create workspace (bypasses RLS with SECURITY DEFINER)
  INSERT INTO public.workspaces (name, owner_id)
  VALUES (
    'My Workspace',
    NEW.id
  )
  RETURNING id INTO new_workspace_id;

  -- Create workspace member
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (
    new_workspace_id,
    NEW.id,
    'owner'
  );

  -- Create profile with workspace assigned
  INSERT INTO public.profiles (id, email, current_workspace_id)
  VALUES (
    NEW.id,
    NEW.email,
    new_workspace_id
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail signup
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
