-- Create templates table for pre-built onboarding flows
CREATE TABLE IF NOT EXISTS flow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  step_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create template steps
CREATE TABLE IF NOT EXISTS flow_template_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES flow_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  step_order INTEGER NOT NULL,
  field_type TEXT DEFAULT 'text',
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert pre-built templates
INSERT INTO flow_templates (name, description, category, icon, color, step_count, is_featured) VALUES
  ('Agency Client Kickoff', 'Complete onboarding flow for agency clients with discovery, contracts, and setup', 'Agency', 'briefcase', 'blue', 8, true),
  ('SaaS User Onboarding', 'Streamlined onboarding for SaaS customers with product setup and training', 'SaaS', 'rocket', 'purple', 6, true),
  ('HR Employee Onboarding', 'Comprehensive employee onboarding with documents, training, and equipment', 'HR', 'users', 'orange', 12, false),
  ('Consultant Discovery', 'Initial discovery and scoping process for consulting engagements', 'Consulting', 'search', 'green', 5, false),
  ('Real Estate Client Intake', 'Property requirements, financing, and preferences for real estate clients', 'Real Estate', 'home', 'indigo', 7, false),
  ('Legal Client Setup', 'Client intake for legal services with case information and documentation', 'Legal', 'scale', 'amber', 9, false),
  ('Marketing Campaign Onboarding', 'Brief collection and asset gathering for marketing campaigns', 'Marketing', 'megaphone', 'pink', 6, false),
  ('Design Project Kickoff', 'Creative brief and requirements for design projects', 'Design', 'palette', 'violet', 7, false),
  ('IT Service Setup', 'Technical onboarding for IT service clients with system access', 'Technology', 'monitor', 'cyan', 8, false),
  ('Financial Advisory Onboarding', 'Client profile and financial goals for advisory services', 'Finance', 'dollar-sign', 'emerald', 10, false);

-- Insert steps for Agency Client Kickoff template
INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Company Information', 'Basic details about your business', 1, 'form', true
FROM flow_templates WHERE name = 'Agency Client Kickoff';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Brand Assets', 'Upload your logo, brand guidelines, and assets', 2, 'file', true
FROM flow_templates WHERE name = 'Agency Client Kickoff';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Project Goals', 'Tell us what you want to achieve', 3, 'form', true
FROM flow_templates WHERE name = 'Agency Client Kickoff';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Target Audience', 'Who are your customers?', 4, 'form', true
FROM flow_templates WHERE name = 'Agency Client Kickoff';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Sign Contract', 'Review and sign the service agreement', 5, 'file', true
FROM flow_templates WHERE name = 'Agency Client Kickoff';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Connect Tools', 'Integrate your existing platforms', 6, 'form', false
FROM flow_templates WHERE name = 'Agency Client Kickoff';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Schedule Kickoff', 'Pick a time for our first meeting', 7, 'calendar', true
FROM flow_templates WHERE name = 'Agency Client Kickoff';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Payment Setup', 'Configure billing and payment details', 8, 'form', true
FROM flow_templates WHERE name = 'Agency Client Kickoff';

-- Insert steps for SaaS User Onboarding template
INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Welcome & Profile Setup', 'Tell us about yourself', 1, 'form', true
FROM flow_templates WHERE name = 'SaaS User Onboarding';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Team Invitation', 'Invite your team members', 2, 'form', false
FROM flow_templates WHERE name = 'SaaS User Onboarding';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Configure Workspace', 'Customize your workspace settings', 3, 'form', true
FROM flow_templates WHERE name = 'SaaS User Onboarding';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Import Data', 'Bring in your existing data', 4, 'file', false
FROM flow_templates WHERE name = 'SaaS User Onboarding';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'Product Tour', 'Learn the key features', 5, 'tutorial', true
FROM flow_templates WHERE name = 'SaaS User Onboarding';

INSERT INTO flow_template_steps (template_id, title, description, step_order, field_type, is_required)
SELECT id, 'First Task', 'Complete your first action', 6, 'form', true
FROM flow_templates WHERE name = 'SaaS User Onboarding';

-- Add indexes for performance
CREATE INDEX idx_flow_templates_category ON flow_templates(category);
CREATE INDEX idx_flow_templates_featured ON flow_templates(is_featured);
CREATE INDEX idx_flow_template_steps_template ON flow_template_steps(template_id, step_order);
