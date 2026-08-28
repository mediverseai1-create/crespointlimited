'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { CardSkeleton } from '@/components/ui/LoadingSpinner'
import { BarChart } from '@/components/charts/BarChart'
import { LineChart } from '@/components/charts/LineChart'
import { AreaChart } from '@/components/charts/AreaChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { formatNumber } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'
import type { BusinessMetric } from '@/types'

const PALETTE = ['#0F1E3C', '#D4A843', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444']

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
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

  const tabs = ['overview', 'revenue', 'operations', 'customers', 'efficiency']

  // Aggregate data by category
  const byCategory = metrics.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + m.value
    return acc
  }, {})

  const donutData = Object.entries(byCategory).map(([name, value], i) => ({
    name, value, color: PALETTE[i % PALETTE.length],
  }))

  // Group by period for time-series
  const byPeriod = metrics.reduce<Record<string, Record<string, number>>>((acc, m) => {
    const key = m.period_start ?? m.created_at.slice(0, 7)
    if (!acc[key]) acc[key] = {}
    acc[key][m.category] = (acc[key][m.category] ?? 0) + m.value
    return acc
  }, {})

  const timeData = Object.entries(byPeriod)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, cats]) => ({ name: period, ...cats }))

  const categories = [...new Set(metrics.map(m => m.category))]

  if (loading) return <div className="grid grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>

  if (metrics.length === 0) {
    return <EmptyState icon={BarChart3} title="No analytics data yet" description="Upload a CSV in the Data Hub to see analytics here." actionLabel="Upload Data" actionHref="/dashboard/data" />
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-[#0F1E3C]' : 'text-[#64748B] hover:text-[#0F1E3C]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(byCategory).slice(0, 4).map(([cat, val], i) => (
          <Card key={cat} padding="sm">
            <p className="text-xs text-[#64748B] mb-1">{cat}</p>
            <p className="text-xl font-bold text-[#0F1E3C]">{formatNumber(val)}</p>
            <div className="mt-2 h-0.5 rounded-full" style={{ background: PALETTE[i] }} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <Card>
          <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={donutData} height={260} />
          </CardContent>
        </Card>

        {/* Time series */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Performance Over Time</CardTitle></CardHeader>
          <CardContent>
            {timeData.length > 0 ? (
              <LineChart
                data={timeData}
                lines={categories.slice(0, 3).map((cat, i) => ({ key: cat, color: PALETTE[i], name: cat }))}
                height={260}
              />
            ) : (
              <EmptyState icon={BarChart3} title="Not enough time-series data" description="Add metrics with period dates to see trends." />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bar chart comparison */}
      <Card>
        <CardHeader><CardTitle>Category Comparison</CardTitle></CardHeader>
        <CardContent>
          <BarChart
            data={Object.entries(byCategory).map(([name, value]) => ({ name, value }))}
            bars={[{ key: 'value', color: '#D4A843' }]}
            height={250}
          />
        </CardContent>
      </Card>
    </div>
  )
}
