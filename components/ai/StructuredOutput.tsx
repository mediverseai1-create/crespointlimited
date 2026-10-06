'use client'

import { useState } from 'react'
import { Brain, Shield, Lightbulb, TrendingUp, ArrowRight, ChevronDown, ChevronUp, Target } from 'lucide-react'
import type { StructuredAnalysis } from '@/lib/ai/types'

const priorityColor: Record<string, string> = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high:     'text-orange-600 bg-orange-50 border-orange-200',
  medium:   'text-amber-600 bg-amber-50 border-amber-200',
  low:      'text-gray-600 bg-gray-50 border-gray-200',
}

export function StructuredOutput({ analysis }: { analysis: StructuredAnalysis }) {
  const [showReasoning, setShowReasoning] = useState(false)

  const confidencePct = Math.round((analysis.confidence ?? 0.5) * 100)
  const confidenceColor =
    confidencePct >= 75 ? 'text-green-600 bg-green-50' :
    confidencePct >= 50 ? 'text-amber-600 bg-amber-50' :
    'text-gray-600 bg-gray-50'

  return (
    <div className="space-y-5">
      {/* Summary + confidence */}
      <div className="bg-[#0F1E3C] rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#D4A843]" />
            <span className="text-xs font-bold text-[#D4A843] uppercase tracking-widest">AI Analysis</span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${confidenceColor}`}>
            {confidencePct}% confidence
          </span>
        </div>
        <p className="text-white leading-relaxed text-sm">{analysis.summary}</p>
      </div>

      {/* Reasoning chain */}
      {analysis.reasoning_chain?.length > 0 && (
        <div>
          <button
            onClick={() => setShowReasoning(v => !v)}
            className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F1E3C] transition-colors mb-2"
          >
            {showReasoning ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            View reasoning chain ({analysis.reasoning_chain.length} steps)
          </button>
          {showReasoning && (
            <div className="bg-[#F8F6F1] rounded-xl p-4 space-y-2">
              {analysis.reasoning_chain.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#0F1E3C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#0F1E3C]">{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Key findings */}
      {analysis.key_findings?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#0F1E3C] mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-[#D4A843]" /> Key Findings
          </h3>
          <div className="space-y-2">
            {analysis.key_findings.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#F8F6F1] rounded-xl p-3">
                <ArrowRight className="h-4 w-4 text-[#D4A843] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#0F1E3C]">{f}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#0F1E3C] mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[#D4A843]" /> Recommendations
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.map((r, i) => (
              <div key={i} className={`rounded-xl border p-4 ${priorityColor[r.priority] ?? priorityColor.medium}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm">{r.title}</h4>
                  <span className="text-xs font-bold uppercase tracking-wide opacity-70 flex-shrink-0">{r.priority}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90 mb-2">{r.description}</p>
                <div className="flex flex-wrap gap-3 text-xs opacity-75">
                  {r.expected_impact && <span>Impact: {r.expected_impact}</span>}
                  {r.timeframe && <span>· {r.timeframe}</span>}
                  <span>· {r.effort?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {analysis.risks?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#0F1E3C] mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" /> Risks Identified
          </h3>
          <div className="space-y-3">
            {analysis.risks.map((r, i) => (
              <div key={i} className={`rounded-xl border p-4 ${priorityColor[r.severity] ?? priorityColor.medium}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{r.title}</h4>
                  <span className="text-xs opacity-70 flex-shrink-0">{r.likelihood} likelihood</span>
                </div>
                <p className="text-xs opacity-90 mb-2">{r.description}</p>
                {r.mitigation && (
                  <p className="text-xs opacity-75"><span className="font-semibold">Mitigation:</span> {r.mitigation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {analysis.opportunities?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#0F1E3C] mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" /> Opportunities
          </h3>
          <div className="space-y-3">
            {analysis.opportunities.map((o, i) => (
              <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-green-800 mb-1">{o.title}</h4>
                <p className="text-xs text-green-700 mb-2">{o.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-green-600">
                  {o.potential_impact && <span>Impact: {o.potential_impact}</span>}
                  {o.timeframe && <span>· {o.timeframe}</span>}
                </div>
                {o.required_action && (
                  <div className="mt-2 flex items-start gap-1.5">
                    <ArrowRight className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-700">{o.required_action}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next steps */}
      {analysis.next_steps?.length > 0 && (
        <div className="bg-[#D4A843]/10 border border-[#D4A843]/25 rounded-xl p-4">
          <h3 className="text-sm font-bold text-[#0F1E3C] mb-3">Immediate Next Steps</h3>
          <ol className="space-y-2">
            {analysis.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#0F1E3C]">
                <span className="w-5 h-5 rounded-full bg-[#D4A843] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Data gaps */}
      {analysis.data_gaps?.length > 0 && analysis.data_gaps[0] !== 'Unable to parse structured output — raw analysis above' && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">Data that would improve this analysis</p>
          <ul className="space-y-1">
            {analysis.data_gaps.map((g, i) => (
              <li key={i} className="text-xs text-[#64748B] flex items-start gap-2">
                <span className="text-[#D4A843]">·</span> {g}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
