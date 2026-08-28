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

const schema = z.object({
  name: z.string().min(2, 'Company name required'),
  industry: z.string().optional(),
  country: z.string().optional(),
  size: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const industries = ['Retail & E-commerce', 'Manufacturing', 'Healthcare & Pharma', 'Financial Services', 'Technology & SaaS', 'Logistics & Supply Chain', 'Professional Services', 'Real Estate', 'Other'].map(i => ({ value: i, label: i }))
const sizes = [{ value: '1-10', label: '1–10' }, { value: '11-50', label: '11–50' }, { value: '51-200', label: '51–200' }, { value: '201-500', label: '201–500' }, { value: '500+', label: '500+' }]

export default function OrgSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
      if (!profile?.organization_id) return
      setOrgId(profile.organization_id)
      const { data: org } = await supabase.from('organizations').select('*').eq('id', profile.organization_id).single()
      if (org) reset({ name: org.name, industry: org.industry ?? '', country: org.country ?? '', size: org.size ?? '' })
    }
    load()
  }, [supabase, reset])

  const onSubmit = async (data: FormData) => {
    if (!orgId) return
    await supabase.from('organizations').update(data).eq('id', orgId)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <CardHeader><CardTitle>Organization Settings</CardTitle></CardHeader>
        <CardContent>
          {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">Organization updated successfully.</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Company Name" error={errors.name?.message} {...register('name')} />
            <Select label="Industry" options={industries} placeholder="Select industry..." {...register('industry')} />
            <Input label="Country" placeholder="United States" {...register('country')} />
            <Select label="Company Size" options={sizes} placeholder="Select size..." {...register('size')} />
            <Button type="submit" loading={isSubmitting}>Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
