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
import { getInitials, roleColor, timeAgo } from '@/lib/utils'
import { Users, UserPlus, Mail } from 'lucide-react'
import type { OrganizationMember } from '@/types'

const inviteSchema = z.object({
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'manager', 'analyst', 'member', 'viewer']),
})
type InviteForm = z.infer<typeof inviteSchema>

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

export default function TeamPage() {
  const [members, setMembers] = useState<(OrganizationMember & { profiles?: { full_name: string | null; job_title: string | null; avatar_url: string | null } })[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'member' },
  })

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    const oid = profile?.organization_id
    setOrgId(oid ?? null)
    if (!oid) { setLoading(false); return }

    const { data } = await supabase
      .from('organization_members')
      .select('*, profiles(full_name, job_title, avatar_url)')
      .eq('organization_id', oid)
      .order('joined_at', { ascending: false })

    setMembers((data as typeof members) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const onInvite = async (data: InviteForm) => {
    if (!orgId) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('invitations').insert({
      organization_id: orgId,
      email: data.email,
      role: data.role,
      invited_by: user?.id,
    })
    setShowInvite(false)
    reset()
  }

  if (loading) return <TableSkeleton />

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setShowInvite(true)}><UserPlus className="h-4 w-4" />Invite Member</Button>
      </div>

      {members.length === 0 ? (
        <EmptyState icon={Users} title="No team members yet" description="Invite your colleagues to collaborate on business intelligence." actionLabel="Invite Member" onAction={() => setShowInvite(true)} />
      ) : (
        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Member', 'Role', 'Job Title', 'Joined', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(member => {
                const name = member.profiles?.full_name ?? 'Unknown'
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0F1E3C] flex items-center justify-center text-white text-sm font-bold">
                          {getInitials(name)}
                        </div>
                        <div>
                          <p className="font-medium text-[#0F1E3C] text-sm">{name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{member.profiles?.job_title ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">{timeAgo(member.joined_at)}</td>
                    <td className="px-4 py-3">
                      {member.role !== 'owner' && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Remove</Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Team Member">
        <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
          <Input label="Email address" type="email" placeholder="colleague@company.com" error={errors.email?.message} {...register('email')} />
          <Select label="Role" options={roleOptions} error={errors.role?.message} {...register('role')} />
          <div className="bg-[#F8F6F1] rounded-lg p-3 text-xs text-[#64748B] flex items-start gap-2">
            <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
            An invitation email will be sent with instructions to join your organization.
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowInvite(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
