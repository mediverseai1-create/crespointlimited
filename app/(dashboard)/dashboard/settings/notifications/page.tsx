'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

const notifSettings = [
  { key: 'email_insights', label: 'New Insights', desc: 'Get notified when new insights are generated', default: true },
  { key: 'email_kpi_alerts', label: 'KPI Alerts', desc: 'Receive alerts when KPIs go off-track', default: true },
  { key: 'email_reports', label: 'Report Ready', desc: 'Notify when a new report is generated', default: false },
  { key: 'email_team', label: 'Team Activity', desc: 'Updates when team members are invited or join', default: false },
  { key: 'email_weekly', label: 'Weekly Summary', desc: 'Weekly digest of your organization performance', default: true },
]

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(notifSettings.map(s => [s.key, s.default]))
  )
  const [saved, setSaved] = useState(false)

  const toggle = (key: string) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }))

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <CardHeader><CardTitle>Email Notifications</CardTitle></CardHeader>
        <CardContent>
          {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">Preferences saved.</div>}
          <div className="divide-y divide-gray-100">
            {notifSettings.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-[#0F1E3C]">{label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => toggle(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${prefs[key] ? 'bg-[#D4A843]' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <Button onClick={save} className="mt-2">Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}
