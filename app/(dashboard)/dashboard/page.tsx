'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import { RecommendationCard } from '@/components/ai/RecommendationCard'
import { severityColor, timeAgo } from '@/lib/utils'
import {
  Brain, Compass, GitBranch, Shield, DollarSign, Globe,
  Target, Database, FileText, BookOpen, Lightbulb, Sparkles,
  AlertCircle, ArrowRight, RefreshCw, Activity, CheckSquare
} from 'lucide-react'
import type { KPI, Insight } from '@/types'

const engines = [
  { icon: Brain,      title: 'Decision Engine',      href: '/dashboard/decision-engine', desc: 'Analyze a business problem' },
  { icon: Compass,    title: 'Strategy Engine',       href: '/dashboard/strategy',        desc: 'Build an executable strategy' },
  { icon: GitBranch,  title: 'Scenario Intelligence', href: '/dashboard/scenarios',       desc: 'Model decision consequences' },
  { icon: Shield,     title: 'Risk Intelligence',     href: '/dashboard/risk',            desc: 'Surface and assess risks' },
  { icon: DollarSign, title: 'Revenue Intelligence',  href: '/dashboard/revenue',         desc: 'Analyze growth and pipeline' },
  { icon: Globe,      title: 'Competitive Intel',     href: '/dashboard/competitive',     desc: 'Monitor market dynamics' },
]

interface Rec {
  id: string
  title: string
  summary: string
  priority: string
  effort: string
  expected_impact: string
  timeframe: string
  confidence: number
  engine: string
  status: string
  created_at: string
}

