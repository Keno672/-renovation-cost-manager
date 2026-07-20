import { Banknote, CircleCheckBig, ClipboardClock, FileCheck2, Hammer, PackageOpen, Ruler, TrendingUp, WalletCards } from 'lucide-react'
import { calculateSummary, formatCurrency, itemProjectedCost } from '../lib/costs'
import type { Project } from '../types'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'

interface DashboardPageProps { project: Project; onOpenSchedule: () => void }

export function DashboardPage({ project, onOpenSchedule }: DashboardPageProps) {
  const summary = calculateSummary(project.workItems)
  const tradeTotals = project.tradeSections.map((trade) => ({
    ...trade,
    value: project.workItems.filter((item) => item.tradeSectionId === trade.id).reduce((sum, item) => sum + itemProjectedCost(item), 0),
  })).sort((a, b) => b.value - a.value)
  const largest = Math.max(...tradeTotals.map((trade) => trade.value), 1)

  return (
    <div>
      <PageHeader eyebrow="Project overview" title="A clear view of every euro." description={`${project.workItems.length} schedule items across ${project.tradeSections.length} trade sections. Costs update as you add estimates, quotes and payments.`} actions={<button type="button" onClick={onOpenSchedule} className="btn-primary">View schedule</button>} />

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Cost summary">
        <StatCard label="Current estimate" value={formatCurrency(summary.estimatedTotal)} detail="Materials, labour & other" icon={TrendingUp} tone="dark" />
        <StatCard label="Confirmed quotes" value={formatCurrency(summary.quotedTotal)} detail="Quoted across all items" icon={FileCheck2} />
        <StatCard label="Actual spend" value={formatCurrency(summary.actualTotal)} detail="Recorded project spend" icon={Banknote} />
        <StatCard label="Remaining projected" value={formatCurrency(summary.remainingProjectedCost)} detail="Quote or estimate less spend" icon={WalletCards} />
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Materials" value={formatCurrency(summary.materialsTotal)} icon={PackageOpen} />
        <StatCard label="Labour" value={formatCurrency(summary.labourTotal)} icon={Hammer} />
        <StatCard label="To measure" value={String(summary.awaitingMeasurement)} icon={Ruler} />
        <StatCard label="Awaiting quote" value={String(summary.awaitingQuotation)} icon={ClipboardClock} />
        <div className="col-span-2 sm:col-span-1"><StatCard label="Completed" value={String(summary.completed)} icon={CircleCheckBig} /></div>
      </section>

      <section className="panel mt-6 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-clay">Projected cost</p><h2 className="mt-1 font-display text-2xl">Breakdown by trade</h2></div><p className="hidden text-xs text-ink/45 sm:block">Actual → quote → estimate</p></div>
        {tradeTotals.every((trade) => trade.value === 0) ? (
          <div className="mt-8 rounded-xl border border-dashed border-black/15 px-5 py-9 text-center"><p className="font-semibold">No costs entered yet</p><p className="mt-1 text-sm text-ink/50">Open the schedule and add an estimate or quote to see the breakdown.</p></div>
        ) : (
          <div className="mt-7 space-y-4">
            {tradeTotals.filter((trade) => trade.value > 0).map((trade) => (
              <div key={trade.id} className="grid grid-cols-[minmax(110px,1fr)_2fr_auto] items-center gap-3">
                <p className="truncate text-sm font-semibold">{trade.name}</p>
                <div className="h-2.5 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full" style={{ width: `${Math.max(3, trade.value / largest * 100)}%`, backgroundColor: trade.colour }} /></div>
                <p className="w-20 text-right text-sm font-bold tabular-nums">{formatCurrency(trade.value)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
