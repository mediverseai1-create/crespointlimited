'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { priorityColor, timeAgo } from '@/lib/utils'
import { CheckSquare, Plus, Calendar } from 'lucide-react'
import type { Action } from '@/types'

const schema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  due_date: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const statuses: Action['status'][] = ['open', 'in_progress', 'completed', 'cancelled']
const statusLabels = { open: 'Open', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' }
const statusVariant: Record<string, 'default' | 'info' | 'success' | 'danger'> = {
  open: 'default', in_progress: 'info', completed: 'success', cancelled: 'danger',
}

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([])
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' },
  })

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const oid = profile?.organization_id
    setOrgId(oid ?? null)
    if (!oid) { setLoading(false); return }
    const { data } = await supabase.from('actions').select('*').eq('organization_id', oid).order('created_at', { ascending: false })
    setActions(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: Action['status']) => {
    await supabase.from('actions').update({ status }).eq('id', id)
    setActions(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const onSubmit = async (data: FormData) => {
    if (!orgId) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('actions').insert({
      ...data,
      organization_id: orgId,
      created_by: user?.id,
      status: 'open',
    })
    setShowForm(false)
    reset()
    load()
  }

  const grouped = statuses.reduce<Record<string, Action[]>>((acc, s) => {
    acc[s] = actions.filter(a => a.status === s)
    return acc
  }, {} as Record<string, Action[]>)

  if (loading) return <TableSkeleton />

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />New Action</Button>
      </div>

      {actions.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No actions yet" description="Create actions from insights or manually to track what your team is working on." actionLabel="Create Action" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map(status => (
            <div key={status}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#0F1E3C]">{statusLabels[status]}</h3>
                <span className="text-xs text-[#64748B] bg-gray-100 px-2 py-0.5 rounded-full">{grouped[status].length}</span>
              </div>
              <div className="space-y-3">
                {grouped[status].length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-[#64748B]">None</p>
                  </div>
                ) : (
                  grouped[status].map(action => (
                    <Card key={action.id} padding="sm" className="group">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                        <Badge variant={statusVariant[action.status]}>{statusLabels[action.status]}</Badge>
                      </div>
                      <p className="text-sm font-medium text-[#0F1E3C] mb-1">{action.title}</p>
                      {action.description && <p className="text-xs text-[#64748B] line-clamp-2 mb-2">{action.description}</p>}
                      {action.due_date && (
                        <div className="flex items-center gap-1 text-xs text-[#64748B] mb-2">
                          <Calendar className="h-3 w-3" />
                          {action.due_date}
                        </div>
                      )}
                      <select
                        value={action.status}
                        onChange={e => updateStatus(action.id, e.target.value as Action['status'])}
                        className="mt-2 text-xs border border-gray-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
                      >
                        {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                      </select>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create Action">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" placeholder="What needs to be done?" error={errors.title?.message} {...register('title')} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#0F1E3C]">Description (optional)</label>
            <textarea rows={3} className="block w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A843] resize-none" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Priority" options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} {...register('priority')} />
            <Input label="Due Date" type="date" {...register('due_date')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">Create Action</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