export default function ExecutiveBriefingPage() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [recommendations, setRecommendations] = useState<Rec[]>([])
  const [agentRuns, setAgentRuns] = useState<Array<{ id: string; agent_type: string; status: string; created_at: string; recommendations_generated: number }>>([])
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [briefingRunning, setBriefingRunning] = useState(false)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const oid = profile?.organization_id
    setOrgId(oid ?? null)
    if (!oid) { setLoading(false); return }

    const { data: org } = await supabase.from('organizations').select('name').eq('id', oid).single()
    setOrgName(org?.name ?? '')

    const [kpisRes, insightsRes] = await Promise.all([
      supabase.from('kpis').select('*').eq('organization_id', oid).limit(8),
      supabase.from('insights').select('*').eq('organization_id', oid).order('created_at', { ascending: false }).limit(5),
    ])

    // Recommendations and agent runs via API
    const [recsRes, runsRes] = await Promise.all([
      fetch('/api/recommendations?status=pending&limit=8').then(r => r.json()),
      supabase.from('agent_runs').select('id,agent_type,status,created_at,recommendations_generated').eq('organization_id', oid).order('created_at', { ascending: false }).limit(5),
    ])

    setKpis(kpisRes.data ?? [])
    setInsights(insightsRes.data ?? [])
    setRecommendations(recsRes.recommendations ?? [])
    setAgentRuns(runsRes.data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  const runBriefing = async () => {
    setBriefingRunning(true)
    try {
      await fetch('/api/agents/briefing', { method: 'POST' })
      await loadData()
    } finally {
      setBriefingRunning(false)
    }
  }

  const handleFeedback = async (id: string, status: 'accepted' | 'rejected' | 'deferred') => {
    await fetch('/api/recommendations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setRecommendations(prev => prev.filter(r => r.id !== id))
  }

  const atRisk = kpis.filter(k => k.status !== 'on_track')
  const unreadInsights = insights.filter(i => !i.is_read)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!orgId) {
    return (
      <EmptyState
        icon={Target}
        title="Welcome to CrestPoint"
        description="Complete your setup to activate your AI executive intelligence system."
        actionLabel="Complete Setup"
        actionHref="/onboarding/profile"
      />
    )
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-1">Executive Briefing</p>
          <h1 className="text-2xl font-bold text-[#0F1E3C]">{orgName}</h1>
          <p className="text-sm text-[#64748B] mt-1">AI intelligence overview — continuously updated.</p>
        </div>
        <Button onClick={runBriefing} loading={briefingRunning} variant="secondary">
          <RefreshCw className="h-4 w-4" />
          {briefingRunning ? 'Running briefing...' : 'Run AI Briefing'}
        </Button>
      </div>

      {/* Status bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'KPIs Tracked',       value: kpis.length,             icon: Target,      color: 'text-blue-600 bg-blue-50' },
          { label: 'At Risk / Off Track', value: atRisk.length,           icon: AlertCircle, color: atRisk.length > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50' },
          { label: 'Pending Actions',     value: recommendations.length,  icon: Lightbulb,   color: 'text-amber-600 bg-amber-50' },
          { label: 'Unread Insights',     value: unreadInsights.length,   icon: Sparkles,    color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} padding="sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3C]">{value}</p>
                <p className="text-xs text-[#64748B]">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0F1E3C]">AI Recommendations — Pending Action</h2>
            <p className="text-xs text-[#64748B]">Accept, defer, or dismiss each recommendation.</p>
          </div>
          <Link href="/dashboard/decision-engine">
            <Button variant="ghost" size="sm"><Brain className="h-4 w-4" /> New Analysis</Button>
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-[#F8F6F1] rounded-2xl border border-gray-200 p-8 text-center">
            <CheckSquare className="h-8 w-8 text-[#64748B] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#0F1E3C] mb-1">No pending recommendations</p>
            <p className="text-xs text-[#64748B] mb-4">Run an AI engine or trigger the briefing agent to generate recommendations.</p>
            <Button onClick={runBriefing} loading={briefingRunning} size="sm">
              <RefreshCw className="h-4 w-4" /> Run AI Briefing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} onFeedback={handleFeedback} />
            ))}
          </div>
        )}
      </div>

      {/* AI Engines */}
      <div>
        <h2 className="text-base font-bold text-[#0F1E3C] mb-4">AI Intelligence Engines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {engines.map(({ icon: Icon, title, href, desc }) => (
            <Link key={href} href={href}
              className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#D4A843]/50 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0F1E3C] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A843] transition-colors duration-300">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0F1E3C] text-sm mb-1">{title}</p>
                <p className="text-xs text-[#64748B]">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPIs */}
        <Card>
          <CardHeader>
            <CardTitle>KPIs Requiring Attention</CardTitle>
            <Link href="/dashboard/kpis"><Button variant="ghost" size="sm">All KPIs</Button></Link>
          </CardHeader>
          <CardContent>
            {kpis.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#64748B] mb-3">No KPIs configured.</p>
                <Link href="/dashboard/kpis"><Button variant="secondary" size="sm"><Target className="h-4 w-4" /> Add KPI</Button></Link>
              </div>
            ) : atRisk.length === 0 ? (
              <p className="text-sm text-green-600 text-center py-6 font-medium">All {kpis.length} KPIs on track.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {atRisk.map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0F1E3C]">{kpi.name}</p>
                      <p className="text-xs text-[#64748B]">{kpi.category}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 capitalize">
                      {kpi.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Active Insights</CardTitle>
            <Link href="/dashboard/insights"><Button variant="ghost" size="sm">All</Button></Link>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-sm text-[#64748B]">Insights are generated as you add data and run AI engines.</p>
                <Link href="/dashboard/data"><Button variant="secondary" size="sm"><Database className="h-4 w-4" /> Upload Data</Button></Link>
              </div>
            ) : (
              <div className="space-y-2">
                {insights.map((insight) => (
                  <div key={insight.id} className={`p-3 rounded-lg border ${severityColor(insight.severity)}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold">{insight.title}</p>
                      {!insight.is_read && <div className="w-2 h-2 rounded-full bg-current flex-shrink-0 mt-1" />}
                    </div>
                    {insight.description && <p className="text-xs mt-1 opacity-75 line-clamp-2">{insight.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent activity */}
      {agentRuns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-50">
              {agentRuns.map(run => (
                <div key={run.id} className="flex items-center gap-3 py-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    run.status === 'completed' ? 'bg-green-500' :
                    run.status === 'running' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F1E3C] capitalize">{run.agent_type.replace(/_/g, ' ')}</p>
                    {run.recommendations_generated > 0 && (
                      <p className="text-xs text-[#64748B]">{run.recommendations_generated} recommendations generated</p>
                    )}
                  </div>
                  <span className="text-xs text-[#64748B]">{timeAgo(run.created_at)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/decision-engine"><Button variant="secondary" size="sm"><Brain className="h-4 w-4" /> New Decision</Button></Link>
            <Link href="/dashboard/strategy"><Button variant="outline" size="sm"><Compass className="h-4 w-4" /> Build Strategy</Button></Link>
            <Link href="/dashboard/data"><Button variant="outline" size="sm"><Database className="h-4 w-4" /> Upload Data</Button></Link>
            <Link href="/dashboard/reports"><Button variant="outline" size="sm"><FileText className="h-4 w-4" /> Generate Report</Button></Link>
            <Link href="/dashboard/decision-memory"><Button variant="outline" size="sm"><BookOpen className="h-4 w-4" /> Log Decision</Button></Link>
            <Link href="/dashboard/risk"><Button variant="outline" size="sm"><Shield className="h-4 w-4" /> Risk Assessment</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
