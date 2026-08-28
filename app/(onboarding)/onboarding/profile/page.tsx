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

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  job_title: z.string().min(2, 'Please select a job role'),
  phone: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const jobRoles = [
  { value: 'CEO', label: 'CEO / Founder' },
  { value: 'COO', label: 'COO / Operations Director' },
  { value: 'CFO', label: 'CFO / Finance Director' },
  { value: 'Operations Manager', label: 'Operations Manager' },
  { value: 'Business Owner', label: 'Business Owner' },
  { value: 'Finance Manager', label: 'Finance Manager' },
  { value: 'Department Head', label: 'Department Head' },
  { value: 'Business Analyst', label: 'Business Analyst' },
  { value: 'Other', label: 'Other' },
]

export default function OnboardingProfilePage() {
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

    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: data.full_name,
      job_title: data.job_title,
      phone: data.phone ?? null,
    })

    if (upsertError) { setError(upsertError.message); return }
    router.push('/onboarding/organization')
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`flex-1 h-1.5 rounded-full ${step === 1 ? 'bg-[#D4A843]' : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="text-sm text-[#64748B] mb-1">Step 1 of 3</p>
      <h1 className="text-2xl font-bold text-[#0F1E3C] mb-2">Tell us about yourself</h1>
      <p className="text-[#64748B] mb-8">Help us personalize your CrestPoint experience.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
        <Input label="Full name" placeholder="Jane Smith" error={errors.full_name?.message} {...register('full_name')} />
        <Select
          label="Your role"
          options={jobRoles}
          placeholder="Select your role..."
          error={errors.job_title?.message}
          {...register('job_title')}
        />
        <Input label="Phone number (optional)" type="tel" placeholder="+1 (555) 000-0000" {...register('phone')} />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Continue
        </Button>
      </form>
    </div>
  )
}
