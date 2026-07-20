import type { Priority } from '../types'

const styles: Record<Priority, string> = {
  High: 'text-rose-700 before:bg-rose-500',
  Medium: 'text-amber-700 before:bg-amber-500',
  Low: 'text-slate-500 before:bg-slate-400',
}

interface PriorityBadgeProps { priority: Priority }

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <span className={`inline-flex items-center gap-1.5 text-xs font-bold before:h-1.5 before:w-1.5 before:rounded-full ${styles[priority]}`}>{priority}</span>
}
