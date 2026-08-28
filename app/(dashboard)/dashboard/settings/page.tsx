import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { User, Building2, Shield, CreditCard, Bell, ChevronRight } from 'lucide-react'

const settingsLinks = [
  { href: '/dashboard/settings/profile', icon: User, title: 'Profile', desc: 'Update your name, job title, and avatar' },
  { href: '/dashboard/settings/organization', icon: Building2, title: 'Organization', desc: 'Manage your organization details and logo' },
  { href: '/dashboard/settings/security', icon: Shield, title: 'Security', desc: 'Change password and manage active sessions' },
  { href: '/dashboard/settings/billing', icon: CreditCard, title: 'Billing & Subscription', desc: 'View your plan, usage, and upgrade options' },
  { href: '/dashboard/settings/notifications', icon: Bell, title: 'Notifications', desc: 'Configure email and in-app notification preferences' },
]

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-3">
      {settingsLinks.map(({ href, icon: Icon, title, desc }) => (
        <Link key={href} href={href}>
          <Card className="hover:border-[#D4A843] hover:shadow-sm transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#F8F6F1] rounded-lg flex items-center justify-center group-hover:bg-[#D4A843]/10 transition-colors">
                <Icon className="h-5 w-5 text-[#0F1E3C]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#0F1E3C]">{title}</p>
                <p className="text-sm text-[#64748B]">{desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#D4A843] transition-colors" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
