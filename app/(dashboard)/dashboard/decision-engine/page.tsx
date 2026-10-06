'use client'

import { useState } from 'react'
import { Brain, Send, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StructuredOutput } from '@/components/ai/StructuredOutput'
import type { StructuredAnalysis } from '@/lib/ai/types'

const SUGGESTED = [
  'Should we enter a new market this quarter?',
  'How should we respond to a competitor undercutting our price?',
  'Should we raise prices or focus on volume growth?',
  'What is our highest-leverage growth action right now?',
  'Should we hire more or automate first?',
  'How do we reduce churn without cutting price?',
]

export default function DecisionEnginePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StructuredAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savedCount, setSavedCount] = useState(0)

  const analyze = async (q: string) => {
    if (!q.trim() || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    setSavedCount(0)

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, engine: 'decision' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed')
      setResult(data.analysis)
      setSavedCount(data.recommendations_saved ?? 0)
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
            <Brain className="h-4 w-4 text-[#D4A843]" />
          </div>
          <h1 className="text-xl font-bold text-[#0F1E3C]">AI Decision Engine</h1>
        </div>
        <p className="text-sm text-[#64748B] ml-10">
          Present any business problem, strategic choice, or challenge. The AI analyzes your organization's data, evaluates options with structured reasoning, and recommends a decision.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <label className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2 block">
          What decision do you need to make?
        </label>
        <textarea
          rows={3}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. We're losing deals to a competitor that has just lowered their prices by 25%. Should we match their pricing or differentiate differently?"
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] resize-none bg-[#F8F6F1]"
          disabled={loading}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); analyze(s) }}
                className="text-xs bg-[#F8F6F1] text-[#64748B] px-3 py-1.5 rounded-full hover:bg-[#0F1E3C] hover:text-white transition-colors border border-gray-200"
              >
                {s}
              </button>
            ))}
          </div>
          <Button
            onClick={() => analyze(query)}
            disabled={!query.trim() || loading}
            loading={loading}
            className="flex-shrink-0 ml-3"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{error}</div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#0F1E3C] rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4 text-[#D4A843] animate-pulse" />
            </div>
          </div>
          <p className="text-sm font-semibold text-[#0F1E3C] mb-1">Analyzing your business context…</p>
          <p className="text-xs text-[#64748B]">Loading organizational memory, KPIs, metrics, reasoning through options…</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-[#D4A843] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {savedCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <History className="h-4 w-4" />
              {savedCount} recommendation{savedCount !== 1 ? 's' : ''} saved to your recommendation pipeline.
            </div>
          )}
          <StructuredOutput analysis={result} />
        </>
      )}
    </div>
  )
}
