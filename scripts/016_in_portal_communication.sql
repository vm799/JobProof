-- In-Portal Comments and Chat
CREATE TABLE IF NOT EXISTS portal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_onboarding_id UUID NOT NULL REFERENCES client_onboardings(id) ON DELETE CASCADE,
  step_id UUID REFERENCES client_step_progress(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'team')),
  sender_id UUID, -- NULL for client (they're not authenticated)
  sender_name TEXT NOT NULL, -- Display name
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_portal_messages_onboarding ON portal_messages(client_onboarding_id);
CREATE INDEX idx_portal_messages_step ON portal_messages(step_id);
CREATE INDEX idx_portal_messages_created_at ON portal_messages(created_at DESC);
CREATE INDEX idx_portal_messages_unread ON portal_messages(is_read) WHERE is_read = false;

-- Enable RLS
ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;

-- Team can see all messages in their workspace
CREATE POLICY "portal_messages_team_policy" ON portal_messages
  FOR ALL USING (
    client_onboarding_id IN (
      SELECT id FROM client_onboardings 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE workspace_id IN (
          SELECT workspace_id FROM workspace_members 
          WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Clients can see messages for their onboarding (via token, not RLS)
