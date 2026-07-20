import { createSeedProject } from '../data/seed'
import { PRIORITIES, STATUSES, type Project, type WorkItem } from '../types'

const STORAGE_KEY = 'renovation-ledger-project-v1'

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
    Array.isArray(project.tradeSections) &&
    project.tradeSections.every((trade) => trade && typeof trade.id === 'string' && typeof trade.name === 'string') &&
    Array.isArray(project.workItems) &&
    project.workItems.every(isWorkItem) &&
    Array.isArray(project.quotes) &&
    Array.isArray(project.suppliers)
  )
}

export function loadProject(): Project {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return createSeedProject()
    const parsed: unknown = JSON.parse(stored)
    return isProject(parsed) ? parsed : createSeedProject()
  } catch {
    return createSeedProject()
  }
}

export function saveProject(project: Project): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
}

export function clearProject(): void {
  localStorage.removeItem(STORAGE_KEY)
}
