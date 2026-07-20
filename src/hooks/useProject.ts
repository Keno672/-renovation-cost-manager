import { useEffect, useState } from 'react'
import { createSeedProject } from '../data/seed'
import { createId } from '../lib/ids'
import { itemEstimatedTotal } from '../lib/costs'
import { clearProject, loadProject, saveProject } from '../lib/storage'
import type { Project, WorkItem } from '../types'

export type WorkItemInput = Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>

export function useProject() {
  const [project, setProject] = useState<Project>(loadProject)

  useEffect(() => saveProject(project), [project])

  const addItem = (input: WorkItemInput): void => {
    const timestamp = new Date().toISOString()
    const normalisedInput = { ...input, estimatedTotal: itemEstimatedTotal(input as WorkItem) }
    setProject((current) => ({
      ...current,
      updatedAt: timestamp,
      workItems: [...current.workItems, { ...normalisedInput, id: createId(), createdAt: timestamp, updatedAt: timestamp }],
    }))
  }

  const updateItem = (id: string, input: WorkItemInput): void => {
    const timestamp = new Date().toISOString()
    const normalisedInput = { ...input, estimatedTotal: itemEstimatedTotal(input as WorkItem) }
    setProject((current) => ({
      ...current,
      updatedAt: timestamp,
      workItems: current.workItems.map((item) => item.id === id ? { ...item, ...normalisedInput, updatedAt: timestamp } : item),
    }))
  }

  const deleteItem = (id: string): void => {
    setProject((current) => ({ ...current, updatedAt: new Date().toISOString(), workItems: current.workItems.filter((item) => item.id !== id) }))
  }

  const renameProject = (name: string): void => {
    setProject((current) => ({ ...current, name: name.trim() || 'Home Renovation', updatedAt: new Date().toISOString() }))
  }

  const importProject = (nextProject: Project): void => setProject({ ...nextProject, updatedAt: new Date().toISOString() })

  const resetProject = (): void => {
    clearProject()
    setProject(createSeedProject())
  }

  return { project, addItem, updateItem, deleteItem, renameProject, importProject, resetProject }
}
