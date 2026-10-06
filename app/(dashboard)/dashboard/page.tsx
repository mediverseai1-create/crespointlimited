'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import { severityColor } from '@/lib/utils'
import {
  Brain, Compass, GitBranch, Shield, DollarSign, Globe,
  Lightbulb, Target, Database, FileText, BookOpen, TrendingUp,
  AlertCircle, Sparkles, ArrowRight
} from 'lucide-react'
import type { KPI, Insight } from '@/types'

const engines = [
  { icon: Brain,     title: 'Decision Engine',       href: '/dashboard/decision-engine', desc: 'Analyze any business problem and get a recommended decision' },
  { icon: Compass,   title: 'Strategy Engine',        href: '/dashboard/strategy',        desc: 'Turn a business goal into an executable strategy' },
  { icon: GitBranch, title: 'Scenario Intelligence',  href: '/dashboard/scenarios',       desc: 'Model consequences of decisions before committing' },
  { icon: Shield,    title: 'Risk Intelligence',      href: '/dashboard/risk',            desc: 'Surface strategic, financial, and operational risks' },
  { icon: DollarSign,title: 'Revenue Intelligence',   href: '/dashboard/revenue',         desc: 'Deep analysis of growth, pipeline, and revenue risks' },
  { icon: Globe,     title: 'Competitive Intel',      href: '/dashboard/competitive',     desc: 'Monitor competitors and market dynamics' },
]

export default function ExecutiveBriefingPage() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>('')
  const [loading, setLoading] = useState(true)
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
      supabase.from('kpis').select('*').eq('organization_id', oid).limit(6),
      supabase.from('insights').select('*').eq('organization_id', oid).order('created_at', { ascending: false }).limit(5),
    ])

    setKpis(kpisRes.data ?? [])
    setInsights(insightsRes.data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  const atRisk = kpis.filter(k => k.status !== 'on_track')
  const unreadInsights = insights.filter(i => !i.is_read)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
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
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#D4A843] mb-1">Executive Briefing</p>
        <h1 className="text-2xl font-bold text-[#0F1E3C]">{orgName || 'Your Organization'}</h1>
        <p className="text-sm text-[#64748B] mt-1">Your AI strategic intelligence overview — updated continuously.</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'KPIs Tracked', value: kpis.length, icon: Target, color: 'text-blue-600 bg-blue-50' },
          { label: 'At Risk / Off Track', value: atRisk.length, icon: AlertCircle, color: atRisk.length > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50' },
          { label: 'Unread Insights', value: unreadInsights.length, icon: Lightbulb, color: 'text-purple-600 bg-purple-50' },
          { label: 'Opportunities', value: 0, icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
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

      {/* AI Engines */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0F1E3C]">AI Intelligence Engines</h2>
            <p className="text-xs text-[#64748B]">Each engine is grounded in your business data.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {engines.map(({ icon: Icon, title, href, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#D4A843]/50 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-[#0F1E3C] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A843] transition-colors duration-300">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#0F1E3C] text-sm mb-1">{title}</p>
                <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPIs at risk */}
        <Card>
          <CardHeader>
            <CardTitle>KPIs Requiring Attention</CardTitle>
            <Link href="/dashboard/kpis"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            {kpis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#64748B] mb-3">No KPIs configured yet.</p>
                <Link href="/dashboard/kpis"><Button variant="secondary" size="sm"><Target className="h-4 w-4" /> Add KPI</Button></Link>
              </div>
            ) : atRisk.length === 0 ? (
              <p className="text-sm text-green-600 text-center py-8 font-medium">All KPIs on track.</p>
            ) : (
              <div className="space-y-3">
                {atRisk.map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[#0F1E3C]">{kpi.name}</p>
                      <p className="text-xs text-[#64748B]">{kpi.category}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                      {kpi.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <Link href="/dashboard/insights"><Button variant="ghost" size="sm">All</Button></Link>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm text-[#64748B]">Insights are generated as you add data and KPIs.</p>
                <Link href="/dashboard/data"><Button variant="secondary" size="sm"><Database className="h-4 w-4" /> Upload Data</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div key={insight.id} className={`p-3 rounded-lg border ${severityColor(insight.severity)}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold">{insight.title}</p>
                      {!insight.is_read && <div className="w-2 h-2 rounded-full bg-current flex-shrink-0 mt-1" />}
                    </div>
                    {insight.description && (
                      <p className="text-xs mt-1 opacity-75 line-clamp-2">{insight.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
