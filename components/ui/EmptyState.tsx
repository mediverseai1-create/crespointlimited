import { LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-[#F8F6F1] rounded-2xl flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-[#64748B]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#0F1E3C] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#64748B] max-w-sm mb-6">{description}</p>}
      {actionLabel && (onAction || actionHref) && (
        actionHref ? (
          <a href={actionHref}>
            <Button>{actionLabel}</Button>
          </a>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  )
}
