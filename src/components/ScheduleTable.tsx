import { Check, CreditCard, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, itemEstimatedTotal } from '../lib/costs'
import type { TradeSection, WorkItem } from '../types'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'

interface ScheduleTableProps {
  items: WorkItem[]
  trades: TradeSection[]
  onEdit: (item: WorkItem) => void
  onDelete: (item: WorkItem) => void
  onSetStatus: (item: WorkItem, status: 'Complete' | 'Paid') => void
}

export function ScheduleTable({ items, trades, onEdit, onDelete, onSetStatus }: ScheduleTableProps) {
  const tradeNames = new Map(trades.map((trade) => [trade.id, trade.name]))
  return (
    <div className="panel hidden overflow-x-auto md:block">
      <table className="w-full min-w-[920px] border-collapse text-left">
        <thead><tr className="border-b border-black/5 bg-mist/35 text-[10px] font-bold uppercase tracking-[.11em] text-ink/45"><th className="px-5 py-3.5">Work item</th><th className="px-3 py-3.5">Trade</th><th className="px-3 py-3.5">Status</th><th className="px-3 py-3.5">Priority</th><th className="px-3 py-3.5 text-right">Estimate</th><th className="px-3 py-3.5 text-right">Quoted</th><th className="px-3 py-3.5 text-right">Actual</th><th className="px-4 py-3.5"><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{items.map((item) => (
          <tr key={item.id} className="border-b border-black/5 last:border-0 hover:bg-paper/70">
            <td className="max-w-xs px-5 py-4"><button type="button" onClick={() => onEdit(item)} className="text-left font-semibold leading-5 hover:text-clay">{item.description}</button><p className="mt-1 text-xs text-ink/40">{item.quantity} {item.unit}{item.supplierOrContractor ? ` · ${item.supplierOrContractor}` : ''}</p></td>
            <td className="max-w-40 px-3 py-4 text-xs font-semibold text-ink/60">{tradeNames.get(item.tradeSectionId)}</td>
            <td className="px-3 py-4"><StatusBadge status={item.status} /></td>
            <td className="px-3 py-4"><PriorityBadge priority={item.priority} /></td>
            <td className="px-3 py-4 text-right text-sm font-semibold tabular-nums">{formatCurrency(itemEstimatedTotal(item))}</td>
            <td className="px-3 py-4 text-right text-sm tabular-nums text-ink/65">{formatCurrency(item.quotedCost)}</td>
            <td className="px-3 py-4 text-right text-sm tabular-nums text-ink/65">{formatCurrency(item.actualCost)}</td>
            <td className="px-3 py-4"><div className="flex justify-end gap-0.5">
              {item.status !== 'Complete' && item.status !== 'Paid' && <button type="button" onClick={() => onSetStatus(item, 'Complete')} className="grid h-9 w-9 place-items-center rounded-lg text-emerald-700 hover:bg-emerald-50" aria-label={`Mark ${item.description} complete`}><Check size={17} /></button>}
              {item.status === 'Complete' && <button type="button" onClick={() => onSetStatus(item, 'Paid')} className="grid h-9 w-9 place-items-center rounded-lg text-evergreen hover:bg-emerald-50" aria-label={`Mark ${item.description} paid`}><CreditCard size={16} /></button>}
              <button type="button" onClick={() => onEdit(item)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-mist" aria-label={`Edit ${item.description}`}><Pencil size={16} /></button>
              <button type="button" onClick={() => onDelete(item)} className="grid h-9 w-9 place-items-center rounded-lg text-rose-600 hover:bg-rose-50" aria-label={`Delete ${item.description}`}><Trash2 size={16} /></button>
            </div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}
