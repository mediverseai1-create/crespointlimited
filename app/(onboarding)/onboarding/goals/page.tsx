'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

const goalAreas = [
  { id: 'revenue', label: 'Revenue & Profitability', desc: 'Track income, margins, and financial performance' },
  { id: 'operations', label: 'Operations', desc: 'Monitor efficiency, capacity, and process metrics' },
  { id: 'sales', label: 'Sales & Customers', desc: 'Track pipeline, conversion, and customer metrics' },
  { id: 'expenses', label: 'Expenses & Cost Control', desc: 'Monitor spending and identify savings opportunities' },
  { id: 'workforce', label: 'Workforce & HR', desc: 'Track headcount, productivity, and team performance' },
  { id: 'supply_chain', label: 'Supply Chain', desc: 'Monitor inventory, logistics, and supplier metrics' },
  { id: 'risks', label: 'Risks & Compliance', desc: 'Identify and track business risks and compliance status' },
]

export default function OnboardingGoalsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [objective, setObjective] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const handleSubmit = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/signin'); return }

    // Mark onboarding complete
    await supabase.from('profiles').update({
      onboarding_completed: true,
    }).eq('id', user.id)

    // Log activity (best-effort)
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (profile?.organization_id) {
      await supabase.from('activity_logs').insert({
        organization_id: profile.organization_id,
        user_id: user.id,
        action: 'completed_onboarding',
        resource_type: 'organization',
        metadata: { areas: selected, objective },
      })
    }

    router.push('/dashboard')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex-1 h-1.5 rounded-full bg-[#D4A843]" />
        ))}
      </div>
      <p className="text-sm text-[#64748B] mb-1">Step 3 of 3</p>
      <h1 className="text-2xl font-bold text-[#0F1E3C] mb-2">What will you monitor?</h1>
      <p className="text-[#64748B] mb-8">Select the areas most important to your business. You can always adjust later.</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {goalAreas.map(({ id, label, desc }) => (
            <label
              key={id}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selected.includes(id)
                  ? 'border-[#D4A843] bg-[#D4A843]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(id)}
                onChange={() => toggle(id)}
                className="mt-0.5 accent-amber-500"
              />
              <div>
                <p className="font-medium text-[#0F1E3C] text-sm">{label}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F1E3C] mb-2">
            Primary objective (optional)
          </label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            placeholder="e.g., Reduce operational costs by 15% while growing revenue by 20% this year..."
            className="block w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-[#0F1E3C] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-[#D4A843] resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1">
            Back
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            loading={loading}
            className="flex-1"
            disabled={selected.length === 0}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
