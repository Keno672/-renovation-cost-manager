import { useState } from 'react'
import { useProject, type WorkItemInput } from './hooks/useProject'
import type { WorkItem } from './types'
import { Navigation } from './components/Navigation'
import type { PageId } from './components/navigationConfig'
import { ItemEditor } from './components/ItemEditor'
import { DashboardPage } from './pages/DashboardPage'
import { SchedulePage } from './pages/SchedulePage'
import { TradesPage } from './pages/TradesPage'
import { QuotesPage } from './pages/QuotesPage'
import { BudgetPage } from './pages/BudgetPage'
import { SettingsPage } from './pages/SettingsPage'

export function App() {
  const { project, addItem, updateItem, deleteItem, renameProject, importProject, resetProject } = useProject()
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

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navigation activePage={activePage} projectName={project.name} onNavigate={navigate} />
      <main className="mx-auto max-w-[1600px] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:ml-64 lg:px-8 lg:pb-12 xl:px-10">
        {activePage === 'dashboard' && <DashboardPage project={project} onOpenSchedule={() => navigate('schedule')} />}
        {activePage === 'schedule' && <SchedulePage key={selectedTrade || 'all'} project={project} initialTradeId={selectedTrade} onAdd={addItem} onUpdate={updateItem} onDelete={deleteItem} />}
        {activePage === 'trades' && <TradesPage project={project} onOpenTrade={openTrade} />}
        {activePage === 'quotes' && <QuotesPage project={project} onEdit={setGlobalEditorItem} />}
        {activePage === 'budget' && <BudgetPage project={project} />}
        {activePage === 'settings' && <SettingsPage project={project} onRename={renameProject} onImport={importProject} onReset={resetProject} />}
      </main>
      {globalEditorItem && <ItemEditor item={globalEditorItem} defaultTradeId={globalEditorItem.tradeSectionId} tradeSections={project.tradeSections} onSave={saveGlobalEditor} onClose={() => setGlobalEditorItem(null)} />}
    </div>
  )
}
