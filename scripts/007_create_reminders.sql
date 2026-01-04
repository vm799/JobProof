-- Create reminders table for automated email reminders
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  onboarding_id UUID REFERENCES client_onboardings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'incomplete_onboarding', 'step_overdue', 'followup'
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient reminder lookups
CREATE INDEX idx_reminders_scheduled ON reminders(scheduled_for, status) WHERE status = 'pending';
CREATE INDEX idx_reminders_onboarding ON reminders(onboarding_id);

-- Add due_date and reminder settings to onboardings
ALTER TABLE client_onboardings ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE client_onboardings ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT true;
ALTER TABLE client_onboardings ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();

-- Function to automatically create reminders for new onboardings
CREATE OR REPLACE FUNCTION create_onboarding_reminders()
RETURNS TRIGGER AS $$
BEGIN
  -- Schedule reminder for 3 days after start if no activity
  INSERT INTO reminders (workspace_id, onboarding_id, reminder_type, scheduled_for)
  VALUES (
    NEW.workspace_id,
    NEW.id,
    'incomplete_onboarding',
    NEW.created_at + INTERVAL '3 days'
  );
  
  -- Schedule reminder for 7 days after start
  INSERT INTO reminders (workspace_id, onboarding_id, reminder_type, scheduled_for)
  VALUES (
    NEW.workspace_id,
    NEW.id,
    'incomplete_onboarding',
    NEW.created_at + INTERVAL '7 days'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create reminders
DROP TRIGGER IF EXISTS trigger_create_reminders ON client_onboardings;
CREATE TRIGGER trigger_create_reminders
  AFTER INSERT ON client_onboardings
  FOR EACH ROW
  EXECUTE FUNCTION create_onboarding_reminders();
