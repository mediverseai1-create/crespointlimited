'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { slugify } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  country: z.string().min(1, 'Please enter your country'),
  size: z.string().min(1, 'Please select a company size'),
})
type FormData = z.infer<typeof schema>

const industries = [
  'Retail & E-commerce', 'Manufacturing', 'Healthcare & Pharma', 'Financial Services',
  'Technology & SaaS', 'Logistics & Supply Chain', 'Hospitality & Food Service',
  'Professional Services', 'Real Estate', 'Education', 'Agriculture', 'Other',
].map((i) => ({ value: i, label: i }))

const sizes = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '500+', label: '500+ employees' },
]

export default function OnboardingOrgPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/signin'); return }

    // Create organization
    const slug = slugify(data.name) + '-' + Math.random().toString(36).slice(2, 7)
    const { data: org, error: orgError } = await supabase.from('organizations').insert({
      name: data.name,
      slug,
      industry: data.industry,
      country: data.country,
      size: data.size,
    }).select().single()

    if (orgError) { setError(orgError.message); return }

    // Update profile with org
    await supabase.from('profiles').update({ organization_id: org.id }).eq('id', user.id)

    // Add user as owner member
    await supabase.from('organization_members').insert({
      organization_id: org.id,
      user_id: user.id,
      role: 'owner',
    })

    router.push('/onboarding/goals')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`flex-1 h-1.5 rounded-full ${step <= 2 ? 'bg-[#D4A843]' : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-sm text-[#64748B] mb-1">Step 2 of 3</p>
      <h1 className="text-2xl font-bold text-[#0F1E3C] mb-2">About your organization</h1>
      <p className="text-[#64748B] mb-8">This helps us configure your dashboard and metrics.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
        <Input label="Company name" placeholder="Acme Corporation" error={errors.name?.message} {...register('name')} />
        <Select label="Industry" options={industries} placeholder="Select your industry..." error={errors.industry?.message} {...register('industry')} />
        <Input label="Country" placeholder="United States" error={errors.country?.message} {...register('country')} />
        <Select label="Company size" options={sizes} placeholder="Select company size..." error={errors.size?.message} {...register('size')} />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1" loading={isSubmitting}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
