'use client'

import { useState } from 'react'
import { Check, X, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Rec {
  id: string
  title: string
  summary: string
  priority: string
  effort: string
  expected_impact: string
  timeframe: string
  confidence: number
  engine: string
  status: string
  created_at: string
}

interface Props {
  rec: Rec
  onFeedback?: (id: string, status: 'accepted' | 'rejected' | 'deferred') => Promise<void>
  showActions?: boolean
}

const priorityStyles: Record<string, string> = {
  critical: 'bg-red-50 text-red-700 border-red-200',
  high:     'bg-orange-50 text-orange-700 border-orange-200',
  medium:   'bg-amber-50 text-amber-700 border-amber-200',
  low:      'bg-gray-50 text-gray-600 border-gray-200',
}

const effortLabel: Record<string, string> = {
  quick_win:   'Quick win',
  medium_term: 'Medium-term',
  long_term:   'Long-term',
}

const statusStyles: Record<string, string> = {
  pending:   'bg-blue-50 text-blue-600',
  accepted:  'bg-green-50 text-green-700',
  rejected:  'bg-gray-50 text-gray-500',
  deferred:  'bg-purple-50 text-purple-600',
  completed: 'bg-teal-50 text-teal-700',
}

export function RecommendationCard({ rec, onFeedback, showActions = true }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [acting, setActing] = useState(false)

  const act = async (status: 'accepted' | 'rejected' | 'deferred') => {
    if (!onFeedback || acting) return
    setActing(true)
    await onFeedback(rec.id, status)
    setActing(false)
  }

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${
      rec.priority === 'critical' ? 'border-red-200' :
      rec.priority === 'high' ? 'border-orange-200' : 'border-gray-200'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${priorityStyles[rec.priority] ?? priorityStyles.medium}`}>
                {rec.priority}
              </span>
              <span className="text-xs text-[#64748B] font-medium">{effortLabel[rec.effort] ?? rec.effort}</span>
              <span className="text-xs text-[#64748B]">·</span>
              <span className="text-xs text-[#64748B]">{rec.engine.replace(/_/g, ' ')}</span>
              {rec.confidence && (
                <>
                  <span className="text-xs text-[#64748B]">·</span>
                  <span className="text-xs text-[#64748B]">{Math.round(rec.confidence * 100)}% confidence</span>
                </>
              )}
            </div>
            <h3 className="font-semibold text-[#0F1E3C] text-sm leading-snug">{rec.title}</h3>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed line-clamp-2">{rec.summary}</p>
          </div>

          {rec.status !== 'pending' && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyles[rec.status]}`}>
              {rec.status}
            </span>
          )}

          <button
            onClick={() => setExpanded(v => !v)}
            className="text-[#64748B] hover:text-[#0F1E3C] transition-colors flex-shrink-0"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            {rec.expected_impact && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1">Expected impact</p>
                <p className="text-sm text-[#0F1E3C]">{rec.expected_impact}</p>
              </div>
            )}
            {rec.timeframe && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#D4A843]" />
                <p className="text-xs text-[#64748B]"><span className="font-semibold">Timeframe:</span> {rec.timeframe}</p>
              </div>
            )}
          </div>
        )}

        {showActions && rec.status === 'pending' && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <Button
              size="sm"
              onClick={() => act('accepted')}
              loading={acting}
              className="flex-1"
            >
              <Check className="h-3.5 w-3.5" /> Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => act('deferred')}
              disabled={acting}
            >
              <Clock className="h-3.5 w-3.5" /> Later
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => act('rejected')}
              disabled={acting}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
