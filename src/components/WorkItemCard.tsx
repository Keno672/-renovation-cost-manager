import { Check, CreditCard, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, itemEstimatedTotal } from '../lib/costs'
import type { WorkItem } from '../types'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'

interface WorkItemCardProps {
  item: WorkItem
  tradeName: string
  onEdit: () => void
  onDelete: () => void
  onSetStatus: (status: 'Complete' | 'Paid') => void
}

export function WorkItemCard({ item, tradeName, onEdit, onDelete, onSetStatus }: WorkItemCardProps) {
  const displayCost = item.actualCost || item.quotedCost || itemEstimatedTotal(item)
  const costLabel = item.actualCost ? 'Actual' : item.quotedCost ? 'Quoted' : 'Estimate'
  return (
    <article className="panel overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.09em] text-ink/40">{tradeName}</p><h3 className="mt-1 font-semibold leading-5">{item.description}</h3></div>
        <PriorityBadge priority={item.priority} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status={item.status} /><span className="text-xs text-ink/45">{item.quantity} {item.unit}</span>{item.supplierOrContractor && <span className="truncate text-xs text-ink/45">· {item.supplierOrContractor}</span>}</div>
      <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-4">
        <div><p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">{costLabel}</p><p className="text-xl font-bold tabular-nums">{formatCurrency(displayCost)}</p></div>
        <div className="flex gap-1">
          {item.status !== 'Complete' && item.status !== 'Paid' && <button type="button" onClick={() => onSetStatus('Complete')} className="grid h-11 w-11 place-items-center rounded-xl text-emerald-700 hover:bg-emerald-50" aria-label={`Mark ${item.description} complete`}><Check size={19} /></button>}
          {item.status === 'Complete' && <button type="button" onClick={() => onSetStatus('Paid')} className="grid h-11 w-11 place-items-center rounded-xl text-evergreen hover:bg-emerald-50" aria-label={`Mark ${item.description} paid`}><CreditCard size={18} /></button>}
          <button type="button" onClick={onEdit} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-mist/60" aria-label={`Edit ${item.description}`}><Pencil size={18} /></button>
          <button type="button" onClick={onDelete} className="grid h-11 w-11 place-items-center rounded-xl text-rose-600 hover:bg-rose-50" aria-label={`Delete ${item.description}`}><Trash2 size={18} /></button>
        </div>
      </div>
    </article>
  )
}
