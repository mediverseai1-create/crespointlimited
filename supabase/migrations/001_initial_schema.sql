-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  size TEXT,
  country TEXT,
  logo_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'growth', 'business')),
  plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'trialing', 'past_due', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member',
  job_title TEXT,
  avatar_url TEXT,
  phone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','manager','analyst','member','viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- KPIs
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  target_value NUMERIC,
  current_value NUMERIC,
  unit TEXT,
  direction TEXT DEFAULT 'higher_better' CHECK (direction IN ('higher_better','lower_better')),
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track','at_risk','off_track')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI History
CREATE TABLE IF NOT EXISTS kpi_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id UUID NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Business Metrics
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  period_start DATE,
  period_end DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Uploads
CREATE TABLE IF NOT EXISTS data_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size BIGINT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  row_count INTEGER,
  columns JSONB DEFAULT '[]',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insights
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'performance' CHECK (category IN ('performance','risk','opportunity','trend')),
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  potential_impact TEXT DEFAULT 'medium' CHECK (potential_impact IN ('low','medium','high','very_high')),
  effort_level TEXT DEFAULT 'medium' CHECK (effort_level IN ('low','medium','high')),
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified','in_review','actioned','dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actions
CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','completed','cancelled')),
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  insight_id UUID REFERENCES insights(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin','manager','analyst','member','viewer')),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON kpis FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Helper function: check org membership
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- profiles: users manage their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- organization_members: members can view their org members
CREATE POLICY "Members can view org members" ON organization_members FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Owners/admins can manage members" ON organization_members FOR ALL USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = organization_members.organization_id AND user_id = auth.uid() AND role IN ('owner','admin'))
);

-- organizations
CREATE POLICY "Org members can view org" ON organizations FOR SELECT USING (is_org_member(id));
CREATE POLICY "Org owners can update org" ON organizations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = id AND user_id = auth.uid() AND role IN ('owner','admin'))
);
CREATE POLICY "Authenticated users can create org" ON organizations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- kpis
CREATE POLICY "Org members can view kpis" ON kpis FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can manage kpis" ON kpis FOR ALL USING (is_org_member(organization_id));

-- kpi_history
CREATE POLICY "Org members can view kpi history" ON kpi_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM kpis k JOIN organization_members om ON om.organization_id = k.organization_id WHERE k.id = kpi_id AND om.user_id = auth.uid())
);
CREATE POLICY "Org members can insert kpi history" ON kpi_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM kpis k JOIN organization_members om ON om.organization_id = k.organization_id WHERE k.id = kpi_id AND om.user_id = auth.uid())
);

-- business_metrics
CREATE POLICY "Org members can view metrics" ON business_metrics FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can manage metrics" ON business_metrics FOR ALL USING (is_org_member(organization_id));

-- data_uploads
CREATE POLICY "Org members can view uploads" ON data_uploads FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can manage uploads" ON data_uploads FOR ALL USING (is_org_member(organization_id));

-- insights
CREATE POLICY "Org members can view insights" ON insights FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can manage insights" ON insights FOR ALL USING (is_org_member(organization_id));

-- opportunities
CREATE POLICY "Org members can view opportunities" ON opportunities FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can manage opportunities" ON opportunities FOR ALL USING (is_org_member(organization_id));

-- actions
CREATE POLICY "Org members can view actions" ON actions FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can manage actions" ON actions FOR ALL USING (is_org_member(organization_id));

-- reports
CREATE POLICY "Org members can view reports" ON reports FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can manage reports" ON reports FOR ALL USING (is_org_member(organization_id));

-- activity_logs
CREATE POLICY "Org members can view activity" ON activity_logs FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert activity" ON activity_logs FOR INSERT WITH CHECK (is_org_member(organization_id));

-- invitations
CREATE POLICY "Org members can view invitations" ON invitations FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Admins can manage invitations" ON invitations FOR ALL USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = invitations.organization_id AND user_id = auth.uid() AND role IN ('owner','admin'))
);
