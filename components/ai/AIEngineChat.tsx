'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIEngineChatProps {
  engineName: string
  description: string
  placeholder: string
  suggested: string[]
  contextItems?: { icon: LucideIcon; label: string; value: string }[]
  systemHint?: string
}

export function AIEngineChat({
  engineName,
  description,
  placeholder,
  suggested,
  contextItems,
  systemHint,
}: AIEngineChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: description },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: systemHint }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response ?? 'Unable to generate a response. Please ensure your AI is configured.',
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please check your configuration and try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-[#0F1E3C]' : 'bg-[#D4A843]'}`}>
                {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
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

        <div className="px-4 pb-2">
          <p className="text-xs text-[#64748B] mb-2">Suggested prompts:</p>
          <div className="flex flex-wrap gap-2">
            {suggested.map(s => (
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

        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder={placeholder}
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
      {contextItems && contextItems.length > 0 && (
        <Card className="w-72 flex-shrink-0 h-fit">
          <CardHeader>
            <CardTitle>{engineName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contextItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F8F6F1] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-[#0F1E3C]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">{label}</p>
                    <p className="text-sm font-medium text-[#0F1E3C]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#D4A843]/10 rounded-lg">
              <p className="text-xs text-[#64748B] leading-relaxed">
                The AI uses only your organization&apos;s data. All analysis is private and isolated.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
