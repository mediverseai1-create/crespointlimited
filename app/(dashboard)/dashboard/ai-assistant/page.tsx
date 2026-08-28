'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Database, Target, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED = [
  'What changed this month?',
  'Which area needs most attention?',
  'What are the strongest trends?',
  'Where are we losing efficiency?',
  'What should we prioritize next quarter?',
  'Summarize our KPI performance',
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your CrestPoint AI Business Analyst. I have access to your organization\'s KPIs, business metrics, and insights. Ask me anything about your business performance.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [orgData, setOrgData] = useState<{ kpiCount: number; metricCount: number; insightCount: number } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchContext = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
      if (!profile?.organization_id) return
      const oid = profile.organization_id
      const [k, m, i] = await Promise.all([
        supabase.from('kpis').select('id', { count: 'exact', head: true }).eq('organization_id', oid),
        supabase.from('business_metrics').select('id', { count: 'exact', head: true }).eq('organization_id', oid),
        supabase.from('insights').select('id', { count: 'exact', head: true }).eq('organization_id', oid),
      ])
      setOrgData({ kpiCount: k.count ?? 0, metricCount: m.count ?? 0, insightCount: i.count ?? 0 })
    }
    fetchContext()
  }, [supabase])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response ?? 'I apologize, I was unable to generate a response. Please ensure the AI is configured.',
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please check your configuration and try again.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-[#0F1E3C]' : 'bg-[#D4A843]'}`}>
                {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant' ? 'bg-[#F8F6F1] text-[#0F1E3C]' : 'bg-[#0F1E3C] text-white'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F1E3C] flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-[#F8F6F1] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-[#64748B] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-[#F8F6F1] text-[#64748B] px-3 py-1.5 rounded-full hover:bg-[#0F1E3C] hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about your business performance..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] bg-white"
              disabled={loading}
            />
            <Button onClick={() => send(input)} disabled={!input.trim() || loading} size="md">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <Card className="w-72 flex-shrink-0 h-fit">
        <CardHeader>
          <CardTitle>AI Data Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[#64748B] mb-4">The AI has access to this data from your organization:</p>
          <div className="space-y-3">
            {[
              { icon: Target, label: 'KPIs', value: orgData?.kpiCount ?? 0 },
              { icon: Database, label: 'Metrics', value: orgData?.metricCount ?? 0 },
              { icon: Lightbulb, label: 'Insights', value: orgData?.insightCount ?? 0 },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F8F6F1] rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#0F1E3C]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">{label}</p>
                  <p className="font-semibold text-[#0F1E3C] text-sm">{value} records</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#D4A843]/10 rounded-lg">
            <p className="text-xs text-[#64748B] leading-relaxed">
              The AI only uses your organization&apos;s data. All analysis is private and not shared.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
