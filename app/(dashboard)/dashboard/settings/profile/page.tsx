'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types'

const schema = z.object({
  full_name: z.string().min(2, 'Name required'),
  job_title: z.string().optional(),
  phone: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function ProfileSettingsPage() {
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) reset({ full_name: profile.full_name ?? '', job_title: profile.job_title ?? '', phone: profile.phone ?? '' })
    }
    load()
  }, [supabase, reset])

  const onSubmit = async (data: FormData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update(data).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
        <CardContent>
          {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">Profile updated successfully.</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="Jane Smith" error={errors.full_name?.message} {...register('full_name')} />
            <Input label="Job Title" placeholder="Operations Manager" {...register('job_title')} />
            <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" {...register('phone')} />
            <Button type="submit" loading={isSubmitting}>Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
