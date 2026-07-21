import type { RealtimeChannel } from '@supabase/supabase-js'
import { createSeedProject } from '../data/seed'
import type { Project } from '../types'
import { isProject } from './projectValidation'
import { supabase } from './supabase'

const SHARED_PROJECT_ID = 'home-renovation'
const TABLE_NAME = 'renovation_projects'

interface ProjectRow {
  id: string
  data: unknown
  revision: number
  updated_at: string
}

function requireClient() {
  if (!supabase) throw new Error('Supabase environment variables are not configured.')
  return supabase
}

export async function loadSharedProject(): Promise<Project> {
  const client = requireClient()
  const { data, error } = await client.from(TABLE_NAME).select('id,data,revision,updated_at').eq('id', SHARED_PROJECT_ID).maybeSingle<ProjectRow>()
  if (error) throw new Error(error.message)

  if (data) {
    if (!isProject(data.data)) throw new Error('The shared project data has an unsupported format.')
    return data.data
  }

  const seed = createSeedProject()
  const { data: created, error: insertError } = await client
    .from(TABLE_NAME)
    .insert({ id: SHARED_PROJECT_ID, data: seed })
    .select('data')
    .single<{ data: unknown }>()

  if (insertError) {
    if (insertError.code === '23505') return loadSharedProject()
    throw new Error(insertError.message)
  }
  if (!isProject(created.data)) throw new Error('The newly created project data is invalid.')
  return created.data
}

export async function saveSharedProject(project: Project): Promise<void> {
  const client = requireClient()
  const { error } = await client
    .from(TABLE_NAME)
    .update({ data: project })
    .eq('id', SHARED_PROJECT_ID)
  if (error) throw new Error(error.message)
}

export function subscribeToSharedProject(onProject: (project: Project) => void): RealtimeChannel {
  const client = requireClient()
  return client
    .channel('shared-renovation-project')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME, filter: `id=eq.${SHARED_PROJECT_ID}` },
      (payload) => {
        const row = payload.new as Partial<ProjectRow>
        if (isProject(row.data)) onProject(row.data)
      },
    )
    .subscribe()
}

export async function unsubscribeFromProject(channel: RealtimeChannel): Promise<void> {
  if (supabase) await supabase.removeChannel(channel)
}
