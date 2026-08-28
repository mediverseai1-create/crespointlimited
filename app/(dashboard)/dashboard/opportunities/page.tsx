'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { impactColor, timeAgo } from '@/lib/utils'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { Opportunity } from '@/types'

const statusConfig = {
  identified: { label: 'Identified', variant: 'info' as const },
  in_review: { label: 'In Review', variant: 'warning' as const },
  actioned: { label: 'Actioned', variant: 'success' as const },
  dismissed: { label: 'Dismissed', variant: 'default' as const },
}

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }
    const { data } = await supabase.from('opportunities').select('*').eq('organization_id', profile.organization_id).order('created_at', { ascending: false })
    setOpps(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: Opportunity['status']) => {
    await supabase.from('opportunities').update({ status }).eq('id', id)
    setOpps(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  if (loading) return <TableSkeleton />

  return (
    <div className="space-y-5">
      {opps.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No opportunities identified yet"
          description="Opportunities are surfaced as the AI analyzes your business data and KPIs."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opps.map(opp => (
            <Card key={opp.id} className="group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={statusConfig[opp.status]?.variant}>{statusConfig[opp.status]?.label}</Badge>
                  {opp.category && <Badge>{opp.category}</Badge>}
                </div>
                <div className="flex gap-1">
                  <select
                    value={opp.status}
                    onChange={e => updateStatus(opp.id, e.target.value as Opportunity['status'])}
                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
                  >
                    <option value="identified">Identified</option>
                    <option value="in_review">In Review</option>
                    <option value="actioned">Actioned</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>
              <h3 className="font-semibold text-[#0F1E3C] mb-2">{opp.title}</h3>
              {opp.description && <p className="text-sm text-[#64748B] mb-3 leading-relaxed">{opp.description}</p>}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${impactColor(opp.potential_impact)}`}>
                  Impact: {opp.potential_impact.replace('_', ' ')}
                </span>
                <span className="text-xs text-[#64748B] bg-gray-100 px-2 py-0.5 rounded-full">
                  Effort: {opp.effort_level}
                </span>
                <span className="text-xs text-[#64748B] ml-auto">{timeAgo(opp.created_at)}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => window.location.href = '/dashboard/actions'}>
                  Create Action <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
