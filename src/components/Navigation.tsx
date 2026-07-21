import { BarChart3 } from 'lucide-react'
import type { SyncStatus } from '../hooks/useProject'
import { pages, type PageId } from './navigationConfig'
import { SyncIndicator } from './SyncIndicator'

interface NavigationProps { activePage: PageId; projectName: string; syncStatus: SyncStatus; onNavigate: (page: PageId) => void }

export function Navigation({ activePage, projectName, syncStatus, onNavigate }: NavigationProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-evergreen p-5 text-white lg:flex">
        <div className="flex items-center gap-3 px-2 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-clay text-white"><BarChart3 size={21} /></span>
          <div><p className="font-display text-lg leading-none">Renovation</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.19em] text-white/45">Ledger</p></div>
        </div>
        <div className="mt-7 rounded-xl bg-white/7 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/40">Active project</p>
          <p className="mt-1 truncate text-sm font-semibold">{projectName}</p>
        </div>
        <nav className="mt-5 space-y-1" aria-label="Main navigation">
          {pages.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => onNavigate(id)} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition ${activePage === id ? 'bg-white text-evergreen' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={19} aria-hidden="true" /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-white px-3 py-2.5"><SyncIndicator status={syncStatus} /></div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-paper/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-evergreen text-white"><BarChart3 size={19} /></span><div><p className="font-display leading-none">Renovation Ledger</p><p className="mt-1 max-w-40 truncate text-[10px] font-bold uppercase tracking-wider text-ink/40">{projectName}</p></div></div><SyncIndicator status={syncStatus} />
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-black/10 bg-white/95 px-1 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur lg:hidden" aria-label="Mobile navigation">
        {pages.map(({ id, shortLabel, icon: Icon }) => (
          <button key={id} type="button" onClick={() => onNavigate(id)} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-bold ${activePage === id ? 'text-clay' : 'text-ink/45'}`} aria-current={activePage === id ? 'page' : undefined}>
            <Icon size={20} strokeWidth={activePage === id ? 2.5 : 2} /><span>{shortLabel}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
