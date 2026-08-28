'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { severityColor, timeAgo } from '@/lib/utils'
import { Lightbulb, CheckCircle, Plus } from 'lucide-react'
import type { Insight } from '@/types'

const categories = ['all', 'performance', 'risk', 'opportunity', 'trend']
const categoryVariant: Record<string, 'default' | 'danger' | 'success' | 'info' | 'warning'> = {
  performance: 'info', risk: 'danger', opportunity: 'success', trend: 'warning',
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }
    const { data } = await supabase.from('insights').select('*').eq('organization_id', profile.organization_id).order('created_at', { ascending: false })
    setInsights(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const markRead = async (id: string) => {
    await supabase.from('insights').update({ is_read: true }).eq('id', id)
    setInsights(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i))
  }

  const filtered = insights.filter(i =>
    (filter === 'all' || i.category === filter) &&
    (search === '' || i.title.toLowerCase().includes(search.toLowerCase()) || (i.description ?? '').toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize transition-all ${filter === cat ? 'bg-white shadow text-[#0F1E3C] font-medium' : 'text-[#64748B] hover:text-[#0F1E3C]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search insights..."
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A843] w-64"
        />
      </div>

      {loading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No insights yet"
          description="Insights are automatically generated as you add KPIs and business data."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(insight => (
            <Card key={insight.id} className={!insight.is_read ? 'border-l-4 border-l-[#D4A843]' : ''}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${severityColor(insight.severity)}`}>
                  <Lightbulb className="h-4 w-4" />
                </div>
                <CardContent className="flex-1 p-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-[#0F1E3C] text-sm">{insight.title}</h3>
                        {!insight.is_read && <span className="w-2 h-2 rounded-full bg-[#D4A843] flex-shrink-0" />}
                        <Badge variant={categoryVariant[insight.category] ?? 'default'}>{insight.category}</Badge>
                        <Badge variant={insight.severity === 'critical' ? 'danger' : insight.severity === 'warning' ? 'warning' : 'info'}>
                          {insight.severity}
                        </Badge>
                      </div>
                      {insight.description && (
                        <p className="text-sm text-[#64748B] leading-relaxed">{insight.description}</p>
                      )}
                      <p className="text-xs text-[#64748B] mt-2">{timeAgo(insight.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!insight.is_read && (
                        <Button variant="ghost" size="sm" onClick={() => markRead(insight.id)}>
                          <CheckCircle className="h-4 w-4" /> Mark Read
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/actions'}>
                        <Plus className="h-4 w-4" /> Create Action
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
