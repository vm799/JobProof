-- Add team member profiles for personal connection
ALTER TABLE workspace_members
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS favorite_quote TEXT;

-- Add personal notes and gratitude tracking
CREATE TABLE IF NOT EXISTS client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_onboarding_id UUID REFERENCES client_onboardings(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  author_id UUID REFERENCES workspace_members(id) ON DELETE SET NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('internal', 'client_visible', 'gratitude', 'encouragement')),
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Welcome videos and personal messages
CREATE TABLE IF NOT EXISTS welcome_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  onboarding_flow_id UUID REFERENCES onboarding_flows(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('video', 'text', 'audio')),
  content_url TEXT,
  content_text TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track client sentiment and engagement
CREATE TABLE IF NOT EXISTS client_sentiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_onboarding_id UUID REFERENCES client_onboardings(id) ON DELETE CASCADE,
  step_progress_id UUID REFERENCES client_step_progress(id) ON DELETE CASCADE,
  sentiment TEXT CHECK (sentiment IN ('excited', 'confused', 'overwhelmed', 'satisfied', 'frustrated')),
  feedback_text TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_client_notes_onboarding ON client_notes(client_onboarding_id);
CREATE INDEX IF NOT EXISTS idx_welcome_messages_flow ON welcome_messages(onboarding_flow_id);
CREATE INDEX IF NOT EXISTS idx_client_sentiment_onboarding ON client_sentiment(client_onboarding_id);

-- Enable RLS
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE welcome_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_sentiment ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view notes in their workspace"
  ON client_notes FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can create notes in their workspace"
  ON client_notes FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view welcome messages in their workspace"
  ON welcome_messages FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Public can view active welcome messages via token"
  ON welcome_messages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Clients can submit sentiment"
  ON client_sentiment FOR INSERT
  WITH CHECK (true);
