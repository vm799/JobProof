-- Seed Flow Templates with Rich Content
-- Run this script to populate your database with professional onboarding templates

-- SEO Onboarding Template
INSERT INTO flow_templates (id, name, description, category, is_featured, created_at)
VALUES (
  gen_random_uuid(),
  'SEO Onboarding',
  'Complete SEO setup and optimization workflow for new clients',
  'marketing',
  true,
  NOW()
)
ON CONFLICT DO NOTHING
RETURNING id;

-- Get the template ID for steps
DO $$
DECLARE
  seo_template_id UUID;
BEGIN
  SELECT id INTO seo_template_id FROM flow_templates WHERE name = 'SEO Onboarding' LIMIT 1;

  -- Insert SEO-specific steps
  INSERT INTO flow_template_steps (template_id, title, description, step_order, expected_duration_hours, requires_approval, created_at) VALUES
  (seo_template_id, 'Website Audit & Analysis', 'Conduct comprehensive technical SEO audit including site speed, mobile responsiveness, and crawlability', 1, 4, true, NOW()),
  (seo_template_id, 'Keyword Research & Strategy', 'Identify target keywords, analyze competition, and develop content strategy', 2, 6, true, NOW()),
  (seo_template_id, 'On-Page SEO Optimization', 'Optimize meta tags, headers, URLs, and internal linking structure', 3, 8, false, NOW()),
  (seo_template_id, 'Content Creation & Publishing', 'Create SEO-optimized content based on keyword strategy', 4, 12, false, NOW()),
  (seo_template_id, 'Technical SEO Implementation', 'Set up XML sitemaps, robots.txt, structured data, and site indexing', 5, 4, true, NOW()),
  (seo_template_id, 'Off-Page SEO & Link Building', 'Develop backlink strategy and execute initial link building campaigns', 6, 10, false, NOW()),
  (seo_template_id, 'Analytics & Reporting Setup', 'Configure Google Analytics, Search Console, and reporting dashboards', 7, 3, true, NOW());
END $$;

-- Social Media Management Template
INSERT INTO flow_templates (id, name, description, category, is_featured, created_at)
VALUES (
  gen_random_uuid(),
  'Social Media Management',
  'Social media strategy, content calendar, and engagement workflow',
  'marketing',
  true,
  NOW()
)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  social_template_id UUID;
BEGIN
  SELECT id INTO social_template_id FROM flow_templates WHERE name = 'Social Media Management' LIMIT 1;

  INSERT INTO flow_template_steps (template_id, title, description, step_order, expected_duration_hours, requires_approval, created_at) VALUES
  (social_template_id, 'Brand Audit & Strategy', 'Analyze current social presence and develop platform strategy', 1, 4, true, NOW()),
  (social_template_id, 'Content Calendar Creation', 'Plan 30-day content calendar with themes and posting schedule', 2, 6, true, NOW()),
  (social_template_id, 'Visual Asset Creation', 'Design branded templates, graphics, and visual content library', 3, 8, false, NOW()),
  (social_template_id, 'Profile Optimization', 'Optimize all social media profiles with consistent branding', 4, 2, false, NOW()),
  (social_template_id, 'Community Management Setup', 'Establish response protocols and engagement guidelines', 5, 3, true, NOW()),
  (social_template_id, 'Analytics Dashboard', 'Configure social media analytics and reporting tools', 6, 2, false, NOW());
END $$;

-- Website Development Template
INSERT INTO flow_templates (id, name, description, category, is_featured, created_at)
VALUES (
  gen_random_uuid(),
  'Website Development',
  'Full-service website design, development, and launch process',
  'development',
  true,
  NOW()
)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  web_template_id UUID;
BEGIN
  SELECT id INTO web_template_id FROM flow_templates WHERE name = 'Website Development' LIMIT 1;

  INSERT INTO flow_template_steps (template_id, title, description, step_order, expected_duration_hours, requires_approval, created_at) VALUES
  (web_template_id, 'Discovery & Requirements', 'Gather business requirements, target audience, and website goals', 1, 4, true, NOW()),
  (web_template_id, 'Wireframing & Site Architecture', 'Create sitemap and wireframes for all key pages', 2, 6, true, NOW()),
  (web_template_id, 'Design Mockups', 'Design high-fidelity mockups for desktop and mobile views', 3, 12, true, NOW()),
  (web_template_id, 'Frontend Development', 'Develop responsive HTML/CSS/JS based on approved designs', 4, 20, false, NOW()),
  (web_template_id, 'Backend & CMS Integration', 'Set up content management system and backend functionality', 5, 16, false, NOW()),
  (web_template_id, 'Testing & QA', 'Conduct cross-browser testing, performance optimization, and bug fixes', 6, 8, true, NOW()),
  (web_template_id, 'Launch & Training', 'Deploy to production and provide CMS training to client', 7, 4, true, NOW());
END $$;

-- Email Marketing Template
INSERT INTO flow_templates (id, name, description, category, is_featured, created_at)
VALUES (
  gen_random_uuid(),
  'Email Marketing Campaign',
  'Email list building, campaign creation, and automation setup',
  'marketing',
  false,
  NOW()
)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  email_template_id UUID;
BEGIN
  SELECT id INTO email_template_id FROM flow_templates WHERE name = 'Email Marketing Campaign' LIMIT 1;

  INSERT INTO flow_template_steps (template_id, title, description, step_order, expected_duration_hours, requires_approval, created_at) VALUES
  (email_template_id, 'List Segmentation Strategy', 'Analyze audience and create segmentation strategy', 1, 3, true, NOW()),
  (email_template_id, 'Email Template Design', 'Create branded email templates with mobile optimization', 2, 6, true, NOW()),
  (email_template_id, 'Campaign Content Creation', 'Write email copy and create supporting graphics', 3, 8, true, NOW()),
  (email_template_id, 'Automation Workflow Setup', 'Build automated email sequences and triggers', 4, 5, false, NOW()),
  (email_template_id, 'Testing & Deployment', 'Test emails across clients and schedule campaigns', 5, 2, true, NOW());
END $$;
