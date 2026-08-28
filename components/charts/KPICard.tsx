import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'
import type { KPI } from '@/types'

interface KPICardProps {
  kpi: KPI
  onClick?: () => void
}

const statusConfig = {
  on_track: { color: 'text-green-600', bg: 'bg-green-50', label: 'On Track' },
  at_risk: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'At Risk' },
  off_track: { color: 'text-red-600', bg: 'bg-red-50', label: 'Off Track' },
}

export function KPICard({ kpi, onClick }: KPICardProps) {
  const config = statusConfig[kpi.status] ?? statusConfig.on_track
  const progress = kpi.target_value && kpi.current_value
    ? Math.min((kpi.current_value / kpi.target_value) * 100, 100)
    : null

  const progressColor = kpi.status === 'on_track' ? 'bg-green-500'
    : kpi.status === 'at_risk' ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div
      className={cn('bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium">{kpi.category}</p>
          <p className="text-sm font-semibold text-[#0F1E3C] mt-0.5 truncate">{kpi.name}</p>
        </div>
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2', config.color, config.bg)}>
          {config.label}
        </span>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <span className="text-2xl font-bold text-[#0F1E3C]">
          {kpi.current_value != null ? formatNumber(kpi.current_value) : '—'}
        </span>
        {kpi.unit && <span className="text-sm text-[#64748B] mb-0.5">{kpi.unit}</span>}
        {kpi.direction === 'higher_better' ? (
          <TrendingUp className={cn('h-4 w-4 mb-0.5', config.color)} />
        ) : kpi.direction === 'lower_better' ? (
          <TrendingDown className={cn('h-4 w-4 mb-0.5', config.color)} />
        ) : (
          <Minus className="h-4 w-4 mb-0.5 text-gray-400" />
        )}
      </div>

      {kpi.target_value != null && (
        <div>
          <div className="flex justify-between text-xs text-[#64748B] mb-1">
            <span>Target: {formatNumber(kpi.target_value)}{kpi.unit ? ` ${kpi.unit}` : ''}</span>
            {progress != null && <span>{progress.toFixed(0)}%</span>}
          </div>
          {progress != null && (
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', progressColor)}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
