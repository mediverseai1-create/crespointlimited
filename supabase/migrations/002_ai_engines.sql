-- ─── AI Engine Tables ────────────────────────────────────────────────────────

-- Organizational memory: persistent business context that all AI engines use
CREATE TABLE IF NOT EXISTS organizational_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'business_context','goals','constraints','market','competitors',
    'pricing','customers','team','product','financials','decisions'
  )),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 1.0,
  source TEXT DEFAULT 'user_input' CHECK (source IN ('user_input','ai_inference','data_analysis')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, category, key)
);

-- Recommendations: structured AI-generated recommendations with feedback tracking
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engine TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  reasoning TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical','high','medium','low')),
  effort TEXT DEFAULT 'medium_term' CHECK (effort IN ('quick_win','medium_term','long_term')),
  expected_impact TEXT,
  timeframe TEXT,
  confidence DECIMAL(3,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','deferred','completed')),
  feedback TEXT,
  outcome TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent runs: log of all AI agent executions
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN (
    'executive_briefing','risk_monitor','revenue_monitor',
    'insight_generator','strategy_advisor','competitive_monitor','decision_analysis'
  )),
  trigger TEXT NOT NULL CHECK (trigger IN ('scheduled','data_upload','kpi_alert','manual','recommendation')),
  status TEXT DEFAULT 'running' CHECK (status IN ('running','completed','failed')),
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  recommendations_generated INTEGER DEFAULT 0,
  duration_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Predictions: AI forecasts with confidence tracking
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engine TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  prediction TEXT NOT NULL,
  rationale TEXT,
  confidence DECIMAL(3,2) NOT NULL,
  horizon TEXT NOT NULL,
  actual_outcome TEXT,
  accuracy_score DECIMAL(3,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','validated','invalidated','expired')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- RLS policies
ALTER TABLE organizational_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_members_memory" ON organizational_memory
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "org_members_recommendations" ON recommendations
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "org_members_agent_runs" ON agent_runs
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "org_members_predictions" ON predictions
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  ));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_memory_org ON organizational_memory(organization_id, category);
CREATE INDEX IF NOT EXISTS idx_recommendations_org ON recommendations(organization_id, status, priority);
CREATE INDEX IF NOT EXISTS idx_agent_runs_org ON agent_runs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_org ON predictions(organization_id, status);
