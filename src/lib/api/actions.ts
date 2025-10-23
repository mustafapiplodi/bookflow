import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Action = Database['public']['Tables']['actions']['Row']
type ActionInsert = Database['public']['Tables']['actions']['Insert']
type ActionUpdate = Database['public']['Tables']['actions']['Update']

export interface ActionWithNote extends Action {
  note: {
    content: string
    books: {
      title: string
    } | null
  }
}

export async function getActions(): Promise<ActionWithNote[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('actions')
    .select(
      `
      *,
      note:notes (
        content,
        books (
          title
        )
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as ActionWithNote[]
}

export async function createAction(
  noteId: string
): Promise<Action> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('actions')
    .insert({
      note_id: noteId,
      user_id: user.id,
      is_completed: false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function completeAction(
  actionId: string,
  outcome?: string
): Promise<Action> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('actions')
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
      outcome: outcome || null,
    })
    .eq('id', actionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAction(actionId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('actions').delete().eq('id', actionId)

  if (error) throw error
}
