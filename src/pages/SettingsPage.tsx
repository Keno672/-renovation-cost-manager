import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Download, FileJson, FileSpreadsheet, HardDrive, RotateCcw, Upload } from 'lucide-react'
import { exportProjectCsv, exportProjectJson } from '../lib/export'
import { isProject } from '../lib/storage'
import type { Project } from '../types'
import { PageHeader } from '../components/PageHeader'

interface SettingsPageProps {
  project: Project
  onRename: (name: string) => void
  onImport: (project: Project) => void
  onReset: () => void
}

export function SettingsPage({ project, onRename, onImport, onReset }: SettingsPageProps) {
  const [name, setName] = useState(project.name)
  const [message, setMessage] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const saveName = (event: FormEvent): void => {
    event.preventDefault()
    onRename(name)
    setMessage('Project name saved.')
  }

  const importFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!isProject(parsed)) throw new Error('Invalid project structure')
      onImport(parsed)
      setName(parsed.name)
      setMessage(`Imported ${parsed.workItems.length} schedule items.`)
    } catch {
      setMessage('Import failed. Choose a valid Renovation Ledger JSON backup.')
    }
  }

  const reset = (): void => {
    if (!window.confirm('Reset all project data to the original schedule? Export a backup first if you need your changes.')) return
    onReset()
    setName('Home Renovation')
    setMessage('The original schedule has been restored.')
  }

  return (
    <div>
      <PageHeader eyebrow="Project & data" title="Settings" description="Rename the project, keep a portable backup, or export a cost schedule for printing and sharing." />
      {message && <div className="mb-5 rounded-xl border border-evergreen/10 bg-emerald-50 px-4 py-3 text-sm font-semibold text-evergreen" role="status">{message}</div>}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel p-5 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-paper"><HardDrive size={20} /></span><div><h2 className="font-display text-xl">Project details</h2><p className="text-xs text-ink/45">Stored on this device</p></div></div><form onSubmit={saveName} className="mt-6"><label><span className="label">Project name</span><input className="field" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} /></label><button type="submit" className="btn-primary mt-4">Save project name</button></form><dl className="mt-7 grid grid-cols-2 gap-4 border-t border-black/5 pt-5 text-sm"><div><dt className="text-xs text-ink/45">Schedule items</dt><dd className="mt-1 font-bold">{project.workItems.length}</dd></div><div><dt className="text-xs text-ink/45">Currency & locale</dt><dd className="mt-1 font-bold">Euro · Ireland</dd></div></dl></section>

        <section className="panel p-5 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-paper"><Download size={20} /></span><div><h2 className="font-display text-xl">Export</h2><p className="text-xs text-ink/45">Back up or share your schedule</p></div></div><div className="mt-6 space-y-3"><button type="button" onClick={() => exportProjectJson(project)} className="flex min-h-16 w-full items-center gap-4 rounded-xl border border-black/10 px-4 text-left transition hover:bg-paper"><FileJson className="text-clay" /><span className="flex-1"><strong className="block text-sm">JSON backup</strong><span className="text-xs text-ink/45">Complete project data for later import</span></span><Download size={17} /></button><button type="button" onClick={() => exportProjectCsv(project)} className="flex min-h-16 w-full items-center gap-4 rounded-xl border border-black/10 px-4 text-left transition hover:bg-paper"><FileSpreadsheet className="text-evergreen" /><span className="flex-1"><strong className="block text-sm">CSV cost schedule</strong><span className="text-xs text-ink/45">Printable, spreadsheet-friendly export</span></span><Download size={17} /></button></div></section>

        <section className="panel p-5 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-paper"><Upload size={20} /></span><div><h2 className="font-display text-xl">Import backup</h2><p className="text-xs text-ink/45">Restore a previous JSON export</p></div></div><p className="mt-5 text-sm leading-6 text-ink/55">Importing replaces the project currently stored in this browser. Export a backup first if you need to preserve it.</p><input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={importFile} /><button type="button" onClick={() => fileInput.current?.click()} className="btn-secondary mt-5"><Upload size={17} />Choose JSON file</button></section>

        <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-rose-600"><RotateCcw size={20} /></span><div><h2 className="font-display text-xl">Reset schedule</h2><p className="text-xs text-rose-700/60">This discards local changes</p></div></div><p className="mt-5 text-sm leading-6 text-ink/55">Restore the full original schedule from the brief and reset all costs, notes, contractors and statuses.</p><button type="button" onClick={reset} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-bold text-white hover:bg-rose-800"><RotateCcw size={17} />Reset all project data</button></section>
      </div>
    </div>
  )
}
