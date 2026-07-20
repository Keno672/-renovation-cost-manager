import type { CostSummary, WorkItem } from '../types'

export const itemEstimatedTotal = (item: WorkItem): number =>
  item.estimatedMaterialCost + item.estimatedLabourCost + item.estimatedOtherCost

export const itemProjectedCost = (item: WorkItem): number =>
  item.actualCost || item.quotedCost || itemEstimatedTotal(item)

export function calculateSummary(items: WorkItem[]): CostSummary {
  const estimatedTotal = items.reduce((sum, item) => sum + itemEstimatedTotal(item), 0)
  const quotedTotal = items.reduce((sum, item) => sum + item.quotedCost, 0)
  const actualTotal = items.reduce((sum, item) => sum + item.actualCost, 0)
  const projectedTotal = items.reduce((sum, item) => sum + itemProjectedCost(item), 0)
  return {
    estimatedTotal,
    quotedTotal,
    actualTotal,
    remainingProjectedCost: Math.max(0, projectedTotal - actualTotal),
    materialsTotal: items.reduce((sum, item) => sum + item.estimatedMaterialCost, 0),
    labourTotal: items.reduce((sum, item) => sum + item.estimatedLabourCost, 0),
    otherTotal: items.reduce((sum, item) => sum + item.estimatedOtherCost, 0),
    awaitingMeasurement: items.filter((item) => item.status === 'To Measure').length,
    awaitingQuotation: items.filter((item) => item.status === 'Awaiting Quote').length,
    completed: items.filter((item) => item.status === 'Complete' || item.status === 'Paid').length,
  }
}

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)

export const formatNumber = (value: number): string => new Intl.NumberFormat('en-IE').format(value)
