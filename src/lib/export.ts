import { itemEstimatedTotal } from './costs'
import type { Project } from '../types'

const download = (content: BlobPart, type: string, filename: string): void => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const csvCell = (value: string | number): string => `"${String(value).replaceAll('"', '""')}"`

export function exportProjectJson(project: Project): void {
  download(JSON.stringify(project, null, 2), 'application/json', 'renovation-ledger-backup.json')
}

export function exportProjectCsv(project: Project): void {
  const trades = new Map(project.tradeSections.map((trade) => [trade.id, trade.name]))
  const headings = ['Trade', 'Description', 'Quantity', 'Unit', 'Material estimate', 'Labour estimate', 'Other estimate', 'Estimated total', 'Quoted cost', 'Actual cost', 'Supplier / contractor', 'Status', 'Priority', 'Notes']
  const rows = project.workItems.map((item) => [
    trades.get(item.tradeSectionId) ?? '', item.description, item.quantity, item.unit, item.estimatedMaterialCost,
    item.estimatedLabourCost, item.estimatedOtherCost, itemEstimatedTotal(item), item.quotedCost, item.actualCost,
    item.supplierOrContractor, item.status, item.priority, item.notes,
  ])
  const csv = [headings, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
  download(`\uFEFF${csv}`, 'text/csv;charset=utf-8', 'renovation-cost-schedule.csv')
}
