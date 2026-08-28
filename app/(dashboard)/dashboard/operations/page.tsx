'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import { BarChart } from '@/components/charts/BarChart'
import { LineChart } from '@/components/charts/LineChart'
import { formatNumber } from '@/lib/utils'
import { Cog } from 'lucide-react'
import type { BusinessMetric, KPI } from '@/types'

export default function OperationsPage() {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([])
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }
    const oid = profile.organization_id
    const [metricsRes, kpisRes] = await Promise.all([
      supabase.from('business_metrics').select('*').eq('organization_id', oid).eq('category', 'operations').order('created_at', { ascending: false }).limit(30),
      supabase.from('kpis').select('*').eq('organization_id', oid).eq('category', 'Operations'),
    ])
    setMetrics(metricsRes.data ?? [])
    setKpis(kpisRes.data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>

  const hasData = metrics.length > 0 || kpis.length > 0

  if (!hasData) {
    return <EmptyState icon={Cog} title="No operations data yet" description="Upload operational data or add Operations KPIs to see insights here." actionLabel="Upload Data" actionHref="/dashboard/data" />
  }

  const barData = metrics.slice(0, 10).map(m => ({ name: m.name, value: m.value }))
  const lineData = metrics.map(m => ({ name: m.period_start ?? m.created_at.slice(0, 10), value: m.value }))

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.slice(0, 4).map(kpi => (
            <Card key={kpi.id} padding="sm">
              <p className="text-xs text-[#64748B] mb-1">{kpi.name}</p>
              <p className="text-xl font-bold text-[#0F1E3C]">
                {kpi.current_value != null ? formatNumber(kpi.current_value) : '—'} {kpi.unit}
              </p>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Operations Metrics</CardTitle></CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <BarChart data={barData} bars={[{ key: 'value', color: '#0F1E3C' }]} height={250} />
            ) : (
              <EmptyState icon={Cog} title="No metrics data" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Operations Trend</CardTitle></CardHeader>
          <CardContent>
            {lineData.length > 1 ? (
              <LineChart data={lineData} lines={[{ key: 'value', color: '#D4A843' }]} height={250} />
            ) : (
              <EmptyState icon={Cog} title="Not enough data for trend" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
