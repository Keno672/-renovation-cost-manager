import { useState } from 'react'
import { useProject, type WorkItemInput } from '../hooks/useProject'
import type { WorkItem } from '../types'
import type { PageId } from './navigationConfig'
import { Navigation } from './Navigation'
import { ItemEditor } from './ItemEditor'
import { LoadingScreen } from './LoadingScreen'
import { ErrorScreen } from './ErrorScreen'
import { DashboardPage } from '../pages/DashboardPage'
import { SchedulePage } from '../pages/SchedulePage'
import { TradesPage } from '../pages/TradesPage'
import { QuotesPage } from '../pages/QuotesPage'
import { BudgetPage } from '../pages/BudgetPage'
import { SettingsPage } from '../pages/SettingsPage'

interface RenovationWorkspaceProps { userEmail: string; onSignOut: () => void }

export function RenovationWorkspace({ userEmail, onSignOut }: RenovationWorkspaceProps) {
  const { project, syncStatus, error, addItem, updateItem, deleteItem, renameProject, importProject, resetProject } = useProject()
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [selectedTrade, setSelectedTrade] = useState('')
  const [globalEditorItem, setGlobalEditorItem] = useState<WorkItem | null>(null)

  const navigate = (page: PageId): void => {
    if (page !== 'schedule') setSelectedTrade('')
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const openTrade = (tradeId: string): void => { setSelectedTrade(tradeId); setActivePage('schedule'); window.scrollTo(0, 0) }
  const saveGlobalEditor = (input: WorkItemInput): void => {
    if (globalEditorItem) updateItem(globalEditorItem.id, input)
    setGlobalEditorItem(null)
  }

  if (!project && syncStatus === 'loading') return <LoadingScreen label="Loading the shared project…" />
  if (!project) return <ErrorScreen message={error || 'The shared project is unavailable.'} onSignOut={onSignOut} />

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navigation activePage={activePage} projectName={project.name} syncStatus={syncStatus} onNavigate={navigate} />
      {error && <div className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg" role="alert">{error}</div>}
      <main className="mx-auto max-w-[1600px] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:ml-64 lg:px-8 lg:pb-12 xl:px-10">
        {activePage === 'dashboard' && <DashboardPage project={project} onOpenSchedule={() => navigate('schedule')} />}
        {activePage === 'schedule' && <SchedulePage key={selectedTrade || 'all'} project={project} initialTradeId={selectedTrade} onAdd={addItem} onUpdate={updateItem} onDelete={deleteItem} />}
        {activePage === 'trades' && <TradesPage project={project} onOpenTrade={openTrade} />}
        {activePage === 'quotes' && <QuotesPage project={project} onEdit={setGlobalEditorItem} />}
        {activePage === 'budget' && <BudgetPage project={project} />}
        {activePage === 'settings' && <SettingsPage project={project} onRename={renameProject} onImport={importProject} onReset={resetProject} userEmail={userEmail} onSignOut={onSignOut} />}
      </main>
      {globalEditorItem && <ItemEditor item={globalEditorItem} defaultTradeId={globalEditorItem.tradeSectionId} tradeSections={project.tradeSections} onSave={saveGlobalEditor} onClose={() => setGlobalEditorItem(null)} />}
    </div>
  )
}
