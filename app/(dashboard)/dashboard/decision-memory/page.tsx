'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Plus, ChevronDown, ChevronUp, Lightbulb, Target, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { createClient } from '@/lib/supabase/client'

interface DecisionEntry {
  id: string
  created_at: string
  decision: string
  reasoning: string
  outcome: string | null
  lesson: string | null
  status: 'active' | 'resolved' | 'monitoring'
}

export default function DecisionMemoryPage() {
  const [entries, setEntries] = useState<DecisionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState({ decision: '', reasoning: '', outcome: '', lesson: '', status: 'active' as const })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }

    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .eq('action', 'decision_logged')
      .order('created_at', { ascending: false })

    const parsed: DecisionEntry[] = (data ?? []).map((row) => ({
      id: row.id,
      created_at: row.created_at,
      ...(typeof row.metadata === 'object' && row.metadata !== null ? row.metadata as object : {}),
    } as DecisionEntry))
    setEntries(parsed)
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!form.decision.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setSaving(false); return }

    await supabase.from('activity_logs').insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      action: 'decision_logged',
      resource_type: 'decision_memory',
      metadata: {
        decision: form.decision,
        reasoning: form.reasoning,
        outcome: form.outcome || null,
        lesson: form.lesson || null,
        status: form.status,
      },
    })

    setForm({ decision: '', reasoning: '', outcome: '', lesson: '', status: 'active' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  const statusColor: Record<string, string> = {
    active:    'bg-blue-50 text-blue-700 border-blue-200',
    resolved:  'bg-green-50 text-green-700 border-green-200',
    monitoring: 'bg-amber-50 text-amber-700 border-amber-200',
  }

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F1E3C] mb-1">Decision Memory</h1>
          <p className="text-sm text-[#64748B] max-w-xl">
            Log important decisions, the reasoning behind them, outcomes, and lessons learned. CrestPoint uses this history to improve future strategy recommendations.
          </p>
        </div>
        <Button onClick={() => setShowForm(v => !v)} className="flex-shrink-0">
          <Plus className="h-4 w-4" /> Log Decision
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Log a Decision</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Decision made *</label>
              <textarea
                rows={2}
                value={form.decision}
                onChange={e => setForm(f => ({ ...f, decision: e.target.value }))}
                placeholder="e.g. We decided to expand into the UK market in Q4 2024"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Reasoning & assumptions</label>
              <textarea
                rows={3}
                value={form.reasoning}
                onChange={e => setForm(f => ({ ...f, reasoning: e.target.value }))}
                placeholder="Why was this decision made? What data and assumptions informed it?"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Outcome (if known)</label>
                <textarea
                  rows={2}
                  value={form.outcome}
                  onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}
                  placeholder="What actually happened?"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Lesson learned</label>
                <textarea
                  rows={2}
                  value={form.lesson}
                  onChange={e => setForm(f => ({ ...f, lesson: e.target.value }))}
                  placeholder="What would you do differently?"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] resize-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof form.status }))}
                  className="px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] bg-white"
                >
                  <option value="active">Active / In progress</option>
                  <option value="monitoring">Monitoring outcome</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="flex gap-2 mt-5">
                <Button onClick={save} loading={saving} disabled={!form.decision.trim()}>Save Decision</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {entries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No decisions logged yet"
          description="Start logging key decisions to build your organization's strategic memory. CrestPoint will use this history to improve future recommendations."
          actionLabel="Log your first decision"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-[#F8F6F1] transition-colors"
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              >
                <div className="w-9 h-9 bg-[#0F1E3C] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="h-4 w-4 text-[#D4A843]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0F1E3C] text-sm line-clamp-2">{entry.decision}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusColor[entry.status] ?? ''}`}>
                      {entry.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#64748B]">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {expanded === entry.id ? <ChevronUp className="h-4 w-4 text-[#64748B] flex-shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-[#64748B] flex-shrink-0 mt-1" />}
              </button>

              {expanded === entry.id && (
                <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                  {entry.reasoning && (
                    <div>
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">Reasoning & assumptions</p>
                      <p className="text-sm text-[#0F1E3C] leading-relaxed">{entry.reasoning}</p>
                    </div>
                  )}
                  {entry.outcome && (
                    <div>
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">Outcome</p>
                      <p className="text-sm text-[#0F1E3C] leading-relaxed">{entry.outcome}</p>
                    </div>
                  )}
                  {entry.lesson && (
                    <div className="flex items-start gap-3 bg-[#D4A843]/10 rounded-xl p-4">
                      <Lightbulb className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-[#c49a38] mb-1">Lesson learned</p>
                        <p className="text-sm text-[#0F1E3C] leading-relaxed">{entry.lesson}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
