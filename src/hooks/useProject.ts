import { useEffect, useRef, useState } from 'react'
import { createSeedProject } from '../data/seed'
import { itemEstimatedTotal } from '../lib/costs'
import { createId } from '../lib/ids'
import { loadSharedProject, saveSharedProject, subscribeToSharedProject, unsubscribeFromProject } from '../lib/projectRepository'
import type { Project, WorkItem } from '../types'

export type WorkItemInput = Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>
export type SyncStatus = 'loading' | 'saving' | 'saved' | 'error'

export function useProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading')
  const [error, setError] = useState('')
  const isReady = useRef(false)
  const lastSavedJson = useRef('')
  const pendingJson = useRef('')
  const isSaving = useRef(false)

  useEffect(() => {
    let active = true
    let channel: ReturnType<typeof subscribeToSharedProject> | null = null

    const initialise = async (): Promise<void> => {
      try {
        setSyncStatus('loading')
        const loaded = await loadSharedProject()
        if (!active) return
        lastSavedJson.current = JSON.stringify(loaded)
        pendingJson.current = lastSavedJson.current
        setProject(loaded)
        isReady.current = true
        setSyncStatus('saved')
        channel = subscribeToSharedProject((latest) => {
          if (!active || isSaving.current || pendingJson.current !== lastSavedJson.current) return
          lastSavedJson.current = JSON.stringify(latest)
          pendingJson.current = lastSavedJson.current
          setProject(latest)
          setSyncStatus('saved')
        })
      } catch (loadError) {
        if (!active) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load the shared project.')
        setSyncStatus('error')
      }
    }

    void initialise()
    return () => {
      active = false
      isReady.current = false
      if (channel) void unsubscribeFromProject(channel)
    }
  }, [])

  useEffect(() => {
    if (!project || !isReady.current) return
    const serialised = JSON.stringify(project)
    if (serialised === lastSavedJson.current) return

    pendingJson.current = serialised
    setSyncStatus('saving')
    const timeout = window.setTimeout(() => {
      isSaving.current = true
      void saveSharedProject(project)
        .then(() => {
          if (pendingJson.current === serialised) {
            lastSavedJson.current = serialised
            setSyncStatus('saved')
            setError('')
          }
        })
        .catch((saveError: unknown) => {
          setError(saveError instanceof Error ? saveError.message : 'Unable to save the project.')
          setSyncStatus('error')
        })
        .finally(() => {
          isSaving.current = false
        })
    }, 450)

    return () => window.clearTimeout(timeout)
  }, [project])

  const addItem = (input: WorkItemInput): void => {
    const timestamp = new Date().toISOString()
    const normalisedInput = { ...input, estimatedTotal: itemEstimatedTotal(input as WorkItem) }
    setProject((current) => current ? ({
      ...current,
      updatedAt: timestamp,
      workItems: [...current.workItems, { ...normalisedInput, id: createId(), createdAt: timestamp, updatedAt: timestamp }],
    }) : current)
  }

  const updateItem = (id: string, input: WorkItemInput): void => {
    const timestamp = new Date().toISOString()
    const normalisedInput = { ...input, estimatedTotal: itemEstimatedTotal(input as WorkItem) }
    setProject((current) => current ? ({
      ...current,
      updatedAt: timestamp,
      workItems: current.workItems.map((item) => item.id === id ? { ...item, ...normalisedInput, updatedAt: timestamp } : item),
    }) : current)
  }

  const deleteItem = (id: string): void => {
    setProject((current) => current ? ({ ...current, updatedAt: new Date().toISOString(), workItems: current.workItems.filter((item) => item.id !== id) }) : current)
  }

  const renameProject = (name: string): void => {
    setProject((current) => current ? ({ ...current, name: name.trim() || 'Home Renovation', updatedAt: new Date().toISOString() }) : current)
  }

  const importProject = (nextProject: Project): void => setProject({ ...nextProject, id: 'home-renovation', updatedAt: new Date().toISOString() })

  const resetProject = (): void => setProject(createSeedProject())

  return { project, syncStatus, error, addItem, updateItem, deleteItem, renameProject, importProject, resetProject }
}
