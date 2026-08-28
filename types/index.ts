export interface Organization {
  id: string
  name: string
  slug: string
  industry: string | null
  size: string | null
  country: string | null
  logo_url: string | null
  plan: 'free' | 'starter' | 'professional' | 'growth' | 'business'
  plan_status: 'active' | 'trialing' | 'past_due' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id: string | null
  full_name: string | null
  role: string | null
  job_title: string | null
  avatar_url: string | null
  phone: string | null
  onboarding_completed: boolean
  created_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'manager' | 'analyst' | 'member' | 'viewer'
  invited_by: string | null
  joined_at: string
  profiles?: Profile
}

export interface KPI {
  id: string
  organization_id: string
  name: string
  description: string | null
  category: string
  target_value: number | null
  current_value: number | null
  unit: string | null
  direction: 'higher_better' | 'lower_better'
  status: 'on_track' | 'at_risk' | 'off_track'
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface KPIHistory {
  id: string
  kpi_id: string
  value: number
  recorded_at: string
  notes: string | null
}

export interface BusinessMetric {
  id: string
  organization_id: string
  category: string
  name: string
  value: number
  period_start: string | null
  period_end: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface DataUpload {
  id: string
  organization_id: string
  filename: string
  file_size: number | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  row_count: number | null
  columns: string[]
  uploaded_by: string | null
  created_at: string
}

export interface Insight {
  id: string
  organization_id: string
  title: string
  description: string | null
  category: 'performance' | 'risk' | 'opportunity' | 'trend'
  severity: 'info' | 'warning' | 'critical'
  data: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export interface Opportunity {
  id: string
  organization_id: string
  title: string
  description: string | null
  category: string | null
  potential_impact: 'low' | 'medium' | 'high' | 'very_high'
  effort_level: 'low' | 'medium' | 'high'
  status: 'identified' | 'in_review' | 'actioned' | 'dismissed'
  created_at: string
}

export interface Action {
  id: string
  organization_id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  assigned_to: string | null
  due_date: string | null
  insight_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Report {
  id: string
  organization_id: string
  title: string
  type: string
  content: Record<string, unknown>
  generated_by: string | null
  created_at: string
}

export interface ActivityLog {
  id: string
  organization_id: string
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  profiles?: Profile
}

export interface Invitation {
  id: string
  organization_id: string
  email: string
  role: 'admin' | 'manager' | 'analyst' | 'member' | 'viewer'
  token: string
  invited_by: string | null
  expires_at: string
  accepted_at: string | null
  created_at: string
}

export interface NavItem {
  label: string
  href: string
  icon: string
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}
