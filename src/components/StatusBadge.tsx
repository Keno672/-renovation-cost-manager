import type { WorkStatus } from '../types'

const styles: Record<WorkStatus, string> = {
  'To Measure': 'bg-slate-100 text-slate-700',
  'Awaiting Quote': 'bg-amber-100 text-amber-800',
  Quoted: 'bg-sky-100 text-sky-800',
  Approved: 'bg-indigo-100 text-indigo-800',
  Ordered: 'bg-violet-100 text-violet-800',
  'In Progress': 'bg-orange-100 text-orange-800',
  Complete: 'bg-emerald-100 text-emerald-800',
  Paid: 'bg-evergreen text-white',
  'On Hold': 'bg-rose-100 text-rose-800',
}

interface StatusBadgeProps { status: WorkStatus }

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}>{status}</span>
}
