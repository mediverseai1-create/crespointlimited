'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { timeAgo, getInitials } from '@/lib/utils'
import { Activity } from 'lucide-react'
import type { ActivityLog } from '@/types'

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }
    const { data } = await supabase
      .from('activity_logs')
      .select('*, profiles(full_name)')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false })
      .limit(100)
    setLogs((data as ActivityLog[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  if (loading) return <TableSkeleton />

  return (
    <div className="space-y-4">
      {logs.length === 0 ? (
        <EmptyState icon={Activity} title="No activity yet" description="Activity is recorded as you and your team use CrestPoint." />
      ) : (
        <Card>
          <CardContent>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-0">
                {logs.map((log, i) => {
                  const name = (log as { profiles?: { full_name: string | null } }).profiles?.full_name ?? 'System'
                  return (
                    <div key={log.id} className="flex gap-4 pl-0 py-4">
                      <div className="w-10 h-10 rounded-full bg-[#0F1E3C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 relative">
                        {getInitials(name)}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-sm text-[#0F1E3C]">
                          <span className="font-medium">{name}</span>{' '}
                          <span className="text-[#64748B]">{log.action.replace(/_/g, ' ')}</span>
                          {log.resource_type && (
                            <span className="text-[#64748B]"> ({log.resource_type})</span>
                          )}
                        </p>
                        <p className="text-xs text-[#64748B] mt-0.5">{timeAgo(log.created_at)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
