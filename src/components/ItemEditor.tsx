import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { itemEstimatedTotal, formatCurrency } from '../lib/costs'
import type { WorkItemInput } from '../hooks/useProject'
import { PRIORITIES, STATUSES, type TradeSection, type WorkItem } from '../types'

const blankItem = (tradeSectionId: string): WorkItemInput => ({
  tradeSectionId,
  description: '',
  notes: '',
  quantity: 1,
  unit: 'item',
  estimatedMaterialCost: 0,
  estimatedLabourCost: 0,
  estimatedOtherCost: 0,
  estimatedTotal: 0,
  quotedCost: 0,
  actualCost: 0,
  supplierOrContractor: '',
  status: 'Awaiting Quote',
  priority: 'Medium',
})

interface ItemEditorProps {
  item: WorkItem | null
  defaultTradeId: string
  tradeSections: TradeSection[]
  onSave: (input: WorkItemInput) => void
  onClose: () => void
}

type NumericKey = 'quantity' | 'estimatedMaterialCost' | 'estimatedLabourCost' | 'estimatedOtherCost' | 'quotedCost' | 'actualCost'

export function ItemEditor({ item, defaultTradeId, tradeSections, onSave, onClose }: ItemEditorProps) {
  const [form, setForm] = useState<WorkItemInput>(() => item ? { ...item } : blankItem(defaultTradeId || tradeSections[0]?.id || ''))
  const [error, setError] = useState('')

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const setText = (key: keyof WorkItemInput, value: string): void => setForm((current) => ({ ...current, [key]: value }))
  const setNumber = (key: NumericKey, value: string): void => {
    const number = value === '' ? 0 : Number(value)
    setForm((current) => ({ ...current, [key]: Number.isFinite(number) ? Math.max(0, number) : 0 }))
  }

  const submit = (event: FormEvent): void => {
    event.preventDefault()
    if (!form.description.trim()) {
      setError('Add an item description before saving.')
      return
    }
    if (!form.tradeSectionId) {
      setError('Choose a trade section.')
      return
    }
    onSave({ ...form, description: form.description.trim(), unit: form.unit.trim() || 'item' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="item-editor-title" className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-paper shadow-2xl sm:max-w-3xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-paper/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-clay">Schedule item</p>
            <h2 id="item-editor-title" className="font-display text-2xl">{item ? 'Edit work item' : 'Add work item'}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/5" aria-label="Close editor"><X /></button>
        </div>

        <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="label">Item description *</span><input autoFocus className="field" value={form.description} onChange={(event) => setText('description', event.target.value)} placeholder="e.g. Fit utility room flooring" /></label>
            <label><span className="label">Trade section *</span><select className="field" value={form.tradeSectionId} onChange={(event) => setText('tradeSectionId', event.target.value)}>{tradeSections.map((trade) => <option key={trade.id} value={trade.id}>{trade.name}</option>)}</select></label>
            <label><span className="label">Supplier or contractor</span><input className="field" value={form.supplierOrContractor} onChange={(event) => setText('supplierOrContractor', event.target.value)} placeholder="Name or company" /></label>
            <label><span className="label">Quantity</span><input className="field" type="number" min="0" step="any" value={form.quantity} onChange={(event) => setNumber('quantity', event.target.value)} /></label>
            <label><span className="label">Unit</span><input className="field" value={form.unit} onChange={(event) => setText('unit', event.target.value)} placeholder="item, m², hour…" /></label>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-bold text-ink">Cost details</legend>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MoneyField label="Materials estimate" value={form.estimatedMaterialCost} onChange={(value) => setNumber('estimatedMaterialCost', value)} />
              <MoneyField label="Labour estimate" value={form.estimatedLabourCost} onChange={(value) => setNumber('estimatedLabourCost', value)} />
              <MoneyField label="Other estimate" value={form.estimatedOtherCost} onChange={(value) => setNumber('estimatedOtherCost', value)} />
              <div className="rounded-xl bg-evergreen px-4 py-3 text-white"><span className="block text-xs font-bold uppercase tracking-[.08em] text-white/60">Estimated total</span><strong className="mt-1 block text-xl tabular-nums">{formatCurrency(itemEstimatedTotal(form as WorkItem))}</strong></div>
              <MoneyField label="Quoted cost" value={form.quotedCost} onChange={(value) => setNumber('quotedCost', value)} />
              <MoneyField label="Actual cost" value={form.actualCost} onChange={(value) => setNumber('actualCost', value)} />
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label><span className="label">Status</span><select className="field" value={form.status} onChange={(event) => setText('status', event.target.value)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
            <label><span className="label">Priority</span><select className="field" value={form.priority} onChange={(event) => setText('priority', event.target.value)}>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
            <label className="sm:col-span-2"><span className="label">Notes</span><textarea className="field min-h-24 py-3" value={form.notes} onChange={(event) => setText('notes', event.target.value)} placeholder="Measurements, quote details, next steps…" /></label>
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">{error}</p>}
          <div className="sticky bottom-0 flex gap-3 border-t border-black/5 bg-paper py-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{item ? 'Save changes' : 'Add item'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

interface MoneyFieldProps { label: string; value: number; onChange: (value: string) => void }

function MoneyField({ label, value, onChange }: MoneyFieldProps) {
  return <label><span className="label">{label}</span><span className="relative block"><span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/45">€</span><input className="field pl-8 tabular-nums" type="number" min="0" step="0.01" value={value} onChange={(event) => onChange(event.target.value)} /></span></label>
}
