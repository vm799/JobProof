-- Create subscriptions table for AppSumo licensing
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  plan_tier text not null check (plan_tier in ('tier_1', 'tier_2', 'tier_3')),
  status text not null check (status in ('active', 'cancelled', 'expired')) default 'active',
  appsumo_code text unique,
  max_active_onboardings integer not null,
  max_custom_flows integer not null,
  max_team_members integer not null,
  features jsonb default '{}'::jsonb,
  activated_at timestamp with time zone default now(),
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Policies for subscriptions
create policy "Users can view their workspace subscription"
  on public.subscriptions for select
  using (
    workspace_id in (
      select workspace_id from public.workspace_members
      where user_id = auth.uid()
    )
  );

create policy "Owners can manage workspace subscription"
  on public.subscriptions for all
  using (
    workspace_id in (
      select id from public.workspaces
      where owner_id = auth.uid()
    )
  );

-- Function to create default subscription for new workspace
create or replace function create_default_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (
    workspace_id,
    plan_tier,
    status,
    max_active_onboardings,
    max_custom_flows,
    max_team_members,
    features
  ) values (
    new.id,
    'tier_1',
    'active',
    10,
    3,
    3,
    '{"email_support": true, "client_portal": true, "basic_analytics": true}'::jsonb
  );
  return new;
end;
$$ language plpgsql;

-- Trigger to create default subscription
drop trigger if exists create_default_subscription_trigger on workspaces;

create trigger create_default_subscription_trigger
  after insert on workspaces
  for each row
  execute function create_default_subscription();
