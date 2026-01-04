-- Custom Domains for White-label
CREATE TABLE IF NOT EXISTS custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verification_token TEXT NOT NULL,
  ssl_status TEXT DEFAULT 'pending', -- pending, active, failed
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  verified_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ
);

CREATE INDEX idx_custom_domains_workspace_id ON custom_domains(workspace_id);
CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX idx_custom_domains_verified ON custom_domains(is_verified);

-- Enable RLS
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "custom_domains_admin_policy" ON custom_domains
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to generate verification token
CREATE OR REPLACE FUNCTION generate_domain_verification_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;
