import type { LucideIcon } from 'lucide-react'

interface StatCardProps { label: string; value: string; detail?: string; icon: LucideIcon; tone?: 'dark' | 'light' }

export function StatCard({ label, value, detail, icon: Icon, tone = 'light' }: StatCardProps) {
  const dark = tone === 'dark'
  return (
    <article className={`rounded-2xl border p-4 sm:p-5 ${dark ? 'border-evergreen bg-evergreen text-white' : 'border-black/5 bg-white shadow-soft'}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-xs font-bold uppercase tracking-[.1em] ${dark ? 'text-white/60' : 'text-ink/50'}`}>{label}</p>
        <span className={`rounded-lg p-2 ${dark ? 'bg-white/10' : 'bg-paper'}`}><Icon size={17} aria-hidden="true" /></span>
      </div>
      <p className="mt-4 text-2xl font-bold tabular-nums sm:text-[1.75rem]">{value}</p>
      {detail && <p className={`mt-1 text-xs ${dark ? 'text-white/55' : 'text-ink/45'}`}>{detail}</p>}
    </article>
  )
}
