'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Check, Zap } from 'lucide-react'
import type { Organization } from '@/types'

const PLANS = [
  { id: 'free', name: 'Free', price: '$0/mo', features: ['5 KPIs', '1 user', 'Basic dashboard'], href: null },
  { id: 'starter', name: 'Starter', price: '$47/mo', features: ['25 KPIs', '3 users', 'AI Assistant'], href: process.env.NEXT_PUBLIC_APP_URL },
  { id: 'professional', name: 'Professional', price: '$57/mo', features: ['Unlimited KPIs', '10 users', 'All features'], href: process.env.NEXT_PUBLIC_APP_URL },
  { id: 'business', name: 'Business', price: '$97/mo', features: ['Unlimited everything', 'Dedicated CSM', 'API access'], href: process.env.NEXT_PUBLIC_APP_URL },
]

export default function BillingPage() {
  const [org, setOrg] = useState<Organization | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
      if (!profile?.organization_id) return
      const { data: orgData } = await supabase.from('organizations').select('*').eq('id', profile.organization_id).single()
      setOrg(orgData)
    }
    load()
  }, [supabase])

  return (
    <div className="max-w-2xl space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-[#0F1E3C] capitalize">{org?.plan ?? 'Free'}</p>
              <p className="text-sm text-[#64748B] mt-1">Status: <span className="capitalize">{org?.plan_status ?? 'active'}</span></p>
            </div>
            <Badge variant={org?.plan === 'free' ? 'default' : 'amber'} className="text-base px-4 py-1.5">
              {org?.plan?.toUpperCase() ?? 'FREE'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h3 className="text-base font-semibold text-[#0F1E3C] mb-4">Available Plans</h3>
        <div className="grid grid-cols-2 gap-4">
          {PLANS.map(plan => {
            const isCurrent = org?.plan === plan.id
            return (
              <Card key={plan.id} className={isCurrent ? 'border-[#D4A843]' : ''} padding="sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-[#0F1E3C]">{plan.name}</h4>
                  {isCurrent && <Badge variant="amber" className="text-xs">Current</Badge>}
                </div>
                <p className="text-lg font-bold text-[#0F1E3C] mb-3">{plan.price}</p>
                <ul className="space-y-1 mb-4">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <Check className="h-3 w-3 text-[#D4A843]" />{f}
                    </li>
                  ))}
                </ul>
                {!isCurrent && plan.href && (
                  <a href={plan.href} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">
                      <Zap className="h-4 w-4" />Upgrade
                    </Button>
                  </a>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <Card>
        <CardContent>
          <p className="text-sm text-[#64748B]">
            Need help with billing? Contact us at{' '}
            <a href="mailto:billing@crestpointlimited.click" className="text-[#D4A843] hover:underline">
              billing@crestpointlimited.click
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
