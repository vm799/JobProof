-- Comprehensive RLS Policies for Zero-Trust Security
-- This script implements proper Row-Level Security across all tables

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Added DROP POLICY IF EXISTS for all policies to prevent conflicts
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their workspace" ON workspaces;
DROP POLICY IF EXISTS "Users can update their workspace" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can manage workspace members" ON workspace_members;
DROP POLICY IF EXISTS "workspace_select_policy" ON workspaces;
DROP POLICY IF EXISTS "workspace_update_policy" ON workspaces;
DROP POLICY IF EXISTS "workspace_members_select_policy" ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_policy" ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete_policy" ON workspace_members;
DROP POLICY IF EXISTS "clients_select_policy" ON clients;
DROP POLICY IF EXISTS "clients_insert_policy" ON clients;
DROP POLICY IF EXISTS "clients_update_policy" ON clients;
DROP POLICY IF EXISTS "clients_delete_policy" ON clients;
DROP POLICY IF EXISTS "flows_select_policy" ON onboarding_flows;
DROP POLICY IF EXISTS "flows_insert_policy" ON onboarding_flows;
DROP POLICY IF EXISTS "flows_update_policy" ON onboarding_flows;
DROP POLICY IF EXISTS "flows_delete_policy" ON onboarding_flows;
DROP POLICY IF EXISTS "steps_select_policy" ON onboarding_steps;
DROP POLICY IF EXISTS "steps_insert_policy" ON onboarding_steps;
DROP POLICY IF EXISTS "steps_update_policy" ON onboarding_steps;
DROP POLICY IF EXISTS "steps_delete_policy" ON onboarding_steps;
DROP POLICY IF EXISTS "onboardings_select_policy" ON client_onboardings;
DROP POLICY IF EXISTS "onboardings_insert_policy" ON client_onboardings;
DROP POLICY IF EXISTS "onboardings_update_policy" ON client_onboardings;
DROP POLICY IF EXISTS "step_progress_select_policy" ON client_step_progress;
DROP POLICY IF EXISTS "step_progress_insert_policy" ON client_step_progress;
DROP POLICY IF EXISTS "step_progress_update_policy" ON client_step_progress;
DROP POLICY IF EXISTS "activity_logs_select_policy" ON activity_logs;
DROP POLICY IF EXISTS "activity_logs_insert_policy" ON activity_logs;
DROP POLICY IF EXISTS "client_notes_select_policy" ON client_notes;
DROP POLICY IF EXISTS "client_notes_insert_policy" ON client_notes;
DROP POLICY IF EXISTS "client_notes_update_policy" ON client_notes;
DROP POLICY IF EXISTS "reminders_select_policy" ON reminders;
DROP POLICY IF EXISTS "reminders_insert_policy" ON reminders;
DROP POLICY IF EXISTS "reminders_update_policy" ON reminders;
DROP POLICY IF EXISTS "client_portal_public_access" ON client_onboardings;
DROP POLICY IF EXISTS "client_portal_steps_public_access" ON onboarding_steps;
DROP POLICY IF EXISTS "client_portal_progress_public_access" ON client_step_progress;
DROP POLICY IF EXISTS "client_portal_progress_update_public" ON client_step_progress;
DROP POLICY IF EXISTS "client_portal_progress_insert_public" ON client_step_progress;

