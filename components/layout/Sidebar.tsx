'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BarChart3, Target, Cog, TrendingUp, Lightbulb,
  Sparkles, CheckSquare, FileText, Bot, Database, Users, Activity,
  Settings, ChevronRight, LogOut
} from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Organization, Profile } from '@/types'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'KPIs', href: '/dashboard/kpis', icon: Target },
  { label: 'Operations', href: '/dashboard/operations', icon: Cog },
  { label: 'Trends', href: '/dashboard/trends', icon: TrendingUp },
  { label: 'Insights', href: '/dashboard/insights', icon: Lightbulb },
  { label: 'Opportunities', href: '/dashboard/opportunities', icon: Sparkles },
  { label: 'Actions', href: '/dashboard/actions', icon: CheckSquare },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  { label: 'Data', href: '/dashboard/data', icon: Database },
  { label: 'Activity', href: '/dashboard/activity', icon: Activity },
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const planLabels: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  growth: 'Growth',
  business: 'Business',
}

interface SidebarProps {
  org: Organization | null
  profile: Profile | null
  onSignOut: () => void
}

export function Sidebar({ org, profile, onSignOut }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-[#0F1E3C] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Logo href="/dashboard" size="md" showText />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-[#D4A843] text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className={cn('h-4 w-4 flex-shrink-0', active ? 'text-white' : 'text-white/50 group-hover:text-white')} />
              {label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
            </Link>
          )
        })}
      </nav>

      {/* Org Info + User */}
      <div className="px-3 py-4 border-t border-white/10 space-y-3">
        {org && (
          <div className="px-3 py-2 bg-white/5 rounded-lg">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Organization</p>
            <p className="text-sm font-medium text-white truncate">{org.name}</p>
            <Badge variant="amber" className="mt-1 text-xs">
              {planLabels[org.plan] ?? org.plan}
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-[#D4A843] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{profile?.full_name ?? 'User'}</p>
            <p className="text-xs text-white/50 truncate">{profile?.job_title ?? 'Member'}</p>
          </div>
          <button
            onClick={onSignOut}
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
