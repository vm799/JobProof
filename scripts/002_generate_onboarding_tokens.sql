-- Function to generate a unique onboarding token
create or replace function generate_onboarding_token()
returns trigger as $$
begin
  -- Generate a random token if one doesn't exist
  if new.onboarding_link_token is null then
    new.onboarding_link_token := encode(gen_random_bytes(32), 'hex');
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger to auto-generate tokens
drop trigger if exists generate_onboarding_token_trigger on client_onboardings;

create trigger generate_onboarding_token_trigger
  before insert on client_onboardings
  for each row
  execute function generate_onboarding_token();

-- Function to create step progress when onboarding is created
create or replace function create_step_progress_for_onboarding()
returns trigger as $$
declare
  step_record record;
begin
  -- Only create progress if flow_id is set
  if new.flow_id is not null then
    -- Create progress records for each step in the flow
    for step_record in 
      select * from onboarding_steps 
      where flow_id = new.flow_id 
      order by step_order asc
    loop
      insert into client_step_progress (
        client_onboarding_id,
        step_id,
        status,
        data
      ) values (
        new.id,
        step_record.id,
        'not_started',
        '{}'::jsonb
      );
    end loop;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Create trigger to auto-create step progress
drop trigger if exists create_step_progress_trigger on client_onboardings;

create trigger create_step_progress_trigger
  after insert on client_onboardings
  for each row
  execute function create_step_progress_for_onboarding();