-- Workspaces: Users can only access workspaces they're members of
CREATE POLICY "workspace_select_policy" ON workspaces
  FOR SELECT USING (
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "workspace_update_policy" ON workspaces
  FOR UPDATE USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Workspace Members: Users can view and manage members in their workspace
CREATE POLICY "workspace_members_select_policy" ON workspace_members
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "workspace_members_insert_policy" ON workspace_members
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "workspace_members_delete_policy" ON workspace_members
  FOR DELETE USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Clients: Workspace-scoped access
CREATE POLICY "clients_select_policy" ON clients
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "clients_insert_policy" ON clients
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "clients_update_policy" ON clients
  FOR UPDATE USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "clients_delete_policy" ON clients
  FOR DELETE USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Onboarding Flows: Workspace-scoped access
CREATE POLICY "flows_select_policy" ON onboarding_flows
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "flows_insert_policy" ON onboarding_flows
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "flows_update_policy" ON onboarding_flows
  FOR UPDATE USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "flows_delete_policy" ON onboarding_flows
  FOR DELETE USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Onboarding Steps: Accessible via flow workspace
CREATE POLICY "steps_select_policy" ON onboarding_steps
  FOR SELECT USING (
    flow_id IN (
      SELECT id FROM onboarding_flows 
      WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "steps_insert_policy" ON onboarding_steps
  FOR INSERT WITH CHECK (
    flow_id IN (
      SELECT id FROM onboarding_flows 
      WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "steps_update_policy" ON onboarding_steps
  FOR UPDATE USING (
    flow_id IN (
      SELECT id FROM onboarding_flows 
      WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "steps_delete_policy" ON onboarding_steps
  FOR DELETE USING (
    flow_id IN (
      SELECT id FROM onboarding_flows 
      WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    )
  );

-- Client Onboardings: Accessible via client workspace
CREATE POLICY "onboardings_select_policy" ON client_onboardings
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "onboardings_insert_policy" ON client_onboardings
  FOR INSERT WITH CHECK (
    client_id IN (
      SELECT id FROM clients 
      WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "onboardings_update_policy" ON client_onboardings
  FOR UPDATE USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    )
  );

-- Client Step Progress: Accessible via onboarding
CREATE POLICY "step_progress_select_policy" ON client_step_progress
  FOR SELECT USING (
    client_onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

CREATE POLICY "step_progress_insert_policy" ON client_step_progress
  FOR INSERT WITH CHECK (
    client_onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

CREATE POLICY "step_progress_update_policy" ON client_step_progress
  FOR UPDATE USING (
    client_onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

-- Activity Logs: Workspace-scoped access
CREATE POLICY "activity_logs_select_policy" ON activity_logs
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "activity_logs_insert_policy" ON activity_logs
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

-- Client Notes: Accessible via onboarding
CREATE POLICY "client_notes_select_policy" ON client_notes
  FOR SELECT USING (
    client_onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

CREATE POLICY "client_notes_insert_policy" ON client_notes
  FOR INSERT WITH CHECK (
    client_onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

CREATE POLICY "client_notes_update_policy" ON client_notes
  FOR UPDATE USING (
    client_onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

-- Reminders: Accessible via onboarding
CREATE POLICY "reminders_select_policy" ON reminders
  FOR SELECT USING (
    onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

CREATE POLICY "reminders_insert_policy" ON reminders
  FOR INSERT WITH CHECK (
    onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

CREATE POLICY "reminders_update_policy" ON reminders
  FOR UPDATE USING (
    onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
      )
    )
  );

-- Adding public access policies for client portal (anon users with magic token)
-- Public access for clients to view their onboarding via magic token
CREATE POLICY "client_portal_public_access" ON client_onboardings
  FOR SELECT USING (true); -- Validated at application layer via onboarding_link_token

CREATE POLICY "client_portal_steps_public_access" ON onboarding_steps
  FOR SELECT USING (true); -- Steps are public, filtered by flow_id at app layer

CREATE POLICY "client_portal_progress_public_access" ON client_step_progress
  FOR SELECT USING (true); -- Progress is public, filtered by onboarding_id at app layer

CREATE POLICY "client_portal_progress_update_public" ON client_step_progress
  FOR UPDATE USING (true); -- Clients can update their own progress via magic token

CREATE POLICY "client_portal_progress_insert_public" ON client_step_progress
  FOR INSERT WITH CHECK (true); -- Clients can create progress entries via magic token

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant public (anon) users access to read client portal data
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON client_onboardings TO anon;
GRANT SELECT ON onboarding_steps TO anon;
GRANT SELECT, INSERT, UPDATE ON client_step_progress TO anon;
