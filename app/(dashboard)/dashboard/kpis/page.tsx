'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { LineChart } from '@/components/charts/LineChart'
import { timeAgo, formatNumber } from '@/lib/utils'
import { Target, Plus, Pencil, Trash2, TrendingUp } from 'lucide-react'
import type { KPI, KPIHistory } from '@/types'

const kpiSchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category required'),
  target_value: z.coerce.number().optional(),
  current_value: z.coerce.number().optional(),
  unit: z.string().optional(),
  direction: z.enum(['higher_better', 'lower_better']),
})
type KPIForm = z.infer<typeof kpiSchema>

const statusBadge = { on_track: 'success', at_risk: 'warning', off_track: 'danger' } as const
const statusLabel = { on_track: 'On Track', at_risk: 'At Risk', off_track: 'Off Track' }

const categories = ['Revenue', 'Operations', 'Sales', 'Marketing', 'Finance', 'HR', 'Customer', 'Product', 'General']
  .map(c => ({ value: c, label: c }))

export default function KPIsPage() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [history, setHistory] = useState<Record<string, KPIHistory[]>>({})
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editKpi, setEditKpi] = useState<KPI | null>(null)
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<KPIForm>({
    resolver: zodResolver(kpiSchema),
    defaultValues: { direction: 'higher_better' },
  })

  const loadKpis = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const oid = profile?.organization_id
    setOrgId(oid ?? null)
    if (!oid) { setLoading(false); return }
    const { data } = await supabase.from('kpis').select('*').eq('organization_id', oid).order('created_at', { ascending: false })
    setKpis(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadKpis() }, [loadKpis])

  const loadHistory = async (kpiId: string) => {
    if (history[kpiId]) return
    const { data } = await supabase.from('kpi_history').select('*').eq('kpi_id', kpiId).order('recorded_at', { ascending: true }).limit(30)
    setHistory(prev => ({ ...prev, [kpiId]: data ?? [] }))
  }

  const openEdit = (kpi: KPI) => {
    setEditKpi(kpi)
    reset({
      name: kpi.name,
      description: kpi.description ?? '',
      category: kpi.category,
      target_value: kpi.target_value ?? undefined,
      current_value: kpi.current_value ?? undefined,
      unit: kpi.unit ?? '',
      direction: kpi.direction,
    })
    setShowForm(true)
  }

  const openCreate = () => {
    setEditKpi(null)
    reset({ direction: 'higher_better' })
    setShowForm(true)
  }

  const onSubmit = async (data: KPIForm) => {
    if (!orgId) return
    const { data: { user } } = await supabase.auth.getUser()

    // Auto-compute status
    let status: KPI['status'] = 'on_track'
    if (data.target_value && data.current_value) {
      const pct = (data.current_value / data.target_value) * 100
      if (data.direction === 'higher_better') {
        status = pct >= 90 ? 'on_track' : pct >= 70 ? 'at_risk' : 'off_track'
      } else {
        status = pct <= 110 ? 'on_track' : pct <= 130 ? 'at_risk' : 'off_track'
      }
    }

    if (editKpi) {
      await supabase.from('kpis').update({ ...data, status }).eq('id', editKpi.id)
    } else {
      const { data: newKpi } = await supabase.from('kpis').insert({
        ...data, organization_id: orgId, created_by: user?.id, status,
      }).select().single()
      if (newKpi && data.current_value) {
        await supabase.from('kpi_history').insert({ kpi_id: newKpi.id, value: data.current_value })
      }
    }
    setShowForm(false)
    loadKpis()
  }

  const deleteKpi = async (id: string) => {
    if (!confirm('Delete this KPI?')) return
    await supabase.from('kpis').delete().eq('id', id)
    setKpis(prev => prev.filter(k => k.id !== id))
    if (selectedKpi?.id === id) setSelectedKpi(null)
  }

  const filtered = kpis.filter(k =>
    (!filterStatus || k.status === filterStatus) &&
    (!filterCategory || k.category === filterCategory)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={openCreate}><Plus className="h-4 w-4" />New KPI</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
        >
          <option value="">All statuses</option>
          <option value="on_track">On Track</option>
          <option value="at_risk">At Risk</option>
          <option value="off_track">Off Track</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Target} title="No KPIs found" description="Create your first KPI to start tracking performance." actionLabel="Add KPI" onAction={openCreate} />
      ) : (
        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Name', 'Category', 'Current', 'Target', 'Status', 'Updated', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(kpi => (
                <tr key={kpi.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedKpi(kpi); loadHistory(kpi.id) }}
                      className="text-sm font-medium text-[#0F1E3C] hover:text-[#D4A843] text-left"
                    >
                      {kpi.name}
                    </button>
                    {kpi.description && <p className="text-xs text-[#64748B] truncate max-w-xs">{kpi.description}</p>}
                  </td>
                  <td className="px-4 py-3"><Badge>{kpi.category}</Badge></td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0F1E3C]">
                    {kpi.current_value != null ? `${formatNumber(kpi.current_value)}${kpi.unit ? ' ' + kpi.unit : ''}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">
                    {kpi.target_value != null ? `${formatNumber(kpi.target_value)}${kpi.unit ? ' ' + kpi.unit : ''}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadge[kpi.status]}>{statusLabel[kpi.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{timeAgo(kpi.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(kpi)} className="p-1.5 text-gray-400 hover:text-[#0F1E3C] rounded transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteKpi(kpi.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* KPI Detail Modal */}
      <Modal isOpen={!!selectedKpi} onClose={() => setSelectedKpi(null)} title={selectedKpi?.name ?? ''} size="lg">
        {selectedKpi && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-[#64748B]">Current Value</p>
                <p className="text-xl font-bold text-[#0F1E3C]">
                  {selectedKpi.current_value != null ? formatNumber(selectedKpi.current_value) : '—'} {selectedKpi.unit}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-[#64748B]">Target</p>
                <p className="text-xl font-bold text-[#0F1E3C]">
                  {selectedKpi.target_value != null ? formatNumber(selectedKpi.target_value) : '—'} {selectedKpi.unit}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-[#64748B]">Status</p>
                <Badge variant={statusBadge[selectedKpi.status]}>{statusLabel[selectedKpi.status]}</Badge>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#0F1E3C] mb-2 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" /> Value History
              </h4>
              {(history[selectedKpi.id]?.length ?? 0) === 0 ? (
                <p className="text-sm text-[#64748B] py-4 text-center">No history data recorded yet.</p>
              ) : (
                <LineChart
                  data={(history[selectedKpi.id] ?? []).map(h => ({ name: h.recorded_at.slice(0, 10), value: h.value }))}
                  lines={[{ key: 'value', color: '#D4A843' }]}
                  height={180}
                />
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editKpi ? 'Edit KPI' : 'Create KPI'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="KPI Name" placeholder="e.g., Monthly Revenue" error={errors.name?.message} {...register('name')} />
          <Input label="Description (optional)" placeholder="What does this KPI measure?" {...register('description')} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" options={categories} placeholder="Select..." error={errors.category?.message} {...register('category')} />
            <Select label="Direction" options={[{ value: 'higher_better', label: 'Higher is better' }, { value: 'lower_better', label: 'Lower is better' }]} {...register('direction')} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Current Value" type="number" placeholder="0" {...register('current_value')} />
            <Input label="Target Value" type="number" placeholder="100" {...register('target_value')} />
            <Input label="Unit" placeholder="%, $, hrs..." {...register('unit')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">{editKpi ? 'Save Changes' : 'Create KPI'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
