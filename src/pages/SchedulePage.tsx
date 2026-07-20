import { useState } from 'react'
import { ListFilter, Plus, Search, X } from 'lucide-react'
import type { WorkItemInput } from '../hooks/useProject'
import { PRIORITIES, STATUSES, type Priority, type Project, type WorkItem, type WorkStatus } from '../types'
import { PageHeader } from '../components/PageHeader'
import { WorkItemCard } from '../components/WorkItemCard'
import { ScheduleTable } from '../components/ScheduleTable'
import { ItemEditor } from '../components/ItemEditor'

interface SchedulePageProps {
  project: Project
  initialTradeId?: string
  onAdd: (item: WorkItemInput) => void
  onUpdate: (id: string, item: WorkItemInput) => void
  onDelete: (id: string) => void
}

const asInput = (item: WorkItem): WorkItemInput => {
  return {
    tradeSectionId: item.tradeSectionId,
    description: item.description,
    notes: item.notes,
    quantity: item.quantity,
    unit: item.unit,
    estimatedMaterialCost: item.estimatedMaterialCost,
    estimatedLabourCost: item.estimatedLabourCost,
    estimatedOtherCost: item.estimatedOtherCost,
    estimatedTotal: item.estimatedTotal,
    quotedCost: item.quotedCost,
    actualCost: item.actualCost,
    supplierOrContractor: item.supplierOrContractor,
    status: item.status,
    priority: item.priority,
  }
}

export function SchedulePage({ project, initialTradeId = '', onAdd, onUpdate, onDelete }: SchedulePageProps) {
  const [search, setSearch] = useState('')
  const [tradeId, setTradeId] = useState(initialTradeId)
  const [status, setStatus] = useState<WorkStatus | ''>('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [editing, setEditing] = useState<WorkItem | 'new' | null>(null)

  const filtered = project.workItems.filter((item) =>
    (!search || item.description.toLocaleLowerCase('en-IE').includes(search.toLocaleLowerCase('en-IE'))) &&
    (!tradeId || item.tradeSectionId === tradeId) &&
    (!status || item.status === status) &&
    (!priority || item.priority === priority),
  )
  const tradeNames = new Map(project.tradeSections.map((trade) => [trade.id, trade.name]))
  const hasFilters = Boolean(search || tradeId || status || priority)

  const remove = (item: WorkItem): void => {
    if (window.confirm(`Delete “${item.description}”? This cannot be undone.`)) onDelete(item.id)
  }
  const setItemStatus = (item: WorkItem, nextStatus: 'Complete' | 'Paid'): void => onUpdate(item.id, { ...asInput(item), status: nextStatus })
  const clearFilters = (): void => { setSearch(''); setTradeId(''); setStatus(''); setPriority('') }
  const closeEditor = (): void => setEditing(null)
  const saveEditor = (input: WorkItemInput): void => {
    if (editing && editing !== 'new') onUpdate(editing.id, input)
    else onAdd(input)
    closeEditor()
  }

  return (
    <div>
      <PageHeader eyebrow="Master schedule" title="Schedule of Works" description="Measure, cost and progress every item in one place. Use the filters to narrow the schedule for a site visit or contractor call." actions={<button type="button" onClick={() => setEditing('new')} className="btn-primary"><Plus size={18} />Add item</button>} />
      <section className="panel mb-5 p-3 sm:p-4" aria-label="Schedule filters">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <label className="relative"><span className="sr-only">Search items</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" size={18} /><input className="field pl-10" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search work items…" /></label>
          <label><span className="sr-only">Filter by trade</span><select className="field" value={tradeId} onChange={(event) => setTradeId(event.target.value)}><option value="">All trades</option>{project.tradeSections.map((trade) => <option key={trade.id} value={trade.id}>{trade.name}</option>)}</select></label>
          <label><span className="sr-only">Filter by status</span><select className="field" value={status} onChange={(event) => setStatus(event.target.value as WorkStatus | '')}><option value="">All statuses</option>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span className="sr-only">Filter by priority</span><select className="field" value={priority} onChange={(event) => setPriority(event.target.value as Priority | '')}><option value="">All priorities</option>{PRIORITIES.map((value) => <option key={value}>{value}</option>)}</select></label>
          {hasFilters ? <button type="button" onClick={clearFilters} className="btn-secondary px-3" aria-label="Clear filters"><X size={18} /><span className="xl:hidden">Clear filters</span></button> : <span className="hidden min-h-11 items-center justify-center text-ink/30 xl:flex"><ListFilter size={18} /></span>}
        </div>
      </section>

      <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</p>{hasFilters && <p className="text-xs text-ink/45">Filtered from {project.workItems.length}</p>}</div>
      {filtered.length ? (
        <><div className="grid gap-3 md:hidden">{filtered.map((item) => <WorkItemCard key={item.id} item={item} tradeName={tradeNames.get(item.tradeSectionId) ?? 'Unassigned'} onEdit={() => setEditing(item)} onDelete={() => remove(item)} onSetStatus={(next) => setItemStatus(item, next)} />)}</div><ScheduleTable items={filtered} trades={project.tradeSections} onEdit={setEditing} onDelete={remove} onSetStatus={setItemStatus} /></>
      ) : (
        <div className="panel px-5 py-14 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mist"><Search size={21} /></span><h2 className="mt-4 font-display text-xl">No matching items</h2><p className="mt-1 text-sm text-ink/50">Try clearing a filter or add a new work item.</p>{hasFilters && <button type="button" onClick={clearFilters} className="btn-secondary mt-5">Clear filters</button>}</div>
      )}

      {editing && <ItemEditor item={editing === 'new' ? null : editing} defaultTradeId={tradeId} tradeSections={project.tradeSections} onSave={saveEditor} onClose={closeEditor} />}
    </div>
  )
}
