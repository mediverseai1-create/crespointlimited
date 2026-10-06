export type EngineType =
  | 'decision'
  | 'strategy'
  | 'scenario'
  | 'risk'
  | 'revenue'
  | 'competitive'
  | 'briefing'
  | 'insights'

export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Effort = 'quick_win' | 'medium_term' | 'long_term'

export interface Recommendation {
  title: string
  description: string
  priority: Priority
  effort: Effort
  expected_impact: string
  timeframe: string
}

export interface Risk {
  title: string
  severity: Priority
  likelihood: 'high' | 'medium' | 'low'
  description: string
  mitigation: string
  early_signals: string[]
}

export interface Opportunity {
  title: string
  description: string
  potential_impact: string
  required_action: string
  timeframe: string
}

export interface Prediction {
  statement: string
  confidence: number
  horizon: string
  rationale: string
}

export interface StructuredAnalysis {
  summary: string
  confidence: number
  reasoning_chain: string[]
  key_findings: string[]
  recommendations: Recommendation[]
  risks: Risk[]
  opportunities: Opportunity[]
  predictions: Prediction[]
  next_steps: string[]
  data_gaps: string[]
  engine: EngineType
}

export interface OrgContext {
  organization: {
    name: string
    industry: string
    size: string
    country: string
    plan: string
  }
  memory: Record<string, Record<string, string>>
  kpis: Array<{
    name: string
    category: string
    current_value: number | null
    target_value: number | null
    unit: string | null
    status: string
  }>
  metrics: Array<{
    category: string
    name: string
    value: number
    period_start: string | null
  }>
  insights: Array<{
    title: string
    category: string
    severity: string
  }>
  recent_recommendations: Array<{
    title: string
    status: string
    engine: string
  }>
}
