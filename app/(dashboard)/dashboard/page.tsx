'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import { KPICard } from '@/components/charts/KPICard'
import { AreaChart } from '@/components/charts/AreaChart'
import { timeAgo, severityColor } from '@/lib/utils'
import {
  Target, Database, FileText, AlertCircle,
  Activity, TrendingUp, Lightbulb
} from 'lucide-react'
import type { KPI, Insight, ActivityLog, BusinessMetric } from '@/types'

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [metrics, setMetrics] = useState<BusinessMetric[]>([])
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const oid = profile?.organization_id
    setOrgId(oid ?? null)
    if (!oid) { setLoading(false); return }

    const [kpisRes, insightsRes, activityRes, metricsRes] = await Promise.all([
      supabase.from('kpis').select('*').eq('organization_id', oid).limit(6),
      supabase.from('insights').select('*').eq('organization_id', oid).order('created_at', { ascending: false }).limit(3),
      supabase.from('activity_logs').select('*').eq('organization_id', oid).order('created_at', { ascending: false }).limit(8),
      supabase.from('business_metrics').select('*').eq('organization_id', oid).order('created_at', { ascending: false }).limit(30),
    ])

    setKpis(kpisRes.data ?? [])
    setInsights(insightsRes.data ?? [])
    setActivity(activityRes.data ?? [])
    setMetrics(metricsRes.data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  // Build chart data from metrics
  const chartData = metrics.reduce<Record<string, Record<string, string | number>>>((acc, m) => {
    const key = m.period_start ?? m.created_at.slice(0, 10)
    if (!acc[key]) acc[key] = { name: key }
    acc[key][m.category] = (Number(acc[key][m.category] ?? 0)) + m.value
    return acc
  }, {})
  const chartArray = Object.values(chartData).slice(0, 10)

  const atRisk = kpis.filter((k) => k.status !== 'on_track')

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
        description="Complete your setup to start monitoring your business performance."
        actionLabel="Complete Setup"
        actionHref="/onboarding/profile"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total KPIs', value: kpis.length, icon: Target, color: 'text-blue-600 bg-blue-50' },
          { label: 'At Risk / Off Track', value: atRisk.length, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
          { label: 'Active Insights', value: insights.filter(i => !i.is_read).length, icon: Lightbulb, color: 'text-purple-600 bg-purple-50' },
          { label: 'Metrics Loaded', value: metrics.length, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
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

      {/* KPIs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#0F1E3C]">Key Performance Indicators</h2>
          <Link href="/dashboard/kpis"><Button variant="ghost" size="sm">View All</Button></Link>
        </div>
        {kpis.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No KPIs yet"
            description="Add your first KPI to start tracking performance."
            actionLabel="Add KPI"
            actionHref="/dashboard/kpis"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <Link href="/dashboard/analytics"><Button variant="ghost" size="sm">Full Analytics</Button></Link>
          </CardHeader>
          <CardContent>
            {chartArray.length === 0 ? (
              <EmptyState icon={TrendingUp} title="No trend data" description="Upload data to see performance trends." />
            ) : (
              <AreaChart
                data={chartArray}
                areas={[{ key: Object.keys(chartArray[0] ?? {}).filter(k => k !== 'name')[0] ?? 'value', color: '#D4A843' }]}
                height={220}
              />
            )}
          </CardContent>
        </Card>

        {/* Insights panel */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <Link href="/dashboard/insights"><Button variant="ghost" size="sm">All</Button></Link>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-8">No insights yet. Insights are generated as you add data.</p>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/kpis"><Button variant="secondary" size="sm"><Target className="h-4 w-4" />Add KPI</Button></Link>
            <Link href="/dashboard/data"><Button variant="outline" size="sm"><Database className="h-4 w-4" />Upload Data</Button></Link>
            <Link href="/dashboard/reports"><Button variant="outline" size="sm"><FileText className="h-4 w-4" />Generate Report</Button></Link>
            <Link href="/dashboard/ai-assistant"><Button variant="outline" size="sm"><Activity className="h-4 w-4" />Ask AI Analyst</Button></Link>
          </div>
        </CardContent>
      </Card>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <Link href="/dashboard/activity"><Button variant="ghost" size="sm">View All</Button></Link>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-sm text-[#64748B] text-center py-4">No activity yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {activity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-3">
                  <div className="w-7 h-7 rounded-full bg-[#0F1E3C]/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-3.5 w-3.5 text-[#0F1E3C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F1E3C] capitalize">{log.action.replace(/_/g, ' ')}</p>
                    {log.resource_type && <p className="text-xs text-[#64748B]">{log.resource_type}</p>}
                  </div>
                  <span className="text-xs text-[#64748B] flex-shrink-0">{timeAgo(log.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
