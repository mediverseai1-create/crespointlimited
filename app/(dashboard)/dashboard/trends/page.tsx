'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import { AreaChart } from '@/components/charts/AreaChart'
import { TrendingUp } from 'lucide-react'
import type { BusinessMetric } from '@/types'

const COLORS = ['#D4A843', '#0F1E3C', '#10B981', '#3B82F6', '#8B5CF6']

export default function TrendsPage() {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }
    const { data } = await supabase.from('business_metrics').select('*').eq('organization_id', profile.organization_id).order('period_start', { ascending: true })
    setMetrics(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const categories = [...new Set(metrics.map(m => m.category))]

  const byPeriod = metrics.reduce<Record<string, Record<string, number>>>((acc, m) => {
    const key = m.period_start ?? m.created_at.slice(0, 7)
    if (!acc[key]) acc[key] = {}
    acc[key][m.category] = (acc[key][m.category] ?? 0) + m.value
    return acc
  }, {})

  const timeData: Array<Record<string, string | number>> = Object.entries(byPeriod).sort(([a], [b]) => a.localeCompare(b)).map(([p, cats]) => ({ name: p, ...cats }))

  if (loading) return <div className="grid grid-cols-1 gap-4">{Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}</div>

  if (metrics.length === 0) {
    return <EmptyState icon={TrendingUp} title="No trend data available" description="Upload time-series data to see trends across your business." actionLabel="Upload Data" actionHref="/dashboard/data" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>All Business Trends</CardTitle></CardHeader>
        <CardContent>
          <AreaChart
            data={timeData}
            areas={categories.slice(0, 5).map((cat, i) => ({ key: cat, color: COLORS[i % COLORS.length], name: cat }))}
            height={350}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.slice(0, 4).map((cat, ci) => {
          const catData = timeData.map(d => ({ name: d.name, value: (d[cat] as number) ?? 0 }))
          return (
            <Card key={cat}>
              <CardHeader><CardTitle>{cat}</CardTitle></CardHeader>
              <CardContent>
                <AreaChart data={catData} areas={[{ key: 'value', color: COLORS[ci % COLORS.length] }]} height={180} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
