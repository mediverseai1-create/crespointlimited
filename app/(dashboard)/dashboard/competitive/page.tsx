'use client'

import { useState } from 'react'
import { Globe, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StructuredOutput } from '@/components/ai/StructuredOutput'
import type { StructuredAnalysis } from '@/lib/ai/types'

const SUGGESTED = [
  'Full competitive landscape analysis',
  'A competitor just dropped prices — how do we respond?',
  'What are our key competitive advantages to double down on?',
  'Where are we most vulnerable to competitive attack?',
  'How do we differentiate from our main competitor?',
  'How do we win more of the deals we are losing?',
]

export default function CompetitiveIntelligencePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StructuredAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (q: string) => {
    if (!q.trim() || loading) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, engine: 'competitive' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed')
      setResult(data.analysis)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-[#0F1E3C] rounded-lg flex items-center justify-center">
            <Globe className="h-4 w-4 text-[#D4A843]" />
          </div>
          <h1 className="text-xl font-bold text-[#0F1E3C]">Competitive Intelligence</h1>
        </div>
        <p className="text-sm text-[#64748B] ml-10">
          AI analysis of your competitive landscape, market dynamics, strategic vulnerabilities, and positioning — so you're never caught off-guard.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
          What competitive question do you want answered?
        </label>
        <textarea rows={2} value={query} onChange={e => setQuery(e.target.value)}
          placeholder="e.g. Our main competitor just cut prices by 30% — what is the right strategic response?"
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] resize-none bg-[#F8F6F1]"
          disabled={loading} />
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => { setQuery(s); analyze(s) }}
                className="text-xs bg-[#F8F6F1] text-[#64748B] px-3 py-1.5 rounded-full hover:bg-[#0F1E3C] hover:text-white transition-colors border border-gray-200">
                {s}
              </button>
            ))}
          </div>
          <Button onClick={() => analyze(query)} disabled={!query.trim() || loading} loading={loading} className="ml-3 flex-shrink-0">
            <Send className="h-4 w-4" /> {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{error}</div>}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-sm font-semibold text-[#0F1E3C] mb-1">Analyzing competitive landscape…</p>
          <p className="text-xs text-[#64748B]">Assessing positioning, vulnerabilities, market dynamics…</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-[#D4A843] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
          </div>
        </div>
      )}
      {result && <StructuredOutput analysis={result} />}
    </div>
  )
}
