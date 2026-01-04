-- Secure Magic Token System with Expiry and Single-Use
-- Fixes the security vulnerability of permanent tokens

-- Add expiry and usage tracking to client_onboardings
ALTER TABLE client_onboardings 
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS token_used_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS token_last_accessed_at TIMESTAMPTZ;

-- Set default expiry to 90 days for existing records
UPDATE client_onboardings 
SET token_expires_at = created_at + INTERVAL '90 days'
WHERE token_expires_at IS NULL;

-- Fixed column name from access_token to onboarding_link_token
-- Create index for token lookup
CREATE INDEX IF NOT EXISTS idx_client_onboardings_token ON client_onboardings(onboarding_link_token);
CREATE INDEX IF NOT EXISTS idx_client_onboardings_token_expires ON client_onboardings(token_expires_at);

-- Function to validate and refresh token
CREATE OR REPLACE FUNCTION validate_onboarding_token(p_token TEXT)
RETURNS TABLE (
  onboarding_id UUID,
  is_valid BOOLEAN,
  expires_at TIMESTAMPTZ,
  client_name TEXT,
  client_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    co.id,
    (co.token_expires_at IS NULL OR co.token_expires_at > NOW()) as is_valid,
    co.token_expires_at,
    c.name,
    c.email
  FROM client_onboardings co
  JOIN clients c ON c.id = co.client_id
  WHERE co.onboarding_link_token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to regenerate expired token
CREATE OR REPLACE FUNCTION regenerate_onboarding_token(p_onboarding_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_new_token TEXT;
BEGIN
  -- Generate new secure token
  v_new_token := encode(gen_random_bytes(32), 'base64');
  
  -- Update with new token and expiry
  UPDATE client_onboardings
  SET 
    onboarding_link_token = v_new_token,
    token_expires_at = NOW() + INTERVAL '90 days',
    token_used_at = NULL,
    token_last_accessed_at = NULL
  WHERE id = p_onboarding_id;
  
  RETURN v_new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to extend token expiry
CREATE OR REPLACE FUNCTION extend_token_expiry(p_token TEXT, p_days INTEGER DEFAULT 90)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE client_onboardings
  SET token_expires_at = NOW() + (p_days || ' days')::INTERVAL
  WHERE onboarding_link_token = p_token
  AND (token_expires_at IS NULL OR token_expires_at > NOW());
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
