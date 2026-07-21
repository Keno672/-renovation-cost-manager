import { Check, Cloud, CloudAlert, LoaderCircle } from 'lucide-react'
import type { SyncStatus } from '../hooks/useProject'

interface SyncIndicatorProps { status: SyncStatus }

export function SyncIndicator({ status }: SyncIndicatorProps) {
  const content = status === 'saving'
    ? { label: 'Saving…', icon: LoaderCircle, classes: 'text-amber-700' }
    : status === 'error'
      ? { label: 'Not saved', icon: CloudAlert, classes: 'text-rose-700' }
      : status === 'loading'
        ? { label: 'Loading…', icon: Cloud, classes: 'text-ink/45' }
        : { label: 'All changes saved', icon: Check, classes: 'text-emerald-700' }
  const Icon = content.icon
  return <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${content.classes}`} role="status"><Icon className={status === 'saving' ? 'animate-spin' : ''} size={14} />{content.label}</span>
}
