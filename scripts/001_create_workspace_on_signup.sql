-- Function to automatically create workspace and profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
begin
  -- Create a workspace for the new user
  insert into public.workspaces (owner_id, name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)) || '''s Workspace',
    now(),
    now()
  )
  returning id into new_workspace_id;

  -- Create a workspace member record
  insert into public.workspace_members (workspace_id, user_id, role, created_at)
  values (new_workspace_id, new.id, 'owner', now());

  -- Create a profile for the new user
  insert into public.profiles (id, email, name, current_workspace_id, created_at, updated_at, onboarding_completed)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new_workspace_id,
    now(),
    now(),
    false
  );

  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to run function on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
