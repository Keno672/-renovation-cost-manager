import { FileCheck2, Pencil } from 'lucide-react'
import { formatCurrency } from '../lib/costs'
import type { Project, WorkItem } from '../types'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'

interface QuotesPageProps { project: Project; onEdit: (item: WorkItem) => void }

export function QuotesPage({ project, onEdit }: QuotesPageProps) {
  const items = project.workItems.filter((item) => item.quotedCost > 0 || ['Quoted', 'Approved', 'Ordered', 'In Progress', 'Complete', 'Paid'].includes(item.status))
  const tradeNames = new Map(project.tradeSections.map((trade) => [trade.id, trade.name]))
  const quoted = items.reduce((sum, item) => sum + item.quotedCost, 0)
  const accepted = items.filter((item) => ['Approved', 'Ordered', 'In Progress', 'Complete', 'Paid'].includes(item.status)).reduce((sum, item) => sum + item.quotedCost, 0)

  return (
    <div>
      <PageHeader eyebrow="Supplier pricing" title="Quotes" description="A focused view of quoted and approved items. Add quote amounts from the schedule editor." />
      <div className="mb-6 grid grid-cols-2 gap-3"><div className="panel p-5"><p className="text-xs font-bold uppercase tracking-wider text-ink/45">Total quoted</p><p className="mt-2 text-2xl font-bold tabular-nums">{formatCurrency(quoted)}</p></div><div className="panel p-5"><p className="text-xs font-bold uppercase tracking-wider text-ink/45">Approved value</p><p className="mt-2 text-2xl font-bold tabular-nums">{formatCurrency(accepted)}</p></div></div>
      {items.length ? <div className="grid gap-3 md:grid-cols-2">{items.map((item) => <article key={item.id} className="panel p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wider text-ink/40">{tradeNames.get(item.tradeSectionId)}</p><h2 className="mt-1 font-semibold">{item.description}</h2></div><button type="button" onClick={() => onEdit(item)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-paper" aria-label={`Edit ${item.description}`}><Pencil size={17} /></button></div><div className="mt-5 flex items-end justify-between border-t border-black/5 pt-4"><div><p className="text-xs text-ink/45">{item.supplierOrContractor || 'Supplier not recorded'}</p><p className="mt-1 text-xl font-bold tabular-nums">{formatCurrency(item.quotedCost)}</p></div><StatusBadge status={item.status} /></div></article>)}</div> : <div className="panel px-5 py-16 text-center"><FileCheck2 className="mx-auto text-ink/25" size={36} /><h2 className="mt-4 font-display text-xl">No quotes recorded</h2><p className="mx-auto mt-1 max-w-md text-sm text-ink/50">When a supplier or contractor sends a price, enter the quoted cost on its schedule item and it will appear here.</p></div>}
    </div>
  )
}
