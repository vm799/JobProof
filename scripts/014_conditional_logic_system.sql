-- Conditional Logic for Dynamic Flows
-- Enables if/then branching in onboarding flows

ALTER TABLE onboarding_steps 
ADD COLUMN IF NOT EXISTS conditional_logic JSONB,
ADD COLUMN IF NOT EXISTS skip_conditions JSONB;

-- Example conditional_logic structure:
-- {
--   "show_if": {
--     "field": "company_type",
--     "operator": "equals",
--     "value": "ecommerce"
--   }
-- }

-- Example skip_conditions structure:
-- {
--   "conditions": [
--     {
--       "field": "has_website",
--       "operator": "equals",
--       "value": false
--     }
--   ]
-- }

CREATE INDEX IF NOT EXISTS idx_onboarding_steps_conditional ON onboarding_steps USING gin(conditional_logic) WHERE conditional_logic IS NOT NULL;

-- Function to evaluate conditions
CREATE OR REPLACE FUNCTION evaluate_step_conditions(
  p_step_id UUID,
  p_answers JSONB
) RETURNS BOOLEAN AS $$
DECLARE
  v_step RECORD;
  v_condition JSONB;
  v_field TEXT;
  v_operator TEXT;
  v_value TEXT;
  v_answer TEXT;
BEGIN
  -- Get step with conditions
  SELECT conditional_logic INTO v_step
  FROM onboarding_steps
  WHERE id = p_step_id;

  -- If no conditions, show the step
  IF v_step.conditional_logic IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Extract condition details
  v_condition := v_step.conditional_logic->'show_if';
  v_field := v_condition->>'field';
  v_operator := v_condition->>'operator';
  v_value := v_condition->>'value';
  v_answer := p_answers->>v_field;

  -- Evaluate condition
  CASE v_operator
    WHEN 'equals' THEN
      RETURN v_answer = v_value;
    WHEN 'not_equals' THEN
      RETURN v_answer != v_value;
    WHEN 'contains' THEN
      RETURN v_answer LIKE '%' || v_value || '%';
    WHEN 'greater_than' THEN
      RETURN v_answer::NUMERIC > v_value::NUMERIC;
    WHEN 'less_than' THEN
      RETURN v_answer::NUMERIC < v_value::NUMERIC;
    ELSE
      RETURN TRUE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
