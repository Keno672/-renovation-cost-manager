import { PRIORITIES, STATUSES, type Project, type WorkItem } from '../types'

const isFiniteNonNegative = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

function isWorkItem(value: unknown): value is WorkItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<WorkItem>
  return (
    typeof item.id === 'string' &&
    typeof item.tradeSectionId === 'string' &&
    typeof item.description === 'string' &&
    typeof item.notes === 'string' &&
    isFiniteNonNegative(item.quantity) &&
    typeof item.unit === 'string' &&
    isFiniteNonNegative(item.estimatedMaterialCost) &&
    isFiniteNonNegative(item.estimatedLabourCost) &&
    isFiniteNonNegative(item.estimatedOtherCost) &&
    isFiniteNonNegative(item.estimatedTotal) &&
    isFiniteNonNegative(item.quotedCost) &&
    isFiniteNonNegative(item.actualCost) &&
    typeof item.supplierOrContractor === 'string' &&
    STATUSES.includes(item.status as WorkItem['status']) &&
    PRIORITIES.includes(item.priority as WorkItem['priority'])
  )
}

export function isProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false
  const project = value as Partial<Project>
  return (
    typeof project.id === 'string' &&
    typeof project.name === 'string' &&
    project.currency === 'EUR' &&
    project.locale === 'en-IE' &&
    typeof project.createdAt === 'string' &&
    typeof project.updatedAt === 'string' &&
    Array.isArray(project.tradeSections) &&
    project.tradeSections.every((trade) =>
      trade && typeof trade.id === 'string' && typeof trade.name === 'string' &&
      typeof trade.colour === 'string' && typeof trade.order === 'number',
    ) &&
    Array.isArray(project.workItems) &&
    project.workItems.every(isWorkItem) &&
    Array.isArray(project.quotes) &&
    Array.isArray(project.suppliers)
  )
}
