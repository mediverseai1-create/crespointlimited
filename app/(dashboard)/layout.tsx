'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import type { Organization, Profile } from '@/types'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/kpis': 'KPI Management',
  '/dashboard/operations': 'Operations',
  '/dashboard/trends': 'Trends',
  '/dashboard/insights': 'Insights',
  '/dashboard/opportunities': 'Opportunities',
  '/dashboard/actions': 'Action Center',
  '/dashboard/reports': 'Reports',
  '/dashboard/ai-assistant': 'AI Assistant',
  '/dashboard/data': 'Data Hub',
  '/dashboard/activity': 'Activity Log',
  '/dashboard/team': 'Team',
  '/dashboard/settings': 'Settings',
  '/dashboard/settings/profile': 'Profile Settings',
  '/dashboard/settings/organization': 'Organization Settings',
  '/dashboard/settings/security': 'Security',
  '/dashboard/settings/billing': 'Billing & Subscription',
  '/dashboard/settings/notifications': 'Notifications',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [org, setOrg] = useState<Organization | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/signin'); return }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profileData)

    if (profileData?.organization_id) {
      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profileData.organization_id)
        .single()
      setOrg(orgData)
    }

    // Redirect to onboarding if not completed
    if (profileData && !profileData.onboarding_completed && !pathname.startsWith('/onboarding')) {
      router.push('/onboarding/profile')
      return
    }

    setLoading(false)
  }, [supabase, router, pathname])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const title = pageTitles[pathname] ?? 'Dashboard'

  if (loading) return <PageLoader />

  return (
    <div className="flex h-screen bg-[#F8F6F1] overflow-hidden">
      <Sidebar org={org} profile={profile} onSignOut={handleSignOut} />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <TopNav title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
