import { ArrowRight, CheckCircle2, Clock3 } from 'lucide-react'
import { formatCurrency, itemEstimatedTotal } from '../lib/costs'
import type { Project } from '../types'
import { PageHeader } from '../components/PageHeader'

interface TradesPageProps { project: Project; onOpenTrade: (tradeId: string) => void }

export function TradesPage({ project, onOpenTrade }: TradesPageProps) {
  return (
    <div>
      <PageHeader eyebrow="By contractor" title="Trade Sections" description="Each section rolls up its schedule, quotes and spend so you can prepare conversations trade by trade." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {project.tradeSections.map((trade) => {
          const items = project.workItems.filter((item) => item.tradeSectionId === trade.id)
          const estimated = items.reduce((sum, item) => sum + itemEstimatedTotal(item), 0)
          const quoted = items.reduce((sum, item) => sum + item.quotedCost, 0)
          const actual = items.reduce((sum, item) => sum + item.actualCost, 0)
          const completed = items.filter((item) => item.status === 'Complete' || item.status === 'Paid').length
          return (
            <article key={trade.id} className="panel overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: trade.colour }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.11em] text-ink/40">{items.length} items</p><h2 className="mt-1 font-display text-xl leading-6">{trade.name}</h2></div><button type="button" onClick={() => onOpenTrade(trade.id)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper text-evergreen transition hover:bg-mist" aria-label={`Open ${trade.name}`}><ArrowRight size={19} /></button></div>
                <dl className="mt-6 grid grid-cols-3 gap-2 border-y border-black/5 py-4"><div><dt className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Estimate</dt><dd className="mt-1 text-sm font-bold tabular-nums">{formatCurrency(estimated)}</dd></div><div><dt className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Quoted</dt><dd className="mt-1 text-sm font-bold tabular-nums">{formatCurrency(quoted)}</dd></div><div><dt className="text-[10px] font-bold uppercase tracking-wider text-ink/40">Actual</dt><dd className="mt-1 text-sm font-bold tabular-nums">{formatCurrency(actual)}</dd></div></dl>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold"><span className="flex items-center gap-1.5 text-amber-700"><Clock3 size={15} />{items.length - completed} outstanding</span><span className="flex items-center gap-1.5 text-emerald-700"><CheckCircle2 size={15} />{completed} complete</span></div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
