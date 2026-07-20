import { CalendarRange, ClipboardList, FileText, LayoutDashboard, Settings, WalletCards, type LucideIcon } from 'lucide-react'

export type PageId = 'dashboard' | 'schedule' | 'trades' | 'quotes' | 'budget' | 'settings'

export const pages: { id: PageId; label: string; shortLabel: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule of Works', shortLabel: 'Schedule', icon: ClipboardList },
  { id: 'trades', label: 'Trade Sections', shortLabel: 'Trades', icon: CalendarRange },
  { id: 'quotes', label: 'Quotes', shortLabel: 'Quotes', icon: FileText },
  { id: 'budget', label: 'Budget', shortLabel: 'Budget', icon: WalletCards },
  { id: 'settings', label: 'Settings', shortLabel: 'More', icon: Settings },
]
